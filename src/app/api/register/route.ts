import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { guestRegistrationSchema } from '@/schemas/event-registration';
import { checkRateLimit, validateHoneypot, getClientIp } from '@/lib/security/rate-limit';
import {
  sendRegistrationConfirmedEmail,
  sendPaymentPendingEmail,
} from '@/lib/email';

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);

    // 1. In-memory Rate Limit Guard (max 5 submissions per 10 mins per IP)
    const rateCheck = checkRateLimit(clientIp, 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many registration requests. Please wait a few moments before trying again.',
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(rateCheck.limit),
            'X-RateLimit-Remaining': String(rateCheck.remaining),
            'X-RateLimit-Reset': String(rateCheck.resetTime),
          },
        }
      );
    }

    // 2. Parse request body
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request body.' },
        { status: 400 }
      );
    }

    // 3. Anti-Bot Honeypot verification
    if (!validateHoneypot(body.hpWebsite)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Registration rejected by automated anti-bot security filters.',
        },
        { status: 400 }
      );
    }

    // 4. Schema validation with Zod
    const parsed = guestRegistrationSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Invalid registration data submitted.';
      return NextResponse.json(
        { success: false, error: firstError, details: parsed.error.issues },
        { status: 400 }
      );
    }

    const {
      eventId,
      fullName,
      email,
      phone,
      collegeName,
      department,
      rollNumber,
      teamName,
      teamMembers,
    } = parsed.data;

    // 5. Global Chapter Registration Master Switch
    const chapterSettings = await db.settings.get();
    if (!chapterSettings.registration_enabled) {
      return NextResponse.json(
        {
          success: false,
          error: 'Public event registrations are temporarily paused by chapter administration.',
        },
        { status: 403 }
      );
    }

    // 6. Target Event Resolution (Supports UUID or event slug)
    let event = await db.events.getById(eventId);
    if (!event) {
      event = await db.events.getBySlug(eventId);
    }

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'The requested event could not be found.' },
        { status: 404 }
      );
    }

    // 7. Event publication status check
    if (event.status !== 'PUBLISHED') {
      return NextResponse.json(
        {
          success: false,
          error: 'Registration is not currently open for this event.',
        },
        { status: 400 }
      );
    }

    // 8. Event deadline check
    if (new Date() > new Date(event.registration_deadline)) {
      return NextResponse.json(
        {
          success: false,
          error: 'The registration deadline for this event has passed.',
        },
        { status: 400 }
      );
    }

    // 9. Event capacity check
    if (event.registered_count >= event.capacity) {
      return NextResponse.json(
        {
          success: false,
          error: 'This event has reached its maximum seating capacity.',
        },
        { status: 400 }
      );
    }

    // 10. Team event rules validation
    if (event.is_team_event) {
      if (!teamName || !teamName.trim()) {
        return NextResponse.json(
          { success: false, error: 'Team name is required for team registrations.' },
          { status: 400 }
        );
      }

      const totalTeamSize = 1 + (teamMembers?.length || 0);
      if (totalTeamSize < event.min_team_size || totalTeamSize > event.max_team_size) {
        return NextResponse.json(
          {
            success: false,
            error: `Team size must be between ${event.min_team_size} and ${event.max_team_size} members. Current team size is ${totalTeamSize}.`,
          },
          { status: 400 }
        );
      }
    }

    // 11. Create Registration Atomically (Fee calculated strictly on server)
    const registration = await db.registrations.create({
      event_id: event.id,
      full_name: fullName,
      email,
      phone,
      college_name: collegeName,
      department,
      roll_number: rollNumber,
      team_name: event.is_team_event ? teamName : undefined,
      team_members: event.is_team_event && teamMembers ? teamMembers.map(m => ({
        member_name: m.memberName,
        member_email: m.memberEmail,
        member_phone: m.memberPhone,
        member_roll_number: m.memberRollNumber,
      })) : undefined,
    });

    // 12. Transactional Email Dispatch
    let emailResult = { success: false };
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    if (registration.registration_status === 'CONFIRMED') {
      emailResult = await sendRegistrationConfirmedEmail(registration.email, {
        attendeeName: registration.full_name,
        eventTitle: event.title,
        ticketToken: registration.ticket_token,
        referenceToken: registration.reference_token,
        venue: event.venue,
        startTime: event.start_time,
        endTime: event.end_time,
        isOnline: event.is_online,
        meetingLink: event.meeting_link,
        teamName: registration.team_name,
        teamMembers: registration.team_members?.map(m => m.member_name),
        siteUrl,
      });
    } else {
      emailResult = await sendPaymentPendingEmail(registration.email, {
        attendeeName: registration.full_name,
        eventTitle: event.title,
        ticketToken: registration.ticket_token,
        referenceToken: registration.reference_token,
        priceInr: event.price_inr,
        startTime: event.start_time,
        venue: event.venue,
        siteUrl,
      });
    }

    // 13. Return Safe Public Response
    return NextResponse.json(
      {
        success: true,
        reference: registration.reference_token,
        ticket_token: registration.ticket_token,
        registration_status: registration.registration_status,
        payment_status: registration.payment_status,
        event_title: event.title,
        amount_inr: event.event_type === 'PAID' ? event.price_inr : 0,
        email_sent: emailResult.success,
        redirect_url: `/registration/${registration.reference_token}`,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to process event registration.';
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 400 }
    );
  }
}
