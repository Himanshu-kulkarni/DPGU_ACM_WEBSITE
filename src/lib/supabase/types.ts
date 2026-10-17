/**
 * DPGU ACM Student Chapter Database Interfaces
 * Mirrors the PostgreSQL schema defined in docs/DATABASE_SCHEMA.md
 */

export type EventType = "FREE" | "PAID";
export type EventStatus = "DRAFT" | "PUBLISHED" | "COMPLETED" | "CANCELLED";
export type RegistrationStatus = "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED" | "EXPIRED";
export type PaymentStatus = "NOT_APPLICABLE" | "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
export type ScanResult = "VALID" | "DUPLICATE" | "INVALID";
export type MemberTier = "FACULTY" | "EXECUTIVE" | "LEAD" | "CORE";

export interface Admin {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: "SUPERADMIN" | "SCANNER";
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface ChapterEvent {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  category_id: string | null;
  banner_url: string | null;
  event_type: EventType;
  price_inr: number;
  capacity: number;
  registered_count: number;
  start_time: string;
  end_time: string;
  venue: string;
  is_online: boolean;
  meeting_link: string | null;
  status: EventStatus;
  created_at: string;
  updated_at: string;
}

export interface Registration {
  id: string;
  event_id: string;
  full_name: string;
  email: string;
  phone: string;
  college_name: string;
  department: string;
  roll_number: string;
  registration_status: RegistrationStatus;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: string;
  registration_id: string;
  event_id: string;
  ticket_token: string;
  qr_payload: string;
  is_checked_in: boolean;
  checked_in_at: string | null;
  checked_in_by: string | null;
  created_at: string;
}

export interface PaymentRecord {
  id: string;
  registration_id: string;
  gateway_name: string;
  gateway_order_id: string;
  gateway_payment_id: string | null;
  gateway_signature: string | null;
  amount_inr: number;
  currency: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  raw_webhook_payload: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface AttendanceLog {
  id: string;
  ticket_id: string | null;
  scanned_by: string | null;
  scan_result: ScanResult;
  ip_address: string | null;
  user_agent: string | null;
  scanned_at: string;
}

export interface TeamMember {
  id: string;
  full_name: string;
  role: string;
  tier: MemberTier;
  bio: string | null;
  photo_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  tenure_year: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  tags: string[];
  demo_url: string | null;
  repo_url: string | null;
  image_url: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  event_name: string;
  position_rank: string;
  achievement_date: string;
  description: string | null;
  photo_url: string | null;
  created_at: string;
}
