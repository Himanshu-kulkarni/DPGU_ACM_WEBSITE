export type AdminRole = 'SUPERADMIN' | 'ADMIN' | 'SCANNER';

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: AdminRole;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export type EventCategory = 
  | 'Workshops' 
  | 'Hackathons' 
  | 'Tech Talks' 
  | 'Coding Contests' 
  | 'Bootcamps' 
  | 'General';

export type EventStatus = 
  | 'DRAFT' 
  | 'PUBLISHED' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'ARCHIVED';

export type EventType = 'FREE' | 'PAID';

export interface EventEntity {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  category: EventCategory;
  banner_url?: string;
  event_type: EventType;
  price_inr: number;
  capacity: number;
  registered_count: number;
  is_team_event: boolean;
  min_team_size: number;
  max_team_size: number;
  start_time: string;
  end_time: string;
  registration_deadline: string;
  venue: string;
  is_online: boolean;
  meeting_link?: string;
  status: EventStatus;
  created_at: string;
  updated_at: string;
}

export type RegistrationStatus = 
  | 'PENDING_PAYMENT' 
  | 'CONFIRMED' 
  | 'CANCELLED' 
  | 'EXPIRED' 
  | 'WAITLISTED';

export type PaymentStatus = 
  | 'NOT_APPLICABLE' 
  | 'PENDING' 
  | 'SUCCESS' 
  | 'FAILED' 
  | 'REFUNDED';

export interface RegistrationEntity {
  id: string;
  event_id: string;
  ticket_token: string;
  full_name: string;
  email: string;
  phone: string;
  college_name: string;
  department: string;
  roll_number: string;
  team_name?: string;
  registration_status: RegistrationStatus;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  // Joined or calculated fields
  event_title?: string;
  team_members?: RegistrationTeamMemberEntity[];
}

export interface RegistrationTeamMemberEntity {
  id: string;
  registration_id: string;
  member_name: string;
  member_email: string;
  member_phone?: string;
  member_roll_number?: string;
  is_team_leader: boolean;
  created_at: string;
}

export interface PaymentEntity {
  id: string;
  registration_id: string;
  gateway_name: string;
  gateway_order_id: string;
  gateway_payment_id?: string;
  gateway_signature?: string;
  amount_inr: number;
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  raw_webhook_payload?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  // Join fields for dashboard display
  attendee_name?: string;
  attendee_email?: string;
  event_title?: string;
}

export type ScanResult = 'VALID' | 'DUPLICATE' | 'INVALID';

export interface AttendanceEntity {
  id: string;
  registration_id: string;
  event_id: string;
  scanned_by?: string;
  scanned_by_name?: string;
  scan_result: ScanResult;
  check_in_time: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  // Joined fields
  attendee_name?: string;
  attendee_email?: string;
  ticket_token?: string;
  event_title?: string;
}

export type TeamCategory = 'FACULTY' | 'EXECUTIVE' | 'LEAD' | 'CORE';

export interface TeamMemberEntity {
  id: string;
  full_name: string;
  role_title: string;
  category: TeamCategory;
  department: string;
  tenure_year: string;
  bio?: string;
  photo_url?: string;
  linkedin_url?: string;
  github_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentBlockEntity {
  id: string;
  block_key: string;
  title: string;
  content_json: Record<string, unknown>;
  description?: string;
  updated_by?: string;
  updated_at: string;
}

export interface GalleryItemEntity {
  id: string;
  title: string;
  event_title: string;
  date: string;
  category: string;
  image_url: string;
  description?: string;
  display_order: number;
  created_at: string;
}

export interface AuditLogEntity {
  id: string;
  admin_id?: string;
  admin_email?: string;
  action: string;
  target_entity: string;
  target_id?: string;
  details_json?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

export interface ChapterSettings {
  chapter_name: string;
  university_name: string;
  contact_email: string;
  support_phone: string;
  location: string;
  registration_enabled: boolean;
  maintenance_mode: boolean;
  max_registrations_per_ip: number;
  updated_at: string;
}
