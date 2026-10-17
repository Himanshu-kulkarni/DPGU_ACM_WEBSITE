import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyApiAdminAuth } from '@/lib/auth/guard';

export async function GET(request: Request) {
  const auth = await verifyApiAdminAuth(request);
  if (auth.errorResponse) return auth.errorResponse;

  const url = new URL(request.url);
  const eventId = url.searchParams.get('eventId') || undefined;

  const db = getDb();
  const records = eventId
    ? await db.attendance.getByEvent(eventId)
    : await db.attendance.getAll();

  const stats = await db.attendance.getStats(eventId);

  return NextResponse.json({ records, stats });
}

export async function POST(request: Request) {
  const auth = await verifyApiAdminAuth(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const json = await request.json();
    const { ticket_token, event_id } = json;

    if (!ticket_token) {
      return NextResponse.json(
        { error: 'Ticket token is required for attendance check-in' },
        { status: 400 }
      );
    }

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const db = getDb();

    const result = await db.attendance.recordCheckIn({
      ticketToken: ticket_token,
      eventId: event_id,
      adminId: auth.user.id,
      adminName: auth.user.full_name,
      ipAddress: ip,
    });

    // Record audit log for check in
    await db.auditLogs.log({
      admin_id: auth.user.id,
      admin_email: auth.user.email,
      action: `ATTENDANCE_${result.scanResult}`,
      target_entity: 'attendance',
      target_id: result.record?.id || ticket_token,
      details_json: {
        ticketToken: ticket_token,
        scanResult: result.scanResult,
        attendeeName: result.registration?.full_name,
      },
      ip_address: ip,
    });

    const statusCode = result.success ? 200 : result.scanResult === 'DUPLICATE' ? 409 : 400;

    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Check-in failed' }, { status: 500 });
  }
}
