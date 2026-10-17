import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyPassword } from '@/lib/auth/password';
import { attachSessionCookieToResponse } from '@/lib/auth/session';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const db = getDb();
    const admin = await db.adminUsers.getByEmail(email);

    if (!admin || !admin.is_active) {
      await db.auditLogs.log({
        action: 'ADMIN_LOGIN_FAILED',
        target_entity: 'admin_users',
        details_json: { email, reason: 'Invalid user or inactive account' },
        ip_address: ip,
      });

      return NextResponse.json(
        { error: 'Invalid administrator email or password' },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(password, admin.password_hash);
    if (!isValid) {
      await db.auditLogs.log({
        admin_id: admin.id,
        admin_email: admin.email,
        action: 'ADMIN_LOGIN_FAILED',
        target_entity: 'admin_users',
        target_id: admin.id,
        details_json: { email, reason: 'Password mismatch' },
        ip_address: ip,
      });

      return NextResponse.json(
        { error: 'Invalid administrator email or password' },
        { status: 401 }
      );
    }

    // Update last login timestamp
    await db.adminUsers.updateLastLogin(admin.id);

    // Record audit log
    await db.auditLogs.log({
      admin_id: admin.id,
      admin_email: admin.email,
      action: 'ADMIN_LOGIN_SUCCESS',
      target_entity: 'admin_users',
      target_id: admin.id,
      details_json: { role: admin.role },
      ip_address: ip,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role,
      },
    });

    // Set secure HttpOnly session cookie on the outgoing response
    attachSessionCookieToResponse(response, admin);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected internal error occurred during authentication' },
      { status: 500 }
    );
  }
}
