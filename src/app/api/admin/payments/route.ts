import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyApiAdminAuth } from '@/lib/auth/guard';

export async function GET(request: Request) {
  const auth = await verifyApiAdminAuth(request);
  if (auth.errorResponse) return auth.errorResponse;

  const db = getDb();
  const payments = await db.payments.getAll();

  const totalRevenue = payments
    .filter(p => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + Number(p.amount_inr), 0);

  const pendingRevenue = payments
    .filter(p => p.status === 'PENDING')
    .reduce((sum, p) => sum + Number(p.amount_inr), 0);

  return NextResponse.json({
    payments,
    summary: {
      totalTransactions: payments.length,
      successfulCount: payments.filter(p => p.status === 'SUCCESS').length,
      pendingCount: payments.filter(p => p.status === 'PENDING').length,
      failedCount: payments.filter(p => p.status === 'FAILED').length,
      totalRevenueInr: totalRevenue,
      pendingRevenueInr: pendingRevenue,
    },
  });
}
