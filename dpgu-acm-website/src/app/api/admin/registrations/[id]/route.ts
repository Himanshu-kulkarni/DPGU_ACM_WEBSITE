import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyApiAdminAuth } from '@/lib/auth/guard';
import type { RegistrationStatus, PaymentStatus } from '@/lib/db/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyApiAdminAuth(request);
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await params;
  const db = getDb();
  const registration = await db.registrations.getById(id);

  if (!registration) {
    return NextResponse.json({ error: 'Registration record not found' }, { status: 404 });
  }

  // Fetch linked attendance scans
  const attendanceList = (await db.attendance.getAll()).filter(a => a.registration_id === id);
  // Fetch linked payments
  const paymentsList = (await db.payments.getAll()).filter(p => p.registration_id === id);

  return NextResponse.json({
    registration,
    attendance: attendanceList,
    payments: paymentsList,
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

  try {
    const json = await request.json();
    const { registration_status, payment_status } = json;

    if (!registration_status && !payment_status) {
      return NextResponse.json(
        { error: 'At least one status field must be provided' },
        { status: 400 }
      );
    }

    const reg = await db.registrations.getById(id);
    if (!reg) {
      return NextResponse.json({ error: 'Registration record not found' }, { status: 404 });
    }

    const updated = await db.registrations.updateStatus(
      id,
      (registration_status as RegistrationStatus) || reg.registration_status,
      payment_status as PaymentStatus | undefined
    );

    await db.auditLogs.log({
      admin_id: auth.user.id,
      admin_email: auth.user.email,
      action: 'REGISTRATION_STATUS_UPDATED',
      target_entity: 'registrations',
      target_id: id,
      details_json: {
        previous_registration_status: reg.registration_status,
        new_registration_status: updated.registration_status,
        previous_payment_status: reg.payment_status,
        new_payment_status: updated.payment_status,
      },
      ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return NextResponse.json({ success: true, registration: updated });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 });
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

  const reg = await db.registrations.getById(id);
  if (!reg) {
    return NextResponse.json({ error: 'Registration record not found' }, { status: 404 });
  }

  await db.registrations.delete(id);

  await db.auditLogs.log({
    admin_id: auth.user.id,
    admin_email: auth.user.email,
    action: 'REGISTRATION_CANCELLED_AND_REMOVED',
    target_entity: 'registrations',
    target_id: id,
    details_json: { attendee: reg.full_name, email: reg.email, event_id: reg.event_id },
    ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1',
  });

  return NextResponse.json({ success: true, message: 'Registration deleted successfully' });
}
