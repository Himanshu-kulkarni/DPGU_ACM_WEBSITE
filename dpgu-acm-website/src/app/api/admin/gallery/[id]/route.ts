import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyApiAdminAuth } from '@/lib/auth/guard';

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
    const updated = await db.gallery.update(id, json);

    await db.auditLogs.log({
      admin_id: auth.user.id,
      admin_email: auth.user.email,
      action: 'GALLERY_ITEM_UPDATED',
      target_entity: 'gallery_items',
      target_id: id,
      details_json: { title: updated.title, updates: json },
      ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 400 });
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

  const item = await db.gallery.getById(id);
  if (!item) {
    return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
  }

  await db.gallery.delete(id);

  await db.auditLogs.log({
    admin_id: auth.user.id,
    admin_email: auth.user.email,
    action: 'GALLERY_ITEM_DELETED',
    target_entity: 'gallery_items',
    target_id: id,
    details_json: { title: item.title },
    ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1',
  });

  return NextResponse.json({ success: true, message: 'Gallery item deleted successfully' });
}
