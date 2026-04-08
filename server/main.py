from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 13 High-Assurance SaaS Modules
from modules.auth.router import router as auth_router
from modules.users.router import router as users_router
from modules.ai.router import router as ai_router
from modules.company.router import router as company_router
from modules.jobs.router import router as jobs_router
from modules.applications.router import router as applications_router
from modules.nft.router import router as nft_router
from modules.search.router import router as search_router
from modules.notifications.router import router as notifications_router
from modules.activity.router import router as activity_router
from modules.analytics.router import router as analytics_router
from modules.sync.router import router as sync_router
from modules.admin.router import router as admin_router
from modules.cms.router import router as cms_router

app = FastAPI(
    title="this best hiring tool Enterprise API",
    description="Unified modular API for Web3 AI Hiring & SaaS Workforce Management",
    version="3.0.0"
)

# CORS Middleware for Elite Gateway Parity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root API Mapping (Standardized v1 prefixes)
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/v1/profile", tags=["Profile Management"])
app.include_router(ai_router, prefix="/api/v1/ai", tags=["AI Reasoning Engine"])
app.include_router(company_router, prefix="/api/v1/company", tags=["Company Workspace"])
app.include_router(jobs_router, prefix="/api/v1/jobs", tags=["Job Marketplace"])
app.include_router(applications_router, prefix="/api/v1/applications", tags=["Hiring Lifecycle"])
app.include_router(nft_router, prefix="/api/v1/nft", tags=["On-Chain Records"])
app.include_router(search_router, prefix="/api/v1/search", tags=["Discovery & Filtering"])
app.include_router(notifications_router, prefix="/api/v1/notifications", tags=["System Alerts"])
app.include_router(activity_router, prefix="/api/v1/activity", tags=["Audit Logs"])
app.include_router(analytics_router, prefix="/api/v1/analytics", tags=["Insights & Metrics"])
app.include_router(sync_router, prefix="/api/v1/sync", tags=["Blockchain Sync"])
app.include_router(admin_router, prefix="/api/v1/admin", tags=["Platform Governance"])
app.include_router(cms_router, prefix="/api/v1/cms", tags=["CMS Orchestration"])

@app.get("/")
def read_root():
    return {
        "status": "online",
        "platform": "this best hiring tool",
        "api_version": "3.0.0",
        "modules": 14,
        "docs": "/docs"
    }
