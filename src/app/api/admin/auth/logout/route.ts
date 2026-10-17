import { NextResponse } from 'next/server';
import { clearAdminSessionCookie, getCurrentAdminSession } from '@/lib/auth/session';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getCurrentAdminSession();
    if (session) {
      const db = getDb();
      await db.auditLogs.log({
        admin_id: session.adminId,
        admin_email: session.email,
        action: 'ADMIN_LOGOUT',
        target_entity: 'admin_users',
        target_id: session.adminId,
        ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1',
      });
    }

    await clearAdminSessionCookie();

    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}
