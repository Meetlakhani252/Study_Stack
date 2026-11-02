# 📋 StudyStack — Project Task Tracker

> This document tracks every task required to complete the StudyStack project from start to finish.
> Update the status of each task after completion by marking it ✅.
>
> **Last Updated:** 2026-11-02 · Phase 7 (AI Doubt Solver) complete

---

## Legend
| Symbol | Meaning |
|--------|---------|
| ✅ | Completed |
| 🔄 | In Progress |
| ⬜ | Not Started |

---

## Phase 1 — Project Setup & Infrastructure

| # | Task | Status |
|---|------|--------|
| 1.1 | Initialize Next.js (App Router) + TypeScript frontend | ✅ |
| 1.2 | Configure Tailwind CSS v4 | ✅ |
| 1.3 | Setup Python FastAPI backend with virtual environment | ✅ |
| 1.4 | Configure `.gitignore` and initial git repository | ✅ |
| 1.5 | Write `README.md` with setup instructions | ✅ |
| 1.6 | Setup environment variable files (`.env.local`, `backend/.env`) | ✅ |
| 1.7 | Define project folder structure (`frontend/`, `backend/`, `supabase/`, `docs/`) | ✅ |

---

## Phase 2 — Database Setup

| # | Task | Status |
|---|------|--------|
| 2.1 | Design relational schema (`subjects`, `topics`, `doubts`, `papers`, `paper_questions`) | ✅ |
| 2.2 | Write initial SQL migration (`0001_setup.sql`) | ✅ |
| 2.3 | Add `is_weak` flag to `topics` table (`0002_add_weak_flag.sql`) | ✅ |
| 2.4 | **Migrate database from Supabase → Neon Postgres** | ✅ |
| 2.5 | Create Neon project and run `neon_setup.sql` schema on Neon console | ✅ |
| 2.6 | Setup Neon serverless client in frontend (`lib/db.ts`) | ✅ |
| 2.7 | Add database indexes for performance (user_id, subject_id) | ✅ |

---

## Phase 3 — Authentication

| # | Task | Status |
|---|------|--------|
| 3.1 | ~~Implement Supabase OTP (magic link) login~~ *(deprecated)* | ✅ |
| 3.2 | ~~Implement Supabase email + password login~~ *(deprecated)* | ✅ |
| 3.3 | **Migrate Auth from Supabase → Clerk** | ✅ |
| 3.4 | Wrap app in `<ClerkProvider>` in `layout.tsx` | ✅ |
| 3.5 | Configure Clerk `middleware.ts` to protect all private routes | ✅ |
| 3.6 | Setup Clerk `<SignIn />` page at `/login` | ✅ |
| 3.7 | Setup Clerk `<SignUp />` page at `/signup` | ✅ |
| 3.8 | Replace manual logout with Clerk `useClerk().signOut()` in Sidebar | ✅ |
| 3.9 | Display logged-in user email in Sidebar via `useUser()` | ✅ |
| 3.10 | Remove all obsolete Supabase auth pages (`/verify`, `/forgot-password`, `/auth/callback`) | ✅ |

---

## Phase 4 — Landing Page

| # | Task | Status |
|---|------|--------|
| 4.1 | Build `Navbar` with login/signup links | ✅ |
| 4.2 | Build `Hero` section with CTA | ✅ |
| 4.3 | Build `Features` section (feature cards) | ✅ |
| 4.4 | Build `ValueProps` section | ✅ |
| 4.5 | Build `Personas` section | ✅ |
| 4.6 | Build `LiveDemo` preview section | ✅ |
| 4.7 | Build `SocialProof` section | ✅ |
| 4.8 | Build `FinalCTA` section | ✅ |
| 4.9 | Build `Footer` | ✅ |
| 4.10 | Update Features copy to remove Supabase mention | ✅ |

---

## Phase 5 — Dashboard & Syllabus Tracker (Core Feature)

| # | Task | Status |
|---|------|--------|
| 5.1 | Build `Sidebar` layout component | ✅ |
| 5.2 | Build `Header` layout component | ✅ |
| 5.3 | Build `Dashboard` page with subject grid | ✅ |
| 5.4 | Implement `CreateSubjectForm` modal (name + exam date) | ✅ |
| 5.5 | Implement `SubjectCard` with expandable topic list | ✅ |
| 5.6 | Implement progress bar and `% completed` counter on Subject Card | ✅ |
| 5.7 | Show `"X of Y topics completed"` count on Subject Card | ✅ |
| 5.8 | Implement `AddTopicsModal` (multi-topic bulk add, one per line) | ✅ |
| 5.9 | Implement `TopicManager` with topic status cycling (Not Started → In Progress → Done) | ✅ |
| 5.10 | Implement `is_weak` Weak/Strong toggle per topic | ✅ |
| 5.11 | Implement topic deletion with confirmation | ✅ |
| 5.12 | **Migrate all CRUD from Supabase client → Next.js Server Actions + Neon** | ✅ |
| 5.13 | Fix Neon Date object serialization bug (`[object Date]` render error) | ✅ |
| 5.14 | Add dark mode support across Dashboard + Subject pages | ✅ |
| 5.15 | Add exam countdown timer on Subject Card (days until exam) | ✅ |
| 5.16 | Add subject deletion from Dashboard | ✅ |
| 5.17 | Add subject edit (rename / change exam date) | ✅ |

---

## Phase 6 — Subject Hub

| # | Task | Status |
|---|------|--------|
| 6.1 | Build `Subject Hub` page (`/subjects/[subjectId]`) | ✅ |
| 6.2 | Add action cards for Syllabus, Doubts, and Papers navigation | ✅ |
| 6.3 | Replace Supabase query in Subject Hub with Neon Server Action | ✅ |

---

## Phase 7 — AI Doubt Solver

| # | Task | Status |
|---|------|--------|
| 7.1 | Build Doubts page UI (`/subjects/[subjectId]/doubts`) | ✅ |
| 7.2 | Implement doubt submission modal (text input) | ✅ |
| 7.3 | Store doubts in Neon `doubts` table via Server Action | ✅ |
| 7.4 | Display submitted doubts list with date and "Pending" badge | ✅ |
| 7.5 | Build FastAPI `POST /doubts/solve` endpoint | ✅ |
| 7.6 | Integrate Gemini Flash API for step-by-step doubt resolution | ✅ |
| 7.7 | Add image upload support (photo of handwritten question) | ✅ |
| 7.8 | Wire frontend doubts page to AI solving pipeline | ✅ |
| 7.9 | Display AI-generated answer below submitted doubt | ✅ |
| 7.10 | Mark doubt as "Resolved" after AI provides answer | ✅ |
| 7.11 | Add daily AI query rate limiting per user (PRD `FR-2.6`) | ✅ |

---

## Phase 8 — Past Paper Analyzer

| # | Task | Status |
|---|------|--------|
| 8.1 | Build Papers page UI (`/subjects/[subjectId]/papers`) with mock data | ✅ |
| 8.2 | Add file upload UI for PDF papers | ⬜ |
| 8.3 | Integrate file storage (Cloudinary or similar) for paper PDFs | ⬜ |
| 8.4 | Store paper metadata in Neon `papers` table | ⬜ |
| 8.5 | Build FastAPI `POST /papers/analyze` endpoint (currently stub) | ⬜ |
| 8.6 | Implement PDF parser using `pdfplumber` | ⬜ |
| 8.7 | Implement question extraction and topic matching logic | ⬜ |
| 8.8 | Calculate topic frequency / exam probability ranking | ⬜ |
| 8.9 | Store extracted questions in `paper_questions` table | ⬜ |
| 8.10 | Wire frontend papers page to FastAPI `/papers/analyze` | ⬜ |
| 8.11 | Display topic frequency heatmap / ranked table in UI | ⬜ |
| 8.12 | Add year/type filter for papers (currently UI-only, needs real data) | ⬜ |

---

## Phase 9 — Backend Infrastructure

| # | Task | Status |
|---|------|--------|
| 9.1 | Setup FastAPI app with health check endpoint | ✅ |
| 9.2 | Create `doubt_solver.py` router stub | ✅ |
| 9.3 | Create `paper_analyzer.py` router stub | ✅ |
| 9.4 | Create `llm_service.py` placeholder (Gemini / GPT-4o-mini) | ✅ |
| 9.5 | Create `pdf_parser.py` using `pdfplumber` | ✅ |
| 9.6 | Create `ocr_service.py` stub (Tesseract) | ✅ |
| 9.7 | **Implement Gemini Flash API in `llm_service.py`** | ✅ |
| 9.8 | Implement OCR for handwritten doubt images | ✅ |
| 9.9 | Add JWT / Clerk token verification in FastAPI for auth | ⬜ |
| 9.10 | Add proper error handling and logging in FastAPI | ⬜ |
| 9.11 | Add CORS configuration for frontend → backend requests | ✅ |

---

## Phase 10 — Code Quality & Polish

| # | Task | Status |
|---|------|--------|
| 10.1 | Fix ESLint warnings (escaped chars, `any` types) | ✅ |
| 10.2 | Run TypeScript strict type checks across project | ✅ |
| 10.3 | Remove unused `@supabase/supabase-js` dependency | ⬜ |
| 10.4 | Migrate `middleware.ts` → `proxy.ts` (Next.js 16 convention) | ⬜ |
| 10.5 | Add loading skeletons on Dashboard and Subject pages | ⬜ |
| 10.6 | Add proper 404 / not-found pages | ⬜ |
| 10.7 | Add error boundary for failed data fetches | ⬜ |
| 10.8 | Add toast notifications for success/error actions | ⬜ |
| 10.9 | Ensure full mobile responsiveness across all pages | ⬜ |

---

## Phase 11 — Deployment

| # | Task | Status |
|---|------|--------|
| 11.1 | Deploy frontend to Vercel | ⬜ |
| 11.2 | Set Clerk and Neon environment variables in Vercel dashboard | ⬜ |
| 11.3 | Deploy FastAPI backend (Railway / Render / Fly.io) | ⬜ |
| 11.4 | Set backend env vars (Gemini API key, Database URL) | ⬜ |
| 11.5 | Update Clerk allowed redirect URLs for production domain | ⬜ |
| 11.6 | Test full production user flow (signup → dashboard → doubts → papers) | ⬜ |
| 11.7 | Add project to resume / portfolio with live URL | ⬜ |

---

## 📊 Overall Progress

| Phase | Total Tasks | Done | Remaining |
|-------|------------|------|-----------|
| 1. Setup & Infrastructure | 7 | 7 | 0 |
| 2. Database | 7 | 7 | 0 |
| 3. Authentication | 10 | 10 | 0 |
| 4. Landing Page | 10 | 10 | 0 |
| 5. Dashboard & Syllabus | 17 | 17 | 0 |
| 6. Subject Hub | 3 | 3 | 0 |
| 7. AI Doubt Solver | 11 | 11 | 0 |
| 8. Past Paper Analyzer | 12 | 1 | 11 |
| 9. Backend Infrastructure | 11 | 9 | 2 |
| 10. Code Quality & Polish | 9 | 3 | 6 |
| 11. Deployment | 7 | 0 | 7 |
| **Total** | **104** | **78** | **26** |

> **~75% Complete** — Core app shell, auth, DB migration, syllabus tracker, and AI Doubt Solver done. Paper analysis and deployment are next.

