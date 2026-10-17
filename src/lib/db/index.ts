import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { hashPassword } from '@/lib/auth/password';
import type {
  AdminUser,
  EventEntity,
  RegistrationEntity,
  RegistrationTeamMemberEntity,
  PaymentEntity,
  AttendanceEntity,
  TeamMemberEntity,
  ContentBlockEntity,
  GalleryItemEntity,
  AuditLogEntity,
  ChapterSettings,
  EventStatus,
  RegistrationStatus,
  PaymentStatus,
  AdminRole,
} from './types';

interface DatabaseSchema {
  admin_users: AdminUser[];
  events: EventEntity[];
  registrations: RegistrationEntity[];
  registration_team_members: RegistrationTeamMemberEntity[];
  payments: PaymentEntity[];
  attendance: AttendanceEntity[];
  team_members: TeamMemberEntity[];
  content_blocks: ContentBlockEntity[];
  gallery_items: GalleryItemEntity[];
  audit_logs: AuditLogEntity[];
  settings: ChapterSettings;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE_PATH = path.join(DATA_DIR, 'db.json');

class DatabaseStore {
  private data: DatabaseSchema;
  private isInitialized = false;

  constructor() {
    this.data = this.getDefaultState();
    this.ensureInitialized();
  }

  private getDefaultState(): DatabaseSchema {
    return {
      admin_users: [],
      events: [],
      registrations: [],
      registration_team_members: [],
      payments: [],
      attendance: [],
      team_members: [],
      content_blocks: [],
      gallery_items: [],
      audit_logs: [],
      settings: {
        chapter_name: 'DPG University ACM Student Chapter',
        university_name: 'DPG University',
        contact_email: 'acm@dpgu.ac.in',
        support_phone: '+91 98765 43210',
        location: 'Sector 34, Gurugram, Haryana, India',
        registration_enabled: true,
        maintenance_mode: false,
        max_registrations_per_ip: 5,
        updated_at: new Date().toISOString(),
      },
    };
  }

  private ensureInitialized() {
    if (this.isInitialized) return;

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE_PATH)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(fileContent);
        this.data = { ...this.getDefaultState(), ...parsed };
      } catch (err) {
        console.error('Failed to parse database file, resetting to initial seed:', err);
        this.seedInitialData();
        this.persist();
      }
    } else {
      this.seedInitialData();
      this.persist();
    }

    // Ensure at least one admin exists
    if (this.data.admin_users.length === 0) {
      this.seedAdminUser();
      this.persist();
    }

    // Migrate any registrations without reference_token
    let migratedRegs = false;
    for (const reg of this.data.registrations) {
      if (!reg.reference_token) {
        reg.reference_token = `ref_${crypto.randomBytes(16).toString('hex')}`;
        migratedRegs = true;
      }
    }
    if (migratedRegs) {
      this.persist();
    }

    this.isInitialized = true;
  }

  private seedAdminUser() {
    const email = (process.env.INITIAL_ADMIN_EMAIL || 'admin@dpgu.acm.org').toLowerCase().trim();
    const rawPassword = process.env.INITIAL_ADMIN_PASSWORD || 'Admin@ACM2026!';
    const name = process.env.INITIAL_ADMIN_NAME || 'DPGU ACM Lead Administrator';

    const admin: AdminUser = {
      id: crypto.randomUUID(),
      email,
      password_hash: hashPassword(rawPassword),
      full_name: name,
      role: 'SUPERADMIN',
      is_active: true,
      last_login_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.data.admin_users.push(admin);
    this.data.audit_logs.unshift({
      id: crypto.randomUUID(),
      admin_id: admin.id,
      admin_email: admin.email,
      action: 'ADMIN_PROVISIONED',
      target_entity: 'admin_users',
      target_id: admin.id,
      details_json: { email: admin.email, role: admin.role, notes: 'Initial administrator provisioned during system bootstrap' },
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString(),
    });
  }

  private seedInitialData() {
    const now = new Date();
    this.seedAdminUser();

    // 1. Seed Initial Events
    const evt1Id = 'e1a2b3c4-1111-4000-8000-000000000001';
    const evt2Id = 'e2b3c4d5-2222-4000-8000-000000000002';
    const evt3Id = 'e3c4d5e6-3333-4000-8000-000000000003';
    const evt4Id = 'e4d5e6f7-4444-4000-8000-000000000004';
    const evt5Id = 'e5e6f7a8-5555-4000-8000-000000000005';

    this.data.events = [
      {
        id: evt1Id,
        slug: 'codematrix-2026',
        title: 'CodeMatrix 2026: Annual Chapter Hackathon',
        subtitle: '36-Hour National Student Hackathon across AI, Web3, and Systems',
        description: 'CodeMatrix 2026 is the flagship annual software hackathon hosted by the DPGU ACM Student Chapter. Over 36 continuous hours, teams of student developers, designers, and researchers will collaborate to build innovative solutions solving real-world challenges in healthcare, sustainable energy, autonomous robotics, and developer tooling.',
        category: 'Hackathons',
        banner_url: '/images/events/hackathon.webp',
        event_type: 'FREE',
        price_inr: 0,
        capacity: 120,
        registered_count: 34,
        is_team_event: true,
        min_team_size: 2,
        max_team_size: 4,
        start_time: '2026-11-14T09:00:00.000Z',
        end_time: '2026-11-15T21:00:00.000Z',
        registration_deadline: '2026-11-10T23:59:59.000Z',
        venue: 'Main Auditorium & CS Labs 301-304, DPG University Campus',
        is_online: false,
        status: 'PUBLISHED',
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
      {
        id: evt2Id,
        slug: 'cloud-native-summit',
        title: 'Cloud Native & Kubernetes Masterclass',
        subtitle: 'Deep dive into microservices, container orchestration, and observability',
        description: 'An intensive, hands-on workshop guiding engineering students through enterprise cloud infrastructure. Learn Docker containerization, Kubernetes pod deployments, ingress controllers, Helm charts, and Prometheus/Grafana observability stacks.',
        category: 'Workshops',
        banner_url: '/images/events/workshop.webp',
        event_type: 'PAID',
        price_inr: 199,
        capacity: 60,
        registered_count: 28,
        is_team_event: false,
        min_team_size: 1,
        max_team_size: 1,
        start_time: '2026-11-28T10:00:00.000Z',
        end_time: '2026-11-28T17:00:00.000Z',
        registration_deadline: '2026-11-26T18:00:00.000Z',
        venue: 'Computer Center Lab 302, DPG University',
        is_online: false,
        status: 'PUBLISHED',
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
      {
        id: evt3Id,
        slug: 'ai-agents-workshop',
        title: 'Autonomous AI Agents & LLM Systems',
        subtitle: 'Building agentic workflows with LangChain, LangGraph, and Vector Databases',
        description: 'Hands-on practical exploration of modern generative AI agent architectures. Learn retrieval-augmented generation (RAG), vector embeddings, multi-agent coordination, and automated reasoning pipelines.',
        category: 'Workshops',
        banner_url: '/images/events/hackathon.webp',
        event_type: 'PAID',
        price_inr: 249,
        capacity: 80,
        registered_count: 42,
        is_team_event: false,
        min_team_size: 1,
        max_team_size: 1,
        start_time: '2026-12-05T10:30:00.000Z',
        end_time: '2026-12-05T16:30:00.000Z',
        registration_deadline: '2026-12-03T23:59:59.000Z',
        venue: 'Virtual Interactive Studio & Google Meet',
        is_online: true,
        meeting_link: 'https://meet.google.com/dpgu-acm-agents',
        status: 'PUBLISHED',
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
      {
        id: evt4Id,
        slug: 'react-nextgen-conference',
        title: 'Modern Full-Stack React & Next.js Architecture',
        subtitle: 'Server Components, Turbopack, and edge rendering patterns',
        description: 'Comprehensive tech talk exploring the next generation of web application design. Understand React 19 compiler internals, Server Actions, streaming SSR, and edge data fetching strategies.',
        category: 'Tech Talks',
        banner_url: '/images/events/workshop.webp',
        event_type: 'FREE',
        price_inr: 0,
        capacity: 150,
        registered_count: 95,
        is_team_event: false,
        min_team_size: 1,
        max_team_size: 1,
        start_time: '2026-12-12T14:00:00.000Z',
        end_time: '2026-12-12T17:00:00.000Z',
        registration_deadline: '2026-12-11T20:00:00.000Z',
        venue: 'Seminar Hall 2, Engineering Block',
        is_online: false,
        status: 'PUBLISHED',
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
      {
        id: evt5Id,
        slug: 'algorithmic-sprint-spring',
        title: 'Spring CodeSprint 2027: Competitive Programming Arena',
        subtitle: 'Draft competitive programming contest for university students',
        description: '2-hour algorithmic sprint focusing on dynamic programming, graph algorithms, and string matching.',
        category: 'Coding Contests',
        banner_url: '/images/events/hackathon.webp',
        event_type: 'FREE',
        price_inr: 0,
        capacity: 100,
        registered_count: 0,
        is_team_event: false,
        min_team_size: 1,
        max_team_size: 1,
        start_time: '2027-02-10T14:00:00.000Z',
        end_time: '2027-02-10T16:30:00.000Z',
        registration_deadline: '2027-02-09T23:59:59.000Z',
        venue: 'Main Lab Block',
        is_online: false,
        status: 'DRAFT',
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
    ];

    // 2. Seed Team Members
    this.data.team_members = [
      {
        id: 'tm-001',
        full_name: 'Dr. Rajesh Sharma',
        role_title: 'Faculty Sponsor & Chapter Coordinator',
        category: 'FACULTY',
        department: 'Department of Computer Science & Engineering',
        tenure_year: 'Academic Term 2026–2027',
        bio: 'Directing faculty oversight, institutional compliance, and academic mentorship for the DPG University ACM Student Chapter. Guiding student engineers toward scientific rigor, ethical leadership, and innovation.',
        photo_url: '',
        linkedin_url: 'https://linkedin.com',
        github_url: 'https://github.com',
        display_order: 1,
        is_active: true,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
      {
        id: 'tm-002',
        full_name: 'Aryan Verma',
        role_title: 'Chapter Chair (President)',
        category: 'EXECUTIVE',
        department: 'B.Tech CSE (4th Year)',
        tenure_year: 'Term 2026–2027',
        bio: 'Chief executive responsible for overall chapter governance, strategic vision, external partnerships, and general body assemblies.',
        photo_url: '',
        linkedin_url: 'https://linkedin.com',
        github_url: 'https://github.com',
        display_order: 2,
        is_active: true,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
      {
        id: 'tm-003',
        full_name: 'Ananya Sharma',
        role_title: 'Vice Chair (Vice President)',
        category: 'EXECUTIVE',
        department: 'B.Tech CSE (3rd Year)',
        tenure_year: 'Term 2026–2027',
        bio: 'Assisting the Chair in strategic planning, inter-society collaborations, and operational logistics across technical domains.',
        photo_url: '',
        linkedin_url: 'https://linkedin.com',
        github_url: 'https://github.com',
        display_order: 3,
        is_active: true,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
      {
        id: 'tm-004',
        full_name: 'Rohit Kumar',
        role_title: 'General Secretary',
        category: 'EXECUTIVE',
        department: 'B.Tech IT (3rd Year)',
        tenure_year: 'Term 2026–2027',
        bio: 'Maintaining official chapter archives, correspondence with ACM India, documentation, and compliance filings.',
        photo_url: '',
        linkedin_url: 'https://linkedin.com',
        github_url: 'https://github.com',
        display_order: 4,
        is_active: true,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
      {
        id: 'tm-005',
        full_name: 'Neha Patel',
        role_title: 'Treasurer & Finance Lead',
        category: 'EXECUTIVE',
        department: 'B.Tech CSE (3rd Year)',
        tenure_year: 'Term 2026–2027',
        bio: 'Administering fiscal accounts, chapter sponsorships, workshop fee audits, and prize distribution reconciliations.',
        photo_url: '',
        linkedin_url: 'https://linkedin.com',
        github_url: 'https://github.com',
        display_order: 5,
        is_active: true,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
      {
        id: 'tm-006',
        full_name: 'Sneha Rao',
        role_title: 'Technical Lead & Webmaster',
        category: 'LEAD',
        department: 'B.Tech CSE (3rd Year)',
        tenure_year: 'Term 2026–2027',
        bio: 'Directing open source architecture, competitive programming practice sessions, and chapter website infrastructure.',
        photo_url: '',
        linkedin_url: 'https://linkedin.com',
        github_url: 'https://github.com',
        display_order: 6,
        is_active: true,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
      {
        id: 'tm-007',
        full_name: 'Vikram Malhotra',
        role_title: 'AI & Research Domain Lead',
        category: 'LEAD',
        department: 'B.Tech AI & Data Science (3rd Year)',
        tenure_year: 'Term 2026–2027',
        bio: 'Organizing machine learning reading groups, hands-on PyTorch workshops, and student research paper initiatives.',
        photo_url: '',
        linkedin_url: 'https://linkedin.com',
        github_url: 'https://github.com',
        display_order: 7,
        is_active: true,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
      {
        id: 'tm-008',
        full_name: 'Priya Singh',
        role_title: 'Creative Design & Outreach Lead',
        category: 'LEAD',
        department: 'B.Tech CSE (2nd Year)',
        tenure_year: 'Term 2026–2027',
        bio: 'Overseeing chapter visual identity, event branding, photography, and social media announcements.',
        photo_url: '',
        linkedin_url: 'https://linkedin.com',
        github_url: 'https://github.com',
        display_order: 8,
        is_active: true,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
    ];

    // 3. Seed Gallery Items
    this.data.gallery_items = [
      {
        id: 'gal-001',
        title: 'CodeMatrix Hackathon: Midnight Sprint',
        event_title: 'CodeMatrix Hackathon',
        date: 'November 2025',
        category: 'Hackathons',
        image_url: '/images/gallery/hackathon-sprint.webp',
        description: 'Teams collaborating on distributed systems and AI solutions during the overnight sprint.',
        display_order: 1,
        created_at: now.toISOString(),
      },
      {
        id: 'gal-002',
        title: 'Cloud Architecture Masterclass in Session',
        event_title: 'Cloud Native Masterclass',
        date: 'October 2025',
        category: 'Workshops',
        image_url: '/images/gallery/cloud-workshop.webp',
        description: 'Hands-on lab demonstration of containerized services and database modeling in Lab 304.',
        display_order: 2,
        created_at: now.toISOString(),
      },
      {
        id: 'gal-003',
        title: 'Chapter Annual Inauguration Ceremony',
        event_title: 'Annual Inauguration',
        date: 'August 2025',
        category: 'Ceremonies',
        image_url: '/images/gallery/ceremony.webp',
        description: 'Faculty coordinator and executive committee lighting the inaugural lamp in the auditorium.',
        display_order: 3,
        created_at: now.toISOString(),
      },
      {
        id: 'gal-004',
        title: 'Algorithmic Speed Contest Arena',
        event_title: 'CodeSprint Contests',
        date: 'September 2025',
        category: 'Competitions',
        image_url: '/images/gallery/contest.webp',
        description: 'Student programmers participating in the live 2-hour speed coding round.',
        display_order: 4,
        created_at: now.toISOString(),
      },
    ];

    // 4. Seed Sample Registrations, Payments, and Attendance
    const reg1Id = 'r1a2b3c4-1111-4000-8000-000000000001';
    const reg2Id = 'r2b3c4d5-2222-4000-8000-000000000002';
    const reg3Id = 'r3c4d5e6-3333-4000-8000-000000000003';

    this.data.registrations = [
      {
        id: reg1Id,
        event_id: evt1Id,
        ticket_token: 'TCK-ACM-CODE-98214',
        reference_token: 'ref_seed_kunal_0000000000000001',
        full_name: 'Kunal Singhania',
        email: 'kunal.singhania@student.dpgu.ac.in',
        phone: '+91 98112 34567',
        college_name: 'DPG University',
        department: 'B.Tech CSE (3rd Year)',
        roll_number: '23BCSE104',
        team_name: 'ByteCrafters',
        registration_status: 'CONFIRMED',
        payment_status: 'NOT_APPLICABLE',
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: reg2Id,
        event_id: evt2Id,
        ticket_token: 'TCK-ACM-K8S-45129',
        reference_token: 'ref_seed_meera_0000000000000002',
        full_name: 'Meera Chawla',
        email: 'meera.chawla@student.dpgu.ac.in',
        phone: '+91 98765 12345',
        college_name: 'DPG University',
        department: 'B.Tech IT (2nd Year)',
        roll_number: '24BIT048',
        registration_status: 'CONFIRMED',
        payment_status: 'SUCCESS',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: reg3Id,
        event_id: evt3Id,
        ticket_token: 'TCK-ACM-AGNT-71043',
        reference_token: 'ref_seed_tanmay_0000000000000003',
        full_name: 'Tanmay Saxena',
        email: 'tanmay.saxena@gmail.com',
        phone: '+91 99887 76655',
        college_name: 'Delhi Technological University',
        department: 'Software Engineering',
        roll_number: '2023/SE/88',
        registration_status: 'CONFIRMED',
        payment_status: 'SUCCESS',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    // Seed Team Members for Reg 1 (CodeMatrix team event)
    this.data.registration_team_members = [
      {
        id: crypto.randomUUID(),
        registration_id: reg1Id,
        member_name: 'Kunal Singhania',
        member_email: 'kunal.singhania@student.dpgu.ac.in',
        member_phone: '+91 98112 34567',
        member_roll_number: '23BCSE104',
        is_team_leader: true,
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: crypto.randomUUID(),
        registration_id: reg1Id,
        member_name: 'Aakash Mehra',
        member_email: 'aakash.mehra@student.dpgu.ac.in',
        member_phone: '+91 98112 99881',
        member_roll_number: '23BCSE112',
        is_team_leader: false,
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ];

    // Seed Payments
    this.data.payments = [
      {
        id: crypto.randomUUID(),
        registration_id: reg2Id,
        gateway_name: 'RAZORPAY_MOCK',
        gateway_order_id: 'order_mock_k8s_9012',
        gateway_payment_id: 'pay_mock_k8s_7812',
        amount_inr: 199.00,
        currency: 'INR',
        status: 'SUCCESS',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: crypto.randomUUID(),
        registration_id: reg3Id,
        gateway_name: 'RAZORPAY_MOCK',
        gateway_order_id: 'order_mock_agnt_3411',
        gateway_payment_id: 'pay_mock_agnt_9918',
        amount_inr: 249.00,
        currency: 'INR',
        status: 'SUCCESS',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    // Seed Attendance Records
    this.data.attendance = [
      {
        id: crypto.randomUUID(),
        registration_id: reg1Id,
        event_id: evt1Id,
        scanned_by: this.data.admin_users[0]?.id,
        scanned_by_name: this.data.admin_users[0]?.full_name,
        scan_result: 'VALID',
        check_in_time: new Date(Date.now() - 3600000 * 4).toISOString(),
        ip_address: '127.0.0.1',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
    ];

    // 5. Seed Content Blocks
    this.data.content_blocks = [
      {
        id: crypto.randomUUID(),
        block_key: 'homepage_hero',
        title: 'Homepage Hero Headline and Subtitle',
        content_json: {
          headline: 'Build. Innovate. Compete.',
          tagline: 'The official computing and engineering chapter of DPG University.',
          description: 'Empowering student developers, researchers, and tech enthusiasts through competitive programming, workshops, national hackathons, and open source mentorship.',
          primaryCtaText: 'Explore Events',
          primaryCtaLink: '/events',
          secondaryCtaText: 'About Chapter',
          secondaryCtaLink: '/about',
        },
        description: 'Displayed at the top of the homepage hero banner',
        updated_at: now.toISOString(),
      },
      {
        id: crypto.randomUUID(),
        block_key: 'chapter_mission',
        title: 'Chapter Mission & Pillars',
        content_json: {
          mission: 'To foster computing excellence, scientific curiosity, and collaborative innovation within DPG University.',
          pillars: [
            { title: 'Technical Mastery', desc: 'Rigorous hands-on coding, systems design, and algorithmic problem-solving.' },
            { title: 'Open Innovation', desc: 'Promoting open source contribution and multi-disciplinary software products.' },
            { title: 'Professional Growth', desc: 'Industry mentorship, conference sponsorships, and career acceleration.' },
          ],
        },
        description: 'Core pillars showcased in the chapter about section',
        updated_at: now.toISOString(),
      },
    ];
  }

  private persist() {
    try {
      const serialized = JSON.stringify(this.data, null, 2);
      const tempPath = `${DB_FILE_PATH}.tmp`;
      fs.writeFileSync(tempPath, serialized, 'utf-8');
      fs.renameSync(tempPath, DB_FILE_PATH);
    } catch (err) {
      console.error('Error writing to database file:', err);
    }
  }

  // =========================================================================
  // Repository Methods
  // =========================================================================

  public events = {
    getAll: async (status?: EventStatus): Promise<EventEntity[]> => {
      this.ensureInitialized();
      if (!status) return [...this.data.events];
      return this.data.events.filter(e => e.status === status);
    },

    getById: async (id: string): Promise<EventEntity | null> => {
      this.ensureInitialized();
      return this.data.events.find(e => e.id === id) || null;
    },

    getBySlug: async (slug: string): Promise<EventEntity | null> => {
      this.ensureInitialized();
      return this.data.events.find(e => e.slug.toLowerCase() === slug.toLowerCase()) || null;
    },

    create: async (payload: Omit<EventEntity, 'id' | 'created_at' | 'updated_at' | 'registered_count'>): Promise<EventEntity> => {
      this.ensureInitialized();
      const existing = this.data.events.find(e => e.slug.toLowerCase() === payload.slug.toLowerCase());
      if (existing) {
        throw new Error(`An event with slug "${payload.slug}" already exists.`);
      }

      const now = new Date().toISOString();
      const newEvent: EventEntity = {
        ...payload,
        id: crypto.randomUUID(),
        registered_count: 0,
        created_at: now,
        updated_at: now,
      };

      this.data.events.unshift(newEvent);
      this.persist();
      return newEvent;
    },

    update: async (id: string, updates: Partial<EventEntity>): Promise<EventEntity> => {
      this.ensureInitialized();
      const index = this.data.events.findIndex(e => e.id === id);
      if (index === -1) {
        throw new Error(`Event with ID "${id}" was not found.`);
      }

      if (updates.slug && updates.slug.toLowerCase() !== this.data.events[index].slug.toLowerCase()) {
        const slugConflict = this.data.events.find(
          e => e.id !== id && e.slug.toLowerCase() === updates.slug!.toLowerCase()
        );
        if (slugConflict) {
          throw new Error(`An event with slug "${updates.slug}" already exists.`);
        }
      }

      const updated: EventEntity = {
        ...this.data.events[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };

      this.data.events[index] = updated;
      this.persist();
      return updated;
    },

    delete: async (id: string): Promise<boolean> => {
      this.ensureInitialized();
      const initialLength = this.data.events.length;
      this.data.events = this.data.events.filter(e => e.id !== id);
      const deleted = this.data.events.length < initialLength;
      if (deleted) {
        this.persist();
      }
      return deleted;
    },
  };

  public registrations = {
    getAll: async (filters?: {
      event_id?: string;
      search?: string;
      status?: RegistrationStatus;
      payment_status?: PaymentStatus;
    }): Promise<RegistrationEntity[]> => {
      this.ensureInitialized();
      let list = [...this.data.registrations];

      if (filters?.event_id) {
        list = list.filter(r => r.event_id === filters.event_id);
      }
      if (filters?.status) {
        list = list.filter(r => r.registration_status === filters.status);
      }
      if (filters?.payment_status) {
        list = list.filter(r => r.payment_status === filters.payment_status);
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase().trim();
        list = list.filter(
          r =>
            r.full_name.toLowerCase().includes(q) ||
            r.email.toLowerCase().includes(q) ||
            r.ticket_token.toLowerCase().includes(q) ||
            r.roll_number.toLowerCase().includes(q) ||
            (r.team_name && r.team_name.toLowerCase().includes(q))
        );
      }

      // Attach event title & team members
      return list.map(r => {
        const evt = this.data.events.find(e => e.id === r.event_id);
        const members = this.data.registration_team_members.filter(m => m.registration_id === r.id);
        return {
          ...r,
          event_title: evt?.title || 'Unknown Event',
          team_members: members,
        };
      });
    },

    getById: async (id: string): Promise<RegistrationEntity | null> => {
      this.ensureInitialized();
      const reg = this.data.registrations.find(r => r.id === id);
      if (!reg) return null;

      const evt = this.data.events.find(e => e.id === reg.event_id);
      const members = this.data.registration_team_members.filter(m => m.registration_id === reg.id);

      return {
        ...reg,
        event_title: evt?.title,
        team_members: members,
      };
    },

    getByTicketToken: async (ticketToken: string): Promise<RegistrationEntity | null> => {
      this.ensureInitialized();
      const reg = this.data.registrations.find(
        r => r.ticket_token.toLowerCase() === ticketToken.toLowerCase().trim()
      );
      if (!reg) return null;

      const evt = this.data.events.find(e => e.id === reg.event_id);
      const members = this.data.registration_team_members.filter(m => m.registration_id === reg.id);

      return {
        ...reg,
        event_title: evt?.title,
        team_members: members,
      };
    },

    getByReferenceToken: async (referenceToken: string): Promise<RegistrationEntity | null> => {
      this.ensureInitialized();
      const cleanToken = referenceToken.trim();
      const reg = this.data.registrations.find(
        r => r.reference_token === cleanToken
      );
      if (!reg) return null;

      const evt = this.data.events.find(e => e.id === reg.event_id);
      const members = this.data.registration_team_members.filter(m => m.registration_id === reg.id);

      return {
        ...reg,
        event_title: evt?.title,
        team_members: members,
      };
    },

    create: async (payload: {
      event_id: string;
      full_name: string;
      email: string;
      phone: string;
      college_name: string;
      department: string;
      roll_number: string;
      team_name?: string;
      registration_status?: RegistrationStatus;
      payment_status?: PaymentStatus;
      team_members?: Array<{
        member_name: string;
        member_email: string;
        member_phone?: string;
        member_roll_number?: string;
        is_team_leader?: boolean;
      }>;
    }): Promise<RegistrationEntity> => {
      this.ensureInitialized();

      const event = this.data.events.find(e => e.id === payload.event_id);
      if (!event) {
        throw new Error(`Target event with ID "${payload.event_id}" does not exist.`);
      }

      // 1. Verify event is published
      if (event.status !== 'PUBLISHED') {
        throw new Error('Registration is not currently open for this event.');
      }

      // 2. Verify registration deadline
      if (new Date() > new Date(event.registration_deadline)) {
        throw new Error('The registration deadline for this event has passed.');
      }

      // 3. Verify capacity
      if (event.registered_count >= event.capacity) {
        throw new Error('This event has reached maximum seating capacity.');
      }

      // 4. Check duplicate registration for primary registrant email
      const normalizedEmail = payload.email.trim().toLowerCase();
      const duplicate = this.data.registrations.find(
        r => r.event_id === payload.event_id &&
             r.email.toLowerCase() === normalizedEmail &&
             r.registration_status !== 'CANCELLED'
      );
      if (duplicate) {
        throw new Error(`A registration with email "${payload.email}" already exists for this event.`);
      }

      // 5. If team event, validate team bounds and team member emails
      if (event.is_team_event) {
        if (!payload.team_name || !payload.team_name.trim()) {
          throw new Error('Team name is required for team registrations.');
        }

        // Count unique team participants (supporting whether leader is in team_members or not)
        const teamMemberEmails = (payload.team_members || []).map(m => m.member_email.trim().toLowerCase());
        const allTeamEmails = new Set<string>([normalizedEmail, ...teamMemberEmails]);
        const totalTeamSize = allTeamEmails.size;

        if (totalTeamSize < event.min_team_size || totalTeamSize > event.max_team_size) {
          throw new Error(
            `Team size must be between ${event.min_team_size} and ${event.max_team_size} members (including the leader). Current size: ${totalTeamSize}.`
          );
        }

        // Check duplicate emails within team members
        if (payload.team_members && payload.team_members.length > 0) {
          const seen = new Set<string>();
          for (const m of payload.team_members) {
            const mEmail = m.member_email.trim().toLowerCase();
            if (seen.has(mEmail)) {
              throw new Error(`Duplicate email "${m.member_email}" found within the team.`);
            }
            seen.add(mEmail);

            // Also check if member is already registered in another active registration for this event
            const memberRegistered = this.data.registration_team_members.find(tm => {
              if (tm.member_email.toLowerCase() !== mEmail) return false;
              const parentReg = this.data.registrations.find(r => r.id === tm.registration_id);
              return parentReg && parentReg.event_id === payload.event_id && parentReg.registration_status !== 'CANCELLED';
            });
            if (memberRegistered) {
              throw new Error(`Team member with email "${m.member_email}" is already registered for this event.`);
            }
          }
        }
      }

      const id = crypto.randomUUID();
      const ticket_token = `TCK-${event.category.substring(0, 3).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      const reference_token = `ref_${crypto.randomBytes(16).toString('hex')}`;
      const now = new Date().toISOString();

      // Determine statuses strictly based on event rules:
      // Free events become CONFIRMED; paid events remain PENDING_PAYMENT until Phase 5
      let registration_status: RegistrationStatus;
      let payment_status: PaymentStatus;

      if (event.event_type === 'FREE') {
        registration_status = payload.registration_status || 'CONFIRMED';
        payment_status = 'NOT_APPLICABLE';
      } else {
        registration_status = payload.registration_status || 'PENDING_PAYMENT';
        payment_status = payload.payment_status || 'PENDING';
      }

      const newRegistration: RegistrationEntity = {
        id,
        event_id: payload.event_id,
        ticket_token,
        reference_token,
        full_name: payload.full_name.trim(),
        email: normalizedEmail,
        phone: payload.phone.trim(),
        college_name: payload.college_name.trim(),
        department: payload.department.trim(),
        roll_number: payload.roll_number.trim(),
        team_name: payload.team_name?.trim(),
        registration_status,
        payment_status,
        created_at: now,
        updated_at: now,
      };

      this.data.registrations.unshift(newRegistration);

      // Create team members if provided
      const createdMembers: RegistrationTeamMemberEntity[] = [];
      const leaderInProvidedMembers = payload.team_members?.some(
        m => m.member_email.trim().toLowerCase() === normalizedEmail || m.is_team_leader
      );

      if (event.is_team_event && !leaderInProvidedMembers) {
        const leaderMember: RegistrationTeamMemberEntity = {
          id: crypto.randomUUID(),
          registration_id: id,
          member_name: payload.full_name.trim(),
          member_email: normalizedEmail,
          member_phone: payload.phone.trim(),
          member_roll_number: payload.roll_number.trim(),
          is_team_leader: true,
          created_at: now,
        };
        this.data.registration_team_members.push(leaderMember);
        createdMembers.push(leaderMember);
      }

      if (payload.team_members && payload.team_members.length > 0) {
        for (const m of payload.team_members) {
          const isLeader = m.is_team_leader ?? (m.member_email.trim().toLowerCase() === normalizedEmail);
          const memberEntity: RegistrationTeamMemberEntity = {
            id: crypto.randomUUID(),
            registration_id: id,
            member_name: m.member_name.trim(),
            member_email: m.member_email.trim().toLowerCase(),
            member_phone: m.member_phone?.trim(),
            member_roll_number: m.member_roll_number?.trim(),
            is_team_leader: !!isLeader,
            created_at: now,
          };
          this.data.registration_team_members.push(memberEntity);
          createdMembers.push(memberEntity);
        }
      }

      // Increment event registration count atomically
      event.registered_count = (event.registered_count || 0) + 1;
      this.persist();

      return {
        ...newRegistration,
        event_title: event.title,
        team_members: createdMembers,
      };
    },

    cancelRegistration: async (
      referenceToken: string,
      attendeeEmail: string,
      reason?: string
    ): Promise<RegistrationEntity> => {
      this.ensureInitialized();
      const cleanToken = referenceToken.trim();
      const cleanEmail = attendeeEmail.trim().toLowerCase();

      const index = this.data.registrations.findIndex(
        r => r.reference_token === cleanToken
      );
      if (index === -1) {
        throw new Error('Registration record not found.');
      }

      const reg = this.data.registrations[index];

      // Verify email identity matches
      if (reg.email.toLowerCase() !== cleanEmail) {
        throw new Error('The email address provided does not match this registration.');
      }

      // Check if already cancelled
      if (reg.registration_status === 'CANCELLED') {
        throw new Error('This registration has already been cancelled.');
      }

      // Check if event has already started
      const event = this.data.events.find(e => e.id === reg.event_id);
      if (event && new Date() >= new Date(event.start_time)) {
        throw new Error('Registrations cannot be cancelled after the event has started.');
      }

      const now = new Date().toISOString();
      reg.registration_status = 'CANCELLED';
      reg.cancelled_at = now;
      reg.cancellation_reason = reason || 'Cancelled by attendee request';
      reg.updated_at = now;

      // Decrement event capacity count if event exists and count > 0
      if (event && event.registered_count > 0) {
        event.registered_count -= 1;
      }

      this.data.audit_logs.unshift({
        id: crypto.randomUUID(),
        action: 'REGISTRATION_CANCELLED',
        target_entity: 'registrations',
        target_id: reg.id,
        details_json: {
          reference_token: reg.reference_token,
          email: reg.email,
          event_id: reg.event_id,
          reason: reg.cancellation_reason,
        },
        ip_address: '127.0.0.1',
        created_at: now,
      });

      this.persist();
      return reg;
    },

    updateStatus: async (
      id: string,
      registration_status: RegistrationStatus,
      payment_status?: PaymentStatus
    ): Promise<RegistrationEntity> => {
      this.ensureInitialized();
      const index = this.data.registrations.findIndex(r => r.id === id);
      if (index === -1) {
        throw new Error(`Registration with ID "${id}" was not found.`);
      }

      this.data.registrations[index].registration_status = registration_status;
      if (payment_status) {
        this.data.registrations[index].payment_status = payment_status;
      }
      this.data.registrations[index].updated_at = new Date().toISOString();

      this.persist();
      return this.data.registrations[index];
    },

    delete: async (id: string): Promise<boolean> => {
      this.ensureInitialized();
      const reg = this.data.registrations.find(r => r.id === id);
      if (!reg) return false;

      this.data.registrations = this.data.registrations.filter(r => r.id !== id);
      this.data.registration_team_members = this.data.registration_team_members.filter(
        m => m.registration_id !== id
      );
      this.data.attendance = this.data.attendance.filter(a => a.registration_id !== id);
      this.data.payments = this.data.payments.filter(p => p.registration_id !== id);

      const evt = this.data.events.find(e => e.id === reg.event_id);
      if (evt && evt.registered_count > 0) {
        evt.registered_count -= 1;
      }

      this.persist();
      return true;
    },
  };

  public payments = {
    getAll: async (): Promise<PaymentEntity[]> => {
      this.ensureInitialized();
      return this.data.payments.map(p => {
        const reg = this.data.registrations.find(r => r.id === p.registration_id);
        const evt = reg ? this.data.events.find(e => e.id === reg.event_id) : null;
        return {
          ...p,
          attendee_name: reg?.full_name || 'N/A',
          attendee_email: reg?.email || 'N/A',
          event_title: evt?.title || 'N/A',
        };
      });
    },

    getById: async (id: string): Promise<PaymentEntity | null> => {
      this.ensureInitialized();
      const p = this.data.payments.find(item => item.id === id);
      if (!p) return null;
      const reg = this.data.registrations.find(r => r.id === p.registration_id);
      const evt = reg ? this.data.events.find(e => e.id === reg.event_id) : null;
      return {
        ...p,
        attendee_name: reg?.full_name,
        attendee_email: reg?.email,
        event_title: evt?.title,
      };
    },

    create: async (payload: Omit<PaymentEntity, 'id' | 'created_at' | 'updated_at'>): Promise<PaymentEntity> => {
      this.ensureInitialized();
      const now = new Date().toISOString();
      const payment: PaymentEntity = {
        ...payload,
        id: crypto.randomUUID(),
        created_at: now,
        updated_at: now,
      };
      this.data.payments.unshift(payment);
      this.persist();
      return payment;
    },

    updateStatus: async (
      id: string,
      status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED',
      paymentId?: string
    ): Promise<PaymentEntity> => {
      this.ensureInitialized();
      const payment = this.data.payments.find(p => p.id === id);
      if (!payment) throw new Error(`Payment record with ID "${id}" was not found.`);

      payment.status = status;
      if (paymentId) payment.gateway_payment_id = paymentId;
      payment.updated_at = new Date().toISOString();

      // If status is SUCCESS, update registration payment status as well
      if (status === 'SUCCESS') {
        const reg = this.data.registrations.find(r => r.id === payment.registration_id);
        if (reg) {
          reg.payment_status = 'SUCCESS';
          reg.registration_status = 'CONFIRMED';
          reg.updated_at = new Date().toISOString();
        }
      }

      this.persist();
      return payment;
    },
  };

  public attendance = {
    getAll: async (): Promise<AttendanceEntity[]> => {
      this.ensureInitialized();
      return this.data.attendance.map(a => {
        const reg = this.data.registrations.find(r => r.id === a.registration_id);
        const evt = this.data.events.find(e => e.id === a.event_id);
        return {
          ...a,
          attendee_name: reg?.full_name,
          attendee_email: reg?.email,
          ticket_token: reg?.ticket_token,
          event_title: evt?.title,
        };
      });
    },

    getByEvent: async (eventId: string): Promise<AttendanceEntity[]> => {
      this.ensureInitialized();
      return this.data.attendance
        .filter(a => a.event_id === eventId)
        .map(a => {
          const reg = this.data.registrations.find(r => r.id === a.registration_id);
          const evt = this.data.events.find(e => e.id === a.event_id);
          return {
            ...a,
            attendee_name: reg?.full_name,
            attendee_email: reg?.email,
            ticket_token: reg?.ticket_token,
            event_title: evt?.title,
          };
        });
    },

    recordCheckIn: async (params: {
      ticketToken: string;
      eventId?: string;
      adminId?: string;
      adminName?: string;
      ipAddress?: string;
    }): Promise<{
      success: boolean;
      scanResult: 'VALID' | 'DUPLICATE' | 'INVALID';
      message: string;
      record?: AttendanceEntity;
      registration?: RegistrationEntity;
    }> => {
      this.ensureInitialized();
      const token = params.ticketToken.trim().toUpperCase();
      const reg = this.data.registrations.find(
        r => r.ticket_token.toUpperCase() === token
      );

      if (!reg) {
        return {
          success: false,
          scanResult: 'INVALID',
          message: `Ticket token "${token}" was not found in registered records.`,
        };
      }

      if (params.eventId && reg.event_id !== params.eventId) {
        return {
          success: false,
          scanResult: 'INVALID',
          message: 'Ticket is registered for a different event.',
        };
      }

      if (reg.registration_status !== 'CONFIRMED') {
        return {
          success: false,
          scanResult: 'INVALID',
          message: `Registration status is "${reg.registration_status}". Only CONFIRMED registrations can check in.`,
        };
      }

      // Check if already checked in
      const existingAttendance = this.data.attendance.find(
        a => a.registration_id === reg.id && a.scan_result === 'VALID'
      );

      if (existingAttendance) {
        // Record duplicate attempt
        const dupRecord: AttendanceEntity = {
          id: crypto.randomUUID(),
          registration_id: reg.id,
          event_id: reg.event_id,
          scanned_by: params.adminId,
          scanned_by_name: params.adminName,
          scan_result: 'DUPLICATE',
          check_in_time: new Date().toISOString(),
          ip_address: params.ipAddress || '127.0.0.1',
          created_at: new Date().toISOString(),
        };
        this.data.attendance.unshift(dupRecord);
        this.persist();

        return {
          success: false,
          scanResult: 'DUPLICATE',
          message: `Ticket already checked in at ${new Date(existingAttendance.check_in_time).toLocaleTimeString()}`,
          record: existingAttendance,
          registration: reg,
        };
      }

      // Valid check-in
      const validRecord: AttendanceEntity = {
        id: crypto.randomUUID(),
        registration_id: reg.id,
        event_id: reg.event_id,
        scanned_by: params.adminId,
        scanned_by_name: params.adminName,
        scan_result: 'VALID',
        check_in_time: new Date().toISOString(),
        ip_address: params.ipAddress || '127.0.0.1',
        created_at: new Date().toISOString(),
      };

      this.data.attendance.unshift(validRecord);
      this.persist();

      return {
        success: true,
        scanResult: 'VALID',
        message: `Successfully checked in ${reg.full_name}`,
        record: validRecord,
        registration: reg,
      };
    },

    getStats: async (eventId?: string) => {
      this.ensureInitialized();
      const list = eventId
        ? this.data.attendance.filter(a => a.event_id === eventId)
        : this.data.attendance;

      const validCount = list.filter(a => a.scan_result === 'VALID').length;
      const duplicateCount = list.filter(a => a.scan_result === 'DUPLICATE').length;
      const invalidCount = list.filter(a => a.scan_result === 'INVALID').length;

      return {
        totalScans: list.length,
        validCount,
        duplicateCount,
        invalidCount,
      };
    },
  };

  public teamMembers = {
    getAll: async (activeOnly = false): Promise<TeamMemberEntity[]> => {
      this.ensureInitialized();
      let list = [...this.data.team_members];
      if (activeOnly) {
        list = list.filter(m => m.is_active);
      }
      return list.sort((a, b) => a.display_order - b.display_order);
    },

    getById: async (id: string): Promise<TeamMemberEntity | null> => {
      this.ensureInitialized();
      return this.data.team_members.find(m => m.id === id) || null;
    },

    create: async (payload: Omit<TeamMemberEntity, 'id' | 'created_at' | 'updated_at'>): Promise<TeamMemberEntity> => {
      this.ensureInitialized();
      const now = new Date().toISOString();
      const member: TeamMemberEntity = {
        ...payload,
        id: crypto.randomUUID(),
        created_at: now,
        updated_at: now,
      };
      this.data.team_members.push(member);
      this.persist();
      return member;
    },

    update: async (id: string, updates: Partial<TeamMemberEntity>): Promise<TeamMemberEntity> => {
      this.ensureInitialized();
      const index = this.data.team_members.findIndex(m => m.id === id);
      if (index === -1) throw new Error(`Team member with ID "${id}" was not found.`);

      const updated = {
        ...this.data.team_members[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      this.data.team_members[index] = updated;
      this.persist();
      return updated;
    },

    delete: async (id: string): Promise<boolean> => {
      this.ensureInitialized();
      const len = this.data.team_members.length;
      this.data.team_members = this.data.team_members.filter(m => m.id !== id);
      const deleted = this.data.team_members.length < len;
      if (deleted) this.persist();
      return deleted;
    },
  };

  public gallery = {
    getAll: async (): Promise<GalleryItemEntity[]> => {
      this.ensureInitialized();
      return [...this.data.gallery_items].sort((a, b) => a.display_order - b.display_order);
    },

    getById: async (id: string): Promise<GalleryItemEntity | null> => {
      this.ensureInitialized();
      return this.data.gallery_items.find(g => g.id === id) || null;
    },

    create: async (payload: Omit<GalleryItemEntity, 'id' | 'created_at'>): Promise<GalleryItemEntity> => {
      this.ensureInitialized();
      const item: GalleryItemEntity = {
        ...payload,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      };
      this.data.gallery_items.push(item);
      this.persist();
      return item;
    },

    update: async (id: string, updates: Partial<GalleryItemEntity>): Promise<GalleryItemEntity> => {
      this.ensureInitialized();
      const index = this.data.gallery_items.findIndex(g => g.id === id);
      if (index === -1) throw new Error(`Gallery item with ID "${id}" was not found.`);

      const updated = {
        ...this.data.gallery_items[index],
        ...updates,
      };
      this.data.gallery_items[index] = updated;
      this.persist();
      return updated;
    },

    delete: async (id: string): Promise<boolean> => {
      this.ensureInitialized();
      const len = this.data.gallery_items.length;
      this.data.gallery_items = this.data.gallery_items.filter(g => g.id !== id);
      const deleted = this.data.gallery_items.length < len;
      if (deleted) this.persist();
      return deleted;
    },
  };

  public contentBlocks = {
    getAll: async (): Promise<ContentBlockEntity[]> => {
      this.ensureInitialized();
      return [...this.data.content_blocks];
    },

    getByKey: async (key: string): Promise<ContentBlockEntity | null> => {
      this.ensureInitialized();
      return this.data.content_blocks.find(c => c.block_key === key) || null;
    },

    upsert: async (
      block_key: string,
      payload: {
        title: string;
        content_json: Record<string, unknown>;
        description?: string;
        updated_by?: string;
      }
    ): Promise<ContentBlockEntity> => {
      this.ensureInitialized();
      const now = new Date().toISOString();
      const index = this.data.content_blocks.findIndex(c => c.block_key === block_key);

      if (index >= 0) {
        const updated = {
          ...this.data.content_blocks[index],
          ...payload,
          updated_at: now,
        };
        this.data.content_blocks[index] = updated;
        this.persist();
        return updated;
      } else {
        const created: ContentBlockEntity = {
          id: crypto.randomUUID(),
          block_key,
          title: payload.title,
          content_json: payload.content_json,
          description: payload.description,
          updated_by: payload.updated_by,
          updated_at: now,
        };
        this.data.content_blocks.push(created);
        this.persist();
        return created;
      }
    },
  };

  public auditLogs = {
    getAll: async (limit = 100): Promise<AuditLogEntity[]> => {
      this.ensureInitialized();
      return [...this.data.audit_logs].slice(0, limit);
    },

    log: async (entry: {
      admin_id?: string;
      admin_email?: string;
      action: string;
      target_entity: string;
      target_id?: string;
      details_json?: Record<string, unknown>;
      ip_address?: string;
    }): Promise<AuditLogEntity> => {
      this.ensureInitialized();
      const logEntity: AuditLogEntity = {
        id: crypto.randomUUID(),
        ...entry,
        created_at: new Date().toISOString(),
      };
      this.data.audit_logs.unshift(logEntity);
      // Keep max 1000 logs in local storage
      if (this.data.audit_logs.length > 1000) {
        this.data.audit_logs = this.data.audit_logs.slice(0, 1000);
      }
      this.persist();
      return logEntity;
    },
  };

  public settings = {
    get: async (): Promise<ChapterSettings> => {
      this.ensureInitialized();
      return { ...this.data.settings };
    },

    update: async (updates: Partial<ChapterSettings>): Promise<ChapterSettings> => {
      this.ensureInitialized();
      this.data.settings = {
        ...this.data.settings,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      this.persist();
      return { ...this.data.settings };
    },
  };

  public adminUsers = {
    getAll: async (): Promise<Omit<AdminUser, 'password_hash'>[]> => {
      this.ensureInitialized();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return this.data.admin_users.map(({ password_hash: _hash, ...rest }) => rest);
    },

    getByEmail: async (email: string): Promise<AdminUser | null> => {
      this.ensureInitialized();
      return (
        this.data.admin_users.find(
          u => u.email.toLowerCase() === email.toLowerCase().trim()
        ) || null
      );
    },

    getById: async (id: string): Promise<AdminUser | null> => {
      this.ensureInitialized();
      return this.data.admin_users.find(u => u.id === id) || null;
    },

    create: async (payload: {
      email: string;
      password_hash: string;
      full_name: string;
      role?: AdminRole;
    }): Promise<Omit<AdminUser, 'password_hash'>> => {
      this.ensureInitialized();
      const email = payload.email.toLowerCase().trim();
      if (this.data.admin_users.some(u => u.email.toLowerCase() === email)) {
        throw new Error(`An administrator with email "${email}" already exists.`);
      }

      const now = new Date().toISOString();
      const user: AdminUser = {
        id: crypto.randomUUID(),
        email,
        password_hash: payload.password_hash,
        full_name: payload.full_name,
        role: payload.role || 'ADMIN',
        is_active: true,
        last_login_at: null,
        created_at: now,
        updated_at: now,
      };

      this.data.admin_users.push(user);
      this.persist();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash: _hash, ...safeUser } = user;
      return safeUser;
    },

    update: async (
      id: string,
      updates: Partial<Omit<AdminUser, 'id' | 'created_at'>>
    ): Promise<Omit<AdminUser, 'password_hash'>> => {
      this.ensureInitialized();
      const user = this.data.admin_users.find(u => u.id === id);
      if (!user) throw new Error(`Admin user with ID "${id}" was not found.`);

      Object.assign(user, updates, { updated_at: new Date().toISOString() });
      this.persist();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash: _hash, ...safeUser } = user;
      return safeUser;
    },

    updateLastLogin: async (id: string): Promise<void> => {
      this.ensureInitialized();
      const user = this.data.admin_users.find(u => u.id === id);
      if (user) {
        user.last_login_at = new Date().toISOString();
        this.persist();
      }
    },

    count: async (): Promise<number> => {
      this.ensureInitialized();
      return this.data.admin_users.length;
    },
  };
}

let dbInstance: DatabaseStore | null = null;

export function getDb(): DatabaseStore {
  if (!dbInstance) {
    dbInstance = new DatabaseStore();
  }
  return dbInstance;
}

export const db: DatabaseStore = new Proxy({} as DatabaseStore, {
  get(_target, prop) {
    const instance = getDb();
    // @ts-expect-error dynamic proxy access
    const value = instance[prop];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
});
