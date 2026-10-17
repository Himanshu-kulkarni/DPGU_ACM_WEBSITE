import { getDb } from '../src/lib/db';
import { hashPassword, verifyPassword } from '../src/lib/auth/password';
import { signSessionPayload, verifySessionToken } from '../src/lib/auth/session';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, details?: string) {
  if (condition) {
    results.push({ name, passed: true, details });
    console.log(`  ✓ PASS: ${name}`);
  } else {
    results.push({ name, passed: false, details });
    console.error(`  ✗ FAIL: ${name} — ${details || 'Assertion failed'}`);
  }
}

async function runAcceptanceTests() {
  console.log('\n======================================================');
  console.log('DPGU ACM STUDENT CHAPTER — PHASE 3 ACCEPTANCE TEST SUITE');
  console.log('======================================================\n');

  const db = getDb();

  // Test 1: Cryptographic Password Hashing and Timing Safe Verification
  console.log('[Suite 1: Password & Authentication Cryptography]');
  const testPass = 'SecurePassword@2026!';
  const hashed = hashPassword(testPass);
  assert(hashed.startsWith('pbkdf2:100000:'), 'PBKDF2 SHA-512 Hash Generation');
  assert(verifyPassword(testPass, hashed), 'Password Verification Success with Correct Password');
  assert(!verifyPassword('WrongPassword!', hashed), 'Password Verification Rejection with Wrong Password');
  assert(!verifyPassword('', hashed), 'Password Verification Rejection with Empty Password');

  // Test 2: Secure Session Token Signing & Web Crypto Validation
  console.log('\n[Suite 2: Session Security & HMAC-SHA256 Token Signing]');
  const token = signSessionPayload({
    adminId: 'admin-uuid-test',
    email: 'admin@dpgu.acm.org',
    name: 'Lead Admin',
    role: 'SUPERADMIN',
  });
  assert(typeof token === 'string' && token.includes('.'), 'HMAC Session Token Generated');
  const payload = verifySessionToken(token);
  assert(payload !== null && payload.adminId === 'admin-uuid-test', 'Valid Token Verified Successfully');
  assert(verifySessionToken('tampered.token.here') === null, 'Tampered Token Rejected');
  assert(verifySessionToken('') === null, 'Empty Token Rejected');

  // Test 3: Initial Administrator Provisioning & Zero Public Signups
  console.log('\n[Suite 3: Administrator Provisioning & DB Invariants]');
  const admins = await db.adminUsers.getAll();
  assert(admins.length > 0, 'Initial Administrator Exists in Database');
  assert(admins[0].email === 'admin@dpgu.acm.org', 'Admin Email Verified');
  assert(!('password_hash' in admins[0]), 'Password Hash Omitted from Safe User Object');

  // Test 4: Event CRUD, Constraints & Slug Uniqueness
  console.log('\n[Suite 4: Event Management & Database Constraints]');
  const testSlug = `test-hackathon-${Date.now()}`;
  const now = new Date();
  const startTime = new Date(now.getTime() + 86400000 * 5).toISOString();
  const endTime = new Date(now.getTime() + 86400000 * 6).toISOString();
  const regDeadline = new Date(now.getTime() + 86400000 * 4).toISOString();

  const createdEvent = await db.events.create({
    slug: testSlug,
    title: 'Unit Test Systems Hackathon',
    subtitle: 'Automated test event',
    description: 'A comprehensive testing event for validating phase 3 constraints.',
    category: 'Hackathons',
    event_type: 'PAID',
    price_inr: 150,
    capacity: 50,
    is_team_event: true,
    min_team_size: 2,
    max_team_size: 4,
    start_time: startTime,
    end_time: endTime,
    registration_deadline: regDeadline,
    venue: 'Lab 301, DPG University',
    is_online: false,
    status: 'DRAFT',
  });
  assert(createdEvent.id !== undefined && createdEvent.slug === testSlug, 'Event Creation Persisted to DB');

  // Test Duplicate Slug Constraint
  let duplicateSlugCaught = false;
  try {
    await db.events.create({
      slug: testSlug, // duplicate!
      title: 'Conflicting Event',
      description: 'Must fail due to unique constraint on slug.',
      category: 'Workshops',
      event_type: 'FREE',
      price_inr: 0,
      capacity: 20,
      is_team_event: false,
      min_team_size: 1,
      max_team_size: 1,
      start_time: startTime,
      end_time: endTime,
      registration_deadline: regDeadline,
      venue: 'Lab 302',
      is_online: false,
      status: 'DRAFT',
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    duplicateSlugCaught = true;
  }
  assert(duplicateSlugCaught, 'Duplicate Event Slug Rejected with Constraint Error');

  // Test Event Updates and Status Transition
  const updatedEvent = await db.events.update(createdEvent.id, {
    status: 'PUBLISHED',
    capacity: 75,
  });
  assert(updatedEvent.status === 'PUBLISHED', 'Event Status Transitioned to PUBLISHED');
  assert(updatedEvent.capacity === 75, 'Event Capacity Updated');

  // Test 5: Registration Pipeline, Ticket Token & Unique Email Constraint
  console.log('\n[Suite 5: Registration Roster & Attendee Constraints]');
  const attendeeEmail = `student-${Date.now()}@dpgu.acm.org`;
  const reg = await db.registrations.create({
    event_id: createdEvent.id,
    full_name: 'Test Candidate',
    email: attendeeEmail,
    phone: '+91 98765 00000',
    college_name: 'DPG University',
    department: 'B.Tech CSE',
    roll_number: '23BCSE999',
    team_name: 'CyberDefenders',
    registration_status: 'CONFIRMED',
    payment_status: 'SUCCESS',
    team_members: [
      {
        member_name: 'Test Candidate',
        member_email: attendeeEmail,
        is_team_leader: true,
      },
      {
        member_name: 'Peer Member',
        member_email: 'peer@dpgu.acm.org',
        is_team_leader: false,
      },
    ],
  });
  assert(reg.id !== undefined, 'Registration Created and Persisted');
  assert(reg.ticket_token.startsWith('TCK-HAC-'), 'Unique Ticket Token Generated');
  assert(reg.team_members?.length === 2, 'Team Members Linked to Registration');

  // Test Duplicate Registration Constraint for Same Event
  let duplicateEmailCaught = false;
  try {
    await db.registrations.create({
      event_id: createdEvent.id,
      full_name: 'Second Attempt',
      email: attendeeEmail, // duplicate!
      phone: '+91 98765 11111',
      college_name: 'DPG University',
      department: 'B.Tech CSE',
      roll_number: '23BCSE999',
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    duplicateEmailCaught = true;
  }
  assert(duplicateEmailCaught, 'Duplicate Attendee Email for Same Event Rejected');

  // Test 6: Attendance Gate Check-in & Duplicate Detection
  console.log('\n[Suite 6: Attendance Gate Telemetry & Duplicate Prevention]');
  // First Check-in: Must succeed
  const scan1 = await db.attendance.recordCheckIn({
    ticketToken: reg.ticket_token,
    eventId: createdEvent.id,
    adminId: admins[0].id,
    adminName: admins[0].full_name,
    ipAddress: '192.168.1.10',
  });
  assert(scan1.success === true && scan1.scanResult === 'VALID', 'First Check-in Succeeds (VALID)');

  // Second Check-in with SAME token: Must detect duplicate
  const scan2 = await db.attendance.recordCheckIn({
    ticketToken: reg.ticket_token,
    eventId: createdEvent.id,
    adminId: admins[0].id,
    adminName: admins[0].full_name,
    ipAddress: '192.168.1.10',
  });
  assert(scan2.success === false && scan2.scanResult === 'DUPLICATE', 'Immediate Duplicate Check-in Rejected (DUPLICATE)');

  // Invalid Token Check-in
  const scan3 = await db.attendance.recordCheckIn({
    ticketToken: 'TCK-NONEXISTENT-TOKEN',
    eventId: createdEvent.id,
  });
  assert(scan3.success === false && scan3.scanResult === 'INVALID', 'Non-existent Ticket Token Rejected (INVALID)');

  // Test 7: Payment Logs Verification
  console.log('\n[Suite 7: Financial Transaction Logs]');
  const payment = await db.payments.create({
    registration_id: reg.id,
    gateway_name: 'MOCK_RAZORPAY',
    gateway_order_id: `order_${Date.now()}`,
    gateway_payment_id: `pay_${Date.now()}`,
    amount_inr: 150.00,
    currency: 'INR',
    status: 'SUCCESS',
  });
  assert(payment.id !== undefined && payment.status === 'SUCCESS', 'Payment Transaction Logged');

  // Test 8: Content Blocks & Settings
  console.log('\n[Suite 8: Content Blocks & Global Settings]');
  const updatedSettings = await db.settings.update({
    registration_enabled: true,
    max_registrations_per_ip: 5,
  });
  assert(updatedSettings.registration_enabled === true, 'Settings Updated and Persisted');

  const contentBlock = await db.contentBlocks.upsert('test_block', {
    title: 'Test Block Title',
    content_json: { test: true },
  });
  assert(contentBlock.block_key === 'test_block', 'Content Block Upserted and Persisted');

  // Test 9: Audit Logs Capture
  console.log('\n[Suite 9: Cryptographic System Audit Trail]');
  await db.auditLogs.log({
    admin_id: admins[0].id,
    admin_email: admins[0].email,
    action: 'TEST_ACCEPTANCE_RUN',
    target_entity: 'system',
    details_json: { test: 'Phase 3 Verification' },
  });
  const recentLogs = await db.auditLogs.getAll(10);
  assert(recentLogs.some(l => l.action === 'TEST_ACCEPTANCE_RUN'), 'Audit Log Entry Recorded');

  // Cleanup test event
  await db.events.delete(createdEvent.id);

  console.log('\n======================================================');
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  console.log(`TEST SUMMARY: ${passedCount}/${totalCount} Assertions Passed`);
  console.log('======================================================\n');

  if (passedCount < totalCount) {
    process.exit(1);
  }
}

runAcceptanceTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
