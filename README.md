
<div align="center">

  <!-- Professional Badges -->
  <img src="https://img.shields.io/badge/AI_POWERED-Google_Gemini-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/SOLANA-Web3_Integrated-14F195?style=for-the-badge&logo=solana&logoColor=black" alt="Solana" />
  <img src="https://img.shields.io/badge/NEXT.JS_16-Production_Ready-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/FASTAPI-v4.0-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />

  <br />
  <br />

  <h1>🚀 SkillSutra — Verified Identity Engine</h1>
  <h3>AI-Powered Talent Verification & Hiring Platform</h3>

  <p align="center">
    <b>Replace resumes with verifiable "Proof Scores." AI-verified skills. On-chain credentials. Instant talent matching.</b>
  </p>

  <p align="center">
    <a href="#-the-problem">Problem</a> · <a href="#-our-solution">Solution</a> · <a href="#-key-features">Features</a> · <a href="#-architecture">Architecture</a> · <a href="#-quick-start">Quick Start</a> · <a href="#-api-reference">API</a> · <a href="#-demo-walkthrough">Demo</a>
  </p>

</div>

---

## 🎯 The Problem

The global hiring market is fundamentally broken:

| Pain Point | Impact |
|---|---|
| **Resume Fraud** | 78% of resumes contain misleading information (HireRight 2024). Recruiters can't verify claims. |
| **Keyword Matching Fails** | ATS systems reject qualified candidates because resumes lack exact keyword matches. |
| **No Skill Verification** | LinkedIn endorsements are meaningless — anyone can endorse anyone for any skill. |
| **Recruiter Overload** | Hiring managers spend 23 hours screening per hire (Glassdoor). Most time is wasted on unqualified applicants. |
| **Candidate Frustration** | Talented developers apply to 100+ jobs with no feedback. There's no way to *prove* competence. |
| **Bias & Opacity** | Traditional hiring relies on subjective gut-feel, school pedigree, and network connections — not actual ability. |

> **The core issue:** There is no trusted, verifiable, and universally accepted way to prove that someone actually has the skills they claim.

---

## 💡 Our Solution

**SkillSutra** is a full-stack AI-powered hiring platform that replaces traditional resumes with **Proof Scores** — mathematically computed, AI-verified, and optionally blockchain-anchored competency ratings.

### How It Works

```
┌──────────────┐     ┌──────────────────┐     ┌───────────────────┐
│  Candidate   │────▶│  AI Verification │────▶│   Proof Score     │
│  uploads CV  │     │  (Gemini 1.5)    │     │   Generated       │
└──────────────┘     └──────────────────┘     └───────┬───────────┘
                                                       │
                     ┌──────────────────┐              │
                     │  Company posts   │              ▼
                     │  Job Description │────▶ AI Matching Engine
                     └──────────────────┘     (Semantic JD↔CV Match)
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │ Ranked Candidate │
                                              │ Shortlist (98%+) │
                                              └─────────────────┘
```

**For Candidates:** Upload your resume once → get a verified Proof Score → get matched to relevant jobs automatically.

**For Companies:** Post a job → AI analyzes your JD → instantly ranked list of verified, pre-qualified candidates.

**For Admins:** Full governance dashboard — user moderation, CMS, feature flags, analytics, and audit trails.

---

## 🏆 Key Features

### 🧠 AI Verification Engine (Google Gemini 1.5)
- **Resume Analysis**: Extracts skills, experience, education, and computes a forensic confidence score
- **JD ↔ CV Matching**: Deep semantic comparison between job descriptions and candidate profiles
- **AI Candidate Ranking**: Upload a JD PDF → get a ranked shortlist of the best-matching verified candidates
- **Skill Gap Analysis**: Shows candidates exactly which skills they need for a target role
- **Fraud Detection**: AI-powered resume fraud scoring and anomaly detection
- **Interview Prep**: AI generates role-specific mock interview questions
- **Salary Intelligence**: AI-powered salary benchmarking based on skills, experience, and location
- **Career Risk Analysis**: Predicts career trajectory risks and suggests mitigation strategies

### 🔐 Enterprise Authentication & RBAC
- **Google OAuth + Supabase Auth**: Secure SSO with session management
- **Three-Tier Role System**: `User` (candidate) · `Company` (recruiter) · `Admin` (governance)
- **Centralized Guards**: All backend endpoints protected by reusable FastAPI dependency guards
- **JWT Token Management**: Short-lived access tokens with automatic refresh

### 📊 Skill Graph System
- **Semantic Competency Network**: Understands relationships between technologies (React → JavaScript → TypeScript)
- **Project-Linked Skills**: Every project strengthens related Proof Score nodes
- **Visual Skill Timeline**: Interactive journey from junior to senior contributor

### 🏢 Company Hub
- **Job Marketplace**: Post, edit, and manage job listings with required skills
- **Applicant Tracking**: Review applications with AI-powered match scores
- **Talent Pool**: Save and organize promising candidates for future roles
- **Team Analyzer**: AI evaluates team composition and suggests hiring priorities

### 👤 Candidate Dashboard
- **Dynamic Profile**: AI-assisted profile builder with real-time completeness scoring
- **Application Tracking**: Track all job applications and their statuses
- **Credential Verification**: Identity verification with document upload
- **Career Planning**: AI-generated career roadmaps and growth recommendations
- **Assessment System**: Take AI-generated skill assessments to boost Proof Scores

### ⚙️ Admin Governance Panel
- **User Moderation**: View, verify, suspend, and manage all platform users
- **CMS System**: Edit all landing page content, navbar links, and feature text without code deploys
- **Feature Flags**: Enable/disable features per user segment in real-time
- **Schema Builder**: Dynamic profile schema management for custom fields
- **Analytics Dashboard**: Platform-wide metrics, engagement data, and audit logs

### 🔗 Solana Web3 Integration
- **On-Chain Credentials**: Mint verified skills as NFT credentials on Solana (Anchor framework)
- **Wallet Authentication**: Sign-in with Solana wallet (Phantom, Solflare)
- **Solana Blinks/Actions**: Apply to jobs directly from X (Twitter) posts via Solana Actions

### 🎨 Premium UI/UX
- **Motion-First Design**: Framer Motion animations throughout the entire experience
- **Glassmorphic Dark Mode**: Professional, high-contrast interface with depth and blur effects
- **Responsive Layout**: Desktop sidebar + mobile bottom navigation
- **Live Terminal Mockup**: Hero section features an animated AI terminal showcasing real-time verification
- **CMS-Driven Content**: Every landing page section is editable from the admin panel

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS 16 FRONTEND                          │
│                                                                 │
│  ┌──────────────┐  ┌────────────┐  ┌─────────────────────────┐ │
│  │ Auth Context  │  │CMS Context │  │  Feature-Based Modules  │ │
│  │ (Supabase)   │  │ (Live CMS) │  │  20 feature directories │ │
│  └──────┬───────┘  └─────┬──────┘  └────────────┬────────────┘ │
│         │                │                       │              │
│  ┌──────┴────────────────┴───────────────────────┴───────────┐  │
│  │              Domain API Clients (TypeScript)               │  │
│  │  auth-api · user-api · company-api · admin-api · public   │  │
│  └──────────────────────────┬────────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────────┘
                              │ HTTPS / REST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FASTAPI BACKEND (Python)                      │
│                                                                 │
│  Middleware: CORS · Rate Limiting · GZip · Security Headers     │
│  Tracing: X-Request-ID on every response                        │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  25+ Feature Modules (Clean Architecture)                  │ │
│  │                                                            │ │
│  │  auth · users · company · jobs · applications · admin     │ │
│  │  ai (16 sub-routers) · search · analytics · cms           │ │
│  │  notifications · chat · nft · career · enterprise         │ │
│  │  skill_graph · talent_pool · verification · vector        │ │
│  └────────────────────────┬───────────────────────────────────┘ │
└───────────────────────────┼─────────────────────────────────────┘
                            │ Supabase Client
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                SUPABASE (PostgreSQL + Auth + RLS)                │
│                                                                 │
│  48 migrations · Full RLS policies · Row-level security         │
│  Tables: users · companies · jobs · applications · ai_scores   │
│  roles · permissions · cms_content · feature_flags · activity  │
│  skill_graph_nodes · nft_credentials · chat_messages · etc.    │
└─────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | Next.js 16 (App Router) | Server components, streaming, edge-ready |
| **UI Components** | shadcn/ui + Radix UI | Accessible, composable, production-grade |
| **Animations** | Framer Motion | 60fps, gesture-aware motion system |
| **Styling** | Tailwind CSS 4 | Utility-first, design token driven |
| **State** | React Context + TanStack Query | Server state caching + auth context |
| **Backend** | FastAPI (Python 3.11+) | Async, type-safe, auto-documented API |
| **AI Engine** | Google Gemini 1.5 Flash | Fast, accurate, structured JSON output |
| **Database** | Supabase (PostgreSQL) | Real-time, auth, storage, RLS in one |
| **Blockchain** | Solana (Anchor) | Fast, low-cost credential minting |
| **Auth** | Supabase Auth + Google OAuth | Enterprise SSO with JWT sessions |
| **Deployment** | Vercel (Frontend) + Docker | Zero-config, edge-optimized |

### Monorepo Structure

```
SkillSutra/
├── web/                         # Next.js 16 Frontend
│   └── src/
│       ├── app/                 # 26 route segments (pages)
│       ├── components/          # Shared UI library (shadcn/ui)
│       ├── context/             # Auth + CMS React contexts
│       ├── features/            # 20 feature modules
│       ├── hooks/               # Custom React hooks
│       └── lib/                 # API clients, validators, utils
│
├── server/                      # FastAPI Backend (Python)
│   ├── main.py                  # App factory with middleware stack
│   ├── core/                    # Config, logging, exceptions, cache
│   ├── api/v1/router.py         # Centralized API v1 router
│   ├── db/engine.py             # Async database engine
│   └── modules/                 # 25+ feature modules
│       └── ai/                  # 16 AI sub-routers + services
│
├── database/
│   └── migrations/              # 48 sequential SQL migrations
│
├── contracts/                   # Solana Anchor programs (Rust)
│   └── solana_anchor_programs/
│
├── docker-compose.yml           # Local dev orchestration
├── Makefile                     # Dev shortcuts
└── .env.example                 # Environment template
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.11+ and **pip**
- **Supabase** account (free tier works)
- **Google AI API Key** (for Gemini features)

### 1. Clone & Configure

```bash
git clone https://github.com/om-prakash16/Skillsutra.git
cd Skillsutra

# Copy environment templates
cp .env.example .env
cp .env.example web/.env.local

# Fill in your credentials:
#   SUPABASE_URL, SUPABASE_KEY, GOOGLE_API_KEY
#   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 2. Automated Setup (Recommended)

```bash
make install    # Installs web + server dependencies
make dev        # Starts both dev servers (ports 3000 + 8000)
```

### 3. Manual Setup

**Backend (port 8000):**
```bash
cd server
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend (port 3000):**
```bash
cd web
npm install
npm run dev
```

### 4. Database Setup

Run migrations in order through the Supabase SQL editor, or use:
```bash
supabase db push
```

### 5. Verify Installation

- Frontend: http://localhost:3000
- Backend API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

---

## 📡 API Reference

All endpoints are versioned under `/api/v1/`. Interactive documentation is available at `/docs` in development mode.

### Core Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/v1/auth/login` | Wallet-based login + JWT issuance | Public |
| `POST` | `/api/v1/auth/google` | Google OAuth callback | Public |
| `GET` | `/api/v1/profile/me` | Get current user profile | User |
| `PUT` | `/api/v1/profile/update` | Update candidate profile | User |
| `POST` | `/api/v1/company/create` | Register a new company | User |
| `POST` | `/api/v1/jobs/create` | Post a new job listing | Company |
| `GET` | `/api/v1/jobs/` | Browse all active jobs | Public |
| `POST` | `/api/v1/applications/apply` | Submit job application | User |

### AI Endpoints (16 Sub-Routers)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/ai/analyze-resume` | AI resume parsing + scoring |
| `POST` | `/api/v1/ai/compare-jd-cv` | Semantic JD ↔ CV match |
| `POST` | `/api/v1/ai/match-jd-candidates` | AI candidate ranking by JD |
| `POST` | `/api/v1/ai/calculate-score` | Recalculate Proof Score |
| `POST` | `/api/v1/ai/quiz/generate` | Generate skill assessment quiz |
| `POST` | `/api/v1/ai/interview/generate` | AI mock interview questions |
| `POST` | `/api/v1/ai/salary/estimate` | AI salary benchmarking |
| `POST` | `/api/v1/ai/fraud/check` | Resume fraud detection |
| `POST` | `/api/v1/ai/portfolio/analyze` | Portfolio strength analysis |
| `POST` | `/api/v1/ai/soft-skills/assess` | Soft skills evaluation |
| `POST` | `/api/v1/ai/skill-graph/build` | Build semantic skill graph |
| `POST` | `/api/v1/ai/career-risk/analyze` | Career trajectory risk analysis |
| `POST` | `/api/v1/ai/simulation/run` | Simulate hiring scenarios |
| `POST` | `/api/v1/ai/team-analyzer/analyze` | Team composition analysis |
| `POST` | `/api/v1/ai/job-optimizer/optimize` | AI-powered JD optimization |
| `POST` | `/api/v1/ai/pitch/generate` | Generate candidate pitch deck |

### Admin & Governance

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/admin/users` | List all platform users |
| `PATCH` | `/api/v1/admin/users/{id}/verify` | Verify a user |
| `PATCH` | `/api/v1/admin/companies/{id}/verify` | Verify a company |
| `GET` | `/api/v1/cms/content` | Get CMS content |
| `PUT` | `/api/v1/cms/content` | Update CMS content |

---

## 🎬 Demo Walkthrough

### For Candidates (Job Seekers)

1. **Sign Up** → Click "Sign in with Google" to create your account
2. **Verify Skills** → Navigate to `/verify` and upload your resume (PDF)
3. **View Proof Score** → AI analyzes your resume and generates a verified Proof Score
4. **Browse Jobs** → Go to `/jobs` to see all active job listings
5. **Apply** → Click any job → "Apply Now" with your verified profile
6. **Track Applications** → View all your applications at `/user/applications`
7. **Career Growth** → Get AI-powered career advice at `/career-advice`

### For Companies (Recruiters)

1. **Create Company** → Register your company through the company panel
2. **Post Jobs** → Navigate to `/company/jobs/create` and fill in job details
3. **AI Matching** → Upload a JD PDF on the `/talent` page → get ranked candidates
4. **Review Applicants** → See applications with AI match scores at `/company/jobs/{id}/applicants`
5. **Save Talent** → Bookmark promising candidates to your talent pool
6. **Manage Jobs** → Edit, close, or repost jobs from `/company/manage-jobs`

### For Admins

1. **Dashboard** → Full platform overview with key metrics
2. **User Management** → Verify, suspend, or promote users
3. **CMS** → Edit all landing page content live (no code deploy needed)
4. **Feature Flags** → Toggle features per user segment
5. **Analytics** → View platform-wide engagement and hiring metrics

---

## 🔒 Security Features

- **HTTPS Only**: Strict-Transport-Security headers on all responses
- **Rate Limiting**: Sliding window (100 req/min per IP) prevents abuse
- **CORS Whitelisting**: Only approved origins can access the API
- **Security Headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`
- **Request Tracing**: Every request gets a unique `X-Request-ID` for debugging
- **GZip Compression**: Automatic response compression for performance
- **Row-Level Security**: Supabase RLS policies enforce data isolation at the database level
- **Input Validation**: Pydantic schemas validate every request body

---

## 🛠️ Development

### Docker Development

```bash
docker-compose up -d          # Start all services
docker-compose logs -f         # Follow logs
docker-compose down            # Stop everything
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | ✅ | Your Supabase project URL |
| `SUPABASE_KEY` | ✅ | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (backend) |
| `GOOGLE_API_KEY` | ✅ | Google Gemini API key |
| `JWT_SECRET` | ✅ | Secret for signing JWT tokens |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase URL (frontend) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key (frontend) |
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API URL |
| `SOLANA_NETWORK` | Optional | `devnet` / `mainnet-beta` |
| `SOLANA_RPC_URL` | Optional | Custom Solana RPC endpoint |

### Port Allocation

| Service | Port | Description |
|---------|------|-------------|
| Next.js Frontend | `3000` | Web application |
| FastAPI Backend | `8000` | REST API server |
| Supabase | Cloud | Managed PostgreSQL |

---

## 📊 Project Metrics

| Metric | Count |
|--------|-------|
| **Backend Modules** | 25+ feature modules |
| **AI Sub-Routers** | 16 specialized AI endpoints |
| **Database Migrations** | 48 SQL migration files |
| **Frontend Pages** | 26 route segments |
| **Frontend Features** | 20 feature modules |
| **API Endpoints** | 100+ REST endpoints |
| **Lines of SQL Schema** | 2,500+ |

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

1. Follow the module pattern in `server/modules/` for new backend features
2. Add corresponding API bindings in `web/src/lib/api/`
3. Create feature modules in `web/src/features/` for new UI
4. Run `npm run build` in `web/` to verify before pushing

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  <b>Built with ❤️ by Om Prakash Kumar</b>
  <br />
  <i>Turning hiring from guesswork into science.</i>
</p>
