-- =====================================================================
-- DPGU ACM Student Chapter — Initial Schema Migration
-- Version: 20261017000001
-- Description: Core relational schema with 9 required tables:
--   1. admin_users
--   2. events
--   3. registrations
--   4. registration_team_members
--   5. payments
--   6. attendance
--   7. team_members
--   8. content_blocks
--   9. audit_logs
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Table: admin_users
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) DEFAULT 'SUPERADMIN' CHECK (role IN ('SUPERADMIN', 'ADMIN', 'SCANNER')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table: events
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(120) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(350),
    description TEXT NOT NULL,
    category VARCHAR(60) NOT NULL CHECK (category IN ('Workshops', 'Hackathons', 'Tech Talks', 'Coding Contests', 'Bootcamps', 'General')),
    banner_url TEXT,
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('FREE', 'PAID')),
    price_inr NUMERIC(10,2) DEFAULT 0.00 CHECK (price_inr >= 0),
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    registered_count INTEGER DEFAULT 0 CHECK (registered_count >= 0),
    is_team_event BOOLEAN DEFAULT FALSE,
    min_team_size INTEGER DEFAULT 1 CHECK (min_team_size >= 1),
    max_team_size INTEGER DEFAULT 1 CHECK (max_team_size >= min_team_size),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL CHECK (end_time > start_time),
    registration_deadline TIMESTAMPTZ NOT NULL CHECK (registration_deadline <= end_time),
    venue VARCHAR(255) NOT NULL,
    is_online BOOLEAN DEFAULT FALSE,
    meeting_link TEXT,
    status VARCHAR(30) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED', 'ARCHIVED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table: registrations
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    ticket_token VARCHAR(80) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(25) NOT NULL,
    college_name VARCHAR(200) NOT NULL,
    department VARCHAR(100) NOT NULL,
    roll_number VARCHAR(60) NOT NULL,
    team_name VARCHAR(150),
    registration_status VARCHAR(30) DEFAULT 'CONFIRMED' 
        CHECK (registration_status IN ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'EXPIRED', 'WAITLISTED')),
    payment_status VARCHAR(30) DEFAULT 'NOT_APPLICABLE' 
        CHECK (payment_status IN ('NOT_APPLICABLE', 'PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_event_attendee_email UNIQUE (event_id, email)
);

-- 4. Table: registration_team_members
CREATE TABLE IF NOT EXISTS registration_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
    member_name VARCHAR(150) NOT NULL,
    member_email VARCHAR(255) NOT NULL,
    member_phone VARCHAR(25),
    member_roll_number VARCHAR(60),
    is_team_leader BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Table: payments
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
    gateway_name VARCHAR(50) NOT NULL,
    gateway_order_id VARCHAR(100) UNIQUE NOT NULL,
    gateway_payment_id VARCHAR(100),
    gateway_signature TEXT,
    amount_inr NUMERIC(10,2) NOT NULL CHECK (amount_inr >= 0),
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')),
    raw_webhook_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Table: attendance
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    scanned_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    scan_result VARCHAR(30) NOT NULL CHECK (scan_result IN ('VALID', 'DUPLICATE', 'INVALID')),
    check_in_time TIMESTAMPTZ DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Table: team_members
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    role_title VARCHAR(100) NOT NULL,
    category VARCHAR(30) NOT NULL CHECK (category IN ('FACULTY', 'EXECUTIVE', 'LEAD', 'CORE')),
    department VARCHAR(150) NOT NULL,
    tenure_year VARCHAR(30) NOT NULL,
    bio TEXT,
    photo_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Table: content_blocks
CREATE TABLE IF NOT EXISTS content_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    block_key VARCHAR(80) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    content_json JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Table: audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_entity VARCHAR(60) NOT NULL,
    target_id VARCHAR(100),
    details_json JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- Performance Indexes
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_events_status_dates ON events (status, start_time DESC);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events (slug);
CREATE INDEX IF NOT EXISTS idx_registrations_event_status ON registrations (event_id, registration_status);
CREATE INDEX IF NOT EXISTS idx_registrations_ticket_token ON registrations (ticket_token);
CREATE INDEX IF NOT EXISTS idx_team_members_registration ON registration_team_members (registration_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments (gateway_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_registration ON payments (registration_id);
CREATE INDEX IF NOT EXISTS idx_attendance_event ON attendance (event_id, check_in_time DESC);
CREATE INDEX IF NOT EXISTS idx_attendance_registration ON attendance (registration_id);
CREATE INDEX IF NOT EXISTS idx_team_order ON team_members (is_active, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs (created_at DESC);
