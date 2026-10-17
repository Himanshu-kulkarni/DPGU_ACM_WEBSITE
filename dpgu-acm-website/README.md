# DPGU ACM Student Chapter Official Website

The official web portal and event operations platform for the **DPG University ACM Student Chapter** (Gurugram, India).

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**, designed according to a premium minimal dark aesthetic with accessible, high-contrast components and a frictionless guest registration model.

---

## 🎨 Design System & Color Palette

The user interface adheres to strict dark-mode design requirements:

| Element | Color Hex | Role |
| :--- | :--- | :--- |
| **Canvas Background** | `#080B12` | Deepest foundation background |
| **Surface** | `#101522` | Cards, navbar, containers, footers |
| **Elevated Surface** | `#171E2D` | Modals, active states, highlighted cards |
| **Primary Text** | `#F5F7FB` | High-contrast headings and primary copy |
| **Secondary Text** | `#A5AEC0` | Subtitles, captions, metadata, icons |
| **Primary Accent** | `#648CFF` | ACM electric blue for CTAs, active pills, links |
| **Borders** | `#252D3D` | 1px subtle card outlines and section dividers |
| **Success Status** | `#10B981` | Confirmed tickets, valid scan, active badge |
| **Warning Status** | `#F59E0B` | Limited seats alert, pending state |
| **Error Status** | `#EF4444` | Form validation errors, declined states |

---

## 📁 Feature-Oriented Project Structure

```
dpgu-acm-website/
├── docs/                                  # Architectural specifications & blueprints
│   ├── MASTER_CONTEXT.md                  # Comprehensive context & state for developers
│   ├── WEBSITE_BLUEPRINT.md               # Brand identity, personas, functional modules
│   ├── SITEMAP.md                         # Hierarchical site tree & route matrix
│   ├── WIREFRAMES.md                      # Page-by-page ASCII wireframes
│   ├── ARCHITECTURE.md                    # System topology & Hostinger hosting analysis
│   ├── DATABASE_SCHEMA.md                 # PostgreSQL DDL, ER diagram, indexes, RLS
│   ├── DECISIONS.md                       # Approved ADRs & open questions registry
│   ├── IMPLEMENTATION_PLAN.md             # 7-phase implementation roadmap & criteria
│   └── TODO.md                            # Action items & master phase checklist
├── public/                                # Static assets and icons
├── src/
│   ├── app/                               # Next.js App Router
│   │   ├── (public)/                      # Public routes (Share Navbar & Footer)
│   │   │   ├── layout.tsx                 # Public layout wrapper
│   │   │   ├── page.tsx                   # Homepage & Phase 1 Interactive Showcase
│   │   │   ├── about/page.tsx             # About chapter & mission
│   │   │   ├── events/page.tsx            # Events & workshops catalog
│   │   │   ├── projects/page.tsx          # Student open-source projects
│   │   │   ├── achievements/page.tsx      # Hall of fame & awards
│   │   │   ├── team/page.tsx              # Executive committee & leads
│   │   │   └── contact/page.tsx           # Contact & membership inquiry form
│   │   ├── (admin)/                       # Protected Admin Console
│   │   │   ├── layout.tsx                 # Admin layout wrapper
│   │   │   └── admin/
│   │   │       ├── login/page.tsx         # Authorized single admin sign-in (No public signup)
│   │   │       └── page.tsx               # Executive metrics dashboard shell
│   │   ├── globals.css                    # Tailwind CSS v4 tokens & accessible focus
│   │   └── layout.tsx                     # Root HTML, Inter font, metadata
│   ├── components/
│   │   ├── layout/                        # Shared layout components
│   │   │   ├── Navbar.tsx                 # Responsive navbar with mobile drawer
│   │   │   └── Footer.tsx                 # Responsive footer with chapter details
│   │   └── ui/                            # Reusable typed UI primitives
│   │       ├── Button.tsx                 # Primary, secondary, text, outline, destructive
│   │       ├── Card.tsx                   # Surface & elevated cards with subcomponents
│   │       ├── Input.tsx                  # Accessible input with validation error states
│   │       ├── Textarea.tsx               # Accessible textarea with error states
│   │       ├── Select.tsx                 # Custom select with error states
│   │       ├── Badge.tsx                  # Badges with status colors and dot indicators
│   │       ├── Spinner.tsx                # Accessible loading indicators (reduced-motion safe)
│   │       ├── EmptyState.tsx             # Empty state with icon, title, description, action
│   │       ├── ErrorState.tsx             # Error state banner with retry callback
│   │       ├── Modal.tsx                  # Accessible dialog with ESC listener & focus lock
│   │       └── Toast.tsx                  # Contextual notification banners
│   ├── lib/
│   │   ├── utils.ts                       # Classnames merger (`cn`)
│   │   ├── env.ts                         # Zod environment variable validator
│   │   └── supabase/                      # Database & Auth preparation
│   │       ├── client.ts                  # Browser Supabase client
│   │       ├── server.ts                  # Server-side service-role client
│   │       └── types.ts                   # Database entity TypeScript interfaces
│   ├── schemas/                           # Validation schemas
│   │   └── event-registration.ts          # Zod schema for guest checkout
│   └── types/                             # Shared TypeScript types
│       └── navigation.ts                  # Navigation items and links
├── .env.example                           # Environment configuration template
├── package.json                           # Dependencies & scripts
└── tsconfig.json                          # TypeScript configuration
```

---

## 🛠️ Getting Started Locally

### Prerequisites
- **Node.js**: `v20.x` or later (Tested on `v24.14.0`)
- **npm**: `v10.x` or later

### Installation
1. Clone the repository and navigate into `dpgu-acm-website`:
   ```bash
   cd dpgu-acm-website
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env.local
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Quality Assurance & Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server at `localhost:3000` |
| `npm run build` | Compiles production bundle and executes strict type checking |
| `npm run start` | Runs the compiled production server |
| `npm run lint` | Runs ESLint across all TypeScript and React files |

---

## 📌 Phase Status

- **Phase 0**: Architecture & Planning (**Completed**)
- **Phase 1**: Project Scaffolding, Core Infrastructure, & Design System (**Completed**)
- **Phase 2**: Complete Public-Facing Website & Event Showcases (**Completed**)
- **Phase 3**: Event Registration Engine & Digital Pass Issuance (**Next**)
