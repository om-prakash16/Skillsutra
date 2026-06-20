# SkillSutra Production Deployment Guide

This document outlines the standard operating procedure (SOP) for deploying the SkillSutra platform to production using our Continuous Deployment (CD) pipelines.

## 1. Architecture Overview

- **Frontend (Next.js)**: Hosted on [Vercel](https://vercel.com).
- **Backend (FastAPI)**: Containerized via Docker and hosted on **Google Cloud Run**.
- **Database (PostgreSQL)**: Managed Google Cloud SQL instance.
- **Cache (Redis)**: Managed Google Memorystore.

---

## 2. CI/CD Pipeline Flow

1. **Pull Request created**: GitHub Actions runs the `ci.yml` workflow (Pytest, Jest, Linting).
2. **Merge to `main`**: 
   - `cd-frontend.yml` triggers Vercel to build and deploy the React bundle.
   - `cd-backend.yml` triggers Docker to build the FastAPI image, pushes to Google Artifact Registry, and deploys to Cloud Run.

---

## 3. Database Migrations in Production

When new database models are added, you must run Alembic migrations **before** the new Cloud Run instances boot up, or else they will fail to find the tables.

### Step 1: Generate the migration locally
```bash
cd server
alembic revision --autogenerate -m "Added User.stripe_customer_id"
```

### Step 2: Push code to `main`
Merge your code. The CI/CD pipeline will begin building the images.

### Step 3: Run migration against Production DB
Connect to your Cloud SQL instance via proxy and apply the migration:
```bash
export DATABASE_URL="postgresql://user:pass@127.0.0.1:5432/skillsutra_db"
alembic upgrade head
```

---

## 4. Environment Variables and Secrets

### Vercel (Frontend)
Manage secrets in the Vercel Dashboard -> Project Settings -> Environment Variables.
- `NEXT_PUBLIC_API_URL`: https://api.skillsutra.com
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: (OAuth key)

### Google Cloud Run (Backend)
Manage secrets using Google Cloud Secret Manager. The `cd-backend.yml` pulls these automatically:
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET_KEY`
- `STRIPE_API_KEY`

---

## 5. Rollback Procedures

If a deployment introduces a critical bug:

### Frontend Rollback
1. Go to Vercel Dashboard -> Deployments.
2. Find the last stable deployment.
3. Click the 3 dots -> **Promote to Production**.
*(Vercel does this instantly without a rebuild).*

### Backend Rollback
1. Go to Google Cloud Console -> Cloud Run -> Revisions.
2. Select the previous stable revision.
3. Click **Manage Traffic** and route 100% of traffic back to the old revision.
*(Cloud Run does this instantly).*

### Database Rollback
If you need to revert a database migration:
```bash
alembic downgrade -1
```
> **Warning**: Downgrading a database can result in data loss. Ensure you have backed up the database before executing a downgrade.
