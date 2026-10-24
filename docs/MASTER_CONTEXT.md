# DPGU ACM Student Chapter — Master Project Context

This document serves as the comprehensive single source of truth for the project state, architecture, design specifications, completed milestones, and conventions.

---

## 1. Project Overview & Vision

- **Entity**: DPG University ACM Student Chapter (Sector 34, Gurugram, Haryana, India).
- **Mission**: Build an authoritative, high-performance, dark-mode digital presence showcasing chapter leadership and events, with frictionless public event registration (zero account required for attendees) and a dedicated single-admin console.
- **Current Status**: **Phase 4 Completed + Homepage & Navigation Revision Completed** (Public Event Registration, Payment Workflows, QR Boarding Pass Engine, Admin Dashboard, Revised Homepage Structure & Navigation).
- **Public Navigation**: Home (`/`), About (`/about`), Events (`/events`), Team (`/team`), Gallery (`/gallery`), Contact (`/contact`), Join Us (`/contact`).
- **Removed Public Sections & Obsolete Routes**: Charter & Standards, Technical Domains & Specializations (`/domains`), Projects & Honors (`/projects`), and Achievements (`/achievements`) have been removed from the public navigation and sitemap, returning standard 404 responses via custom `not-found.tsx`.

---

## 2. Technical Stack & Dependencies

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `16.4.2` | Full-stack React framework with SSR, ISR, and API route handlers |
| **UI Library** | React | `19.3.0` | Declarative component UI |
| **Language** | TypeScript | `^5` | Strict static type checking |
| **Styling** | Tailwind CSS | `^4` | Utility-first CSS using CSS variables and theme tokens |
| **Icons** | Lucide React | `^1.58.0` | Accessible SVG icon suite |
| **Validation** | Zod | `^3.24.2` | Runtime schema validation for forms and environment variables |
| **Database** | PostgreSQL / Supabase / JSON Store | `^2.49.1` | Relational database with atomic reservations and audit logs |
| **Class Merging**| `clsx` + `tailwind-merge` | Latest | Deterministic Tailwind utility class composition (`cn()`) |

---

## 3. Approved Design Tokens & Style Guide

All components strictly honor the following palette and styling constraints:

```css
--color-bg-base:          #080B12;  /* Deepest canvas background */
--color-surface:          #101522;  /* Cards, containers, navbar, footer */
--color-surface-elevated: #171E2D;  /* Modals, elevated cards, interactive hovers */
--color-text-primary:     #F5F7FB;  /* High contrast headings and primary text */
--color-text-secondary:   #A5AEC0;  /* Subtitles, labels, captions, metadata */
--color-accent:           #648CFF;  /* Primary brand blue (ACM derivative) */
--color-accent-hover:     #5078EE;  /* Active / hover state for buttons */
--color-border-subtle:    #252D3D;  /* 1px card borders and dividers */
--color-border-focus:     #648CFF;  /* Accessible focus outline */
--color-status-success:   #10B981;  /* Valid scan, confirmed ticket, registration open */
--color-status-warning:   #F59E0B;  /* Limited spots, registration closed */
--color-status-error:     #EF4444;  /* Capacity reached, validation error */
```

### Accessibility & Motion Rules:
- **Focus Rings**: `:focus-visible` utilizes `outline: 2px solid #648CFF` with `outline-offset: 2px` on all interactive triggers.
- **Reduced Motion**: `@media (prefers-reduced-motion: reduce)` automatically sets animation durations to zero. No continuous spinning or glowing animations.
- **Form Error Presentation**: Every input with an error connects via `aria-describedby` to a descriptive error element tagged `role="alert"`.

---

## 4. Homepage Structural Order (Revision)

1. **Navigation Bar**: Responsive glassmorphic navigation with links to Home, About, Events, Team, Gallery, Contact, and "Join Us" primary CTA button.
2. **Hero Section**: Chapter introduction with "Build. Innovate. Compete." headline, introductory copy, action buttons, and adjusted metrics (Attendees, Workshops, Pillars, Open Access).
3. **Meet Our Team Section**:
   - Replaces former Upcoming Events widget on homepage.
   - Showcases Faculty Sponsor (`Dr. Rajesh Sharma`), Chapter Chair (`Aryan Verma`), Vice Chair (`Ananya Sharma`), and key officers (`Rohit Kumar`, `Neha Patel`, `Sneha Rao`, etc.).
   - Full names, official roles/designations, short bios, and LinkedIn/GitHub links.
   - Clear visual distinction between institutional leadership and functional leads.
   - "View Full Team" CTA linking to `/team`.
4. **Events Hub Exploration Card**:
   - Prominent feature card introducing chapter hackathons, masterclasses, and talks with quick capability highlights.
   - Direct CTA links to explore upcoming and past events on `/events`.
   - **No standalone upcoming-events widget or event-card section is displayed on the homepage.**
5. **About DPGU ACM Section**:
   - Chapter mission, ACM affiliation, and the Four Pillars (Learn, Build, Network, Lead).
6. **Chapter Highlights & Milestones**:
   - Verified institutional highlights: ACM Global Affiliation, Student-Led Engineering, and National Competition Engagement (SIH, ICPC).
7. **Contact / Join Us Call to Action**:
   - Application prompt with CTAs for chapter membership and reaching out to the secretariat.
8. **Footer**:
   - Clean chapter identity, navigation links (About, Events, Team, Gallery, Contact), ACM resources, location details, legal links, and admin portal.

---

## 5. Events Section & Dynamic Classification Rules

The public `/events` catalog clearly separates events into two categories using a segmented control:

### 5.1 Dynamic Date Classification
- **Upcoming Events**: Published events where `now <= new Date(event.endTime || event.startTime)` and status is not `COMPLETED` or `PAST`. For events spanning multiple days, they remain classified as upcoming until their end date has passed.
- **Past Events**: Events that have already taken place (`now > new Date(event.endTime || event.startTime)` or status is `COMPLETED`/`PAST`).

### 5.2 Registration Status vs Event Timing
- **Upcoming Events**:
  - Displays title, poster banner, date range, venue, category, and fee indicator (Free vs Paid).
  - Displays registration availability badge:
    - *Registration Open*: registration action enabled with spots remaining indicator.
    - *Registration Closed*: deadline has passed; registration action disabled.
    - *Capacity Reached / Sold Out*: all seats reserved; registration action disabled.
- **Past Events**:
  - Displays event title, poster banner, date, venue, category badge, and completion status.
  - Provides "View Event Details & Recap" link.
  - **Does not display a registration button for completed events.**

---

## 6. Architectural Guardrails & Rules

1. **Guest Registration Principle**: Public attendees register for events without creating user accounts. Registration identity is tied to `(event_id, LOWER(email))`.
2. **No Public Admin Signups**: The admin portal (`/admin/login`) is strictly for authorized administrators.
3. **No Fabricated Data**: Production pages must not display fabricated member names, fake phone numbers, or unverified event statistics.
4. **Hostinger Compatibility**: Lightweight JSON/PostgreSQL store compatibility ensuring frictionless deployment.
