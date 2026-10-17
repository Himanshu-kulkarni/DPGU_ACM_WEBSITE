import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyApiAdminAuth } from '@/lib/auth/guard';

export async function GET(request: Request) {
  const auth = await verifyApiAdminAuth(request);
  if (auth.errorResponse) return auth.errorResponse;

  const url = new URL(request.url);
  const isAuditExport = url.searchParams.get('export') === 'audit_csv';

  const db = getDb();
  const events = await db.events.getAll();
  const registrations = await db.registrations.getAll();
  const payments = await db.payments.getAll();
  const attendance = await db.attendance.getAll();
  const auditLogs = await db.auditLogs.getAll(150);

  if (isAuditExport) {
    const headers = ['Timestamp', 'Admin ID', 'Admin Email', 'Action', 'Target Entity', 'Target ID', 'IP Address'];
    const escapeCsv = (val: unknown) => `"${String(val ?? '').replace(/"/g, '""')}"`;

    const rows = [headers.join(',')];
    for (const log of auditLogs) {
      rows.push([
        escapeCsv(log.created_at),
        escapeCsv(log.admin_id),
        escapeCsv(log.admin_email),
        escapeCsv(log.action),
        escapeCsv(log.target_entity),
        escapeCsv(log.target_id),
        escapeCsv(log.ip_address),
      ].join(','));
    }

    return new NextResponse(rows.join('\r\n'), {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="audit_logs_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  const confirmedRegs = registrations.filter(r => r.registration_status === 'CONFIRMED');
  const validCheckIns = attendance.filter(a => a.scan_result === 'VALID');
  const successfulPayments = payments.filter(p => p.status === 'SUCCESS');
  const totalRevenue = successfulPayments.reduce((acc, p) => acc + Number(p.amount_inr), 0);

  const checkInRate = confirmedRegs.length > 0 
    ? Math.round((validCheckIns.length / confirmedRegs.length) * 100) 
    : 0;

  return NextResponse.json({
    kpis: {
      totalEvents: events.length,
      publishedEvents: events.filter(e => e.status === 'PUBLISHED').length,
      draftEvents: events.filter(e => e.status === 'DRAFT').length,
      archivedEvents: events.filter(e => e.status === 'ARCHIVED').length,
      totalRegistrations: registrations.length,
      confirmedRegistrations: confirmedRegs.length,
      pendingRegistrations: registrations.filter(r => r.registration_status === 'PENDING_PAYMENT').length,
      totalRevenueInr: totalRevenue,
      successfulPayments: successfulPayments.length,
      totalAttendanceScans: attendance.length,
      validCheckIns: validCheckIns.length,
      checkInRatePercentage: checkInRate,
    },
    auditLogs,
  });
}
