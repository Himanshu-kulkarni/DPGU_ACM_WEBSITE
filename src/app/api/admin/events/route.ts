import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { verifyApiAdminAuth } from '@/lib/auth/guard';
import type { EventCategory, EventStatus, EventType } from '@/lib/db/types';

const createEventSchema = z.object({
  slug: z.string().min(3).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must consist of lowercase alphanumeric characters and hyphens only.',
  }),
  title: z.string().min(3).max(255),
  subtitle: z.string().max(350).optional(),
  description: z.string().min(10),
  category: z.enum(['Workshops', 'Hackathons', 'Tech Talks', 'Coding Contests', 'Bootcamps', 'General']),
  banner_url: z.string().optional(),
  event_type: z.enum(['FREE', 'PAID']),
  price_inr: z.number().min(0),
  capacity: z.number().int().min(1),
  is_team_event: z.boolean().default(false),
  min_team_size: z.number().int().min(1).default(1),
  max_team_size: z.number().int().min(1).default(1),
  start_time: z.string().datetime({ message: 'Start time must be a valid ISO 8601 timestamp' }),
  end_time: z.string().datetime({ message: 'End time must be a valid ISO 8601 timestamp' }),
  registration_deadline: z.string().datetime({ message: 'Registration deadline must be a valid ISO 8601 timestamp' }),
  venue: z.string().min(2).max(255),
  is_online: z.boolean().default(false),
  meeting_link: z.string().url().optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED', 'ARCHIVED']).default('DRAFT'),
}).refine(data => new Date(data.end_time) > new Date(data.start_time), {
  message: 'End time must be later than start time',
  path: ['end_time'],
}).refine(data => new Date(data.registration_deadline) <= new Date(data.end_time), {
  message: 'Registration deadline cannot be after event end time',
  path: ['registration_deadline'],
}).refine(data => !data.is_team_event || data.max_team_size >= data.min_team_size, {
  message: 'Max team size must be greater than or equal to min team size',
  path: ['max_team_size'],
});

export async function GET(request: Request) {
  const auth = await verifyApiAdminAuth(request);
  if (auth.errorResponse) return auth.errorResponse;

  const url = new URL(request.url);
  const status = url.searchParams.get('status') as EventStatus | null;

  const db = getDb();
  const events = await db.events.getAll(status || undefined);

  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  const auth = await verifyApiAdminAuth(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const json = await request.json();
    const parsed = createEventSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = getDb();

    // Check slug uniqueness
    const existing = await db.events.getBySlug(parsed.data.slug);
    if (existing) {
      return NextResponse.json(
        { error: `An event with slug "${parsed.data.slug}" already exists.` },
        { status: 409 }
      );
    }

    const payload = {
      ...parsed.data,
      category: parsed.data.category as EventCategory,
      event_type: parsed.data.event_type as EventType,
      status: parsed.data.status as EventStatus,
      meeting_link: parsed.data.meeting_link || undefined,
    };

    const newEvent = await db.events.create(payload);

    // Record audit trail
    await db.auditLogs.log({
      admin_id: auth.user.id,
      admin_email: auth.user.email,
      action: 'EVENT_CREATED',
      target_entity: 'events',
      target_id: newEvent.id,
      details_json: { title: newEvent.title, slug: newEvent.slug, status: newEvent.status },
      ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return NextResponse.json({ success: true, event: newEvent }, { status: 201 });
  } catch (error) {
    const err = error as Error;
    console.error('Error creating event:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
