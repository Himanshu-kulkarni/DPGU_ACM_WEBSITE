# DPGU ACM Student Chapter — Architecture Decision Records (ADRs) & Decisions Registry

This document records the architectural decisions, structural rationale, trade-offs, and open questions governing the DPGU ACM Student Chapter platform.

---

## 1. Approved Architecture Decision Records (ADRs)

### ADR-001: Visual Aesthetic & Design System
- **Status**: APPROVED
- **Context**: The DPGU ACM Student Chapter requires an authoritative, technically sophisticated online presence that reflects ACM’s global computing prestige. Standard university club templates are generic and light-mode biased.
- **Decision**: Adopt a **premium minimal dark aesthetic**:
  - Deep black canvas (`#05070A`) and deep navy surfaces (`#0B0F17`).
  - Restrained, vibrant cyan and blue electric accents (`#0070F3`, `#38BDF8`).
  - Sleek modern sans-serif typography (`Outfit` / `Inter`) paired with monospace accents (`JetBrains Mono`).
  - Subtle glassmorphism (`backdrop-blur-md`), 1px slate borders, and smooth micro-animations.
- **Consequences**:
  - *Positive*: Creates a memorable, high-end impression on students, faculty, and industry sponsors; aligns with developer and computing culture.
  - *Negative*: Requires careful contrast ratio management to maintain WCAG 2.1 AA accessibility compliance across all text elements.

---

### ADR-002: Frictionless Public Event Registration (Guest Checkout)
- **Status**: APPROVED
- **Context**: Forcing college students and external participants to create an account, verify an email with a code, and set a password creates a severe drop-off rate (often >40%) during event sign-ups.
- **Decision**: All public event registrations will operate on a **Guest Registration Model**:
  - No user accounts or passwords required for attendees.
  - Attendee identity is anchored by their verified email and phone number.
  - Duplicate registration prevention is enforced strictly via a database composite unique constraint: `UNIQUE (event_id, LOWER(email))`.
  - Confirmation produces an immediate digital ticket pass and sends a transactional email copy.
- **Consequences**:
  - *Positive*: Near-zero registration friction, higher event attendance, rapid sign-ups on mobile.
  - *Negative*: Attendees cannot log into a profile to view all their past tickets in one dashboard (mitigated by emailing ticket links and offering an email ticket lookup tool).

---

### ADR-003: Dual-Mode Event Monetization (Free RSVP and Paid Gateway)
- **Status**: APPROVED
- **Context**: The chapter hosts both community-building workshops (free) and flagship hackathons/hands-on bootcamps with venue, kit, or catering fees (paid).
- **Decision**: The system natively supports two event modes:
  - `FREE`: Instant registration, immediate capacity reservation, automatic status `CONFIRMED`, and instant QR ticket issuance.
  - `PAID`: Generates a locked payment gateway order (in INR), holds a 15-minute temporary reservation lock, and confirms registration only upon receiving a cryptographically verified webhook from the payment gateway.
- **Consequences**:
  - *Positive*: Single unified platform handles both free guest RSVPs and paid ticketing without third-party ticketing platform commission fees.
  - *Negative*: Requires payment gateway merchant onboarding, webhook idempotency handling, and financial reconciliation tools.

---

### ADR-004: Single Master Administrator Authentication Model
- **Status**: APPROVED
- **Context**: The chapter leadership requires a secure back-office dashboard to manage events, registrations, attendance, and website content. To prevent administrative complexity, the initial system specifies a single administrator account.
- **Decision**: Implement a single master administrator account using Supabase Auth / Argon2id with secure HTTP-only cookies and edge route protection middleware.
- **Consequences**:
  - *Positive*: Minimal authentication overhead, rapid implementation, robust security with zero credential sprawl.
  - *Negative*: If gate volunteers need to scan tickets at the door, sharing the superadmin password introduces security risks. (See UNRESOLVED-05 for scanner delegation tokens).

---

### ADR-005: Technology Stack Selection
- **Status**: APPROVED
- **Context**: The platform requires high visual polish, SEO discoverability for public events, fast API route handling, and strict relational integrity for event ticketing and payments.
- **Decision**: Standardize on:
  - **Framework**: Next.js 14+ (App Router) with React, TypeScript.
  - **Styling**: Tailwind CSS with CSS Variables for theme tokens.
  - **Database**: PostgreSQL hosted on Supabase (with Row Level Security and PgBouncer connection pooling).
  - **Icons & Animation**: Lucide React and Framer Motion.
- **Consequences**:
  - *Positive*: Full type safety from database to UI, industry-standard DX, rich ecosystem.
  - *Negative*: Deployment requires Node.js SSR runtime or a decoupled static/serverless model depending on Hostinger capabilities.

---

### ADR-006: Digital QR Code Ticket Pass & In-Browser Camera Scanner
- **Status**: APPROVED
- **Context**: Physical ticket printing is expensive, slow, and prone to fraud. At event check-in, volunteers need to rapidly admit registered attendees without installing native mobile apps from app stores.
- **Decision**: 
  - Each confirmed registration generates a unique digital pass (`/tickets/[ticketId]`) featuring an HMAC-signed QR code.
  - The admin portal includes an in-browser camera scanner (`/admin/scanner`) built using the HTML5-QRCode Web API.
  - Scanning sends the token to `/api/tickets/verify`, returning real-time visual (Green/Yellow/Red) and audio feedback, and logging the scan timestamp.
- **Consequences**:
  - *Positive*: Zero hardware cost; works on any smartphone with a modern web browser; instant duplicate detection.
  - *Negative*: Requires camera permissions in the mobile browser and reliable venue Wi-Fi/cellular connection.

---

### ADR-007: Hostinger Deployment Strategy & Runtime Compatibility
- **Status**: APPROVED (Contingency Matrix)
- **Context**: Hosting is provided through Hostinger, but the exact plan tier (Shared Web Hosting vs. Cloud Hosting vs. KVM VPS) is unverified. Hostinger Shared Web Hosting does NOT provide PostgreSQL and has limited/no persistent Node.js background process support.
- **Decision**:
  - Use **Supabase as the Managed PostgreSQL Engine**: Guarantees standard PostgreSQL with RLS and backups, completely bypassing Hostinger's MySQL-only shared limitation.
  - **If Hostinger is a VPS (KVM)**: Deploy Next.js as a Dockerized standalone Node.js service managed by PM2/Docker behind an Nginx reverse proxy on the Hostinger VPS.
  - **If Hostinger is Shared Web Hosting**: Deploy the Next.js frontend to Vercel (or Cloudflare Pages on student non-profit tiers) mapped to the chapter's custom domain via Hostinger DNS, OR export the static frontend to Hostinger's LiteSpeed `public_html` with dynamic operations handled via Supabase Edge Functions.
- **Consequences**:
  - *Positive*: Zero risk of project failure due to Hostinger shared hosting limitations.
  - *Negative*: Requires verifying the Hostinger plan before finalizing the production deployment pipeline.

---

## 2. Unresolved Decisions & Open Questions Registry

The following items are missing requirements or pending administrative decisions that must be resolved prior to Phase 4 / Phase 6 deployment:

### UNRESOLVED-01: Payment Gateway Provider & Merchant Onboarding
- **Description**: Which payment gateway provider will be integrated for paid event registrations in India?
- **Options**:
  1. *Razorpay*: Industry standard for student hackathons and Indian universities; supports UPI QR, Cards, NetBanking, auto-refunds.
  2. *Cashfree*: Robust alternative, competitive developer API, fast UPI processing.
  3. *PayU*: Common in institutional higher-education setups.
  4. *Stripe India*: Highly developer friendly, but currently restricted by regulatory requirements for new Indian individual merchants.
- **Open Questions for Chapter Executive**:
  - What legal entity will hold the merchant account? (University official bank account, ACM faculty advisor's institutional account, or chapter society account?)
  - Is GST registration required for paid event ticketing?
  - Who will provide the gateway API keys (`KEY_ID` and `KEY_SECRET`)?

---

### UNRESOLVED-02: Transactional Email Dispatch Provider
- **Description**: Reliable email delivery is essential for sending digital tickets with QR codes and calendar invites.
- **Options**:
  1. *Resend*: Modern developer-first email API (3,000 free emails/month), high inbox deliverability, supports HTML React Email templates.
  2. *Hostinger Shared SMTP*: Included with Hostinger hosting, but subject to hourly sending limits (typically 50-100 emails/hour) and potential spam filtering by university firewalls.
  3. *Amazon SES*: Low cost, but requires domain identity verification and sandbox removal approval.
- **Recommendation**: Resend with custom domain DKIM/SPF verification.

---

### UNRESOLVED-03: Refund & Cancellation Policy for Paid Tickets
- **Description**: What happens if an attendee registers for a paid workshop and requests a cancellation, or if an event is postponed/cancelled?
- **Options**:
  1. *Strict No-Refund Policy*: Clearly stated on the checkout modal; tickets are final.
  2. *Manual Admin Refund*: Administrator can click "Issue Refund" in the admin dashboard, triggering the gateway refund API.
  3. *Automated Cancellation Window*: Attendees can cancel up to 48 hours before the event for an 80% refund.
- **Recommendation**: Strict No-Refund Policy for student chapter events, with manual emergency refund capability retained in the admin panel.

---

### UNRESOLVED-04: Domain Name & DNS Authority
- **Description**: What official URL will host the chapter website?
- **Options**:
  1. University Subdomain: `acm.dpgu.ac.in` (High institutional authority; requires university IT approval).
  2. Standalone Domain: `dpguacm.org` or `dpgu-acm.in` (Purchased on Hostinger; chapter maintains full DNS control).
- **Recommendation**: Standalone domain with Cloudflare DNS management for DDoS protection, SSL termination, and caching.

---

### UNRESOLVED-05: Volunteer Scanner Access Delegation
- **Description**: The requirement specifies "One initial administrator account", but at physical events, 2 to 4 student volunteers will scan tickets at different entrance doors simultaneously.
- **Options**:
  1. *Shared Master Admin Credentials*: All volunteers log in with the master admin email and password. (Risk: Volunteers could accidentally edit events or view financial records).
  2. *Temporary Scanner Passcode / Token*: The admin generates a 6-digit daily scan PIN or shareable scanner link (`/admin/scanner?token=...`) that only grants camera scan permissions without access to admin settings or revenue.
- **Recommendation**: Implement a lightweight Scanner Token role so volunteers only access the camera check-in screen.

---

### UNRESOLVED-06: Official Assets & Data Verification
- **Description**: Official chapter information must not be fabricated.
- **Items Pending Chapter Provision**:
  - Official high-resolution SVG/PNG chapter logo.
  - Official faculty sponsor name, department, title, and welcome statement.
  - Current Executive Board member roster (names, roles, LinkedIn, GitHub profiles).
  - Official contact email address and campus office location.
  - Active social media links (Discord, WhatsApp, LinkedIn, GitHub).
