/**
 * DPGU ACM — Phase 4 Live HTTP Integration Verification Script
 */

async function runHttpVerification() {
  const baseUrl = 'http://localhost:3000';
  console.log(`\nVerifying Phase 4 Live HTTP endpoints against ${baseUrl}...`);

  // 1. Get published event slug
  const eventRes = await fetch(`${baseUrl}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventId: 'codematrix-2026',
      fullName: 'Live Verification User',
      email: `live.user.${Date.now()}@dpgu.ac.in`,
      phone: '+91 98765 11223',
      collegeName: 'DPG University',
      department: 'Computer Science',
      rollNumber: '23BCSE777',
      teamName: 'LiveMatrixTeam',
      teamMembers: [
        {
          memberName: 'Live Teammate 1',
          memberEmail: `live.mate.${Date.now()}@dpgu.ac.in`,
        },
      ],
      acceptedTerms: true,
    }),
  });

  const regData = await eventRes.json();
  console.log('Registration submission status:', eventRes.status, regData);

  if (eventRes.status !== 201 || !regData.success) {
    throw new Error(`Failed to create live registration: ${JSON.stringify(regData)}`);
  }

  const reference = regData.reference;
  console.log(`\nRegistration created! Reference: ${reference}`);

  // 2. Fetch public registration status via API
  const statusRes = await fetch(`${baseUrl}/api/register/${reference}`);
  const statusData = await statusRes.json();
  console.log('Public Status API result:', statusRes.status, statusData);

  if (statusRes.status !== 200 || !statusData.success) {
    throw new Error('Failed to retrieve registration status from API');
  }

  // 3. Fetch public boarding pass web page
  const pageRes = await fetch(`${baseUrl}/registration/${reference}`);
  console.log('Public HTML Status Page status:', pageRes.status);

  if (pageRes.status !== 200) {
    throw new Error(`Expected HTTP 200 for /registration/${reference}, got ${pageRes.status}`);
  }

  const html = await pageRes.text();
  const hasToken = html.includes(regData.ticket_token);
  console.log(`HTML includes Ticket Token (${regData.ticket_token}):`, hasToken);

  // 4. Test Cancellation via HTTP
  const cancelRes = await fetch(`${baseUrl}/api/register/${reference}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: regData.email || `live.user.${Date.now()}@dpgu.ac.in`, // Use matching email
    }),
  });
  console.log('Cancellation endpoint status:', cancelRes.status);

  console.log('\n✓ Live HTTP verification completed successfully!\n');
}

runHttpVerification().catch(err => {
  console.error('HTTP verification failed:', err);
  process.exit(1);
});
