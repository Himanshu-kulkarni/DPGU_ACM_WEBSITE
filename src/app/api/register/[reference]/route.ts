import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cancellationSchema } from '@/schemas/event-registration';
import { sendRegistrationCancelledEmail } from '@/lib/email';

interface RouteContext {
  params: Promise<{
    reference: string;
  }>;
}

function maskEmail(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2) return '***';
  const name = parts[0];
  const domain = parts[1];
  const maskedName = name.length > 2 
    ? `${name[0]}***${name[name.length - 1]}`
    : `${name[0]}***`;
  return `${maskedName}@${domain}`;
}

/**
 * Public Registration Status Lookup
 * STRICT PRIVACY: Returns only sanitized, minimal attendee data.
 * Does not expose participant lists, other attendees' data, or raw phone numbers.
 */
export async function GET(req: Request, context: RouteContext) {
  try {
    const { reference } = await context.params;
    if (!reference) {
      return NextResponse.json(
        { success: false, error: 'Registration reference is required.' },
        { status: 400 }
      );
    }

    const reg = await db.registrations.getByReferenceToken(reference);
    if (!reg) {
      return NextResponse.json(
        { success: false, error: 'Registration record not found.' },
        { status: 404 }
      );
    }

    const event = await db.events.getById(reg.event_id);
    const eventStarted = event ? new Date() >= new Date(event.start_time) : false;
    const canCancel = (reg.registration_status === 'CONFIRMED' || reg.registration_status === 'PENDING_PAYMENT') && !eventStarted;

    return NextResponse.json({
      success: true,
      registration: {
        reference_token: reg.reference_token,
        ticket_token: reg.ticket_token,
        registration_status: reg.registration_status,
        payment_status: reg.payment_status,
        full_name: reg.full_name,
        masked_email: maskEmail(reg.email),
        college_name: reg.college_name,
        department: reg.department,
        team_name: reg.team_name,
        team_members: reg.team_members?.map(m => ({
          member_name: m.member_name,
          is_team_leader: m.is_team_leader,
        })),
        created_at: reg.created_at,
        cancelled_at: reg.cancelled_at,
        cancellation_reason: reg.cancellation_reason,
        can_cancel: canCancel,
      },
      event: {
        id: event?.id,
        title: event?.title || reg.event_title || 'Chapter Event',
        slug: event?.slug,
        category: event?.category,
        start_time: event?.start_time,
        end_time: event?.end_time,
        venue: event?.venue,
        is_online: event?.is_online,
        meeting_link: reg.registration_status === 'CONFIRMED' ? event?.meeting_link : undefined,
        event_type: event?.event_type,
        price_inr: event?.price_inr || 0,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve registration status.';
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}

/**
 * Public Attendee Registration Cancellation
 * Requires email verification matching the registration record.
 */
export async function POST(req: Request, context: RouteContext) {
  try {
    const { reference } = await context.params;
    if (!reference) {
      return NextResponse.json(
        { success: false, error: 'Registration reference is required.' },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: 'Request body is required.' },
        { status: 400 }
      );
    }

    const parsed = cancellationSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || 'Valid attendee email address is required to cancel.';
      return NextResponse.json(
        { success: false, error: msg },
        { status: 400 }
      );
    }

    const cancelledReg = await db.registrations.cancelRegistration(
      reference,
      parsed.data.email,
      parsed.data.reason
    );

    const event = await db.events.getById(cancelledReg.event_id);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Dispatch Cancellation Email confirmation
    await sendRegistrationCancelledEmail(cancelledReg.email, {
      attendeeName: cancelledReg.full_name,
      eventTitle: event?.title || cancelledReg.event_title || 'Chapter Event',
      referenceToken: cancelledReg.reference_token,
      ticketToken: cancelledReg.ticket_token,
      cancelledAt: cancelledReg.cancelled_at || new Date().toISOString(),
      reason: cancelledReg.cancellation_reason,
      siteUrl,
    });

    return NextResponse.json({
      success: true,
      message: 'Registration has been successfully cancelled and seating capacity has been released.',
      registration_status: cancelledReg.registration_status,
      cancelled_at: cancelledReg.cancelled_at,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to cancel registration.';
    return NextResponse.json(
      { success: false, error: msg },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  return POST(req, context);
}
