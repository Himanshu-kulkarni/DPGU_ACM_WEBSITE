# DPGU ACM Student Chapter — Project Action Items & Master Checklist

This document tracks all actionable tasks across the lifecycle of the DPGU ACM Student Chapter platform.

---

## 📋 Phase 0: Planning, Requirements Analysis, & Architecture (Completed)

- [x] **[P0]** Inspect current workspace to avoid overwriting unrelated files.
- [x] **[P0]** Formulate Hostinger hosting capability matrix & administrator verification protocol.
- [x] **[P0]** Identify missing requirements and document open architectural questions (`docs/DECISIONS.md`).
- [x] **[P0]** Design complete sitemap and page-by-page structural wireframes (`docs/SITEMAP.md`, `docs/WIREFRAMES.md`).
- [x] **[P0]** Formulate comprehensive PostgreSQL / Supabase database schema with RLS and DDL (`docs/DATABASE_SCHEMA.md`).
- [x] **[P0]** Formulate hosting-compatible decoupled architecture (`docs/ARCHITECTURE.md`).
- [x] **[P0]** Define detailed implementation roadmap and acceptance criteria for all phases (`docs/IMPLEMENTATION_PLAN.md`).
- [x] **[P0]** Create master context blueprint (`docs/MASTER_CONTEXT.md`).

---

## 📋 Phase 1: Project Scaffolding, Core Infrastructure, & Design System (Completed)

- [x] **[P0]** Initialize Next.js (App Router) project with TypeScript in `dpgu-acm-website/`.
- [x] **[P0]** Configure Tailwind CSS with required tokens:
  - Background: `#080B12`
  - Surface: `#101522`
  - Elevated Surface: `#171E2D`
  - Primary text: `#F5F7FB`
  - Secondary text: `#A5AEC0`
  - Primary accent: `#648CFF`
  - Borders: `#252D3D`
- [x] **[P0]** Configure Inter font via `next/font/google` and JetBrains Mono for codes/tokens.
- [x] **[P0]** Implement accessible focus styles (`:focus-visible: 2px solid #648CFF`) and `@media (prefers-reduced-motion: reduce)` rules.
- [x] **[P0]** Build reusable UI component suite in `src/components/ui/` (`Button`, `Card`, `Input`, `Textarea`, `Select`, `Badge`, `Spinner`, `EmptyState`, `ErrorState`, `Modal`, `Toast`).
- [x] **[P0]** Build responsive glassmorphic sticky Navigation Bar (`src/components/layout/Navbar.tsx`) with mobile drawer.
- [x] **[P0]** Build responsive Chapter Footer (`src/components/layout/Footer.tsx`).
- [x] **[P0]** Establish shared public layout (`src/app/(public)/layout.tsx`) and admin shell layout (`src/app/(admin)/layout.tsx`).
- [x] **[P0]** Create admin login page (`/admin/login`) with strict single-admin access (no public signup).
- [x] **[P0]** Establish Supabase client preparation (`src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/types.ts`).
- [x] **[P0]** Implement environment validator with Zod (`src/lib/env.ts`) and create `.env.example`.
- [x] **[P0]** Implement guest registration validation schema with Zod (`src/schemas/event-registration.ts`).

---

## 📋 Phase 2: Complete Public-Facing Website (Completed)

- [x] **[P0]** Implement full Homepage (`/`) with all 9 requested sections:
  1. Navigation with ACM branding.
  2. Hero section with headline "Build. Innovate. Compete."
  3. Upcoming events with spotlight flagship card and preview grid.
  4. About the chapter with four pillars (Learn, Build, Network, Lead).
  5. Technical domains preview.
  6. Achievements & competition honors.
  7. Faculty sponsor & executive team preview.
  8. Call to action.
  9. Footer with campus location, resources, and social channels.
- [x] **[P0]** Implement About Page (`/about`) with chapter history, ACM mission, constitution, and faculty patron section.
- [x] **[P0]** Implement Events Hub (`/events`) with real-time text search, category filters (Workshops, Hackathons, Tech Talks, Bootcamps), status filters (Upcoming, Past), and pricing filters (Free, Paid).
- [x] **[P0]** Implement Event Details Page (`/events/[slug]`) with full schedule agenda, prerequisites, speaker bio, FAQs, capacity specs, and static prerendering via `generateStaticParams`.
- [x] **[P0]** Implement Technical Domains Page (`/domains`) covering all 6 Special Interest Groups (Web & Cloud, AI/ML, Competitive Programming, Cybersecurity, IoT-Robotics, UI/UX Design).
- [x] **[P0]** Implement Student Projects & Achievements Directory (`/projects`) with category filters, GitHub repo links, live demo links, and Hall of Fame section.
- [x] **[P0]** Implement Executive Committee Directory (`/team`) with faculty sponsor card and student officer roster with transparent placeholder notices.
- [x] **[P0]** Implement Event Photographs & Visual Archive (`/gallery`) with album filters and editorial photo cards.
- [x] **[P0]** Implement Contact & Chapter Membership Page (`/contact`) with validated form, secretariat location, and community channels.
- [x] **[P0]** Implement Privacy Policy (`/privacy`) aligned with DPDP Act and data minimization.
- [x] **[P0]** Implement Event Registration Terms & Conduct (`/terms`).
- [x] **[P0]** Execute Phase 2 verification: ESLint 0 errors, Next.js Turbopack build 22 routes 100% pass, and browser visual/responsive verification.

---

## 📋 Phase 3: Event Engine & Guest Registration Flow (Upcoming)

- [ ] **[P0]** Build Frictionless Guest Registration Drawer (`src/components/forms/GuestRegistrationDrawer.tsx`).
- [ ] **[P0]** Implement Public Registration API (`POST /api/register`) with atomic capacity verification and duplicate email prevention.
- [ ] **[P0]** Build Digital Ticket Pass View (`/tickets/[ticketId]`) with boarding-pass styling.
- [ ] **[P0]** Implement client-side and server-side QR Code Generator (`src/components/tickets/QRCodeRenderer.tsx`).
- [ ] **[P1]** Implement Transactional Email Dispatcher with `.ics` calendar file attachment.
- [ ] **[P0]** Execute Phase 3 acceptance criteria audit (60-second guest registration, instant QR pass, duplicate prevention).

---

## 📋 Phase 4: Payment Gateway Integration & Paid Event Flow (Upcoming)

- [ ] **[P0]** Resolve UNRESOLVED-01: Confirm payment gateway provider (Razorpay / Cashfree) and obtain sandbox API credentials.
- [ ] **[P0]** Implement Payment Client SDK wrapper (`src/lib/payments/`).
- [ ] **[P0]** Implement Payment Order Creator (`POST /api/payments/create-order`) with 15-minute temporary seat reservation lock.
- [ ] **[P0]** Integrate Client-Side Checkout Modal (UPI QR, Credit/Debit Cards, NetBanking).
- [ ] **[P0]** Build Secure Webhook Listener (`POST /api/payments/webhook`) with HMAC-SHA256 signature verification.
- [ ] **[P0]** Implement webhook idempotency handling to prevent duplicate tickets or double billing.
- [ ] **[P1]** Handle transaction failures, user drop-offs, and automatic release of expired seat locks.
- [ ] **[P0]** Execute Phase 4 acceptance criteria audit (valid HMAC check, order reconciliation, digital receipt).

---

## 📋 Phase 5: Admin Dashboard, QR Scanner, & Attendance Management (Upcoming)

- [ ] **[P0]** Wire Admin Login Page (`/admin/login`) with Supabase Auth credential verification.
- [ ] **[P0]** Implement Next.js Edge Middleware route guard (`middleware.ts`) to secure all `/admin/*` routes.
- [ ] **[P0]** Implement Executive Overview Dashboard (`/admin`) with real-time KPI metrics (Attendees, Revenue, Events).
- [ ] **[P0]** Build Events Manager (`/admin/events`) with Create, Edit, Publish, and Archive actions.
- [ ] **[P0]** Build Registrations & Payments Ledger (`/admin/registrations`) with search, filter, and 1-click CSV export.
- [ ] **[P0]** Build In-Browser Live QR Camera Scanner (`/admin/scanner`) using HTML5-QRCode Web API.
- [ ] **[P0]** Implement Ticket Verification API (`POST /api/tickets/verify`) with instant audio-visual status feedback (Valid / Duplicate / Invalid).
- [ ] **[P1]** Build Content CMS (`/admin/content`) for Team Roster, Projects Showcase, and Achievements.
- [ ] **[P0]** Execute Phase 5 acceptance criteria audit (protected routes, sub-500ms QR scan, CSV export).

---

## 📋 Phase 6: End-to-End Testing, Security Hardening, & Deployment (Upcoming)

- [ ] **[P0]** Conduct complete security audit: CSRF tokens, Content Security Policy (CSP), SQL injection defense, rate limiting.
- [ ] **[P0]** Execute Hostinger Plan Verification protocol with Chapter IT lead.
- [ ] **[P0]** Configure production deployment pipeline (Hostinger VPS Docker container OR Vercel + Hostinger LiteSpeed hybrid).
- [ ] **[P0]** Configure custom domain DNS records and TLS/SSL certificate (HTTPS).
- [ ] **[P1]** Run end-to-end automated tests for registration, payment webhook, and QR check-in flows.
- [ ] **[P1]** Produce Admin Operations & Gate Volunteer Training Manual.
- [ ] **[P0]** Execute Phase 6 acceptance criteria audit (100% test pass rate, live SSL, production handover).
