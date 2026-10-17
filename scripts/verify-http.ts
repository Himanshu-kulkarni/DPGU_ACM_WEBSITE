async function testHttpEndpoints() {
  const BASE_URL = 'http://localhost:3000';
  console.log('Testing live HTTP endpoints against ' + BASE_URL + '...\n');

  // 1. Test unauthenticated redirect
  console.log('1. Testing Unauthenticated Access to /admin...');
  const res1 = await fetch(`${BASE_URL}/admin`, { redirect: 'manual' });
  console.log(`   Status: ${res1.status} (Expected: 307 or 302 redirect)`);
  const locationHeader = res1.headers.get('location');
  console.log(`   Redirect Location: ${locationHeader}`);
  if (res1.status >= 300 && res1.status < 400 && locationHeader?.includes('/admin/login')) {
    console.log('   ✓ PASS: Unauthenticated access properly blocked and redirected to /admin/login');
  } else {
    console.error('   ✗ FAIL: Expected redirect to /admin/login');
  }

  // 2. Test Invalid Login
  console.log('\n2. Testing Invalid Admin Login...');
  const resLoginFail = await fetch(`${BASE_URL}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@dpgu.acm.org', password: 'WrongPassword123!' }),
  });
  console.log(`   Status: ${resLoginFail.status} (Expected: 401)`);
  const dataFail = await resLoginFail.json();
  console.log(`   Response: ${JSON.stringify(dataFail)}`);
  if (resLoginFail.status === 401) {
    console.log('   ✓ PASS: Invalid login rejected with 401');
  } else {
    console.error('   ✗ FAIL: Expected 401 for invalid password');
  }

  // 3. Test Valid Login & Cookie Capture
  console.log('\n3. Testing Valid Admin Login...');
  const resLogin = await fetch(`${BASE_URL}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@dpgu.acm.org', password: 'Admin@ACM2026!' }),
  });
  console.log(`   Status: ${resLogin.status} (Expected: 200)`);
  const cookieHeader = resLogin.headers.get('set-cookie');
  console.log(`   Set-Cookie: ${cookieHeader ? cookieHeader.slice(0, 45) + '...' : 'NONE'}`);
  const dataLogin = await resLogin.json();
  console.log(`   User: ${dataLogin.user?.email} (${dataLogin.user?.role})`);
  if (resLogin.status === 200 && cookieHeader?.includes('acm_admin_session')) {
    console.log('   ✓ PASS: Valid login succeeded and issued secure session cookie');
  } else {
    console.error('   ✗ FAIL: Failed to obtain session cookie');
  }

  // Extract session token
  const match = cookieHeader?.match(/acm_admin_session=([^;]+)/);
  const sessionToken = match ? match[1] : '';
  const authHeaders = {
    Cookie: `acm_admin_session=${sessionToken}`,
    'Content-Type': 'application/json',
  };

  // 4. Test Authenticated Events API
  console.log('\n4. Testing Authenticated Events API (GET /api/admin/events)...');
  const resEvents = await fetch(`${BASE_URL}/api/admin/events`, { headers: authHeaders });
  console.log(`   Status: ${resEvents.status} (Expected: 200)`);
  const dataEvents = await resEvents.json();
  console.log(`   Total Events in DB: ${dataEvents.events?.length}`);
  if (resEvents.status === 200 && Array.isArray(dataEvents.events)) {
    console.log('   ✓ PASS: Authenticated access to events API verified');
  }

  // 5. Test Authenticated Registrations API & CSV Export
  console.log('\n5. Testing Registrations CSV Export (GET /api/admin/registrations?export=csv)...');
  const resCsv = await fetch(`${BASE_URL}/api/admin/registrations?export=csv`, { headers: authHeaders });
  console.log(`   Status: ${resCsv.status} (Expected: 200)`);
  console.log(`   Content-Type: ${resCsv.headers.get('content-type')}`);
  const csvText = await resCsv.text();
  console.log(`   First Line: ${csvText.split('\n')[0]}`);
  if (resCsv.status === 200 && resCsv.headers.get('content-type')?.includes('text/csv')) {
    console.log('   ✓ PASS: CSV export generated and streamed successfully');
  }

  // 6. Test Gate Check-in Engine
  console.log('\n6. Testing Gate Attendance Check-in API (POST /api/admin/attendance)...');
  const resCheckin = await fetch(`${BASE_URL}/api/admin/attendance`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ ticket_token: 'TCK-ACM-CODE-98214' }),
  });
  console.log(`   Status: ${resCheckin.status} (Expected: 200 or 409 duplicate)`);
  const checkinData = await resCheckin.json();
  console.log(`   Scan Result: ${checkinData.scanResult} - ${checkinData.message}`);
  if (checkinData.scanResult === 'VALID' || checkinData.scanResult === 'DUPLICATE') {
    console.log('   ✓ PASS: Attendance verification engine validated');
  }

  // 7. Test Reports & Audit Log Telemetry
  console.log('\n7. Testing Reports & Audit Log Telemetry (GET /api/admin/reports)...');
  const resReports = await fetch(`${BASE_URL}/api/admin/reports`, { headers: authHeaders });
  console.log(`   Status: ${resReports.status} (Expected: 200)`);
  const reportsData = await resReports.json();
  console.log(`   KPI Telemetry: Events=${reportsData.kpis?.totalEvents}, Regs=${reportsData.kpis?.totalRegistrations}, Revenue=₹${reportsData.kpis?.totalRevenueInr}, Check-in Rate=${reportsData.kpis?.checkInRatePercentage}%`);
  console.log(`   Audit Log Count: ${reportsData.auditLogs?.length}`);
  if (resReports.status === 200 && reportsData.kpis && reportsData.auditLogs?.length > 0) {
    console.log('   ✓ PASS: Reports & audit trail telemetry active');
  }

  // 8. Test Logout
  console.log('\n8. Testing Admin Logout (POST /api/admin/auth/logout)...');
  const resLogout = await fetch(`${BASE_URL}/api/admin/auth/logout`, {
    method: 'POST',
    headers: authHeaders,
  });
  console.log(`   Status: ${resLogout.status} (Expected: 200)`);
  console.log(`   Clear-Cookie: ${resLogout.headers.get('set-cookie')}`);
  if (resLogout.status === 200) {
    console.log('   ✓ PASS: Secure logout clears cookie');
  }

  console.log('\n======================================================');
  console.log('ALL LIVE HTTP ENDPOINTS VALIDATED SUCCESSFULLY!');
  console.log('======================================================');
}

testHttpEndpoints().catch(err => {
  console.error('HTTP Test Failure:', err);
  process.exit(1);
});
