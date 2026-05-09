from fastapi import APIRouter

from modules.auth.api.router import router as auth_router
from modules.users.api.router import router as users_router
from modules.company.api.router import router as company_router
from modules.jobs.api.router import router as jobs_router
from modules.applications.router import router as applications_router
from modules.ai.router import router as ai_router
from modules.cms.router import router as cms_router
from modules.notifications.api.router import router as notifications_router
from modules.analytics.router import router as analytics_router
from modules.chat.router import router as chat_router

v1_router = APIRouter()

v1_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
v1_router.include_router(users_router, prefix="/profile", tags=["User Profiles"])
v1_router.include_router(company_router, prefix="/company", tags=["Company Hub"])
v1_router.include_router(jobs_router, prefix="/jobs", tags=["Jobs Marketplace"])
v1_router.include_router(applications_router, prefix="/applications", tags=["Applications"])
v1_router.include_router(ai_router, prefix="/ai", tags=["AI Reasoning Engine"])
v1_router.include_router(cms_router, prefix="/cms", tags=["CMS Content"])
v1_router.include_router(notifications_router, prefix="/notifications", tags=["Notifications"])
v1_router.include_router(analytics_router, prefix="/analytics", tags=["Performance Metrics"])
v1_router.include_router(chat_router, prefix="/chat", tags=["Direct Communication"])
