# DPGU ACM Student Chapter — Master Project Context

This document serves as the comprehensive single source of truth for the project state, architecture, design specifications, completed milestones, and conventions.

---

## 1. Project Overview & Vision

- **Entity**: DPG University ACM Student Chapter (Sector 34, Gurugram, Haryana, India).
- **Mission**: Build an authoritative, high-performance, dark-mode digital presence showcasing chapter events, student projects, achievements, and leadership, with frictionless public event registration (zero account required for attendees) and a dedicated single-admin console.
- **Current Status**: **Phase 2 Completed** (Complete Public-Facing Portal, Event Filter Engine, Showcases, Legal Pages).
- **Next Phase**: **Phase 3** (Event Engine, Guest Registration Drawer, & Digital QR Ticket Issuance).

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
| **Database** | PostgreSQL / Supabase | `^2.49.1` | Managed cloud relational database with Row Level Security (RLS) |
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
--color-status-success:   #10B981;  /* Valid scan, confirmed ticket */
--color-status-warning:   #F59E0B;  /* Limited spots, duplicate scan */
--color-status-error:     #EF4444;  /* Form validation error, counterfeit ticket */
```

### Accessibility & Motion Rules:
- **Focus Rings**: `:focus-visible` utilizes `outline: 2px solid #648CFF` with `outline-offset: 2px` on all interactive triggers.
- **Reduced Motion**: `@media (prefers-reduced-motion: reduce)` automatically sets animation durations to zero. No continuous spinning or glowing animations.
- **Form Error Presentation**: Every input with an error connects via `aria-describedby` to a descriptive error element tagged `role="alert"`.

---

## 4. Component Inventory (`src/components/`)

### UI Primitives (`src/components/ui/`)
1. **`Button.tsx`**:
   - Variants: `primary`, `secondary`, `text`, `outline`, `destructive`.
   - Sizes: `sm`, `md`, `lg`.
   - Supports `isLoading` with accessible spinner, `leftIcon`, `rightIcon`, and disabled states.
2. **`Card.tsx`**:
   - Variants: `surface` (`#101522`), `elevated` (`#171E2D`), `outline`.
   - Subcomponents: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
   - Supports `isInteractive` prop with subtle border transition.
3. **`Input.tsx`**:
   - Complete form field with label, helper text, left/right icons, and accessible validation error alert.
4. **`Textarea.tsx`**:
   - Multi-line input with error state association.
5. **`Select.tsx`**:
   - Styled native select with accessible chevron icon and validation error presentation.
6. **`Badge.tsx`**:
   - Status indicators: `neutral`, `accent`, `success`, `warning`, `error`.
   - Supports optional dot indicator (`showDot`).
7. **`Spinner.tsx`**:
   - Accessible loading indicator with `role="status"` and visually hidden label text.
8. **`EmptyState.tsx`**:
   - Clean dashed container for zero-data states with icon, title, description, and action button.
9. **`ErrorState.tsx`**:
   - Accessible error banner (`role="alert"`) with retry callback trigger.
10. **`Modal.tsx`**:
    - Accessible dialog (`role="dialog"`, `aria-modal="true"`) with backdrop blur, body scroll lock, and ESC key listener.
11. **`Toast.tsx`**:
    - Status notification banner (`success`, `error`, `warning`, `info`) with dismiss button.

### Shared Layout (`src/components/layout/`)
1. **`Navbar.tsx`**:
   - Sticky top glassmorphic navigation bar (`#080B12`/85 with `backdrop-blur-md`).
   - Active route detection using `usePathname()`.
   - Fully responsive mobile drawer with accessible hamburger toggle button (`aria-expanded`).
2. **`Footer.tsx`**:
   - Multi-column footer covering chapter identity, navigation links, ACM resources, campus location, and admin link.

---

## 5. Architectural Guardrails & Rules

1. **Guest Registration Principle**: Public attendees register for events without creating user accounts. Registration identity is tied to `(event_id, LOWER(email))`.
2. **No Public Admin Signups**: The admin portal (`/admin/login`) is strictly for the authorized single administrator. Public registration or signup endpoints are prohibited.
3. **No Fake Data**: Production pages must not display fabricated member names, fake phone numbers, or unverified event statistics.
4. **No Payment Processing in Phase 1**: Payment gateway integration is strictly deferred to Phase 4.
5. **Hostinger Compatibility**: PostgreSQL is hosted via Supabase, ensuring full compatibility regardless of whether Hostinger provides a shared web hosting plan or a KVM VPS.
