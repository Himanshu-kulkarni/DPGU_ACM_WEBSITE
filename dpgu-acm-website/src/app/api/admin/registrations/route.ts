import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyApiAdminAuth } from '@/lib/auth/guard';
import type { RegistrationStatus, PaymentStatus } from '@/lib/db/types';

export async function GET(request: Request) {
  const auth = await verifyApiAdminAuth(request);
  if (auth.errorResponse) return auth.errorResponse;

  const url = new URL(request.url);
  const eventId = url.searchParams.get('eventId') || undefined;
  const status = (url.searchParams.get('status') as RegistrationStatus) || undefined;
  const paymentStatus = (url.searchParams.get('paymentStatus') as PaymentStatus) || undefined;
  const search = url.searchParams.get('search') || undefined;
  const isExport = url.searchParams.get('export') === 'csv';

  const db = getDb();
  const registrations = await db.registrations.getAll({
    event_id: eventId,
    status,
    payment_status: paymentStatus,
    search,
  });

  if (isExport) {
    // Generate permitted CSV format
    const headers = [
      'Ticket Token',
      'Full Name',
      'Email',
      'Phone',
      'College Name',
      'Department',
      'Roll Number',
      'Team Name',
      'Event Title',
      'Registration Status',
      'Payment Status',
      'Registered At',
    ];

    const escapeCsv = (val: unknown) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvRows = [headers.join(',')];
    for (const reg of registrations) {
      csvRows.push(
        [
          escapeCsv(reg.ticket_token),
          escapeCsv(reg.full_name),
          escapeCsv(reg.email),
          escapeCsv(reg.phone),
          escapeCsv(reg.college_name),
          escapeCsv(reg.department),
          escapeCsv(reg.roll_number),
          escapeCsv(reg.team_name || 'N/A'),
          escapeCsv(reg.event_title || 'N/A'),
          escapeCsv(reg.registration_status),
          escapeCsv(reg.payment_status),
          escapeCsv(reg.created_at),
        ].join(',')
      );
    }

    const csvContent = csvRows.join('\r\n');

    await db.auditLogs.log({
      admin_id: auth.user.id,
      admin_email: auth.user.email,
      action: 'REGISTRATIONS_EXPORTED_CSV',
      target_entity: 'registrations',
      details_json: { recordCount: registrations.length, filterEventId: eventId },
      ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="registrations_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({
    registrations,
    total: registrations.length,
  });
}

export async function POST(request: Request) {
  const auth = await verifyApiAdminAuth(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const json = await request.json();
    const db = getDb();

    if (!json.event_id || !json.full_name || !json.email || !json.phone) {
      return NextResponse.json(
        { error: 'Missing required attendee information' },
        { status: 400 }
      );
    }

    const created = await db.registrations.create(json);

    await db.auditLogs.log({
      admin_id: auth.user.id,
      admin_email: auth.user.email,
      action: 'ADMIN_MANUAL_REGISTRATION_CREATED',
      target_entity: 'registrations',
      target_id: created.id,
      details_json: { attendee: created.full_name, email: created.email, event_id: created.event_id },
      ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return NextResponse.json({ success: true, registration: created }, { status: 201 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Failed to create registration' }, { status: 400 });
  }
}
