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
    const updated = await db.teamMembers.update(id, json);

    await db.auditLogs.log({
      admin_id: auth.user.id,
      admin_email: auth.user.email,
      action: 'TEAM_MEMBER_UPDATED',
      target_entity: 'team_members',
      target_id: id,
      details_json: { name: updated.full_name, updates: json },
      ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return NextResponse.json({ success: true, member: updated });
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

  const member = await db.teamMembers.getById(id);
  if (!member) {
    return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
  }

  await db.teamMembers.delete(id);

  await db.auditLogs.log({
    admin_id: auth.user.id,
    admin_email: auth.user.email,
    action: 'TEAM_MEMBER_DELETED',
    target_entity: 'team_members',
    target_id: id,
    details_json: { name: member.full_name, role: member.role_title },
    ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1',
  });

  return NextResponse.json({ success: true, message: 'Team member removed successfully' });
}
