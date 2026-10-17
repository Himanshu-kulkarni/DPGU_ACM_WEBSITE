import crypto from 'crypto';
import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';
import type { AdminRole, AdminUser } from '@/lib/db/types';

export const ADMIN_SESSION_COOKIE = 'acm_admin_session';
const SESSION_EXPIRY_SECONDS = 60 * 60 * 12; // 12 hours

export interface SessionPayload {
  adminId: string;
  email: string;
  name: string;
  role: AdminRole;
  exp: number; // Unix timestamp in seconds
}

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret && secret.length >= 32) {
    return secret;
  }
  // Fallback for local development if secret is missing or too short
  return 'acm_fallback_secure_dev_key_2026_dpgu_student_chapter_superadmin';
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str, 'utf8').toString('base64url');
}

function base64UrlDecode(str: string): string {
  return Buffer.from(str, 'base64url').toString('utf8');
}

/**
 * Sign session data into a tamper-proof HMAC-SHA256 token
 */
export function signSessionPayload(payload: Omit<SessionPayload, 'exp'> & { exp?: number }): string {
  const exp = payload.exp || Math.floor(Date.now() / 1000) + SESSION_EXPIRY_SECONDS;
  const fullPayload: SessionPayload = { ...payload, exp };
  
  const payloadStr = JSON.stringify(fullPayload);
  const encodedPayload = base64UrlEncode(payloadStr);

  const secret = getSessionSecret();
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(encodedPayload);
  const signature = hmac.digest('base64url');

  return `${encodedPayload}.${signature}`;
}

/**
 * Verify and decode an HMAC-SHA256 session token
 */
export function verifySessionToken(token: string | null | undefined): SessionPayload | null {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, receivedSignature] = parts;

  const secret = getSessionSecret();
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(encodedPayload);
  const expectedSignature = hmac.digest('base64url');

  const bufA = Buffer.from(receivedSignature);
  const bufB = Buffer.from(expectedSignature);

  if (bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) {
    return null;
  }

  try {
    const payloadStr = base64UrlDecode(encodedPayload);
    const payload: SessionPayload = JSON.parse(payloadStr);

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Reads and verifies the current session from Next.js server cookies
 */
export async function getCurrentAdminSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE);
  if (!sessionCookie?.value) {
    return null;
  }
  return verifySessionToken(sessionCookie.value);
}

/**
 * Helper to construct cookie options
 */
export function getSessionCookieOptions() {
  return {
    name: ADMIN_SESSION_COOKIE,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_EXPIRY_SECONDS,
  };
}

/**
 * Attaches the session cookie directly to a NextResponse object
 */
export function attachSessionCookieToResponse(response: NextResponse, admin: AdminUser): string {
  const token = signSessionPayload({
    adminId: admin.id,
    email: admin.email,
    name: admin.full_name,
    role: admin.role,
  });

  response.cookies.set({
    ...getSessionCookieOptions(),
    value: token,
  });

  return token;
}

/**
 * Issues and sets the session cookie on Next.js cookies()
 */
export async function setAdminSessionCookie(admin: AdminUser): Promise<string> {
  const token = signSessionPayload({
    adminId: admin.id,
    email: admin.email,
    name: admin.full_name,
    role: admin.role,
  });

  const cookieStore = await cookies();
  cookieStore.set({
    ...getSessionCookieOptions(),
    value: token,
  });

  return token;
}

/**
 * Clears the session cookie
 */
export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    ...getSessionCookieOptions(),
    value: '',
    maxAge: 0,
  });
}
