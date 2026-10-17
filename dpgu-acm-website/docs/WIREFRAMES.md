# DPGU ACM Student Chapter — Page-by-Page Wireframes

This document provides structural wireframes, component hierarchies, and responsive layout blueprints for every route in the DPGU ACM Student Chapter platform.

---

## 1. Global Navigation & Footer Wireframes

### 1.1 Desktop Navigation Bar (Sticky Glassmorphic)
```
+--------------------------------------------------------------------------------------------------+
| [LOGO] DPGU ACM        About    Events    Projects    Achievements    Team    Contact    [JOIN US]|
+--------------------------------------------------------------------------------------------------+
```
- **Height**: 72px, fixed position with `backdrop-blur-md bg-[#0B0F17]/80 border-b border-slate-800/80`.
- **Active Route Indicator**: Subtle blue under-glow or pill highlight (`bg-blue-500/10 text-blue-400 border border-blue-500/30`).
- **Join Us CTA**: High-contrast button (`bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2`).

### 1.2 Mobile Navigation Drawer (< 768px)
```
+--------------------------------------------------+
| [LOGO] DPGU ACM                       [X CLOSE]  |
+--------------------------------------------------+
|  > Home                                          |
|  > About Chapter                                 |
|  > Events & Workshops                            |
|  > Student Projects                              |
|  > Hall of Fame & Achievements                   |
|  > Executive Team                                |
|  > Contact Us                                    |
|                                                  |
|  [================ JOIN CHAPTER ===============] |
+--------------------------------------------------+
```

### 1.3 Global Footer
```
+--------------------------------------------------------------------------------------------------+
|  [LOGO] DPGU ACM STUDENT CHAPTER                EXPLORE         RESOURCES       CONNECT          |
|  Advancing Computing as a Science & Profession. About Chapter   ACM Digital Lib Discord Community|
|  DPG University, Gurugram, Haryana, India.      Events Catalog  Student Code    GitHub Repo      |
|                                                 Projects Hub    Constitution    LinkedIn Page    |
|                                                 Hall of Fame    Brand Assets    Instagram        |
|  +---------------------------------------------------------------------------------------------+ |
|  | (c) 2026 DPGU ACM Student Chapter. All rights reserved.   Privacy Policy | Terms of Service   | |
+--------------------------------------------------------------------------------------------------+
```

---

## 2. Public Page Wireframes

### 2.1 Homepage (`/`)
```
+--------------------------------------------------------------------------------------------------+
| [NAVBAR]                                                                                         |
+--------------------------------------------------------------------------------------------------+
| [HERO SECTION]                                                                                   |
|                                                                                                  |
|   [Badge: Official ACM Student Chapter @ DPG University]                                         |
|   # EMPOWERING THE NEXT GENERATION OF COMPUTING LEADERS                                          |
|                                                                                                  |
|   A community of developers, designers, and researchers building open-source projects,          |
|   hosting high-impact hackathons, and fostering technological excellence at DPG University.      |
|                                                                                                  |
|   [ Explore Events -> ]    [ Join ACM Chapter ]    [ View Projects ]                             |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
| [LIVE CHAPTER METRICS BAR]                                                                       |
|   +---------------------+ +---------------------+ +---------------------+ +--------------------+ |
|   | [ 25+ ] Events Held | | [ 500+ ] Attendees  | | [ 12+ ] Projects    | | [ 1st ] Hackathons | |
|   +---------------------+ +---------------------+ +---------------------+ +--------------------+ |
+--------------------------------------------------------------------------------------------------+
| [FEATURED SPOTLIGHT EVENT BANNER]                                                                |
|   +--------------------------------------------------------------------------------------------+ |
|   | [TAG: UPCOMING FLAGSHIP]                                                                   | |
|   | Annual Chapter Hackathon 2026: CodeMatrix                                                  | |
|   | Date: Nov 14-15, 2026 | Mode: In-Person (DPGU Auditorium) | Fee: FREE                          | |
|   | Remaining Seats: [||||||||||||||||....] 42 spots left                                      | |
|   | [ Register Free Now ]                              [ View Event Schedule & Rules -> ]       | |
|   +--------------------------------------------------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
| [FOUR PILLARS OF ACM DPGU]                                                                       |
|   +------------------+ +------------------+ +------------------+ +------------------+           |
|   | [LEARN]          | | [BUILD]          | | [NETWORK]        | | [LEAD]           |           |
|   | Hands-on technical| | Collaborative    | | Direct mentorship| | Student-driven   |           |
|   | workshops & talks| | open-source code | | with alumni &    | | leadership &     |           |
|   | on AI/ML & Web.  | | & real software. | | tech leaders.    | | event governance.|           |
|   +------------------+ +------------------+ +------------------+ +------------------+           |
+--------------------------------------------------------------------------------------------------+
| [LATEST PROJECTS PREVIEW]                                                                        |
|   +------------------------------------+  +------------------------------------+                 |
|   | [Project Title 1]                  |  | [Project Title 2]                  |                 |
|   | Autonomous Campus Navigator (AI)   |  | Smart Attendance Edge Node (IoT)   |                 |
|   | [Tags: Next.js, PyTorch]           |  | [Tags: Rust, ESP32, MQTT]          |                 |
|   | [GitHub Repo] [Live Demo]          |  | [GitHub Repo] [Paper]              |                 |
|   +------------------------------------+  +------------------------------------+                 |
|   [ View All Student Projects -> ]                                                               |
+--------------------------------------------------------------------------------------------------+
| [COMMUNITY CTA SECTION]                                                                          |
|   Ready to build something extraordinary? Join DPGU ACM today.                                    |
|   [ Apply for Membership ]                                                                       |
+--------------------------------------------------------------------------------------------------+
| [FOOTER]                                                                                         |
+--------------------------------------------------------------------------------------------------+
```

---

### 2.2 Events Hub (`/events`)
```
+--------------------------------------------------------------------------------------------------+
| [NAVBAR]                                                                                         |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|  Events & Workshops                                                                              |
|  Participate in technical workshops, hackathons, guest lectures, and coding challenges.          |
|                                                                                                  |
|  [Filter: [All Events] [Upcoming] [Past Events] [Workshops] [Hackathons] ]   [Search Events: Q ]  |
|                                                                                                  |
|  +-----------------------------+ +-----------------------------+ +-----------------------------+ |
|  | [TAG: UPCOMING] [WORKSHOP]  | | [TAG: UPCOMING] [HACKATHON] | | [TAG: PAST] [TALK]          | |
|  | Modern Cloud Architectures  | | CodeMatrix Hackathon 2026   | | Intro to Quantum Computing  | |
|  | Date: Oct 28, 2026          | | Date: Nov 14-15, 2026       | | Date: Sep 12, 2026          | |
|  | Venue: Lab 304, DPGU        | | Venue: Campus Auditorium    | | Venue: Virtual (Zoom)       | |
|  | Fee: FREE                   | | Fee: Rs 199 per team        | | Fee: FREE                   | |
|  | Capacity: 45/60 Registered  | | Capacity: 80/100 Teams      | | Recorded: Available on YT   | |
|  |                             | |                             | |                             | |
|  | [ Register Now ]            | | [ Register & Pay ]          | | [ View Recap & Slides ]     | |
|  +-----------------------------+ +-----------------------------+ +-----------------------------+ |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
| [FOOTER]                                                                                         |
+--------------------------------------------------------------------------------------------------+
```

---

### 2.3 Event Detail & Registration Modal (`/events/[slug]`)
```
+--------------------------------------------------------------------------------------------------+
| [NAVBAR]                                                                                         |
+--------------------------------------------------------------------------------------------------+
| < Back to Events                                                                                 |
|                                                                                                  |
| [EVENT HERO]                                                                                     |
|   [Tag: Hands-on Workshop]  [Status: Open for Registration]                                      |
|   # Fullstack Next.js 14 & Supabase Cloud Architectures                                          |
|                                                                                                  |
|   +--------------------------------------------------+ +---------------------------------------+ |
|   | ABOUT THE EVENT                                  | | EVENT SUMMARY CARD                    | |
|   | Learn to build scalable fullstack apps using     | | Date: Saturday, October 28, 2026      | |
|   | Next.js App Router, Supabase Postgres, and       | | Time: 10:00 AM - 04:00 PM IST         | |
|   | Vercel deployment. Live coding session.          | | Venue: Advanced Computing Lab, DPGU   | |
|   |                                                  | | Fee: FREE (Zero registration charge)  | |
|   | KEY PREREQUISITES                                | | Total Seats: 60                       | |
|   | - Basic knowledge of JavaScript / React          | | Spots Left: 15 spots remaining        | |
|   | - Laptop with Node.js 20+ installed              | |                                       | |
|   |                                                  | | [ REGISTER FOR EVENT NOW ]            | |
|   | AGENDA & SCHEDULE                                | +---------------------------------------+ |
|   | 10:00 AM - Keynote & Architecture Principles     |                                           |
|   | 11:30 AM - Database Schema & Supabase Setup      | | SPEAKER PROFILE                       | |
|   | 01:00 PM - Lunch & Networking Break              | | [Avatar] [Speaker Name]               | |
|   | 02:00 PM - Frontend UI & State Management        | | Senior Software Engineer @ TechCorp   | |
|   | 03:30 PM - Live Deployment & QA Session          | | [LinkedIn Profile]                    | |
|   +--------------------------------------------------+ +---------------------------------------+ |
+--------------------------------------------------------------------------------------------------+

========================= REGISTRATION SLIDE-OVER DRAWER =========================
+--------------------------------------------------------------------------------+
| REGISTER FOR: Fullstack Next.js & Supabase Workshop                 [X Close]  |
| Event Date: Oct 28, 2026 | Registration Fee: FREE                              |
+--------------------------------------------------------------------------------+
|                                                                                |
|  * Full Name                                                                   |
|  [ Enter your full name                                                      ] |
|                                                                                |
|  * Email Address (Ticket will be sent here)                                    |
|  [ student@dpgu.ac.in                                                        ] |
|                                                                                |
|  * WhatsApp / Phone Number                                                     |
|  [ +91 98765 43210                                                           ] |
|                                                                                |
|  * College / University Name                                                   |
|  [ DPG University                                                            ] |
|                                                                                |
|  * Department / Roll Number                                                    |
|  [ CSE / 2023-BCS-042                                                        ] |
|                                                                                |
|  [x] I agree to the Chapter Event Conduct Code & Event Terms.                  |
|                                                                                |
|  [ ================== CONFIRM FREE REGISTRATION ================== ]          |
|  (Or for paid events: [ PROCEED TO PAY Rs 199 VIA UPI / CARDS ])               |
|                                                                                |
|  Note: No account creation required. You will receive an instant digital pass. |
+--------------------------------------------------------------------------------+
```

---

### 2.4 Digital Pass & Ticket View (`/tickets/[ticketId]`)
```
+--------------------------------------------------------------------------------------------------+
| [NAVBAR]                                                                                         |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   [✓ REGISTRATION CONFIRMED]                                                                     |
|   Your pass for Fullstack Next.js & Supabase Workshop is ready!                                  |
|   A confirmation copy has been dispatched to [attendee@email.com].                               |
|                                                                                                  |
|   +--------------------------------------------------------------------------------------------+ |
|   |  DPGU ACM STUDENT CHAPTER                                      PASS TICKET #DPGU-2026-X8F2 | |
|   |  ----------------------------------------------------------------------------------------  | |
|   |  EVENT: Fullstack Next.js 14 & Supabase Cloud Architectures                                | |
|   |                                                                                            | |
|   |  ATTENDEE NAME:     John Doe                                +----------------------------+ | |
|   |  ROLL / DEPT:       2023-BCS-042 (CSE)                      |   ##### #####   ##   #####  | | |
|   |  INSTITUTION:       DPG University, Gurugram                |   #   # #   #  #  #  #   #  | | |
|   |  DATE & TIME:       Sat, Oct 28, 2026 | 10:00 AM IST        |   ##### #####   ##   #####  | | |
|   |  VENUE:             Advanced Computing Lab 304, DPGU        |   [ DIGITAL QR PASS CODE ] | | |
|   |  STATUS:            [✓ VALID / UNCLAIMED]                   |   Token: X8F2-9901-C4          | | |
|   |  FEE PAID:          Rs 0.00 (FREE RSVP)                     +----------------------------+ | |
|   +--------------------------------------------------------------------------------------------+ |
|                                                                                                  |
|   [ Download Pass (PNG/PDF) ]   [ Add to Google Calendar ]   [ Share Link ]                      |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
| [FOOTER]                                                                                         |
+--------------------------------------------------------------------------------------------------+
```

---

### 2.5 Executive Team Directory (`/team`)
```
+--------------------------------------------------------------------------------------------------+
| [NAVBAR]                                                                                         |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|  Executive Committee & Chapter Leads                                                             |
|  Meet the student officers and faculty advisors driving innovation at DPGU ACM.                  |
|                                                                                                  |
|  [Filter: [All Officers] [Executive Board] [Technical Leads] [Design & Media] [Past Officers] ]  |
|                                                                                                  |
|  FACULTY PATRON & ADVISOR                                                                        |
|  +--------------------------------------------------------------------------------------------+  |
|  | [Photo Placeholder]  Prof. [Faculty Advisor Name]                                          |  |
|  |                      Faculty Sponsor, DPGU ACM Student Chapter                             |  |
|  |                      "Empowering students to push the boundaries of scientific computing." |  |
|  +--------------------------------------------------------------------------------------------+  |
|                                                                                                  |
|  STUDENT EXECUTIVE BOARD (TERM 2026-2027)                                                        |
|  +--------------------+ +--------------------+ +--------------------+ +--------------------+     |
|  | [Photo]            | | [Photo]            | | [Photo]            | | [Photo]            |     |
|  | [Officer Name 1]   | | [Officer Name 2]   | | [Officer Name 3]   | | [Officer Name 4]   |     |
|  | Chapter Chair      | | Vice Chair         | | General Secretary  | | Treasurer          |     |
|  | [GitHub] [LinkedIn]| | [GitHub] [LinkedIn]| | [GitHub] [LinkedIn]| | [GitHub] [LinkedIn]|     |
|  +--------------------+ +--------------------+ +--------------------+ +--------------------+     |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
| [FOOTER]                                                                                         |
+--------------------------------------------------------------------------------------------------+
```

---

### 2.6 Projects Showcase (`/projects`) & Hall of Fame (`/achievements`)
```
+--------------------------------------------------------------------------------------------------+
| [NAVBAR]                                                                                         |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|  Student Projects & Research                                                                     |
|  Open-source software, AI models, and hardware prototypes crafted by DPGU ACM members.           |
|                                                                                                  |
|  [Filter: [All] [Web & Cloud] [AI & Machine Learning] [Systems & IoT] [Cybersecurity] ]          |
|                                                                                                  |
|  +-------------------------------------+  +-------------------------------------+                |
|  | [Thumbnail / Architecture Diagram]  |  | [Thumbnail / Architecture Diagram]  |                |
|  | Campus Pathfinder (Autonomous Nav) |  | Smart Classroom Attendance Node     |                |
|  | Built by: Team DevGuild             |  | Built by: Embedded Systems SIG      |                |
|  | Tech: Next.js, FastAPI, ROS2        |  | Tech: ESP32, Rust, Supabase, MQTT   |                |
|  |                                     |  |                                     |                |
|  | [View Code on GitHub] [Live Demo]   |  | [View Code on GitHub] [Read Paper]  |                |
|  +-------------------------------------+  +-------------------------------------+                |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
| [FOOTER]                                                                                         |
+--------------------------------------------------------------------------------------------------+
```

---

## 3. Admin Dashboard Wireframes

### 3.1 Admin Authentication (`/admin/login`)
```
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|                                 +-----------------------------+                                  |
|                                 |       [DPGU ACM LOGO]       |                                  |
|                                 |    Chapter Admin Console    |                                  |
|                                 |                             |                                  |
|                                 |  Administrator Email        |                                  |
|                                 |  [ admin@dpgu.acm.org     ] |                                  |
|                                 |                             |                                  |
|                                 |  Password                   |                                  |
|                                 |  [ ********************** ] |                                  |
|                                 |                             |                                  |
|                                 |  [ SIGN IN TO DASHBOARD ]   |                                  |
|                                 |                             |                                  |
|                                 |  * Single authorized admin  |                                  |
|                                 +-----------------------------+                                  |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

---

### 3.2 Admin Overview (`/admin`)
```
+--------------------------------------------------------------------------------------------------+
| [SIDEBAR]                  | [ADMIN TOPBAR: Welcome, Chapter Chair | [Logout] ]                  |
|                            +---------------------------------------------------------------------+
| [DASHBOARD]                | METRICS OVERVIEW (LAST 30 DAYS)                                     |
|  - Overview (Active)       | +-----------------+ +-----------------+ +-------------------------+ |
|  - Events Manager          | | TOTAL ATTENDEES | | ACTIVE EVENTS   | | TOTAL REVENUE           | |
|  - Registrations & Payments| | 542 Registered  | | 3 Live Events   | | Rs 28,400 Collected     | |
|  - Live QR Scanner         | +-----------------+ +-----------------+ +-------------------------+ |
|  - Content CMS             |                                                                     |
|  - Reports & Export        | QUICK ACTIONS:                                                      |
|  - Settings                | [ + Create New Event ]   [ Launch QR Scanner ]   [ Export CSV ]     |
|                            |                                                                     |
|                            | RECENT REGISTRATIONS (LIVE STREAM)                                  |
|                            | +-----------------------------------------------------------------+ |
|                            | | Attendee Name  | Event Title       | Status    | Time           | |
|                            | |----------------+-------------------+-----------+----------------| |
|                            | | Rahul Verma    | Cloud Workshop    | CONFIRMED | 2 mins ago     | |
|                            | | Priya Sharma   | CodeMatrix 2026   | PAID      | 14 mins ago    | |
|                            | | Amit Kumar     | CodeMatrix 2026   | PENDING   | 35 mins ago    | |
|                            | +-----------------------------------------------------------------+ |
+----------------------------+---------------------------------------------------------------------+
```

---

### 3.3 Admin Live QR Attendance Scanner (`/admin/scanner`)
```
+--------------------------------------------------------------------------------------------------+
| [ADMIN TOPBAR: < Back to Dashboard | Active Event: Fullstack Workshop | Camera: Back ]          |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|                                    [ CAMERA VIEWFINDER ]                                         |
|                                 +-------------------------+                                      |
|                                 |  +--                 --+|                                      |
|                                 |  |                     ||                                      |
|                                 |  |    [ ALIGN QR ]     ||                                      |
|                                 |  |                     ||                                      |
|                                 |  +--                 --+|                                      |
|                                 +-------------------------+                                      |
|                                    Status: Ready to scan                                         |
|                                                                                                  |
|   ============================ SCAN FEEDBACK OVERLAY ============================                |
|   +----------------------------------------------------------------------------+                 |
|   | [✓ SUCCESS: VALID TICKET - ATTENDANCE RECORDED]                            |                 |
|   | Attendee:     Rahul Verma                                                  |                 |
|   | Roll Number:  2023-BCS-042 (CSE, DPG University)                           |                 |
|   | Ticket Token: DPGU-2026-X8F2-9901                                          |                 |
|   | Timestamp:    Checked in at 09:42 AM IST                                   |                 |
|   +----------------------------------------------------------------------------+                 |
|                                                                                                  |
|   RECENT CHECK-INS (SESSION): 48 / 60 Checked In (80%)                                           |
|   1. Rahul Verma (09:42 AM)                                                                      |
|   2. Sneha Patel (09:40 AM)                                                                      |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

---

### 3.4 Admin Registrations & Payments Ledger (`/admin/registrations`)
```
+--------------------------------------------------------------------------------------------------+
| [SIDEBAR]                  | REGISTRATIONS & FINANCIAL LEDGER                                    |
|                            | Filter: [All Events v] [Status: All v]   Search: [ Name / Email / ID] |
|                            | [ EXPORT CSV ]   [ BULK EMAIL PASSES ]                              |
|                            |                                                                     |
|                            | +-----------------------------------------------------------------+ |
|                            | | ID   | Name      | Email         | Event        | Status| Amt   | |
|                            | |------+-----------+---------------+--------------+-------+-------| |
|                            | | #101 | Rahul V.  | rahul@dpgu.ac | Cloud W/S    | CONF. | FREE  | |
|                            | | #102 | Priya S.  | priya@gmail   | Hackathon 26 | CONF. | Rs 199| |
|                            | | #103 | Amit K.   | amit@dpgu.ac  | Hackathon 26 | PEND. | Rs 199| |
|                            | +-----------------------------------------------------------------+ |
+----------------------------+---------------------------------------------------------------------+
```
