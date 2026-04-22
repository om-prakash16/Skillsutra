# Best Hiring Tool — Enterprise Hiring Platform

A full-stack, enterprise-grade hiring platform built for the modern Web3 talent economy. Companies can post jobs and verify talent, candidates can build verifiable on-chain profiles, and administrators manage the platform through a real-time CMS.

**Stack**: Next.js 16 · FastAPI · Supabase (PostgreSQL) · Solana Web3.js · Framer Motion

---

## Repository Structure

```
/
├── web/                        # Next.js 16 frontend (App Router)
│   └── src/
│       ├── app/                # Route segments (pages & layouts)
│       │   ├── auth/           # Login & registration flows
│       │   ├── user/           # Candidate dashboard (auth-guarded)
│       │   ├── dashboard/
│       │   │   ├── candidate/  # Profile, skills, activity timeline
│       │   │   └── company/    # Recruiter dashboard, applicants
│       │   ├── company/        # Company panel (role-guarded)
│       │   └── admin/          # Admin panel (admin-only)
│       ├── components/         # Shared UI component library (shadcn/ui + custom)
│       │   ├── auth/           # Role selector, wallet connection
│       │   ├── admin/          # Admin-specific components
│       │   ├── layout/         # Navbar, sidebar, footer
│       │   └── ui/             # Atomic UI: Button, Card, Input, Badge, Table...
│       ├── context/            # React Context providers
│       │   ├── auth-context.tsx    # Solana wallet auth + JWT session state
│       │   └── cms-context.tsx     # Live CMS content hydration
│       ├── hooks/
│       │   ├── useRoleGuard.ts     # Client-side RBAC enforcement
│       │   ├── useFeatureFlags.tsx  # Feature flag checks
│       │   └── useSyncManager.ts   # Data sync management
│       └── lib/
│           ├── api/                # Domain-specific API clients
│           │   ├── api-client.ts   # Base fetchWithAuth + unified `api` object
│           │   ├── auth-api.ts     # Auth control plane
│           │   ├── user-api.ts     # User/Candidate control plane
│           │   ├── company-api.ts  # Company/Recruiter control plane
│           │   ├── admin-api.ts    # Admin control plane
│           │   └── public-api.ts   # Unauthenticated endpoints
│           └── validations/        # Zod schema definitions
│
├── server/                     # FastAPI backend (Python 3.11+)
│   ├── main.py                 # App factory, CORS, router registration
│   ├── core/
│   │   ├── supabase.py         # Supabase client singleton
│   │   └── events.py           # Async event bus for side effects
│   └── modules/                # Feature-scoped routers & services
│       ├── auth/               # Authentication & RBAC
│       │   ├── router.py       # Wallet login, JWT issuance
│       │   ├── service.py      # Token verification, permission checks
│       │   ├── guards.py       # Role-based dependency guards
│       │   ├── models.py       # Auth schemas
│       │   ├── handlers.py     # Event handlers (welcome email, etc.)
│       │   ├── mailer.py       # Email service
│       │   └── enterprise_auth.py  # Enterprise SSO / API key auth
│       ├── users/              # ── USER CONTROL PLANE ──
│       │   ├── router.py       # Profile CRUD, skills, portfolio
│       │   ├── service.py      # User business logic
│       │   ├── identity_router.py  # Identity verification
│       │   └── ...             # Identity & portfolio services
│       ├── company/            # ── COMPANY CONTROL PLANE ──
│       │   └── router.py       # Company create, team, invites
│       ├── admin/              # ── ADMIN CONTROL PLANE ──
│       │   ├── router.py       # Platform governance (824 lines)
│       │   ├── service.py      # Admin business logic
│       │   ├── models.py       # All admin Pydantic schemas (single source)
│       │   ├── feature_router.py   # Feature flag CRUD
│       │   └── feature_service.py  # Feature flag logic + cache
│       ├── jobs/               # Shared: Company posts, User applies
│       ├── applications/       # Shared: Company reviews, User submits
│       ├── ai/                 # AI services (18 sub-routers)
│       ├── analytics/          # Role-scoped analytics
│       ├── activity/           # Multi-actor event stream
│       ├── cms/                # Admin-facing content management
│       ├── notifications/      # In-app notification delivery
│       ├── search/             # Full-text candidate & job search
│       ├── sync/               # Profile sync & data reconciliation
│       ├── nft/                # On-chain credential minting (Solana)
│       ├── career/             # Career planning & goals
│       ├── chat/               # Community chat (WebSocket)
│       └── enterprise/         # Enterprise API (API key auth)
│
├── database/
│   └── migrations/             # 38 ordered SQL migrations
│       ├── 01_initial_schema.sql
│       ├── 02_rbac_schema.sql
│       ├── ...
│       └── 99_master_schema_parity.sql
│
├── contracts/                  # Solana programs (Anchor framework)
├── docker-compose.yml          # Local dev environment orchestration
├── Makefile                    # Dev shortcuts: `make dev`, `make migrate`
└── .env.example                # Required environment variables template
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│              Next.js Frontend                        │
│                                                     │
│  ┌─────────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ auth-context │  │cms-context│  │ useRoleGuard │  │
│  └──────┬──────┘  └─────┬────┘  └──────┬───────┘  │
│         │                │              │           │
│  ┌──────┴────────────────┴──────────────┴────────┐  │
│  │           Domain API Clients                   │  │
│  │  auth-api | user-api | company-api | admin-api │  │
│  └──────────────────┬────────────────────────────┘  │
└─────────────────────┼───────────────────────────────┘
                      │ HTTPS / REST
                      ▼
┌─────────────────────────────────────────────────────┐
│              FastAPI Backend                          │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  Auth Guards (guards.py)                     │    │
│  │  require_admin | require_company | require_user │ │
│  └──────────┬──────────────────────────────────┘    │
│             │                                       │
│  ┌──────────┼──────────────────────────────────┐    │
│  │  Control Planes:                             │    │
│  │  /api/v1/auth/*     → Auth (wallet + JWT)    │    │
│  │  /api/v1/profile/*  → User (candidate)       │    │
│  │  /api/v1/company/*  → Company (recruiter)    │    │
│  │  /api/v1/admin/*    → Admin (governance)     │    │
│  │  /api/v1/jobs/*     → Shared (all roles)     │    │
│  │  /api/v1/ai/*       → Shared (AI services)   │    │
│  └──────────┬──────────────────────────────────┘    │
└─────────────┼───────────────────────────────────────┘
              │ Supabase Client
              ▼
┌─────────────────────────────────────────────────────┐
│           Supabase (PostgreSQL)                       │
│  users · companies · jobs · applications              │
│  roles · user_roles · permissions                     │
│  cms_content · feature_flags · platform_settings      │
└─────────────────────────────────────────────────────┘
```

---

## Control Plane Architecture

### 🔐 Auth Control Plane
- **Backend**: `modules/auth/` — Wallet login, JWT issuance, signature verification
- **Frontend**: `context/auth-context.tsx` + `middleware.ts`
- **Guards**: `guards.py` — `require_admin`, `require_company`, `require_user`

### 👤 User/Candidate Control Plane
- **Backend**: `modules/users/` — Profile, skills, portfolio, identity
- **Frontend**: `/user/*`, `/dashboard/candidate/*`
- **API Client**: `lib/api/user-api.ts`

### 🏢 Company/Recruiter Control Plane
- **Backend**: `modules/company/` + `modules/jobs/` (company endpoints)
- **Frontend**: `/company/*`, `/dashboard/company/*`
- **API Client**: `lib/api/company-api.ts`

### ⚙️ Admin Control Plane
- **Backend**: `modules/admin/` — User moderation, schema builder, feature flags, audit
- **Frontend**: `/admin/*`
- **API Client**: `lib/api/admin-api.ts`

---

## Key Design Decisions

### 1. Wallet-First Authentication
Authentication is anchored to Solana wallet addresses. On first login, a wallet signs a challenge message; the backend verifies the signature, creates a user record, and issues a short-lived JWT. The role (`USER` / `COMPANY` / `ADMIN`) is embedded in the token and stored in the `users` table.

### 2. Centralized RBAC Guards
Role enforcement is handled by reusable FastAPI dependencies in `auth/guards.py`. Every protected endpoint uses one of `require_admin`, `require_company`, or `get_current_user` — never inline role checks.

### 3. Domain-Specific API Clients
The frontend uses separate API modules per control plane (`auth-api.ts`, `user-api.ts`, `company-api.ts`, `admin-api.ts`, `public-api.ts`). A unified `api` object in `api-client.ts` is preserved for backward compatibility.

### 4. Dynamic Content via CMS Context
Landing page copy, navbar links, and feature flags are stored in a `cms_content` table and served via `/api/v1/cms`. The React `CmsContext` hydrates this at page load, making the entire landing experience editable from the admin panel without a code deploy.

### 5. Role-Aware Company Verification
Newly created companies are initialized with `verified = false`. An admin must explicitly promote a company via `PATCH /admin/companies/{id}/verify`.

### 6. Real-Time Activity Intelligence
Every lifecycle event is tracked in `activity_events`. Role-scoped timelines provide candidates with personal activity, companies with engagement forensics, and admins with a global audit trail.

---

## Getting Started

```bash
# Clone and set up environment
cp .env.example .env          # and fill in values
cp web/.env.example web/.env.local

# Backend
cd server && pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend
cd web && npm install
npm run dev                   # http://localhost:3000

# Or, spin everything up together
make dev
```

**Required environment variables**: `SUPABASE_URL`, `SUPABASE_KEY`, `JWT_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`

---

## Running Database Migrations

Migrations live in `database/migrations/` and are numbered sequentially. Run them in order through the Supabase dashboard SQL editor, or with the Supabase CLI:

```bash
supabase db push
```

---

## Contributing

Pull requests are welcome. Open an issue first for major changes. Ensure any new backend routes follow the module pattern in `server/modules/` and add corresponding API bindings in the appropriate domain API client (`web/src/lib/api/`).
