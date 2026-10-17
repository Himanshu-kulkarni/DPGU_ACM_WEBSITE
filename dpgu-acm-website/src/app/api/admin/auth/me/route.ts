import { NextResponse } from 'next/server';
import { verifyApiAdminAuth } from '@/lib/auth/guard';

export async function GET(request: Request) {
  const auth = await verifyApiAdminAuth(request);
  if (auth.errorResponse) {
    return auth.errorResponse;
  }

  const { password_hash, ...safeUser } = auth.user;
  return NextResponse.json({
    user: safeUser,
  });
}
