import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyApiAdminAuth } from '@/lib/auth/guard';

export async function GET(request: Request) {
  const auth = await verifyApiAdminAuth(request);
  if (auth.errorResponse) return auth.errorResponse;

  const db = getDb();
  const blocks = await db.contentBlocks.getAll();

  return NextResponse.json({ blocks });
}

export async function POST(request: Request) {
  const auth = await verifyApiAdminAuth(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const json = await request.json();
    const { block_key, title, content_json, description } = json;

    if (!block_key || !title || !content_json) {
      return NextResponse.json(
        { error: 'block_key, title, and content_json are required.' },
        { status: 400 }
      );
    }

    const db = getDb();
    const updatedBlock = await db.contentBlocks.upsert(block_key, {
      title,
      content_json,
      description,
      updated_by: auth.user.id,
    });

    await db.auditLogs.log({
      admin_id: auth.user.id,
      admin_email: auth.user.email,
      action: 'CONTENT_BLOCK_UPSERTED',
      target_entity: 'content_blocks',
      target_id: updatedBlock.id,
      details_json: { block_key, title },
      ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return NextResponse.json({ success: true, block: updatedBlock });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Operation failed' }, { status: 500 });
  }
}
