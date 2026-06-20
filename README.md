# SkillSutra Enterprise Platform

An enterprise-grade Search, Discovery, AI Matching & Knowledge Graph platform designed to support 1M+ users and 100K+ concurrent sessions.

## 🚀 Architecture

* **Frontend:** Next.js 14, React, Tailwind CSS, Lucide Icons
* **Backend:** FastAPI, Python 3.11, Pydantic
* **Database:** PostgreSQL (with `pgvector` for AI semantic search)
* **Cache & Queues:** Redis
* **ORM & Migrations:** SQLAlchemy, Alembic
* **Infrastructure:** Docker, Docker Compose, Google Cloud Run, Vercel

## 📦 Core Subsystems

1. **AI Talent Matching:** Integrates with Gemini 1.5 Pro to execute semantic analysis between candidate resumes and job descriptions using HNSW vector indexes.
2. **Mentorship Marketplace:** A robust scheduling and billing engine to book 1-on-1 sessions with Top 1% engineers.
3. **B2B API Gateway:** Allows enterprise partners (like Greenhouse and Workday) to securely sync candidate data using scoped `APIKeys`.
4. **DevOps & Observability:** Fully instrumented with System Health checks, Deployment tracking, and automated Disaster Recovery logs.
5. **Real-Time Messaging & Networking:** A fully functional WebSocket-based chat engine allowing candidates and recruiters to connect, message directly, and update rich profile aesthetics (like LinkedIn-style banners).
6. **Security & Compliance:** Enforces rigid Role-Based Access Control (RBAC), Data Leak Prevention (DLP) middleware, and SOC-2 compliant Audit Ledgers.

---

## 🛠️ Quickstart (Local Development)

We use `make` commands to orchestrate the Docker containers and testing suites.

### 1. Requirements
* Docker Desktop
* Python 3.11+
* Node.js 20+

### 2. Environment Setup
Create a `.env` file in the `server/` directory:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/skillsutra_db
REDIS_URL=redis://localhost:6379/0
JWT_SECRET_KEY=super_secret_key
STRIPE_SECRET_KEY=sk_test_...
GEMINI_API_KEY=AIza...
```

### 3. Start the Platform
Run the entire architecture locally:
```bash
make up
```
This will launch:
* FastAPI Backend on `http://localhost:8000`
* Next.js Frontend on `http://localhost:3000`
* PostgreSQL Database on port `5432`
* Redis Cache on port `6379`

### 4. Database Migrations
Initialize the database tables:
```bash
make migrate
```

### 5. Run Test Suites
Execute the CI/CD test batteries:
```bash
make test
```

---

## 🔒 Security Policy
If you discover a security vulnerability (e.g. a DLP bypass), please DO NOT open a public issue. Email `security@skillsutra.com` directly. We operate a Bug Bounty program.
