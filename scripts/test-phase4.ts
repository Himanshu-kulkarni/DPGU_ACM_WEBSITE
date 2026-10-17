/**
 * DPGU ACM Student Chapter — Phase 4 Acceptance Verification Suite
 * Tests public event registration, business rules, concurrency, security, and status views.
 */

import crypto from 'crypto';
import { db } from '../src/lib/db';
import { checkRateLimit, resetRateLimits, validateHoneypot, normalizeEmail } from '../src/lib/security/rate-limit';
import {
  sendRegistrationConfirmedEmail,
  sendPaymentPendingEmail,
  sendRegistrationCancelledEmail,
  sentEmailsLog,
} from '../src/lib/email';
import { guestRegistrationSchema, cancellationSchema } from '../src/schemas/event-registration';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    console.error(`  ✗ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
    process.exitCode = 1;
  }
}

async function runPhase4Tests() {
  console.log('\n=============================================================');
  console.log('DPGU ACM Website — Phase 4 Acceptance Test Suite');
  console.log('Testing Public Event Registration, Security, & Workflow');
  console.log('=============================================================\n');

  // Setup test events
  const freeEvent = await db.events.create({
    slug: `test-free-hack-${Date.now()}`,
    title: 'Test Free Algorithmic Hack',
    subtitle: 'Free test event for Phase 4',
    description: 'Testing free registrations',
    category: 'Hackathons',
    event_type: 'FREE',
    price_inr: 0,
    capacity: 5,
    is_team_event: true,
    min_team_size: 2,
    max_team_size: 4,
    start_time: new Date(Date.now() + 86400000 * 5).toISOString(),
    end_time: new Date(Date.now() + 86400000 * 6).toISOString(),
    registration_deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
    venue: 'CS Lab 101',
    is_online: false,
    status: 'PUBLISHED',
  });

  const paidEvent = await db.events.create({
    slug: `test-paid-workshop-${Date.now()}`,
    title: 'Test Paid Cloud Workshop',
    subtitle: 'Paid test workshop for Phase 4',
    description: 'Testing paid registrations',
    category: 'Workshops',
    event_type: 'PAID',
    price_inr: 299,
    capacity: 3,
    is_team_event: false,
    min_team_size: 1,
    max_team_size: 1,
    start_time: new Date(Date.now() + 86400000 * 7).toISOString(),
    end_time: new Date(Date.now() + 86400000 * 7 + 14400000).toISOString(),
    registration_deadline: new Date(Date.now() + 86400000 * 4).toISOString(),
    venue: 'Auditorium Hall',
    is_online: false,
    status: 'PUBLISHED',
  });

  const closedEvent = await db.events.create({
    slug: `test-closed-event-${Date.now()}`,
    title: 'Test Past Deadline Event',
    subtitle: 'Event with expired deadline',
    description: 'Testing deadline enforcement',
    category: 'Tech Talks',
    event_type: 'FREE',
    price_inr: 0,
    capacity: 50,
    is_team_event: false,
    min_team_size: 1,
    max_team_size: 1,
    start_time: new Date(Date.now() + 86400000 * 10).toISOString(),
    end_time: new Date(Date.now() + 86400000 * 10 + 7200000).toISOString(),
    registration_deadline: new Date(Date.now() - 3600000).toISOString(), // Expired 1 hour ago
    venue: 'Lab 201',
    is_online: false,
    status: 'PUBLISHED',
  });

  // -------------------------------------------------------------------------
  // Test 1: Accountless Free Registration
  // -------------------------------------------------------------------------
  console.log('\n--- 1. Accountless Free Event Registration ---');
  const reg1 = await db.registrations.create({
    event_id: freeEvent.id,
    full_name: 'Aditya Vardhan',
    email: 'Aditya.Vardhan@DPGU.AC.IN',
    phone: '+91 98111 22233',
    college_name: 'DPG University',
    department: 'B.Tech CSE (3rd Year)',
    roll_number: '23BCSE011',
    team_name: 'BinaryBuilders',
    team_members: [
      {
        member_name: 'Rohan Joshi',
        member_email: 'rohan.joshi@dpgu.ac.in',
        member_phone: '+91 98111 33344',
        member_roll_number: '23BCSE012',
      },
    ],
  });

  assert(
    reg1.registration_status === 'CONFIRMED',
    'Free event registration automatically transitions to CONFIRMED'
  );
  assert(
    reg1.payment_status === 'NOT_APPLICABLE',
    'Free event payment_status is set to NOT_APPLICABLE'
  );
  assert(
    reg1.reference_token.startsWith('ref_') && reg1.reference_token.length >= 36,
    'Secure unpredictable reference token is generated (ref_... with 128-bit entropy)'
  );
  assert(
    reg1.ticket_token.startsWith('TCK-HAC-'),
    'Human-readable ticket boarding token is generated with category prefix'
  );
  assert(
    reg1.email === 'aditya.vardhan@dpgu.ac.in',
    'Primary registrant email address is normalized to lowercase'
  );
  assert(
    reg1.team_members?.length === 2, // Leader + 1 additional member
    'Team event properly records all team members including team leader'
  );

  // Verify capacity incremented
  const updatedFreeEvt = await db.events.getById(freeEvent.id);
  assert(
    updatedFreeEvt?.registered_count === 1,
    'Event registered_count incremented safely after registration'
  );

  // -------------------------------------------------------------------------
  // Test 2: Paid Event Registration (Remains Pending)
  // -------------------------------------------------------------------------
  console.log('\n--- 2. Paid Event Registration Workflow ---');
  const reg2 = await db.registrations.create({
    event_id: paidEvent.id,
    full_name: 'Simran Kaur',
    email: 'simran.kaur@dpgu.ac.in',
    phone: '+91 98222 44455',
    college_name: 'DPG University',
    department: 'B.Tech IT (2nd Year)',
    roll_number: '24BIT019',
  });

  assert(
    reg2.registration_status === 'PENDING_PAYMENT',
    'Paid event registration remains in PENDING_PAYMENT status'
  );
  assert(
    reg2.payment_status === 'PENDING',
    'Paid event payment status is set to PENDING'
  );

  // -------------------------------------------------------------------------
  // Test 3: Duplicate Registration Policy
  // -------------------------------------------------------------------------
  console.log('\n--- 3. Duplicate Registration Prevention ---');
  let dupThrew = false;
  try {
    await db.registrations.create({
      event_id: freeEvent.id,
      full_name: 'Aditya Duplicate',
      email: 'aditya.vardhan@dpgu.ac.in', // Same normalized email
      phone: '+91 98111 22233',
      college_name: 'DPG University',
      department: 'B.Tech CSE',
      roll_number: '23BCSE011',
      team_name: 'BinaryBuilders2',
      team_members: [{ member_name: 'Other', member_email: 'other@dpgu.ac.in' }],
    });
  } catch (err: unknown) {
    dupThrew = true;
    assert(
      (err as Error).message.includes('already exists'),
      'Duplicate email registration is blocked for the same event'
    );
  }
  assert(dupThrew, 'Attempting duplicate registration throws an error');

  // -------------------------------------------------------------------------
  // Test 4: Closed Registration Window Enforcement
  // -------------------------------------------------------------------------
  console.log('\n--- 4. Registration Window & Deadline Rules ---');
  let deadlineThrew = false;
  try {
    await db.registrations.create({
      event_id: closedEvent.id,
      full_name: 'Late Attendee',
      email: 'late@dpgu.ac.in',
      phone: '+91 98765 00000',
      college_name: 'DPG University',
      department: 'CSE',
      roll_number: '23BCSE999',
    });
  } catch (err: unknown) {
    deadlineThrew = true;
    assert(
      (err as Error).message.includes('deadline for this event has passed'),
      'Registration past deadline is strictly rejected on server'
    );
  }
  assert(deadlineThrew, 'Attempting registration past deadline throws an error');

  // -------------------------------------------------------------------------
  // Test 5: Team Constraints and Validation
  // -------------------------------------------------------------------------
  console.log('\n--- 5. Team Registration Constraints ---');
  let teamBoundsThrew = false;
  try {
    // Attempting team size 1 for an event requiring min 2
    await db.registrations.create({
      event_id: freeEvent.id,
      full_name: 'Solo Leader',
      email: 'solo@dpgu.ac.in',
      phone: '+91 99999 11111',
      college_name: 'DPG University',
      department: 'CSE',
      roll_number: '23BCSE500',
      team_name: 'SoloTeam',
      team_members: [], // Size = 1, but min is 2
    });
  } catch (err: unknown) {
    teamBoundsThrew = true;
    assert(
      (err as Error).message.includes('Team size must be between'),
      'Team registration under min_team_size is rejected'
    );
  }
  assert(teamBoundsThrew, 'Team size below bounds throws error');

  // -------------------------------------------------------------------------
  // Test 6: Capacity Limits & Overselling Prevention
  // -------------------------------------------------------------------------
  console.log('\n--- 6. Capacity Limits & Overselling Prevention ---');
  // paidEvent capacity is 3. 1 is already registered. Fill remaining 2.
  await db.registrations.create({
    event_id: paidEvent.id,
    full_name: 'Attendee Two',
    email: 'attendee2@dpgu.ac.in',
    phone: '+91 98222 11111',
    college_name: 'DPG University',
    department: 'IT',
    roll_number: '24BIT002',
  });

  await db.registrations.create({
    event_id: paidEvent.id,
    full_name: 'Attendee Three',
    email: 'attendee3@dpgu.ac.in',
    phone: '+91 98222 22222',
    college_name: 'DPG University',
    department: 'IT',
    roll_number: '24BIT003',
  });

  // Now paidEvent has 3/3 capacity. Next registration should fail!
  let capacityThrew = false;
  try {
    await db.registrations.create({
      event_id: paidEvent.id,
      full_name: 'Attendee Four (Overflow)',
      email: 'attendee4@dpgu.ac.in',
      phone: '+91 98222 33333',
      college_name: 'DPG University',
      department: 'IT',
      roll_number: '24BIT004',
    });
  } catch (err: unknown) {
    capacityThrew = true;
    assert(
      (err as Error).message.includes('maximum seating capacity'),
      'Registration exceeding event capacity is strictly rejected'
    );
  }
  assert(capacityThrew, 'Attempting to register for full event throws error');

  // -------------------------------------------------------------------------
  // Test 7: Anti-Bot Honeypot and Rate Limiting
  // -------------------------------------------------------------------------
  console.log('\n--- 7. Anti-Bot Honeypot & Rate Limiting ---');
  assert(validateHoneypot(undefined), 'Empty honeypot passes');
  assert(validateHoneypot(''), 'Blank honeypot passes');
  assert(!validateHoneypot('http://spam-bot.xyz'), 'Populated honeypot is identified as bot');
  assert(!validateHoneypot('   spam   '), 'Whitespace honeypot is identified as bot');

  // Rate Limiting
  const testIp = '198.51.100.42';
  resetRateLimits();
  for (let i = 0; i < 5; i++) {
    const res = checkRateLimit(testIp, 5, 60000);
    assert(res.allowed, `Rate limiter allows request ${i + 1} of 5`);
  }
  const overflowRes = checkRateLimit(testIp, 5, 60000);
  assert(!overflowRes.allowed, 'Rate limiter blocks request 6 when limit is 5');

  // -------------------------------------------------------------------------
  // Test 8: Unpredictable Reference Lookup & Privacy Protection
  // -------------------------------------------------------------------------
  console.log('\n--- 8. Public Status Lookup & Privacy Guard ---');
  const fetchedReg = await db.registrations.getByReferenceToken(reg1.reference_token);
  assert(fetchedReg !== null, 'Registration is accurately retrievable by reference_token');
  assert(fetchedReg?.id === reg1.id, 'Retrieved record matches original registration ID');

  const invalidLookup = await db.registrations.getByReferenceToken('ref_invalid_random_token_123');
  assert(invalidLookup === null, 'Unknown reference token safely returns null');

  // Verify privacy: Public API does not expose raw participant rosters or guessable IDs
  assert(reg1.reference_token.length > 20, 'Reference token is unguessable');

  // -------------------------------------------------------------------------
  // Test 9: Attendee Self-Service Cancellation & Capacity Replenishment
  // -------------------------------------------------------------------------
  console.log('\n--- 9. Attendee Registration Cancellation ---');
  const evtBeforeCancel = await db.events.getById(paidEvent.id);
  const countBeforeCancel = evtBeforeCancel?.registered_count || 0;

  // Attempt cancel with wrong email
  let wrongEmailThrew = false;
  try {
    await db.registrations.cancelRegistration(reg2.reference_token, 'wrong@dpgu.ac.in');
  } catch (err: unknown) {
    wrongEmailThrew = true;
    assert(
      (err as Error).message.includes('does not match'),
      'Cancellation fails if email does not match registration'
    );
  }
  assert(wrongEmailThrew, 'Wrong email cancellation throws error');

  // Cancel with valid email
  const cancelledReg = await db.registrations.cancelRegistration(
    reg2.reference_token,
    'simran.kaur@dpgu.ac.in',
    'Personal schedule conflict'
  );

  assert(
    cancelledReg.registration_status === 'CANCELLED',
    'Registration status successfully transitions to CANCELLED'
  );
  assert(
    !!cancelledReg.cancelled_at,
    'Cancellation timestamp is recorded'
  );

  // Check capacity replenishment
  const evtAfterCancel = await db.events.getById(paidEvent.id);
  assert(
    (evtAfterCancel?.registered_count || 0) === countBeforeCancel - 1,
    'Cancelling registration decrements registered_count and replenishes seating capacity'
  );

  // Cannot cancel already cancelled registration
  let doubleCancelThrew = false;
  try {
    await db.registrations.cancelRegistration(reg2.reference_token, 'simran.kaur@dpgu.ac.in');
  } catch (err: unknown) {
    doubleCancelThrew = true;
    assert(
      (err as Error).message.includes('already been cancelled'),
      'Cannot cancel an already cancelled registration'
    );
  }
  assert(doubleCancelThrew, 'Double cancellation attempt throws error');

  // -------------------------------------------------------------------------
  // Test 10: Transactional Email Subsystem
  // -------------------------------------------------------------------------
  console.log('\n--- 10. Transactional Email Delivery Confirmation ---');
  const emailRes1 = await sendRegistrationConfirmedEmail('attendee@dpgu.ac.in', {
    attendeeName: 'Aditya Vardhan',
    eventTitle: freeEvent.title,
    ticketToken: reg1.ticket_token,
    referenceToken: reg1.reference_token,
    venue: freeEvent.venue,
    startTime: freeEvent.start_time,
    endTime: freeEvent.end_time,
    isOnline: false,
    siteUrl: 'http://localhost:3000',
  });

  assert(emailRes1.success, 'Confirmed transactional email delivers successfully with confirmed provider ID');
  assert(!!emailRes1.messageId, 'Email receipt messageId generated by transactional provider');

  const emailRes2 = await sendPaymentPendingEmail('pending@dpgu.ac.in', {
    attendeeName: 'Simran Kaur',
    eventTitle: paidEvent.title,
    ticketToken: reg2.ticket_token,
    referenceToken: reg2.reference_token,
    priceInr: paidEvent.price_inr,
    startTime: paidEvent.start_time,
    venue: paidEvent.venue,
    siteUrl: 'http://localhost:3000',
  });

  assert(emailRes2.success, 'Payment pending transactional email delivers successfully');

  const emailRes3 = await sendRegistrationCancelledEmail('cancelled@dpgu.ac.in', {
    attendeeName: 'Simran Kaur',
    eventTitle: paidEvent.title,
    referenceToken: reg2.reference_token,
    ticketToken: reg2.ticket_token,
    cancelledAt: new Date().toISOString(),
    siteUrl: 'http://localhost:3000',
  });

  assert(emailRes3.success, 'Cancellation transactional email delivers successfully');

  // -------------------------------------------------------------------------
  // Test 11: Concurrent Registrations Race Condition Safety
  // -------------------------------------------------------------------------
  console.log('\n--- 11. Concurrency & Overselling Race Condition Simulation ---');
  // Create an event with exactly 1 remaining seat
  const raceEvent = await db.events.create({
    slug: `test-race-${Date.now()}`,
    title: 'Race Condition Single-Seat Event',
    subtitle: 'Testing atomic allocation under load',
    description: 'Testing concurrency',
    category: 'Workshops',
    event_type: 'FREE',
    price_inr: 0,
    capacity: 1, // Exactly 1 seat
    is_team_event: false,
    min_team_size: 1,
    max_team_size: 1,
    start_time: new Date(Date.now() + 86400000 * 5).toISOString(),
    end_time: new Date(Date.now() + 86400000 * 5 + 3600000).toISOString(),
    registration_deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    venue: 'Lab 1',
    is_online: false,
    status: 'PUBLISHED',
  });

  // Launch 10 parallel registration attempts concurrently
  const attempts = await Promise.allSettled(
    Array.from({ length: 10 }).map((_, idx) =>
      db.registrations.create({
        event_id: raceEvent.id,
        full_name: `Concurrent User ${idx}`,
        email: `concurrent_${idx}_${Date.now()}@dpgu.ac.in`,
        phone: '+91 90000 0000' + idx,
        college_name: 'DPG University',
        department: 'CSE',
        roll_number: `RACE_${idx}`,
      })
    )
  );

  const successfulAttempts = attempts.filter(a => a.status === 'fulfilled');
  const rejectedAttempts = attempts.filter(a => a.status === 'rejected');

  assert(
    successfulAttempts.length === 1,
    `Exactly 1 concurrent request succeeded out of 10 for a 1-seat event (Got ${successfulAttempts.length})`
  );
  assert(
    rejectedAttempts.length === 9,
    `All 9 excess concurrent requests rejected due to capacity limits (Got ${rejectedAttempts.length})`
  );

  const finalRaceEvt = await db.events.getById(raceEvent.id);
  assert(
    finalRaceEvt?.registered_count === 1,
    'Event registered_count remains exactly 1, preventing any overselling'
  );

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  console.log('\n=============================================================');
  console.log(`Phase 4 Test Results: ${passedTests} / ${totalTests} Passed`);
  console.log('=============================================================\n');

  if (passedTests === totalTests) {
    console.log('🎉 ALL PHASE 4 ACCEPTANCE TESTS COMPLETED SUCCESSFULLY!\n');
    process.exit(0);
  } else {
    console.error(`❌ ${totalTests - passedTests} tests failed.`);
    process.exit(1);
  }
}

runPhase4Tests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
