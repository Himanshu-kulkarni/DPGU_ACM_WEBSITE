import { NextResponse } from 'next/server';
import { getCurrentAdminSession, verifySessionToken, ADMIN_SESSION_COOKIE } from './session';
import { getDb } from '@/lib/db';
import type { AdminUser, AdminRole } from '@/lib/db/types';

export class AuthError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 401) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

/**
 * Validates admin session from Next.js server components or server actions.
 * Throws AuthError if unauthorized.
 */
export async function requireAdminSession(allowedRoles?: AdminRole[]): Promise<AdminUser> {
  const session = await getCurrentAdminSession();

  if (!session) {
    throw new AuthError('Authentication required. Please sign in to the administrator portal.', 401);
  }

  const db = getDb();
  const admin = await db.adminUsers.getById(session.adminId);

  if (!admin || !admin.is_active) {
    throw new AuthError('Account not found or has been deactivated.', 403);
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(admin.role)) {
    throw new AuthError('Forbidden: Insufficient administrative privileges.', 403);
  }

  return admin;
}

/**
 * Validates an incoming HTTP request for Route Handlers (API routes).
 * Extracts session from cookie or Authorization header.
 * Returns either { user: AdminUser } or { errorResponse: NextResponse }.
 */
export async function verifyApiAdminAuth(
  request: Request,
  allowedRoles?: AdminRole[]
): Promise<{ user: AdminUser; errorResponse: null } | { user: null; errorResponse: NextResponse }> {
  let token: string | null = null;

  // 1. Try reading cookie from Cookie header
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`(?:^|; )${ADMIN_SESSION_COOKIE}=([^;]*)`));
  if (match) {
    token = decodeURIComponent(match[1]);
  }

  // 2. Try Authorization: Bearer <token>
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: 'Unauthorized: Missing administrative session token' },
        { status: 401 }
      ),
    };
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: 'Unauthorized: Session token is invalid or expired' },
        { status: 401 }
      ),
    };
  }

  const db = getDb();
  const admin = await db.adminUsers.getById(payload.adminId);

  if (!admin || !admin.is_active) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: 'Forbidden: Account is inactive or deactivated' },
        { status: 403 }
      ),
    };
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(admin.role)) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: 'Forbidden: Insufficient privileges for this operation' },
        { status: 403 }
      ),
    };
  }

  return { user: admin, errorResponse: null };
}
