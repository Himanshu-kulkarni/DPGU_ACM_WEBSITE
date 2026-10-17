-- =====================================================================
-- DPGU ACM Student Chapter — Add Registration Reference & Cancellation
-- Version: 20261017000003
-- Description: Adds cryptographically unpredictable reference tokens and
--   cancellation audit fields to the registrations table.
-- =====================================================================

-- 1. Add reference_token column to registrations
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS reference_token VARCHAR(100) UNIQUE;

-- 2. Add cancellation tracking columns
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

-- 3. Create index for high-performance reference lookups
CREATE INDEX IF NOT EXISTS idx_registrations_reference_token ON registrations(reference_token);

-- 4. Create index for event deadline and status checks
CREATE INDEX IF NOT EXISTS idx_events_status_deadline ON events(status, registration_deadline);
