# Bharat Career Hub — Implementation Plan

Build a production-grade, responsive India-wide Government Jobs Discovery Portal (**Bharat Career Hub**) featuring 10 dedicated routes, rich multi-attribute search and filtering, Supabase database integration with seamless local storage fallback, an administrative recruitment management suite, and future PWA readiness.

---

## 1. Architecture & Design System

### Design Language
- **Palette**: Civic Indian Navy Blue (`#001f3e`, `#0b1c30`), Clean Crisp White (`#ffffff`), subtle Tricolor accents (Saffron `#f59e0b` / `#d98b00` and Civic Emerald `#15803d` / `#16a34a`), with Slate neutral borders.
- **Typography**: Clean hierarchy with `Plus Jakarta Sans` for titles/body and `JetBrains Mono` for tabular data, advt numbers, and pay matrices.
- **Responsiveness**: Fluid layout scaling across desktop, tablet, and mobile browsers with touch-friendly touch targets and accessible contrast.

### Navigation & Routing (`react-router-dom`)
Full client-side URL routing with browser history:
1. `/` — **Homepage** (Hero, live stats, fast category chips, hot closing notices, state map quick jump)
2. `/jobs` — **All Government Jobs** (Comprehensive faceted search, filters by Board, Dept, State, Qualification, Pay Level, Status, View mode toggles)
3. `/jobs/:id` — **Job Details Page** (Full gazetted details, vacancy tables, eligibility, syllabus, timeline, official link handoff modal)
4. `/departments` — **Department Directory** (Union Ministries, State Boards, Defence, Railways, Banking, PSUs)
5. `/states` — **State-Wise Jobs** (State & UT directory with active vacancy counters and state filter)
6. `/calendar` — **Examination Calendar** (Monthly chronological timeline of upcoming CBTs, Mains, Interviews)
7. `/auth` — **Login & Registration** (Google OAuth via Supabase, One-Time Registration OTR, and Demo Sign-in)
8. `/dashboard` — **User Candidate Dashboard** (Saved notices, applied trackers, exam alerts, OTR profile)
9. `/admin` — **Admin Dashboard** (Recruitment CRUD management, create/edit postings, verify gazette, expire notices)
10. `/about` — **About & Contact** (Civic transparency notice, RTI charter, anti-fraud policy, contact form)

---

## 2. Data Models & Supabase Architecture

### Schema Definition (`supabase/schema.sql`)
- Table `public.jobs`:
  - `id` (uuid / text primary key)
  - `title` (text)
  - `department` (text)
  - `organization` (text)
  - `category` (UPSC, SSC, Railways, Banking, Army, Navy, Air Force, State PSC, PSU, Teaching, Healthcare, Police, Judiciary, Engineering, Research)
  - `location` (text - All India / State Name)
  - `qualification` (text - 10th, 12th, Diploma, Graduate, B.Tech, PG, MBBS, etc.)
  - `vacancies` (integer)
  - `salary` (text - 7th CPC Level and pay band)
  - `age_limit` (text - min and max age with relaxation details)
  - `application_start_date` (timestamptz)
  - `application_end_date` (timestamptz)
  - `examination_date` (timestamptz / text)
  - `official_notification_url` (text)
  - `official_application_url` (text)
  - `status` ('active' | 'closing-soon' | 'expired' | 'draft')
  - `verified_at` (timestamptz)
  - `created_at` (timestamptz)
- Table `public.saved_jobs` (user bookmarks with user_id foreign key)
- Table `public.job_alerts` (candidate alert subscriptions)
- Row Level Security (RLS) policies allowing public read access for active jobs, user-isolated saved jobs, and role-based admin mutability.

### Client-Side Data Layer (`src/lib/supabase.ts` & `src/services/jobService.ts`)
- Dual-mode architecture:
  - When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are provided, directly queries Supabase with real-time updates and Google OAuth.
  - When keys are omitted, automatically operates in **Demo / LocalStorage mode** seeded with over 20+ realistic government recruitment records (UPSC CSE, SSC CGL, RRB ALP, SBI PO, ISRO, Indian Navy, NDA, State PSCs, DRDO, etc.), supporting full persistent CRUD in the browser.

---

## 3. Core Features & Capabilities

- **Deep Search & Multi-Faceted Filters**:
  - Full-text search matching recruitment title, department, organization, advertisement number, and qualification.
  - Faceted filters: Category/Recruitment Board, State/UT, Education Level, 7th CPC Pay Scale, Application Status (Active vs. Closing Soon vs. Expired), and Special Provisions (PwBD, Ex-Servicemen, Zero Fee).
  - Multi-criteria sorting: Closing Date (Earliest First), Newest Notification, Vacancy Count (High to Low), Pay Scale.
- **Official Portal Handoff & Anti-Fraud Safety**:
  - Direct redirect modal with warning that Bharat Career Hub never charges fees; links strictly handoff to authenticated `.gov.in` and `.nic.in` domains.
  - Embedded Gazette PDF previewer simulator with digital stamp verification.
- **Candidate User Portal**:
  - Saved notifications bookmarks with offline LocalStorage synchronization.
  - Quick eligibility checker (Age + Education + Category -> Matching Posts).
  - Instant job alert registration modal for WhatsApp/Email notification dispatches.
- **Admin Management Suite**:
  - Dedicated `/admin` route with quick-toggle Demo Admin switcher in top bar for instant testing.
  - Modal form to Create New Recruitment and Edit Existing Recruitments with live preview.
  - One-click "Mark as Expired" or "Verify Gazette Notice" buttons.
  - Ability to Reset to Default Seed Data anytime.
- **PWA & Production Hygiene**:
  - `manifest.json` and meta viewport tags configured for standalone PWA readiness.
  - Accessible high-contrast typography, text resize controls (A-, A, A+), language selector dropdown.

---

## 4. Execution Steps

1. **Install Dependencies**: Install `react-router-dom` and `@supabase/supabase-js`.
2. **Setup Supabase Schema & Mock Bridge**: Create `/supabase/schema.sql`, `/src/lib/supabase.ts`, and `/src/services/jobService.ts`.
3. **Build Core Application Layout & Navigation**: Create responsive Navbar with active links, breadcrumbs, search dialog, and Role Switcher banner.
4. **Develop Pages**:
   - `HomePage.tsx`
   - `AllJobsPage.tsx`
   - `JobDetailsPage.tsx`
   - `DepartmentDirectoryPage.tsx`
   - `StateWiseJobsPage.tsx`
   - `ExamCalendarPage.tsx`
   - `AuthPage.tsx`
   - `UserDashboardPage.tsx`
   - `AdminDashboardPage.tsx`
   - `AboutContactPage.tsx`
5. **Add Interactive Modals & Tools**:
   - Eligibility Calculator Modal
   - Official Application Handoff Modal
   - Gazette Document Reader Modal
   - Job Alert Subscription Modal
   - Create/Edit Job Admin Modal
6. **Verify Compilation & Testing**: Run `compile_applet` and `lint_applet` to ensure zero TypeScript or build errors.
