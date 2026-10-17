import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyApiAdminAuth } from '@/lib/auth/guard';

export async function GET(request: Request) {
  const auth = await verifyApiAdminAuth(request);
  if (auth.errorResponse) return auth.errorResponse;

  const db = getDb();
  const items = await db.gallery.getAll();

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const auth = await verifyApiAdminAuth(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const json = await request.json();
    const { title, event_title, date, category, image_url } = json;

    if (!title || !event_title || !date || !category || !image_url) {
      return NextResponse.json(
        { error: 'Title, event title, date, category, and image URL are required.' },
        { status: 400 }
      );
    }

    const db = getDb();
    const created = await db.gallery.create({
      title,
      event_title,
      date,
      category,
      image_url,
      description: json.description || '',
      display_order: Number(json.display_order) || 0,
    });

    await db.auditLogs.log({
      admin_id: auth.user.id,
      admin_email: auth.user.email,
      action: 'GALLERY_ITEM_ADDED',
      target_entity: 'gallery_items',
      target_id: created.id,
      details_json: { title: created.title, category: created.category },
      ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return NextResponse.json({ success: true, item: created }, { status: 201 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Creation failed' }, { status: 500 });
  }
}
