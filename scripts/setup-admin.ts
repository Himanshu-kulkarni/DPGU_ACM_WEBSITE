import { getDb } from '../src/lib/db';
import { hashPassword } from '../src/lib/auth/password';

async function main() {
  const args = process.argv.slice(2);
  const email = (args[0] || process.env.INITIAL_ADMIN_EMAIL || 'admin@dpgu.acm.org').toLowerCase().trim();
  const password = args[1] || process.env.INITIAL_ADMIN_PASSWORD || 'Admin@ACM2026!';
  const name = args[2] || process.env.INITIAL_ADMIN_NAME || 'DPGU ACM Lead Administrator';

  console.log('--- DPGU ACM Chapter: Administrator Provisioning Tool ---');
  console.log(`Target Email: ${email}`);
  console.log(`Administrator Name: ${name}`);

  const db = getDb();
  const existing = await db.adminUsers.getByEmail(email);

  if (existing) {
    console.log(`Administrator "${email}" already exists. Updating credentials...`);
    const newHash = hashPassword(password);
    await db.adminUsers.update(existing.id, {
      password_hash: newHash,
      full_name: name,
      is_active: true,
    });
    await db.auditLogs.log({
      admin_id: existing.id,
      admin_email: existing.email,
      action: 'ADMIN_CREDENTIALS_RESET',
      target_entity: 'admin_users',
      target_id: existing.id,
      details_json: { notes: 'Password reset via CLI setup utility' },
    });
    console.log(`Administrator "${email}" credentials successfully updated!`);
  } else {
    console.log(`Creating new administrator account for "${email}"...`);
    const password_hash = hashPassword(password);
    const created = await db.adminUsers.create({
      email,
      password_hash,
      full_name: name,
      role: 'SUPERADMIN',
    });
    await db.auditLogs.log({
      admin_id: created.id,
      admin_email: created.email,
      action: 'ADMIN_PROVISIONED_CLI',
      target_entity: 'admin_users',
      target_id: created.id,
      details_json: { email: created.email, role: created.role },
    });
    console.log(`Administrator "${email}" created successfully with ID: ${created.id}`);
  }
}

main().catch(err => {
  console.error('Failed to provision administrator:', err);
  process.exit(1);
});
