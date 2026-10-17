import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyApiAdminAuth } from '@/lib/auth/guard';

export async function GET(request: Request) {
  const auth = await verifyApiAdminAuth(request);
  if (auth.errorResponse) return auth.errorResponse;

  const db = getDb();
  const members = await db.teamMembers.getAll(false);

  return NextResponse.json({ members });
}

export async function POST(request: Request) {
  const auth = await verifyApiAdminAuth(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const json = await request.json();
    const { full_name, role_title, category, department, tenure_year } = json;

    if (!full_name || !role_title || !category || !department || !tenure_year) {
      return NextResponse.json(
        { error: 'Full name, role, category, department, and tenure year are required.' },
        { status: 400 }
      );
    }

    const db = getDb();
    const created = await db.teamMembers.create({
      full_name,
      role_title,
      category,
      department,
      tenure_year,
      bio: json.bio || '',
      photo_url: json.photo_url || '',
      linkedin_url: json.linkedin_url || '',
      github_url: json.github_url || '',
      display_order: Number(json.display_order) || 0,
      is_active: json.is_active ?? true,
    });

    await db.auditLogs.log({
      admin_id: auth.user.id,
      admin_email: auth.user.email,
      action: 'TEAM_MEMBER_CREATED',
      target_entity: 'team_members',
      target_id: created.id,
      details_json: { name: created.full_name, role: created.role_title },
      ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return NextResponse.json({ success: true, member: created }, { status: 201 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Creation failed' }, { status: 500 });
  }
}
