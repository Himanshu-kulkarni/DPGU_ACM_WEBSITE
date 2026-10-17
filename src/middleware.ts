import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_SESSION_COOKIE = 'acm_admin_session';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'acm_fallback_secure_dev_key_2026_dpgu_student_chapter_superadmin';

function base64UrlToUint8Array(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function verifyEdgeToken(token: string): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;

    const [encodedPayload, receivedSignature] = parts;
    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(SESSION_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBytes = base64UrlToUint8Array(receivedSignature);
    const dataBytes = encoder.encode(encodedPayload);

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes as unknown as BufferSource,
      dataBytes as unknown as BufferSource
    );

    if (!isValid) return false;

    // Decode and check expiry
    let base64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    const payload = JSON.parse(atob(base64));

    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const isLoginPage = pathname === '/admin/login';

  const isAuthenticated = sessionCookie ? await verifyEdgeToken(sessionCookie) : false;

  // If visiting /admin/login while already authenticated, go to dashboard
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // If visiting protected admin route without authentication, redirect to login
  if (!isLoginPage && !isAuthenticated) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
