import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyApiAdminAuth } from '@/lib/auth/guard';

export async function GET(request: Request) {
  const auth = await verifyApiAdminAuth(request);
  if (auth.errorResponse) return auth.errorResponse;

  const db = getDb();
  const settings = await db.settings.get();

  return NextResponse.json({ settings });
}

export async function PATCH(request: Request) {
  const auth = await verifyApiAdminAuth(request, ['SUPERADMIN']);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const json = await request.json();
    const db = getDb();
    const updated = await db.settings.update(json);

    await db.auditLogs.log({
      admin_id: auth.user.id,
      admin_email: auth.user.email,
      action: 'CHAPTER_SETTINGS_UPDATED',
      target_entity: 'settings',
      details_json: json,
      ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Settings update failed' }, { status: 400 });
  }
}
