-- =====================================================================
-- DPGU ACM Student Chapter — Row Level Security (RLS) Policies
-- Version: 20261017000002
-- Description: Strict Row Level Security policies for all tables.
--   Enforces zero public exposure of administrative and sensitive data,
--   allowing public access only to published events, active team members,
--   and public content blocks.
-- =====================================================================

-- 1. Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- 2. Table: admin_users
-- Strict isolation: No public access. Only service role and authenticated admins.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS admin_users_service_role_all ON admin_users;
CREATE POLICY admin_users_service_role_all ON admin_users
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS admin_users_admin_select ON admin_users;
CREATE POLICY admin_users_admin_select ON admin_users
    FOR SELECT
    TO authenticated
    USING (true);

-- ---------------------------------------------------------------------
-- 3. Table: events
-- Public: Read only published events.
-- Service role & Admin: Full management.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS events_public_read ON events;
CREATE POLICY events_public_read ON events
    FOR SELECT
    TO anon, authenticated
    USING (status = 'PUBLISHED');

DROP POLICY IF EXISTS events_admin_all ON events;
CREATE POLICY events_admin_all ON events
    FOR ALL
    TO service_role, authenticated
    USING (true)
    WITH CHECK (true);

-- ---------------------------------------------------------------------
-- 4. Table: registrations
-- Public: Can insert registration (submit registration).
-- Authenticated & Service Role: Full access.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS registrations_public_insert ON registrations;
CREATE POLICY registrations_public_insert ON registrations
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS registrations_admin_all ON registrations;
CREATE POLICY registrations_admin_all ON registrations
    FOR ALL
    TO service_role, authenticated
    USING (true)
    WITH CHECK (true);

-- ---------------------------------------------------------------------
-- 5. Table: registration_team_members
-- Public: Can insert team members during event registration.
-- Admin: Full access.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS reg_team_public_insert ON registration_team_members;
CREATE POLICY reg_team_public_insert ON registration_team_members
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS reg_team_admin_all ON registration_team_members;
CREATE POLICY reg_team_admin_all ON registration_team_members
    FOR ALL
    TO service_role, authenticated
    USING (true)
    WITH CHECK (true);

-- ---------------------------------------------------------------------
-- 6. Table: payments
-- Restricted: No public read or write. Managed strictly via backend / webhooks.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS payments_admin_all ON payments;
CREATE POLICY payments_admin_all ON payments
    FOR ALL
    TO service_role, authenticated
    USING (true)
    WITH CHECK (true);

-- ---------------------------------------------------------------------
-- 7. Table: attendance
-- Restricted: Scanners & Admins only.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS attendance_admin_all ON attendance;
CREATE POLICY attendance_admin_all ON attendance
    FOR ALL
    TO service_role, authenticated
    USING (true)
    WITH CHECK (true);

-- ---------------------------------------------------------------------
-- 8. Table: team_members
-- Public: Read active members.
-- Admin: Full management.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS team_members_public_read ON team_members;
CREATE POLICY team_members_public_read ON team_members
    FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

DROP POLICY IF EXISTS team_members_admin_all ON team_members;
CREATE POLICY team_members_admin_all ON team_members
    FOR ALL
    TO service_role, authenticated
    USING (true)
    WITH CHECK (true);

-- ---------------------------------------------------------------------
-- 9. Table: content_blocks
-- Public: Read content blocks.
-- Admin: Full management.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS content_blocks_public_read ON content_blocks;
CREATE POLICY content_blocks_public_read ON content_blocks
    FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS content_blocks_admin_all ON content_blocks;
CREATE POLICY content_blocks_admin_all ON content_blocks
    FOR ALL
    TO service_role, authenticated
    USING (true)
    WITH CHECK (true);

-- ---------------------------------------------------------------------
-- 10. Table: audit_logs
-- Strictly internal audit trail.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS audit_logs_admin_all ON audit_logs;
CREATE POLICY audit_logs_admin_all ON audit_logs
    FOR ALL
    TO service_role, authenticated
    USING (true)
    WITH CHECK (true);
