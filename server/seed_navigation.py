import asyncio
import os
import sys

# Add server directory to path so we can import core and models
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.database import engine, Base
from sqlalchemy import text
from sqlalchemy.orm import selectinload
from core.database import AsyncSessionLocal
import models.navigation  # Ensures models are registered
import models.user

async def alter_users_table():
    async with engine.begin() as conn:
        print("Checking if sidebar_preferences exists in users table...")
        try:
            await conn.execute(text("ALTER TABLE users ADD COLUMN sidebar_preferences JSONB;"))
            print("Added sidebar_preferences column to users table.")
        except Exception as e:
            if "already exists" in str(e):
                print("sidebar_preferences already exists.")
            else:
                print(f"Skipping alter table: {e}")

async def create_navigation_tables():
    async with engine.begin() as conn:
        print("Creating navigation tables via SQLAlchemy metadata...")
        await conn.run_sync(Base.metadata.create_all)
        print("Navigation tables created successfully.")

async def seed_navigation_data():
    from models.navigation import NavigationModule, NavigationSubGroup, NavigationLink
    import uuid

    print("Seeding Enterprise Navigation structure...")

    admin_nav_groups = [
        {
            "label": "Dashboard",
            "links": [
                { "href": "/admin", "label": "Overview", "icon": "LayoutDashboard", "exact": True },
                { "href": "/admin/dashboard/executive", "label": "Executive Dashboard", "icon": "BarChart3" },
                { "href": "/admin/dashboard/activity", "label": "Activity Feed", "icon": "Activity" },
                { "href": "/admin/dashboard/quick-actions", "label": "Quick Actions", "icon": "Zap" },
                { "href": "/admin/dashboard/favorites", "label": "Favorites", "icon": "Star" },
                { "href": "/admin/dashboard/recent", "label": "Recent Activity", "icon": "History" },
            ]
        },
        {
            "label": "Identity & Access",
            "subGroups": [
                {
                    "label": "Users",
                    "links": [
                        { "href": "/admin/users", "label": "All Users", "icon": "Users" },
                        { "href": "/admin/users/verified", "label": "Verified Users", "icon": "ShieldCheck" },
                        { "href": "/admin/users/pending", "label": "Pending Verification", "icon": "AlertTriangle" },
                        { "href": "/admin/users/suspended", "label": "Suspended Users", "icon": "UserMinus" },
                        { "href": "/admin/users/blocked", "label": "Blocked Users", "icon": "UserX" },
                        { "href": "/admin/users/deleted", "label": "Deleted Users", "icon": "Trash2" },
                    ]
                },
                {
                    "label": "Organizations",
                    "links": [
                        { "href": "/admin/organizations/companies", "label": "Companies", "icon": "Building2" },
                        { "href": "/admin/organizations/departments", "label": "Departments", "icon": "Network" },
                        { "href": "/admin/organizations/teams", "label": "Teams", "icon": "Users2" },
                        { "href": "/admin/organizations/branches", "label": "Branches", "icon": "Map" },
                    ]
                },
                {
                    "label": "Staff",
                    "links": [
                        { "href": "/admin/staff/super-admins", "label": "Super Admins", "icon": "ShieldAlert" },
                        { "href": "/admin/staff/platform-admins", "label": "Platform Admins", "icon": "ShieldCheck" },
                        { "href": "/admin/staff/moderators", "label": "Moderators", "icon": "AlertOctagon" },
                        { "href": "/admin/staff/mentors", "label": "Mentors", "icon": "GraduationCap" },
                        { "href": "/admin/staff/recruiters", "label": "Recruiters", "icon": "Briefcase" },
                        { "href": "/admin/staff/support", "label": "Support Agents", "icon": "Headset" },
                    ]
                },
                {
                    "label": "Access Management",
                    "links": [
                        { "href": "/admin/access/roles", "label": "Roles", "icon": "Key" },
                        { "href": "/admin/access/permissions", "label": "Permissions", "icon": "Lock" },
                        { "href": "/admin/access/matrix", "label": "Permission Matrix", "icon": "Grid" },
                        { "href": "/admin/access/custom-roles", "label": "Custom Roles", "icon": "Wrench" },
                        { "href": "/admin/access/groups", "label": "User Groups", "icon": "Users2" },
                        { "href": "/admin/access/tokens", "label": "API Tokens", "icon": "Code" },
                        { "href": "/admin/access/sessions", "label": "Sessions", "icon": "MonitorSmartphone" },
                        { "href": "/admin/access/devices", "label": "Trusted Devices", "icon": "Cpu" },
                        { "href": "/admin/access/login-history", "label": "Login History", "icon": "History" },
                    ]
                }
            ]
        },
        {
            "label": "Recruitment",
            "subGroups": [
                {
                    "label": "Jobs",
                    "links": [
                        { "href": "/admin/jobs", "label": "All Jobs", "icon": "Briefcase" },
                        { "href": "/admin/jobs/drafts", "label": "Draft Jobs", "icon": "FileText" },
                        { "href": "/admin/jobs/published", "label": "Published Jobs", "icon": "CheckCircle2" },
                        { "href": "/admin/jobs/scheduled", "label": "Scheduled Jobs", "icon": "Calendar" },
                        { "href": "/admin/jobs/archived", "label": "Archived Jobs", "icon": "Archive" },
                    ]
                },
                {
                    "label": "Applications",
                    "links": [
                        { "href": "/admin/applications", "label": "All Applications", "icon": "FileSpreadsheet" },
                        { "href": "/admin/applications/pipeline", "label": "Pipeline", "icon": "GitMerge" },
                        { "href": "/admin/applications/shortlisted", "label": "Shortlisted", "icon": "Star" },
                        { "href": "/admin/applications/interviews", "label": "Interviews", "icon": "MessagesSquare" },
                        { "href": "/admin/applications/offers", "label": "Offers", "icon": "Award" },
                        { "href": "/admin/applications/hired", "label": "Hired", "icon": "CheckCircle2" },
                        { "href": "/admin/applications/rejected", "label": "Rejected", "icon": "UserX" },
                    ]
                },
                {
                    "label": "ATS",
                    "links": [
                        { "href": "/admin/ats/pool", "label": "Talent Pool", "icon": "Users" },
                        { "href": "/admin/ats/resumes", "label": "Resume Database", "icon": "FileSpreadsheet" },
                        { "href": "/admin/ats/search", "label": "Candidate Search", "icon": "Search" },
                        { "href": "/admin/ats/notes", "label": "Candidate Notes", "icon": "FileText" },
                        { "href": "/admin/ats/tags", "label": "Candidate Tags", "icon": "Tags" },
                    ]
                }
            ]
        },
        {
            "label": "Community",
            "links": [
                { "href": "/admin/community/feed", "label": "Feed", "icon": "LayoutDashboard" },
                { "href": "/admin/community/posts", "label": "Posts", "icon": "FileText" },
                { "href": "/admin/community/discussions", "label": "Discussions", "icon": "MessagesSquare" },
                { "href": "/admin/community/questions", "label": "Questions", "icon": "HelpCircle" },
                { "href": "/admin/community/comments", "label": "Comments", "icon": "MessageSquare" },
                { "href": "/admin/community/reports", "label": "Reports", "icon": "AlertOctagon" },
                { "href": "/admin/community/polls", "label": "Polls", "icon": "BarChart3" },
                { "href": "/admin/community/events", "label": "Events", "icon": "Calendar" },
                { "href": "/admin/community/groups", "label": "Groups", "icon": "Users2" },
                { "href": "/admin/community/mentorship", "label": "Mentorship", "icon": "GraduationCap" },
            ]
        },
        {
            "label": "Learning",
            "links": [
                { "href": "/admin/learning/courses", "label": "Courses", "icon": "BookOpen" },
                { "href": "/admin/learning/lessons", "label": "Lessons", "icon": "FileText" },
                { "href": "/admin/learning/modules", "label": "Modules", "icon": "Layers" },
                { "href": "/admin/learning/quizzes", "label": "Quizzes", "icon": "FileQuestion" },
                { "href": "/admin/learning/certificates", "label": "Certificates", "icon": "Award" },
                { "href": "/admin/learning/skills", "label": "Skills", "icon": "Zap" },
                { "href": "/admin/learning/paths", "label": "Learning Paths", "icon": "Map" },
            ]
        },
        {
            "label": "CMS",
            "subGroups": [
                {
                    "label": "Website",
                    "links": [
                        { "href": "/admin/cms/pages", "label": "Pages", "icon": "PanelTop" },
                        { "href": "/admin/cms/navigation", "label": "Navigation", "icon": "Navigation" },
                        { "href": "/admin/cms/header", "label": "Header Builder", "icon": "AlignVerticalSpaceAround" },
                        { "href": "/admin/cms/footer", "label": "Footer Builder", "icon": "AlignVerticalSpaceAround" },
                        { "href": "/admin/cms/mega-menu", "label": "Mega Menu", "icon": "Layers" },
                        { "href": "/admin/cms/landing", "label": "Landing Pages", "icon": "LayoutTemplate" },
                    ]
                },
                {
                    "label": "Content",
                    "links": [
                        { "href": "/admin/cms/blog", "label": "Blog", "icon": "FileText" },
                        { "href": "/admin/cms/categories", "label": "Categories", "icon": "FolderOpen" },
                        { "href": "/admin/cms/tags", "label": "Tags", "icon": "Tags" },
                        { "href": "/admin/cms/authors", "label": "Authors", "icon": "Users" },
                        { "href": "/admin/cms/media", "label": "Media Library", "icon": "ImageIcon" },
                        { "href": "/admin/cms/files", "label": "File Manager", "icon": "FileArchive" },
                    ]
                },
                {
                    "label": "Builder",
                    "links": [
                        { "href": "/admin/cms/components", "label": "Components", "icon": "ToyBrick" },
                        { "href": "/admin/cms/sections", "label": "Sections", "icon": "LayoutDashboard" },
                        { "href": "/admin/cms/templates", "label": "Templates", "icon": "LayoutTemplate" },
                        { "href": "/admin/cms/global", "label": "Global Components", "icon": "Globe" },
                        { "href": "/admin/cms/theme", "label": "Theme Builder", "icon": "Palette" },
                        { "href": "/admin/cms/tokens", "label": "Design Tokens", "icon": "Type" },
                    ]
                },
                {
                    "label": "SEO",
                    "links": [
                        { "href": "/admin/cms/seo", "label": "Meta Manager", "icon": "Search" },
                        { "href": "/admin/cms/sitemap", "label": "Sitemap", "icon": "Map" },
                        { "href": "/admin/cms/redirects", "label": "Redirects", "icon": "GitMerge" },
                        { "href": "/admin/cms/robots", "label": "Robots", "icon": "Settings" },
                        { "href": "/admin/cms/schema", "label": "Schema", "icon": "Code" },
                        { "href": "/admin/cms/og", "label": "Open Graph", "icon": "Share2" },
                    ]
                }
            ]
        },
        {
            "label": "AI Center",
            "links": [
                { "href": "/admin/ai/dashboard", "label": "AI Dashboard", "icon": "Brain" },
                { "href": "/admin/ai/models", "label": "AI Models", "icon": "Cpu" },
                { "href": "/admin/ai/prompts", "label": "AI Prompts", "icon": "MessageSquare" },
                { "href": "/admin/ai/assistants", "label": "AI Assistants", "icon": "User" },
                { "href": "/admin/ai/workflows", "label": "AI Workflows", "icon": "GitMerge" },
                { "href": "/admin/ai/automation", "label": "AI Automation", "icon": "Zap" },
                { "href": "/admin/ai/analytics", "label": "AI Analytics", "icon": "BarChart3" },
                { "href": "/admin/ai/usage", "label": "AI Usage", "icon": "Activity" },
                { "href": "/admin/ai/costs", "label": "AI Cost Monitor", "icon": "Banknote" },
            ]
        },
        {
            "label": "Marketing",
            "links": [
                { "href": "/admin/marketing/campaigns", "label": "Campaigns", "icon": "Megaphone" },
                { "href": "/admin/marketing/newsletters", "label": "Newsletters", "icon": "MailCheck" },
                { "href": "/admin/marketing/popups", "label": "Popups", "icon": "AlertOctagon" },
                { "href": "/admin/marketing/announcements", "label": "Announcement Bar", "icon": "Flag" },
                { "href": "/admin/marketing/push", "label": "Push Notifications", "icon": "Bell" },
                { "href": "/admin/marketing/sms", "label": "SMS", "icon": "Smartphone" },
                { "href": "/admin/marketing/whatsapp", "label": "WhatsApp", "icon": "MessageSquare" },
                { "href": "/admin/marketing/emails", "label": "Email Campaigns", "icon": "Mail" },
                { "href": "/admin/marketing/referrals", "label": "Referral System", "icon": "Users" },
            ]
        },
        {
            "label": "Communication",
            "links": [
                { "href": "/admin/comm/notifications", "label": "Notifications", "icon": "Bell" },
                { "href": "/admin/comm/emails", "label": "Email Center", "icon": "Mail" },
                { "href": "/admin/comm/templates", "label": "Templates", "icon": "LayoutTemplate" },
                { "href": "/admin/comm/inbox", "label": "Inbox", "icon": "Mail" },
                { "href": "/admin/comm/chat", "label": "Chat", "icon": "MessageSquare" },
                { "href": "/admin/comm/tickets", "label": "Support Tickets", "icon": "Ticket" },
                { "href": "/admin/comm/messages", "label": "Contact Messages", "icon": "MessagesSquare" },
            ]
        },
        {
            "label": "Finance",
            "links": [
                { "href": "/admin/finance/revenue", "label": "Revenue", "icon": "Landmark" },
                { "href": "/admin/finance/payments", "label": "Payments", "icon": "CreditCard" },
                { "href": "/admin/finance/transactions", "label": "Transactions", "icon": "Receipt" },
                { "href": "/admin/finance/refunds", "label": "Refunds", "icon": "RefreshCw" },
                { "href": "/admin/finance/invoices", "label": "Invoices", "icon": "FileText" },
                { "href": "/admin/finance/taxes", "label": "Taxes", "icon": "FileSpreadsheet" },
                { "href": "/admin/finance/coupons", "label": "Coupons", "icon": "Ticket" },
                { "href": "/admin/finance/wallet", "label": "Wallet", "icon": "Wallet" },
                { "href": "/admin/finance/payouts", "label": "Payouts", "icon": "Banknote" },
            ]
        },
        {
            "label": "Billing",
            "links": [
                { "href": "/admin/billing/plans", "label": "Plans", "icon": "Layers" },
                { "href": "/admin/billing/subscriptions", "label": "Subscriptions", "icon": "CreditCard" },
                { "href": "/admin/billing/usage", "label": "Usage", "icon": "Activity" },
                { "href": "/admin/billing/licenses", "label": "Licenses", "icon": "Key" },
                { "href": "/admin/billing/credits", "label": "Credits", "icon": "Star" },
                { "href": "/admin/billing/api", "label": "API Usage", "icon": "Code" },
            ]
        },
        {
            "label": "Analytics",
            "links": [
                { "href": "/admin/analytics/dashboard", "label": "Executive Dashboard", "icon": "BarChart3" },
                { "href": "/admin/analytics/users", "label": "Users", "icon": "Users" },
                { "href": "/admin/analytics/companies", "label": "Companies", "icon": "Building2" },
                { "href": "/admin/analytics/jobs", "label": "Jobs", "icon": "Briefcase" },
                { "href": "/admin/analytics/revenue", "label": "Revenue", "icon": "Landmark" },
                { "href": "/admin/analytics/engagement", "label": "Engagement", "icon": "Activity" },
                { "href": "/admin/analytics/traffic", "label": "Traffic", "icon": "Globe" },
                { "href": "/admin/analytics/ai", "label": "AI Analytics", "icon": "Brain" },
                { "href": "/admin/analytics/reports", "label": "Reports", "icon": "FileText" },
                { "href": "/admin/analytics/funnels", "label": "Funnels", "icon": "Filter" },
            ]
        },
        {
            "label": "Search",
            "links": [
                { "href": "/admin/search/universal", "label": "Universal Search", "icon": "Search" },
                { "href": "/admin/search/analytics", "label": "Search Analytics", "icon": "BarChart3" },
                { "href": "/admin/search/index", "label": "Search Index", "icon": "Database" },
                { "href": "/admin/search/synonyms", "label": "Search Synonyms", "icon": "Languages" },
            ]
        },
        {
            "label": "Security",
            "subGroups": [
                {
                    "label": "Security",
                    "links": [
                        { "href": "/admin/security/dashboard", "label": "Security Dashboard", "icon": "ShieldCheck" },
                        { "href": "/admin/security/threats", "label": "Threat Detection", "icon": "ShieldAlert" },
                        { "href": "/admin/security/policies", "label": "Security Policies", "icon": "FileText" },
                        { "href": "/admin/security/firewall", "label": "Firewall Rules", "icon": "Server" },
                        { "href": "/admin/security/limits", "label": "Rate Limits", "icon": "Activity" },
                        { "href": "/admin/security/api", "label": "API Security", "icon": "Code" },
                    ]
                },
                {
                    "label": "Audit",
                    "links": [
                        { "href": "/admin/audit/logs", "label": "Audit Logs", "icon": "Fingerprint" },
                        { "href": "/admin/audit/users", "label": "User Activity", "icon": "Users" },
                        { "href": "/admin/audit/admins", "label": "Admin Activity", "icon": "Key" },
                        { "href": "/admin/audit/api", "label": "API Logs", "icon": "Code" },
                        { "href": "/admin/audit/login", "label": "Login Logs", "icon": "History" },
                    ]
                }
            ]
        },
        {
            "label": "Automation",
            "links": [
                { "href": "/admin/automation/workflows", "label": "Workflow Builder", "icon": "GitMerge" },
                { "href": "/admin/automation/tasks", "label": "Scheduled Tasks", "icon": "Calendar" },
                { "href": "/admin/automation/queue", "label": "Queue Manager", "icon": "List" },
                { "href": "/admin/automation/background", "label": "Background Jobs", "icon": "Cpu" },
                { "href": "/admin/automation/webhooks", "label": "Webhooks", "icon": "Webhook" },
                { "href": "/admin/automation/integrations", "label": "Integrations", "icon": "ToyBrick" },
            ]
        },
        {
            "label": "Integrations",
            "links": [
                { "href": "/admin/integrations/keys", "label": "API Keys", "icon": "Key" },
                { "href": "/admin/integrations/oauth", "label": "OAuth Apps", "icon": "Lock" },
                { "href": "/admin/integrations/webhooks", "label": "Webhooks", "icon": "Webhook" },
                { "href": "/admin/integrations/stripe", "label": "Stripe", "icon": "CreditCard" },
                { "href": "/admin/integrations/razorpay", "label": "Razorpay", "icon": "CreditCard" },
                { "href": "/admin/integrations/google", "label": "Google", "icon": "Globe" },
                { "href": "/admin/integrations/microsoft", "label": "Microsoft", "icon": "LayoutDashboard" },
                { "href": "/admin/integrations/slack", "label": "Slack", "icon": "MessageSquare" },
                { "href": "/admin/integrations/discord", "label": "Discord", "icon": "MessagesSquare" },
                { "href": "/admin/integrations/zapier", "label": "Zapier", "icon": "Zap" },
                { "href": "/admin/integrations/n8n", "label": "n8n", "icon": "GitMerge" },
            ]
        },
        {
            "label": "Infrastructure",
            "links": [
                { "href": "/admin/infra/health", "label": "System Health", "icon": "Activity" },
                { "href": "/admin/infra/monitoring", "label": "Monitoring", "icon": "MonitorSmartphone" },
                { "href": "/admin/infra/status", "label": "Server Status", "icon": "Server" },
                { "href": "/admin/infra/db", "label": "Database", "icon": "Database" },
                { "href": "/admin/infra/redis", "label": "Redis", "icon": "Database" },
                { "href": "/admin/infra/storage", "label": "Storage", "icon": "HardDrive" },
                { "href": "/admin/infra/cache", "label": "Cache", "icon": "Zap" },
                { "href": "/admin/infra/cdn", "label": "CDN", "icon": "Globe" },
                { "href": "/admin/infra/queue", "label": "Queue", "icon": "List" },
                { "href": "/admin/infra/logs", "label": "Logs", "icon": "FileText" },
            ]
        },
        {
            "label": "Database",
            "links": [
                { "href": "/admin/db/tables", "label": "Tables", "icon": "Database" },
                { "href": "/admin/db/sql", "label": "SQL Console", "icon": "Code" },
                { "href": "/admin/db/backups", "label": "Backups", "icon": "Archive" },
                { "href": "/admin/db/restore", "label": "Restore", "icon": "RefreshCw" },
                { "href": "/admin/db/migrations", "label": "Migrations", "icon": "GitMerge" },
                { "href": "/admin/db/indexes", "label": "Indexes", "icon": "Search" },
                { "href": "/admin/db/performance", "label": "Performance", "icon": "Activity" },
            ]
        },
        {
            "label": "Assets",
            "links": [
                { "href": "/admin/assets/media", "label": "Media Library", "icon": "ImageIcon" },
                { "href": "/admin/assets/images", "label": "Images", "icon": "ImageIcon" },
                { "href": "/admin/assets/videos", "label": "Videos", "icon": "PlayCircle" },
                { "href": "/admin/assets/documents", "label": "Documents", "icon": "FileText" },
                { "href": "/admin/assets/icons", "label": "Icons", "icon": "Star" },
                { "href": "/admin/assets/fonts", "label": "Fonts", "icon": "Type" },
                { "href": "/admin/assets/brand", "label": "Brand Assets", "icon": "Palette" },
            ]
        },
        {
            "label": "Localization",
            "links": [
                { "href": "/admin/locale/languages", "label": "Languages", "icon": "Languages" },
                { "href": "/admin/locale/translations", "label": "Translations", "icon": "FileText" },
                { "href": "/admin/locale/currency", "label": "Currency", "icon": "Banknote" },
                { "href": "/admin/locale/regions", "label": "Regions", "icon": "Map" },
                { "href": "/admin/locale/timezones", "label": "Time Zones", "icon": "Calendar" },
            ]
        },
        {
            "label": "Feature Management",
            "links": [
                { "href": "/admin/features/flags", "label": "Feature Flags", "icon": "ToggleRight" },
                { "href": "/admin/features/experiments", "label": "Experiments", "icon": "FlaskConical" },
                { "href": "/admin/features/ab-tests", "label": "A/B Tests", "icon": "SplitSquareHorizontal" },
                { "href": "/admin/features/canary", "label": "Canary Releases", "icon": "Activity" },
                { "href": "/admin/features/rollouts", "label": "Rollouts", "icon": "GitMerge" },
            ]
        },
        {
            "label": "Marketplace",
            "links": [
                { "href": "/admin/marketplace/plugins", "label": "Plugins", "icon": "ToyBrick" },
                { "href": "/admin/marketplace/themes", "label": "Themes", "icon": "Palette" },
                { "href": "/admin/marketplace/components", "label": "Components", "icon": "LayoutTemplate" },
                { "href": "/admin/marketplace/templates", "label": "Templates", "icon": "Layers" },
                { "href": "/admin/marketplace/extensions", "label": "Extensions", "icon": "Puzzle" },
            ]
        },
        {
            "label": "Developer",
            "links": [
                { "href": "/admin/dev/api", "label": "API Explorer", "icon": "Code" },
                { "href": "/admin/dev/graphql", "label": "GraphQL Playground", "icon": "Database" },
                { "href": "/admin/dev/sdk", "label": "SDK", "icon": "ToyBrick" },
                { "href": "/admin/dev/cli", "label": "CLI", "icon": "Code" },
                { "href": "/admin/dev/events", "label": "Event Logs", "icon": "Activity" },
                { "href": "/admin/dev/settings", "label": "Developer Settings", "icon": "Settings" },
            ]
        },
        {
            "label": "Support",
            "links": [
                { "href": "/admin/support/help", "label": "Help Center", "icon": "HelpCircle" },
                { "href": "/admin/support/docs", "label": "Documentation", "icon": "BookOpen" },
                { "href": "/admin/support/tickets", "label": "Tickets", "icon": "Ticket" },
                { "href": "/admin/support/feedback", "label": "Feedback", "icon": "MessageSquare" },
                { "href": "/admin/support/changelog", "label": "Changelog", "icon": "History" },
                { "href": "/admin/support/releases", "label": "Release Notes", "icon": "FileText" },
            ]
        },
        {
            "label": "Platform Settings",
            "subGroups": [
                {
                    "label": "General",
                    "links": [
                        { "href": "/admin/settings/general", "label": "General Settings", "icon": "Settings" },
                        { "href": "/admin/settings/branding", "label": "Branding", "icon": "Palette" },
                        { "href": "/admin/settings/domain", "label": "Domain", "icon": "Globe" },
                        { "href": "/admin/settings/email", "label": "Email", "icon": "Mail" },
                        { "href": "/admin/settings/storage", "label": "Storage", "icon": "HardDrive" },
                    ]
                },
                {
                    "label": "Authentication",
                    "links": [
                        { "href": "/admin/settings/auth/login", "label": "Login", "icon": "LogIn" },
                        { "href": "/admin/settings/auth/sso", "label": "SSO", "icon": "Key" },
                        { "href": "/admin/settings/auth/mfa", "label": "MFA", "icon": "ShieldCheck" },
                        { "href": "/admin/settings/auth/password", "label": "Password Policy", "icon": "Lock" },
                    ]
                },
                {
                    "label": "System",
                    "links": [
                        { "href": "/admin/settings/system/env", "label": "Environment", "icon": "Server" },
                        { "href": "/admin/settings/system/backups", "label": "Backups", "icon": "Archive" },
                        { "href": "/admin/settings/system/maintenance", "label": "Maintenance Mode", "icon": "Wrench" },
                        { "href": "/admin/settings/system/cache", "label": "Cache", "icon": "Zap" },
                        { "href": "/admin/settings/system/scheduler", "label": "Scheduler", "icon": "Calendar" },
                    ]
                },
                {
                    "label": "Advanced",
                    "links": [
                        { "href": "/admin/settings/advanced/features", "label": "Feature Configuration", "icon": "ToggleRight" },
                        { "href": "/admin/settings/advanced/code", "label": "Custom Code", "icon": "Code" },
                        { "href": "/admin/settings/advanced/env", "label": "Environment Variables", "icon": "Server" },
                        { "href": "/admin/settings/advanced/secrets", "label": "Secrets", "icon": "Key" },
                        { "href": "/admin/settings/advanced/licensing", "label": "Licensing", "icon": "FileText" },
                    ]
                }
            ]
        },
        {
            "label": "Account",
            "links": [
                { "href": "/admin/account/profile", "label": "My Profile", "icon": "User" },
                { "href": "/admin/account/preferences", "label": "Preferences", "icon": "Settings" },
                { "href": "/admin/account/notifications", "label": "Notifications", "icon": "Bell" },
                { "href": "/admin/account/tokens", "label": "API Tokens", "icon": "Code" },
                { "href": "/admin/account/sessions", "label": "Sessions", "icon": "MonitorSmartphone" },
                { "href": "/admin/account/activity", "label": "Activity", "icon": "Activity" },
                { "href": "/admin/account/logout", "label": "Logout", "icon": "LogOut" },
            ]
        }
    ]

    async with AsyncSessionLocal() as session:
        # Check if already seeded
        result = await session.execute(text("SELECT COUNT(*) FROM navigation_modules"))
        count = result.scalar()
        if count > 0:
            print("Navigation data already exists, clearing old data to reseed...")
            await session.execute(text("DELETE FROM navigation_modules"))
            await session.commit()

        for mod_idx, group in enumerate(admin_nav_groups):
            module = NavigationModule(
                id=uuid.uuid4(),
                label=group["label"],
                order_index=mod_idx
            )
            session.add(module)
            
            if "subGroups" in group:
                for sub_idx, sub in enumerate(group["subGroups"]):
                    subgroup = NavigationSubGroup(
                        id=uuid.uuid4(),
                        module_id=module.id,
                        label=sub["label"],
                        order_index=sub_idx
                    )
                    session.add(subgroup)
                    
                    for link_idx, link in enumerate(sub["links"]):
                        nav_link = NavigationLink(
                            id=uuid.uuid4(),
                            module_id=module.id,
                            subgroup_id=subgroup.id,
                            label=link["label"],
                            href=link["href"],
                            icon=link.get("icon"),
                            exact=link.get("exact", False),
                            order_index=link_idx
                        )
                        session.add(nav_link)
            
            if "links" in group:
                for link_idx, link in enumerate(group["links"]):
                    nav_link = NavigationLink(
                        id=uuid.uuid4(),
                        module_id=module.id,
                        label=link["label"],
                        href=link["href"],
                        icon=link.get("icon"),
                        exact=link.get("exact", False),
                        order_index=link_idx
                    )
                    session.add(nav_link)
            
        await session.commit()
        print("Successfully seeded all Enterprise Navigation routes to the database!")

async def main():
    await alter_users_table()
    await create_navigation_tables()
    await seed_navigation_data()

if __name__ == "__main__":
    asyncio.run(main())
