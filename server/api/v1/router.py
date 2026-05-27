from fastapi import APIRouter

from api.v1.auth import router as auth_router
from modules.users.api.router import router as users_router
from modules.profile.router import router as profile_router
from modules.company.api.router import router as company_router
from modules.jobs.api.router import router as jobs_router
from modules.applications.router import router as applications_router
from modules.ai.router import router as ai_router
from modules.cms.router import router as cms_router
from modules.notifications.api.router import router as notifications_router
from modules.identity.api.router import router as identity_router
from modules.analytics.router import router as analytics_router
from modules.chat.router import router as chat_router
from modules.admin.api.router import router as admin_router
from modules.admin.api.feature_router import router as feature_router
from modules.admin.api.db_proxy import router as db_proxy_router
from modules.users.api.github_integration import router as github_router
from modules.challenges.router import router as challenges_router
from modules.career.router import router as career_router
from modules.skill_graph.router import router as skill_graph_router
from modules.search.router import router as search_router
from modules.projects.router import router as projects_router
from modules.activity.router import router as activity_router
from modules.competitions.router import router as competitions_router
from modules.learning.router import router as learning_router
from modules.community.router import router as community_router
from modules.admin.api.recruiter_router import router as recruiter_router
from modules.gamification.router import router as gamification_router
from modules.ecosystem.contests_router import router as contests_router
from modules.ecosystem.gigs_router import router as gigs_router
from modules.ecosystem.habits_router import router as habits_router
from modules.ecosystem.feed_router import router as feed_router
from modules.portfolio.router import router as portfolio_router
from modules.workspaces.router import router as workspaces_router

from api.routers.resume import router as resume_router
from api.routers.cover_letter import router as cover_letter_router
from api.routers.social import router as social_router

v1_router = APIRouter()
v1_router.include_router(resume_router, prefix="", tags=["AI Resume Builder"])
v1_router.include_router(cover_letter_router, prefix="", tags=["AI Cover Letter Generator"])
v1_router.include_router(social_router, prefix="", tags=["Social Networking"])

v1_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
v1_router.include_router(identity_router, prefix="/identity", tags=["Identity"])
v1_router.include_router(users_router, prefix="/users", tags=["Users Base"])
v1_router.include_router(profile_router, prefix="/profile", tags=["Talent Profiles"])
v1_router.include_router(company_router, prefix="/company", tags=["Company Hub"])
v1_router.include_router(jobs_router, prefix="/jobs", tags=["Jobs Marketplace"])
v1_router.include_router(applications_router, prefix="/applications", tags=["Applications"])
v1_router.include_router(ai_router, prefix="/ai", tags=["AI Reasoning Engine"])
v1_router.include_router(cms_router, prefix="/cms", tags=["CMS Content"])
v1_router.include_router(notifications_router, prefix="/notifications", tags=["Notifications"])
v1_router.include_router(analytics_router, prefix="/analytics", tags=["Performance Metrics"])
v1_router.include_router(chat_router, prefix="/chat", tags=["Direct Communication"])
v1_router.include_router(admin_router, prefix="/admin", tags=["Admin Control Panel"])
v1_router.include_router(feature_router, prefix="/admin/features", tags=["Admin Features"])
v1_router.include_router(db_proxy_router, prefix="/db", tags=["Database Proxy"])
v1_router.include_router(github_router, prefix="/github", tags=["GitHub Integration"])
v1_router.include_router(challenges_router, prefix="/challenges", tags=["Coding Challenges"])
v1_router.include_router(career_router, prefix="/career", tags=["Career Development"])
v1_router.include_router(skill_graph_router, prefix="/skills", tags=["Skills & Taxonomy"])
v1_router.include_router(search_router, prefix="/search", tags=["Global Search"])
v1_router.include_router(projects_router, prefix="/projects", tags=["Project Ledger"])
v1_router.include_router(activity_router, prefix="/activity", tags=["Activity Ledger"])
v1_router.include_router(competitions_router, prefix="/competitions", tags=["Hackathons & Teams"])
v1_router.include_router(learning_router, prefix="/learning", tags=["Learning & Growth"])
v1_router.include_router(community_router, prefix="/community", tags=["Community Forum"])
v1_router.include_router(recruiter_router)
v1_router.include_router(gamification_router)
v1_router.include_router(contests_router)
v1_router.include_router(gigs_router)
v1_router.include_router(habits_router)
v1_router.include_router(feed_router)
v1_router.include_router(portfolio_router)
v1_router.include_router(workspaces_router)
