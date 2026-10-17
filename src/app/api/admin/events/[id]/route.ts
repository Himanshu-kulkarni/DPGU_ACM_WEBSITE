import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { verifyApiAdminAuth } from '@/lib/auth/guard';

const updateEventSchema = z.object({
  slug: z.string().min(3).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  title: z.string().min(3).max(255).optional(),
  subtitle: z.string().max(350).optional(),
  description: z.string().min(10).optional(),
  category: z.enum(['Workshops', 'Hackathons', 'Tech Talks', 'Coding Contests', 'Bootcamps', 'General']).optional(),
  banner_url: z.string().optional(),
  event_type: z.enum(['FREE', 'PAID']).optional(),
  price_inr: z.number().min(0).optional(),
  capacity: z.number().int().min(1).optional(),
  is_team_event: z.boolean().optional(),
  min_team_size: z.number().int().min(1).optional(),
  max_team_size: z.number().int().min(1).optional(),
  start_time: z.string().datetime().optional(),
  end_time: z.string().datetime().optional(),
  registration_deadline: z.string().datetime().optional(),
  venue: z.string().min(2).max(255).optional(),
  is_online: z.boolean().optional(),
  meeting_link: z.string().url().optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED', 'ARCHIVED']).optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyApiAdminAuth(request);
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await params;
  const db = getDb();
  const event = await db.events.getById(id);

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  const registrations = await db.registrations.getAll({ event_id: id });

  return NextResponse.json({
    event,
    registrationsCount: registrations.length,
    confirmedCount: registrations.filter(r => r.registration_status === 'CONFIRMED').length,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyApiAdminAuth(request);
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await params;
  const db = getDb();

  const existing = await db.events.getById(id);
  if (!existing) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  try {
    const json = await request.json();
    const parsed = updateEventSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Check slug collision if slug is being updated
    if (parsed.data.slug && parsed.data.slug !== existing.slug) {
      const slugConflict = await db.events.getBySlug(parsed.data.slug);
      if (slugConflict && slugConflict.id !== id) {
        return NextResponse.json(
          { error: `An event with slug "${parsed.data.slug}" already exists.` },
          { status: 409 }
        );
      }
    }

    // Validate date chronology if updated
    const startTime = parsed.data.start_time || existing.start_time;
    const endTime = parsed.data.end_time || existing.end_time;
    const regDeadline = parsed.data.registration_deadline || existing.registration_deadline;

    if (new Date(endTime) <= new Date(startTime)) {
      return NextResponse.json(
        { error: 'End time must be later than start time' },
        { status: 400 }
      );
    }

    if (new Date(regDeadline) > new Date(endTime)) {
      return NextResponse.json(
        { error: 'Registration deadline cannot be after event end time' },
        { status: 400 }
      );
    }

    const updatedEvent = await db.events.update(id, parsed.data);

    // Record audit trail
    await db.auditLogs.log({
      admin_id: auth.user.id,
      admin_email: auth.user.email,
      action: 'EVENT_UPDATED',
      target_entity: 'events',
      target_id: id,
      details_json: { updates: parsed.data, title: updatedEvent.title },
      ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return NextResponse.json({ success: true, event: updatedEvent });
  } catch (error) {
    const err = error as Error;
    console.error('Error updating event:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyApiAdminAuth(request);
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await params;
  const db = getDb();

  const existing = await db.events.getById(id);
  if (!existing) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  // Check if event has registrations
  const registrations = await db.registrations.getAll({ event_id: id });
  if (registrations.length > 0) {
    // If registrations exist, archive instead of hard deleting to preserve audit integrity
    const archived = await db.events.update(id, { status: 'ARCHIVED' });
    await db.auditLogs.log({
      admin_id: auth.user.id,
      admin_email: auth.user.email,
      action: 'EVENT_ARCHIVED_WITH_RECORDS',
      target_entity: 'events',
      target_id: id,
      details_json: { title: existing.title, registrationCount: registrations.length },
      ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return NextResponse.json({
      success: true,
      message: 'Event contains registrations. Successfully archived to preserve audit history.',
      event: archived,
    });
  }

  await db.events.delete(id);

  await db.auditLogs.log({
    admin_id: auth.user.id,
    admin_email: auth.user.email,
    action: 'EVENT_DELETED',
    target_entity: 'events',
    target_id: id,
    details_json: { title: existing.title, slug: existing.slug },
    ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1',
  });

  return NextResponse.json({ success: true, message: 'Event deleted successfully' });
}
