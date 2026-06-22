from fastapi import APIRouter

from api.v1.auth_router import router as auth_router
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
from modules.messages.router import router as messages_router
from modules.admin.api.router import router as admin_router
from modules.admin.api.feature_router import router as feature_router
from modules.admin.api.db_proxy import router as db_proxy_router
from modules.users.api.github_integration import router as github_router
from modules.challenges.router import router as challenges_router
from modules.career.router import router as career_router
from modules.career.os_router import router as os_router
from modules.skill_graph.router import router as skill_graph_router
from modules.search.router import router as search_router
from modules.projects.router import router as projects_router
from modules.activity.router import router as activity_router
from modules.competitions.router import router as competitions_router
from modules.learning.router import router as learning_router
from fastapi import APIRouter

from api.v1.auth_router import router as auth_router
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
from modules.identity.api.admin_users_router import router as admin_users_router
from modules.identity.api.admin_orgs_router import router as admin_orgs_router
from modules.identity.api.admin_roles_router import router as admin_roles_router
from modules.identity.api.admin_apikeys_router import router as admin_apikeys_router
from modules.identity.api.admin_sessions_router import router as admin_sessions_router
from modules.identity.api.admin_invitations_router import router as admin_invitations_router
from modules.identity.api.admin_teams_router import router as admin_teams_router
from modules.identity.api.admin_mfa_router import router as admin_mfa_router
from modules.identity.api.admin_verification_router import router as admin_verification_router
from modules.identity.api.admin_devices_router import router as admin_devices_router
from modules.identity.api.admin_oauth_router import router as admin_oauth_router
from modules.identity.api.admin_service_accounts_router import router as admin_service_accounts_router
from modules.identity.api.admin_login_history_router import router as admin_login_history_router
from modules.identity.api.admin_security_events_router import router as admin_security_events_router
from modules.identity.api.admin_impersonation_router import router as admin_impersonation_router
from modules.identity.api.admin_audit_router import router as admin_audit_router
from modules.identity.api.admin_identity_metrics_router import router as admin_identity_metrics_router
from modules.chat.router import router as chat_router
from modules.messages.router import router as messages_router
from modules.admin.api.router import router as admin_router
from modules.admin.api.feature_router import router as feature_router
from modules.admin.api.secrets_router import router as secrets_router
from modules.admin.api.db_proxy import router as db_proxy_router
from modules.users.api.github_integration import router as github_router
from modules.challenges.router import router as challenges_router
from modules.career.router import router as career_router
from modules.career.os_router import router as os_router
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
from modules.feed.router import router as social_feed_router
from modules.portfolio.router import router as portfolio_router
from modules.workspaces.router import router as workspaces_router
from modules.blog.router import router as blog_router
from modules.builder.router import router as builder_router
from api.v1.navigation import router as navigation_router

from api.routers.resume import router as resume_router
from api.routers.cover_letter import router as cover_letter_router
from api.routers.social import router as social_router
from api.routers.security import router as security_router
from api.v1.sessions_router import router as active_sessions_router
from api.v1.auth.mfa_router import router as mfa_router
from modules.security.api.router import router as security_lockdown_router

v1_router = APIRouter()
v1_router.include_router(blog_router)
v1_router.include_router(resume_router, prefix="", tags=["AI Resume Builder"])
v1_router.include_router(cover_letter_router, prefix="", tags=["AI Cover Letter Generator"])
v1_router.include_router(social_router, prefix="", tags=["Social Networking"])
v1_router.include_router(security_router, prefix="", tags=["Security Center"])
v1_router.include_router(security_lockdown_router)
v1_router.include_router(navigation_router)

from api.v1.public_profile import router as public_profile_router
from api.v1.integrations import router as integrations_router

v1_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
v1_router.include_router(active_sessions_router, prefix="/auth/sessions", tags=["Session Management"])
v1_router.include_router(mfa_router, prefix="/auth/mfa", tags=["MFA Management"])
v1_router.include_router(identity_router, prefix="/identity", tags=["Identity"])
v1_router.include_router(admin_users_router)
v1_router.include_router(admin_orgs_router)
v1_router.include_router(admin_roles_router)
v1_router.include_router(admin_apikeys_router)
v1_router.include_router(admin_sessions_router)
v1_router.include_router(admin_invitations_router)
v1_router.include_router(admin_teams_router)
v1_router.include_router(admin_mfa_router)
v1_router.include_router(admin_verification_router)
v1_router.include_router(admin_devices_router)
v1_router.include_router(admin_oauth_router)
v1_router.include_router(admin_service_accounts_router)
v1_router.include_router(admin_login_history_router)
v1_router.include_router(admin_security_events_router)
v1_router.include_router(admin_impersonation_router)
v1_router.include_router(admin_audit_router)
v1_router.include_router(admin_identity_metrics_router)
v1_router.include_router(users_router, prefix="/users", tags=["Users Base"])
v1_router.include_router(profile_router, prefix="/profile", tags=["Talent Profiles"])
v1_router.include_router(public_profile_router, prefix="/profiles", tags=["Public Profiles"])
v1_router.include_router(company_router, prefix="/company", tags=["Company Hub"])
v1_router.include_router(jobs_router, prefix="/jobs", tags=["Jobs Marketplace"])
v1_router.include_router(applications_router, prefix="/applications", tags=["Applications"])
v1_router.include_router(ai_router, prefix="/ai", tags=["AI Reasoning Engine"])
v1_router.include_router(cms_router, prefix="/cms", tags=["CMS Content"])
v1_router.include_router(builder_router, prefix="/builder", tags=["Visual Builder Core"])
v1_router.include_router(notifications_router, prefix="/notifications", tags=["Notifications"])
v1_router.include_router(analytics_router, prefix="/analytics", tags=["Performance Metrics"])
v1_router.include_router(chat_router, prefix="/chat", tags=["Direct Communication"])
v1_router.include_router(messages_router, prefix="/messages", tags=["Direct Messaging"])
v1_router.include_router(admin_router, prefix="/superadmin", tags=["Super Admin Control Panel"])

from modules.admin.api.quick_actions import router as quick_actions_router
v1_router.include_router(quick_actions_router, prefix="/superadmin/quick-actions", tags=["Super Admin Quick Actions"])

from modules.admin.api.roles_router import router as superadmin_roles_router
from modules.admin.api.members_router import router as superadmin_members_router
v1_router.include_router(superadmin_roles_router, prefix="/superadmin/roles", tags=["Super Admin Roles"])
v1_router.include_router(superadmin_members_router, prefix="/superadmin/members", tags=["Super Admin Members"])

v1_router.include_router(feature_router, prefix="/superadmin/features", tags=["Super Admin Features"])
v1_router.include_router(secrets_router, prefix="/superadmin/secrets", tags=["Super Admin Secrets"])
v1_router.include_router(db_proxy_router, prefix="/db", tags=["Database Proxy"])
v1_router.include_router(integrations_router, prefix="/integrations", tags=["Developer Platforms Sync"])
v1_router.include_router(github_router, prefix="/github", tags=["GitHub Integration"])
v1_router.include_router(challenges_router, prefix="/challenges", tags=["Coding Challenges"])
v1_router.include_router(career_router, prefix="/career", tags=["Career Development"])
v1_router.include_router(os_router, prefix="/os", tags=["Career OS"])
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
v1_router.include_router(social_feed_router, prefix="/feed", tags=["Social Feed Posts"])
v1_router.include_router(portfolio_router)
v1_router.include_router(workspaces_router)

from modules.workflow.router import router as workflow_router
v1_router.include_router(workflow_router, prefix="/workflows", tags=["Workflow Automation"])

from modules.operations.health_router import router as health_router
v1_router.include_router(health_router, prefix="/ops", tags=["Operations & Health"])

from modules.design.router import router as design_router
v1_router.include_router(design_router, prefix="/design", tags=["Design System"])

from modules.media.router import router as media_router
v1_router.include_router(media_router, prefix="/media", tags=["Media DAM"])

from modules.collaboration.router import router as collaboration_router
v1_router.include_router(collaboration_router, prefix="/collaboration", tags=["Collaboration System"])

from modules.delivery.router import router as delivery_router
from modules.delivery.admin_router import admin_delivery_router
v1_router.include_router(delivery_router, prefix="/delivery", tags=["Content Delivery & Routing"])
v1_router.include_router(admin_delivery_router)

from modules.ats.router import router as ats_router
v1_router.include_router(ats_router, prefix="/ats", tags=["Applicant Tracking System (ATS)"])

from modules.crm.router import router as crm_router
v1_router.include_router(crm_router, prefix="/crm", tags=["Talent CRM"])

from modules.talent.router import router as talent_router
v1_router.include_router(talent_router, prefix="/talent", tags=["Talent Identity Platform"])

from modules.learning.router import router as learning_router
v1_router.include_router(learning_router, prefix="/learning", tags=["Learning & Career Intelligence"])
