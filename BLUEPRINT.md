# SkillSutra — Technical Blueprint

> **Version**: 4.0.0 | **Stack**: Next.js 16 · FastAPI · Supabase (PostgreSQL) · Google Gemini AI · Solana Web3 · Framer Motion

A production-grade, AI-powered hiring platform that replaces traditional resumes with verifiable **Proof Scores** — computed by AI, optionally anchored on-chain, and matched semantically to job descriptions.

---

## Problem Statement

| Issue | Data Point | Impact |
|-------|-----------|--------|
| Resume Fraud | 78% of resumes contain misleading information (HireRight 2024) | Companies can't trust candidate claims |
| ATS Failure | 75% of qualified candidates are filtered out by keyword matching | Best talent never reaches recruiters |
| Recruiter Overload | 23+ hours spent screening per hire (Glassdoor) | Massive time and cost waste |
| No Verification | LinkedIn endorsements are gameable and meaningless | Zero accountability in professional claims |
| Candidate Frustration | Avg. developer applies to 100+ jobs with no feedback | Talented people are invisible |
| Bias & Opacity | Decisions based on school pedigree, not proven ability | Systemic unfairness in hiring |

**Core Insight**: There is no trusted, universally accepted way to *prove* someone actually has the skills they claim.

---

## Solution: SkillSutra Proof Score System

```
Candidate uploads CV → Gemini AI analyzes → Proof Score generated (0-100)
                                                    ↓
Company posts JD → AI extracts requirements → Semantic matching
                                                    ↓
                                        Ranked candidate shortlist
```

- **For Candidates**: Upload once → get a verified score → get matched automatically
- **For Companies**: Post a JD → AI ranks pre-verified candidates → hire faster
- **For Admins**: Full governance — user moderation, CMS, feature flags, analytics

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│              Next.js 16 Frontend (App Router)            │
│                                                         │
│  ┌─────────────┐  ┌──────────┐  ┌──────────────┐      │
│  │ auth-context │  │cms-context│  │ useRoleGuard │      │
│  └──────┬──────┘  └─────┬────┘  └──────┬───────┘      │
│         │                │              │               │
│  ┌──────┴────────────────┴──────────────┴────────────┐  │
│  │        Domain API Clients (TypeScript)             │  │
│  │  auth-api | user-api | company-api | admin-api    │  │
│  └──────────────────┬────────────────────────────────┘  │
└─────────────────────┼───────────────────────────────────┘
                      │ HTTPS / REST
                      ▼
┌─────────────────────────────────────────────────────────┐
│              FastAPI Backend (Python 3.11+)               │
│                                                         │
│  Middleware: CORS · Rate Limiting · GZip · Security     │
│  Tracing: X-Request-ID · Structured Logging             │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  25+ Feature Modules (Clean Architecture)       │    │
│  │  /api/v1/auth/*     → Auth (Google OAuth + JWT) │    │
│  │  /api/v1/profile/*  → User (candidate)          │    │
│  │  /api/v1/company/*  → Company (recruiter)       │    │
│  │  /api/v1/admin/*    → Admin (governance)        │    │
│  │  /api/v1/jobs/*     → Shared (all roles)        │    │
│  │  /api/v1/ai/*       → 16 AI sub-routers         │    │
│  └──────────┬──────────────────────────────────────┘    │
└─────────────┼───────────────────────────────────────────┘
              │ Supabase Client
              ▼
┌─────────────────────────────────────────────────────────┐
│           Supabase (PostgreSQL + Auth + RLS)              │
│  48 migrations · Row-Level Security · Real-time         │
│  users · companies · jobs · applications · ai_scores    │
│  skill_graph · nft_credentials · feature_flags · cms    │
└─────────────────────────────────────────────────────────┘
```

---

## Repository Structure

```
/
├── web/                        # Next.js 16 frontend (App Router)
│   └── src/
│       ├── app/                # 26 route segments (pages & layouts)
│       │   ├── auth/           # Login & registration flows
│       │   ├── user/           # Candidate dashboard (auth-guarded)
│       │   ├── company/        # Company panel (role-guarded)
│       │   ├── admin/          # Admin panel (admin-only)
│       │   ├── jobs/           # Job marketplace
│       │   ├── talent/         # Talent discovery + AI matching
│       │   ├── verify/         # Resume verification page
│       │   └── ...             # 15+ more route segments
│       ├── components/         # Shared UI component library (shadcn/ui)
│       │   ├── layout/         # Navbar, sidebar, footer, mobile-nav
│       │   ├── providers/      # Query, smooth-scroll, wallet providers
│       │   └── ui/             # Atomic UI: Button, Card, Input, Badge...
│       ├── context/            # React Context providers
│       │   ├── auth-context.tsx    # Supabase auth + user state
│       │   └── cms-context.tsx     # Live CMS content hydration
│       ├── features/           # 20 feature-scoped modules
│       │   ├── landing/        # Hero, Vision, Stats, Testimonials, FAQ
│       │   ├── jobs/           # Job listings, filters, cards
│       │   ├── talent/         # Talent cards, search, filters
│       │   ├── talent-pool/    # Save/bookmark talent for companies
│       │   ├── profile/        # Dynamic profile builder
│       │   ├── admin/          # Admin-specific features
│       │   └── ...             # 14 more feature modules
│       ├── hooks/              # Custom React hooks
│       │   ├── useRoleGuard.ts     # Client-side RBAC enforcement
│       │   └── useFeatureFlags.tsx # Feature flag checks
│       └── lib/
│           ├── api/            # Domain-specific API clients
│           │   ├── api-client.ts   # Base fetchWithAuth + unified api
│           │   ├── auth-api.ts     # Auth control plane
│           │   ├── user-api.ts     # User/Candidate control plane
│           │   ├── company-api.ts  # Company/Recruiter control plane
│           │   ├── admin-api.ts    # Admin control plane
│           │   └── public-api.ts   # Unauthenticated endpoints
│           └── validations/    # Zod schema definitions
│
├── server/                     # FastAPI backend (Python 3.11+)
│   ├── main.py                 # App factory, middleware, exception handlers
│   ├── core/
│   │   ├── config.py           # Pydantic-based settings
│   │   ├── logging.py          # Structured protocol logging
│   │   ├── exceptions.py       # Centralized exception hierarchy
│   │   ├── response.py         # Standardized API responses
│   │   ├── cache.py            # In-memory caching layer
│   │   └── dependencies.py     # Shared FastAPI dependencies
│   ├── db/engine.py            # Async database engine
│   ├── api/
│   │   ├── v1/router.py        # Centralized API v1 router
│   │   └── middleware/         # Rate limiting middleware
│   └── modules/                # 25+ feature-scoped modules
│       ├── auth/               # Google OAuth, JWT, RBAC guards
│       ├── users/              # Profile CRUD, skills, portfolio
│       ├── company/            # Company create, team management
│       ├── jobs/               # Job CRUD, search, applications
│       ├── applications/       # Application submit & review
│       ├── admin/              # Platform governance, moderation
│       ├── ai/                 # ★ 16 AI sub-routers + Gemini services
│       │   ├── router.py       # Master AI router
│       │   ├── services/       # resume_service, reputation_service
│       │   ├── quiz_router.py
│       │   ├── interview_router.py
│       │   ├── fraud_router.py
│       │   ├── salary_router.py
│       │   ├── scoring_router.py
│       │   ├── skill_graph_router.py
│       │   ├── portfolio_router.py
│       │   ├── soft_skills_router.py
│       │   ├── career_risk_router.py
│       │   ├── simulation_router.py
│       │   ├── team_analyzer_router.py
│       │   ├── job_optimizer_router.py
│       │   ├── pitch_router.py
│       │   ├── recruiter_dashboard_router.py
│       │   ├── external_platform_router.py
│       │   └── feedback_loop_router.py
│       ├── search/             # Full-text candidate & job search
│       ├── analytics/          # Role-scoped analytics
│       ├── cms/                # Admin-facing content management
│       ├── notifications/      # In-app notification delivery
│       ├── chat/               # Community chat (WebSocket)
│       ├── skill_graph/        # Semantic skill relationships
│       ├── talent_pool/        # Company saved candidates
│       ├── nft/                # On-chain credential minting
│       ├── career/             # Career planning & goals
│       ├── verification/       # Identity verification
│       ├── vector/             # Vector embeddings for search
│       ├── enterprise/         # Enterprise API (API key auth)
│       └── competitions/       # Skill competitions
│
├── database/
│   └── migrations/             # 48 ordered SQL migrations
│
├── contracts/                  # Solana programs (Anchor framework)
│   ├── Anchor.toml
│   └── solana_anchor_programs/
│
├── docker-compose.yml          # Local dev environment orchestration
├── Makefile                    # Dev shortcuts: make dev, make install
└── .env.example                # Required environment variables
```

---

## Control Plane Architecture

### 🔐 Auth Control Plane
- **Backend**: `modules/auth/` — Google OAuth, JWT issuance, signature verification
- **Frontend**: `context/auth-context.tsx` + `middleware.ts`
- **Guards**: `guards.py` — `require_admin`, `require_company`, `require_user`
- **Roles**: `user` (candidate) · `company` (recruiter) · `admin` (governance)

### 👤 User/Candidate Control Plane
- **Backend**: `modules/users/` — Profile, skills, portfolio, identity verification
- **Frontend**: `/user/*` — Dashboard, applications, credentials, settings, assessments
- **API Client**: `lib/api/user-api.ts`

### 🏢 Company/Recruiter Control Plane
- **Backend**: `modules/company/` + `modules/jobs/` (company endpoints)
- **Frontend**: `/company/*` — Job posting, applicant review, talent pool
- **API Client**: `lib/api/company-api.ts`

### ⚙️ Admin Control Plane
- **Backend**: `modules/admin/` — User moderation, schema builder, feature flags, audit
- **Frontend**: `/admin/*` — Dashboard, users, companies, CMS, analytics
- **API Client**: `lib/api/admin-api.ts`

---

## Key Design Decisions

### 1. AI-First Verification (Google Gemini 1.5)
Rather than relying on self-reported skills, SkillSutra uses Gemini 1.5 Flash to analyze resumes and extract skills, experience, education, and compute a forensic confidence score. The AI generates structured JSON output, enabling precise matching.

### 2. Proof Score System
Each candidate receives a computed Proof Score (0-100) based on:
- Extracted skills and depth of experience
- AI forensic confidence in the resume's authenticity
- Skill gap analysis against target roles
- Optional: on-chain credential verification

### 3. Semantic JD ↔ CV Matching
Companies upload a Job Description PDF → AI extracts requirements → searches the candidate pool → AI re-ranks the top 10 candidates with precise match scores. This replaces manual screening with intelligent ranking.

### 4. Centralized RBAC Guards
Role enforcement is handled by reusable FastAPI dependencies in `auth/guards.py`. Every protected endpoint uses `require_admin`, `require_company`, or `get_current_user` — never inline role checks.

### 5. CMS-Driven Landing Page
All landing page content is stored in a `cms_content` table and served via `/api/v1/cms`. The React `CmsContext` hydrates at page load, making the entire experience editable from the admin panel without code deploys.

### 6. Feature-Based Frontend Architecture
The frontend uses a feature-based module structure (`web/src/features/`) where each feature owns its own components, hooks, and utilities. This enables team-scale development and clear code ownership.

### 7. Production-Grade Middleware Stack
- **Rate Limiting**: Sliding window (100 req/min) prevents abuse
- **Security Headers**: HSTS, X-Content-Type-Options, X-Frame-Options
- **Request Tracing**: Every request gets a UUID via `X-Request-ID`
- **GZip Compression**: Automatic response compression
- **Structured Logging**: Protocol-level logs with correlation IDs

---

## AI Engine Details (16 Sub-Routers)

| Router | Endpoint | Capability |
|--------|----------|------------|
| **Resume Analysis** | `/ai/analyze-resume` | Extract skills, experience, education from PDF |
| **GitHub PR Integration** | `/ai/github/prs` | Fetch and analyze user pull requests |
| **JD-CV Matching** | `/ai/compare-jd-cv` | Deep semantic comparison with match score |
| **Candidate Ranking** | `/ai/match-jd-candidates` | Upload JD → ranked shortlist of candidates |
| **Proof Scoring** | `/ai/calculate-score` | Compute verified Proof Score |
| **Quiz Generation** | `/ai/quiz/generate` | Role-specific skill assessment quizzes |
| **Interview Prep** | `/ai/interview/generate` | AI mock interview questions |
| **Salary Intelligence** | `/ai/salary/estimate` | AI salary benchmarking |
| **Fraud Detection** | `/ai/fraud/check` | Resume fraud scoring |
| **Portfolio Analysis** | `/ai/portfolio/analyze` | Portfolio strength assessment |
| **Soft Skills** | `/ai/soft-skills/assess` | Soft skills evaluation |
| **Skill Graph** | `/ai/skill-graph/build` | Semantic skill relationship mapping |
| **Career Risk** | `/ai/career-risk/analyze` | Career trajectory risk analysis |
| **Simulation** | `/ai/simulation/run` | Hiring scenario simulation |
| **Team Analyzer** | `/ai/team-analyzer/analyze` | Team composition optimization |
| **JD Optimizer** | `/ai/job-optimizer/optimize` | AI-powered JD improvement |
| **Pitch Generator** | `/ai/pitch/generate` | Candidate pitch deck creation |

---

## Database Schema (48 Migrations)

Key tables across the schema:

| Table | Purpose |
|-------|---------|
| `users` | Core user profiles with role, wallet, profile_data |
| `companies` | Company profiles with verification status |
| `jobs` | Job listings with required_skills, status |
| `applications` | Job applications with status tracking |
| `ai_scores` | AI-computed Proof Scores per user |
| `skill_graph_nodes` | Semantic skill relationships |
| `nft_credentials` | On-chain credential records |
| `cms_content` | CMS-managed landing page content |
| `feature_flags` | Feature toggles per user segment |
| `activity_events` | Global audit trail |
| `chat_messages` | Community chat messages |
| `enterprise_api_keys` | Enterprise API access |

All tables use Row-Level Security (RLS) policies for data isolation.

---

## Getting Started

```bash
# Clone and configure
git clone https://github.com/om-prakash16/Skillsutra.git
cd Skillsutra
cp .env.example .env
cp .env.example web/.env.local
# Fill in: SUPABASE_URL, SUPABASE_KEY, GOOGLE_API_KEY

# Quick start
make install    # Install all dependencies
make dev        # Start both servers (3000 + 8000)

# Or manual:
cd server && uvicorn main:app --reload --port 8000
cd web && npm run dev
```

---

## Competitive Landscape

| Feature | LinkedIn | Indeed | SkillSutra |
|---------|----------|--------|------------|
| AI Skill Verification | ✕ | ✕ | ✓ Gemini 1.5 |
| Proof Scores | ✕ | ✕ | ✓ 0-100 scale |
| JD ↔ CV Matching | Basic | Basic | ✓ Semantic AI |
| On-Chain Credentials | ✕ | ✕ | ✓ Solana NFT |
| Resume Fraud Detection | ✕ | ✕ | ✓ AI forensics |
| Admin CMS | ✕ | ✕ | ✓ Full CMS |
| Open API | Limited | Limited | ✓ 100+ endpoints |
| Real-time Analytics | Limited | Limited | ✓ Role-scoped |

---

## Project Metrics

| Metric | Count |
|--------|-------|
| Backend Modules | 25+ |
| AI Sub-Routers | 16 |
| Database Migrations | 48 |
| Frontend Pages | 26 |
| Frontend Feature Modules | 20 |
| API Endpoints | 100+ |
| Lines of SQL Schema | 2,500+ |
