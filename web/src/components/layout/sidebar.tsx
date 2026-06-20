"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
    LayoutDashboard, User, Briefcase, Bookmark, Settings, LogOut, Building2, Users, 
    Zap, Code, Brain, Boxes, History, ShieldAlert, Fingerprint, FileText, BarChart3, 
    Flag, Tags, Globe, Cpu, Activity, ChevronRight, CreditCard, ShieldCheck, Key, 
    GraduationCap, Scale, Bell, ToggleRight, Database, LifeBuoy, Mail,
    Star, RefreshCw, AlertTriangle, UserMinus, UserX, Network, Server, Headset,
    Lock, CheckCircle2, MonitorSmartphone, PlayCircle, StarHalf, FileSpreadsheet,
    MessageSquare, MessagesSquare, AlertOctagon, HelpCircle, Calendar, Users2,
    BookOpen, Layers, FileQuestion, Award, Map, Navigation, AlignVerticalSpaceAround,
    LayoutTemplate, Image as ImageIcon, PencilRuler, Search, Share2, Megaphone,
    MailCheck, Ticket, Receipt, Landmark, Banknote, SearchCode, Webhook, 
    HardDrive, Archive, FileImage, Type, Palette, Languages, FlaskConical,
    Wand2, ToyBrick, Wrench, FolderOpen, PanelTop, GitMerge, FileArchive,
    Moon, Sun, Menu, X, Trash, Trash2, Grid, Smartphone, Wallet, Filter, List, 
    SplitSquareHorizontal, Puzzle, LogIn, UserPlus, Clock, CalendarOff, FileCheck, Target, Laptop, ClipboardList, Kanban, CheckSquare, ShoppingCart, Truck, FileSignature, Package, Box, Store, Terminal, ListTree, MousePointerClick, Link2 as LinkIcon, FormInput, Route, Send, Bot, Copy, Inbox, FolderLock
} from "lucide-react"

import { useAuth } from "@/context/auth-context"
import { useCompany } from "@/components/providers/company-provider"

interface SidebarProps {
    role: "super_admin" | "admin" | "career_professional" | "company" | "mentor" | "moderator" | "user" | string
    className?: string
    variant?: "default" | "mobile"
}

const adminNavGroups = [
    {
        label: "Dashboard",
        links: [
            { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
            { href: "/admin/dashboard/executive", label: "Executive Dashboard", icon: BarChart3 },
            { href: "/admin/dashboard/activity", label: "Activity Feed", icon: Activity },
            { href: "/admin/dashboard/quick-actions", label: "Quick Actions", icon: Zap },
            { href: "/admin/dashboard/favorites", label: "Favorites", icon: Star },
            { href: "/admin/dashboard/recent", label: "Recent Activity", icon: History },
        ]
    },
    {
        label: "Platform Management",
        links: [
            { href: "/admin/platform", label: "Overview", icon: LayoutDashboard },
            { href: "/admin/platform/tenants", label: "Tenants", icon: Building2 },
            { href: "/admin/platform/organizations", label: "Organizations", icon: Network },
            { href: "/admin/platform/workspaces", label: "Workspaces", icon: SplitSquareHorizontal },
            { href: "/admin/platform/domains", label: "Domains", icon: Globe },
            { href: "/admin/platform/regions", label: "Regions", icon: Map },
            { href: "/admin/platform/feature-flags", label: "Feature Flags", icon: ToggleRight },
            { href: "/admin/platform/quotas", label: "Quotas", icon: BarChart3 },
            { href: "/admin/platform/plans", label: "Plans", icon: CreditCard },
            { href: "/admin/platform/usage", label: "Usage", icon: Activity },
            { href: "/admin/platform/maintenance", label: "Maintenance", icon: Wrench },
        ]
    },
    {
        label: "Identity & Access",
        links: [
            { href: "/admin/identity", label: "Dashboard", icon: LayoutDashboard },
            { href: "/admin/identity/users", label: "Users", icon: Users },
            { href: "/admin/identity/invitations", label: "Invitations", icon: Mail },
            { href: "/admin/identity/organizations", label: "Organizations", icon: Building2 },
            { href: "/admin/identity/groups", label: "User Groups", icon: Users2 },
            { href: "/admin/identity/roles", label: "Roles", icon: ShieldCheck },
            { href: "/admin/identity/permissions", label: "Permissions", icon: Key },
            { href: "/admin/identity/sessions", label: "Sessions", icon: MonitorSmartphone },
            { href: "/admin/identity/devices", label: "Devices", icon: Cpu },
            { href: "/admin/identity/api-keys", label: "API Keys", icon: Code },
            { href: "/admin/identity/oauth", label: "OAuth Apps", icon: Puzzle },
            { href: "/admin/identity/mfa", label: "MFA", icon: Lock },
            { href: "/admin/identity/verification", label: "Verification", icon: ShieldCheck },
            { href: "/admin/identity/login-history", label: "Login History", icon: History },
            { href: "/admin/identity/security-events", label: "Security Events", icon: ShieldAlert },
            { href: "/admin/identity/impersonation", label: "Impersonation", icon: Fingerprint },
            { href: "/admin/identity/audit", label: "Audit Logs", icon: Database },
        ]
    },
    {
        label: "Authorization",
        links: [
            { href: "/admin/authorization", label: "Dashboard", icon: LayoutDashboard },
            { href: "/admin/authorization/roles", label: "Roles", icon: ShieldCheck },
            { href: "/admin/authorization/roles/platform", label: "Platform Roles", icon: Globe },
            { href: "/admin/authorization/roles/tenant", label: "Tenant Roles", icon: Building2 },
            { href: "/admin/authorization/roles/workspace", label: "Workspace Roles", icon: SplitSquareHorizontal },
            { href: "/admin/authorization/library", label: "Permission Library", icon: Key },
            { href: "/admin/authorization/groups", label: "Permission Groups", icon: Users2 },
            { href: "/admin/authorization/policies", label: "Policies (ABAC)", icon: FileText },
            { href: "/admin/authorization/templates", label: "Role Templates", icon: Copy },
            { href: "/admin/authorization/delegation", label: "Delegation", icon: GitMerge },
            { href: "/admin/authorization/temporary", label: "Temporary Access", icon: Clock },
            { href: "/admin/authorization/approval-matrix", label: "Approval Matrix", icon: CheckCircle2 },
            { href: "/admin/authorization/requests", label: "Access Requests", icon: Inbox },
            { href: "/admin/authorization/features", label: "Feature Access", icon: ToggleRight },
            { href: "/admin/authorization/resources", label: "Resource Permissions", icon: FolderLock },
            { href: "/admin/authorization/simulate", label: "Simulate Access", icon: PlayCircle },
            { href: "/admin/authorization/audit", label: "Audit", icon: History },
        ]
    },
    {
        label: "CMS & Experience",
        links: [
            { href: "/admin/cms", label: "Dashboard", icon: LayoutDashboard },
            { href: "/admin/cms/pages", label: "Pages", icon: FileText },
            { href: "/admin/cms/collections", label: "Collections", icon: Database },
            { href: "/admin/cms/entries", label: "Content Entries", icon: ListTree },
            { href: "/admin/cms/builder", label: "Visual Builder", icon: MousePointerClick },
            { href: "/admin/cms/components", label: "Components", icon: Puzzle },
            { href: "/admin/cms/templates", label: "Templates", icon: LayoutTemplate },
            { href: "/admin/cms/blocks", label: "Global Blocks", icon: Box },
            { href: "/admin/cms/navigation", label: "Navigation", icon: LinkIcon },
            { href: "/admin/cms/media", label: "Media Library", icon: ImageIcon },
            { href: "/admin/cms/forms", label: "Forms", icon: FormInput },
            { href: "/admin/cms/popups", label: "Popups", icon: MessageSquare },
            { href: "/admin/cms/seo", label: "SEO", icon: Search },
            { href: "/admin/cms/routes", label: "Routes & Slugs", icon: Route },
            { href: "/admin/cms/themes", label: "Themes", icon: Palette },
            { href: "/admin/cms/localization", label: "Localization", icon: Globe },
            { href: "/admin/cms/publishing", label: "Publishing", icon: Send },
            { href: "/admin/cms/ai", label: "AI Content", icon: Bot },
        ]
    },
    {
        label: "Recruitment",
        subGroups: [
            {
                label: "Jobs",
                links: [
                    { href: "/admin/jobs", label: "All Jobs", icon: Briefcase },
                    { href: "/admin/jobs/drafts", label: "Draft Jobs", icon: FileText },
                    { href: "/admin/jobs/published", label: "Published Jobs", icon: CheckCircle2 },
                    { href: "/admin/jobs/scheduled", label: "Scheduled Jobs", icon: Calendar },
                    { href: "/admin/jobs/archived", label: "Archived Jobs", icon: Archive },
                ]
            },
            {
                label: "Applications",
                links: [
                    { href: "/admin/applications", label: "All Applications", icon: FileSpreadsheet },
                    { href: "/admin/applications/pipeline", label: "Pipeline", icon: GitMerge },
                    { href: "/admin/applications/shortlisted", label: "Shortlisted", icon: Star },
                    { href: "/admin/applications/interviews", label: "Interviews", icon: MessagesSquare },
                    { href: "/admin/applications/offers", label: "Offers", icon: Award },
                    { href: "/admin/applications/hired", label: "Hired", icon: CheckCircle2 },
                    { href: "/admin/applications/rejected", label: "Rejected", icon: UserX },
                ]
            },
            {
                label: "ATS",
                links: [
                    { href: "/admin/ats/pool", label: "Talent Pool", icon: Users },
                    { href: "/admin/ats/requisitions", label: "Requisitions", icon: ClipboardList },
                    { href: "/admin/ats/skills", label: "Skills Library", icon: GraduationCap },
                    { href: "/admin/ats/questions", label: "Question Bank", icon: HelpCircle },
                    { href: "/admin/ats/resumes", label: "Resume Database", icon: FileSpreadsheet },
                    { href: "/admin/ats/search", label: "Candidate Search", icon: Search },
                    { href: "/admin/ats/notes", label: "Candidate Notes", icon: FileText },
                    { href: "/admin/ats/tags", label: "Candidate Tags", icon: Tags },
                ]
            }
        ]
    },
    {
        label: "Projects & Work Management",
        subGroups: [
            {
                label: "Collaboration",
                links: [
                    { href: "/admin/projects/workspace", label: "Workspace Dashboard", icon: LayoutDashboard },
                    { href: "/admin/projects/board", label: "Sprint Board", icon: Kanban },
                    { href: "/admin/projects/tasks", label: "My Tasks", icon: CheckSquare },
                ]
            },
            {
                label: "Planning",
                links: [
                    { href: "/admin/projects/time", label: "Time Tracking", icon: Clock },
                    { href: "/admin/projects/resources", label: "Resource Workload", icon: Users2 },
                    { href: "/admin/projects/wiki", label: "Knowledge Base", icon: BookOpen },
                ]
            }
        ]
    },
    {
        label: "ERP & Business Operations",
        subGroups: [
            {
                label: "Finance & Accounting",
                links: [
                    { href: "/admin/erp/dashboard", label: "Executive Dashboard", icon: BarChart3 },
                    { href: "/admin/erp/finance", label: "General Ledger", icon: Landmark },
                ]
            },
            {
                label: "Supply Chain & Ops",
                links: [
                    { href: "/admin/erp/procurement", label: "Procurement & Vendors", icon: ShoppingCart },
                    { href: "/admin/erp/contracts", label: "Contract Management", icon: FileSignature },
                    { href: "/admin/erp/inventory", label: "Inventory & Assets", icon: Package },
                ]
            }
        ]
    },
    {
        label: "Ecosystem & Platform",
        subGroups: [
            {
                label: "Extensions & Apps",
                links: [
                    { href: "/admin/ecosystem/marketplace", label: "App Marketplace", icon: Store },
                    { href: "/admin/ecosystem/integrations", label: "Installed Plugins", icon: Puzzle },
                ]
            },
            {
                label: "Developer Tools",
                links: [
                    { href: "/admin/ecosystem/api", label: "API & Webhooks", icon: Webhook },
                    { href: "/admin/ecosystem/developer", label: "Developer Portal", icon: Terminal },
                    { href: "/admin/ecosystem/portals", label: "Partner Portals", icon: Globe },
                ]
            }
        ]
    },
    {
        label: "HRMS & Employee Lifecycle",
        subGroups: [
            {
                label: "Core HR",
                links: [
                    { href: "/admin/hrms/dashboard", label: "HR Dashboard", icon: LayoutDashboard },
                    { href: "/admin/hrms/directory", label: "Employee Directory", icon: Users },
                    { href: "/admin/hrms/org-chart", label: "Organization Chart", icon: Network },
                ]
            },
            {
                label: "Lifecycle & Time",
                links: [
                    { href: "/admin/hrms/onboarding", label: "Onboarding & Offboarding", icon: UserPlus },
                    { href: "/admin/hrms/attendance", label: "Time & Attendance", icon: Clock },
                    { href: "/admin/hrms/leave", label: "Leave Center", icon: CalendarOff },
                    { href: "/admin/hrms/documents", label: "Documents", icon: FileCheck },
                ]
            },
            {
                label: "Performance & Ops",
                links: [
                    { href: "/admin/hrms/performance", label: "Performance & Goals", icon: Target },
                    { href: "/admin/hrms/assets", label: "Assets", icon: Laptop },
                    { href: "/admin/hrms/expenses", label: "Expenses", icon: Receipt },
                ]
            }
        ]
    },
    {
        label: "Community",
        links: [
            { href: "/admin/community/feed", label: "Feed", icon: LayoutDashboard },
            { href: "/admin/community/posts", label: "Posts", icon: FileText },
            { href: "/admin/community/discussions", label: "Discussions", icon: MessagesSquare },
            { href: "/admin/community/questions", label: "Questions", icon: HelpCircle },
            { href: "/admin/community/comments", label: "Comments", icon: MessageSquare },
            { href: "/admin/community/reports", label: "Reports", icon: AlertOctagon },
            { href: "/admin/community/polls", label: "Polls", icon: BarChart3 },
            { href: "/admin/community/events", label: "Events", icon: Calendar },
            { href: "/admin/community/groups", label: "Groups", icon: Users2 },
            { href: "/admin/community/mentorship", label: "Mentorship", icon: GraduationCap },
        ]
    },
    {
        label: "Learning",
        links: [
            { href: "/admin/learning/courses", label: "Courses", icon: BookOpen },
            { href: "/admin/learning/lessons", label: "Lessons", icon: FileText },
            { href: "/admin/learning/modules", label: "Modules", icon: Layers },
            { href: "/admin/learning/quizzes", label: "Quizzes", icon: FileQuestion },
            { href: "/admin/learning/certificates", label: "Certificates", icon: Award },
            { href: "/admin/learning/skills", label: "Skills", icon: Zap },
            { href: "/admin/learning/paths", label: "Learning Paths", icon: Map },
        ]
    },
    {
        label: "CMS",
        subGroups: [
            {
                label: "Website",
                links: [
                    { href: "/admin/cms/pages", label: "Pages", icon: PanelTop },
                    { href: "/admin/cms/navigation", label: "Navigation", icon: Navigation },
                    { href: "/admin/cms/header", label: "Header Builder", icon: AlignVerticalSpaceAround },
                    { href: "/admin/cms/footer", label: "Footer Builder", icon: AlignVerticalSpaceAround },
                    { href: "/admin/cms/mega-menu", label: "Mega Menu", icon: Layers },
                    { href: "/admin/cms/landing", label: "Landing Pages", icon: LayoutTemplate },
                ]
            },
            {
                label: "Content",
                links: [
                    { href: "/admin/cms/blog", label: "Blog", icon: FileText },
                    { href: "/admin/cms/categories", label: "Categories", icon: FolderOpen },
                    { href: "/admin/cms/tags", label: "Tags", icon: Tags },
                    { href: "/admin/cms/authors", label: "Authors", icon: Users },
                    { href: "/admin/cms/media", label: "Media Library", icon: ImageIcon },
                    { href: "/admin/cms/files", label: "File Manager", icon: FileArchive },
                ]
            },
            {
                label: "Builder",
                links: [
                    { href: "/admin/cms/components", label: "Components", icon: ToyBrick },
                    { href: "/admin/cms/sections", label: "Sections", icon: LayoutDashboard },
                    { href: "/admin/cms/templates", label: "Templates", icon: LayoutTemplate },
                    { href: "/admin/cms/global", label: "Global Components", icon: Globe },
                    { href: "/admin/cms/theme", label: "Theme Builder", icon: Palette },
                    { href: "/admin/cms/tokens", label: "Design Tokens", icon: Type },
                ]
            },
            {
                label: "SEO",
                links: [
                    { href: "/admin/cms/seo", label: "Meta Manager", icon: Search },
                    { href: "/admin/cms/sitemap", label: "Sitemap", icon: Map },
                    { href: "/admin/cms/redirects", label: "Redirects", icon: GitMerge },
                    { href: "/admin/cms/robots", label: "Robots", icon: Settings },
                    { href: "/admin/cms/schema", label: "Schema", icon: Code },
                    { href: "/admin/cms/og", label: "Open Graph", icon: Share2 },
                ]
            }
        ]
    },
    {
        label: "AI Center",
        links: [
            { href: "/admin/ai/dashboard", label: "AI Dashboard", icon: Brain },
            { href: "/admin/ai/models", label: "AI Models", icon: Cpu },
            { href: "/admin/ai/prompts", label: "AI Prompts", icon: MessageSquare },
            { href: "/admin/ai/assistants", label: "AI Assistants", icon: User },
            { href: "/admin/ai/workflows", label: "AI Workflows", icon: GitMerge },
            { href: "/admin/ai/automation", label: "AI Automation", icon: Zap },
            { href: "/admin/ai/analytics", label: "AI Analytics", icon: BarChart3 },
            { href: "/admin/ai/usage", label: "AI Usage", icon: Activity },
            { href: "/admin/ai/costs", label: "AI Cost Monitor", icon: Banknote },
        ]
    },
    {
        label: "Marketing",
        links: [
            { href: "/admin/marketing/campaigns", label: "Campaigns", icon: Megaphone },
            { href: "/admin/marketing/newsletters", label: "Newsletters", icon: MailCheck },
            { href: "/admin/marketing/popups", label: "Popups", icon: AlertOctagon },
            { href: "/admin/marketing/announcements", label: "Announcement Bar", icon: Flag },
            { href: "/admin/marketing/push", label: "Push Notifications", icon: Bell },
            { href: "/admin/marketing/sms", label: "SMS", icon: Smartphone },
            { href: "/admin/marketing/whatsapp", label: "WhatsApp", icon: MessageSquare },
            { href: "/admin/marketing/emails", label: "Email Campaigns", icon: Mail },
            { href: "/admin/marketing/referrals", label: "Referral System", icon: Users },
        ]
    },
    {
        label: "Communication",
        links: [
            { href: "/admin/comm/notifications", label: "Notifications", icon: Bell },
            { href: "/admin/comm/emails", label: "Email Center", icon: Mail },
            { href: "/admin/comm/templates", label: "Templates", icon: LayoutTemplate },
            { href: "/admin/comm/inbox", label: "Inbox", icon: Mail },
            { href: "/admin/comm/chat", label: "Chat", icon: MessageSquare },
            { href: "/admin/comm/tickets", label: "Support Tickets", icon: Ticket },
            { href: "/admin/comm/messages", label: "Contact Messages", icon: MessagesSquare },
        ]
    },
    {
        label: "Finance",
        links: [
            { href: "/admin/finance/revenue", label: "Revenue", icon: Landmark },
            { href: "/admin/finance/payments", label: "Payments", icon: CreditCard },
            { href: "/admin/finance/transactions", label: "Transactions", icon: Receipt },
            { href: "/admin/finance/refunds", label: "Refunds", icon: RefreshCw },
            { href: "/admin/finance/invoices", label: "Invoices", icon: FileText },
            { href: "/admin/finance/taxes", label: "Taxes", icon: FileSpreadsheet },
            { href: "/admin/finance/coupons", label: "Coupons", icon: Ticket },
            { href: "/admin/finance/wallet", label: "Wallet", icon: Wallet },
            { href: "/admin/finance/payouts", label: "Payouts", icon: Banknote },
        ]
    },
    {
        label: "Billing",
        links: [
            { href: "/admin/billing/plans", label: "Plans", icon: Layers },
            { href: "/admin/billing/subscriptions", label: "Subscriptions", icon: CreditCard },
            { href: "/admin/billing/usage", label: "Usage", icon: Activity },
            { href: "/admin/billing/licenses", label: "Licenses", icon: Key },
            { href: "/admin/billing/credits", label: "Credits", icon: Star },
            { href: "/admin/billing/api", label: "API Usage", icon: Code },
        ]
    },
    {
        label: "Analytics",
        links: [
            { href: "/admin/analytics/dashboard", label: "Executive Dashboard", icon: BarChart3 },
            { href: "/admin/analytics/users", label: "Users", icon: Users },
            { href: "/admin/analytics/companies", label: "Companies", icon: Building2 },
            { href: "/admin/analytics/jobs", label: "Jobs", icon: Briefcase },
            { href: "/admin/analytics/revenue", label: "Revenue", icon: Landmark },
            { href: "/admin/analytics/engagement", label: "Engagement", icon: Activity },
            { href: "/admin/analytics/traffic", label: "Traffic", icon: Globe },
            { href: "/admin/analytics/ai", label: "AI Analytics", icon: Brain },
            { href: "/admin/analytics/reports", label: "Reports", icon: FileText },
            { href: "/admin/analytics/funnels", label: "Funnels", icon: Filter },
        ]
    },
    {
        label: "Search",
        links: [
            { href: "/admin/search/universal", label: "Universal Search", icon: Search },
            { href: "/admin/search/analytics", label: "Search Analytics", icon: BarChart3 },
            { href: "/admin/search/index", label: "Search Index", icon: Database },
            { href: "/admin/search/synonyms", label: "Search Synonyms", icon: Languages },
        ]
    },
    {
        label: "Security",
        subGroups: [
            {
                label: "Security",
                links: [
                    { href: "/admin/security/dashboard", label: "Security Dashboard", icon: ShieldCheck },
                    { href: "/admin/security/threats", label: "Threat Detection", icon: ShieldAlert },
                    { href: "/admin/security/policies", label: "Security Policies", icon: FileText },
                    { href: "/admin/security/firewall", label: "Firewall Rules", icon: Server },
                    { href: "/admin/security/limits", label: "Rate Limits", icon: Activity },
                    { href: "/admin/security/api", label: "API Security", icon: Code },
                ]
            },
            {
                label: "Audit",
                links: [
                    { href: "/admin/audit/logs", label: "Audit Logs", icon: Fingerprint },
                    { href: "/admin/audit/users", label: "User Activity", icon: Users },
                    { href: "/admin/audit/admins", label: "Admin Activity", icon: Key },
                    { href: "/admin/audit/api", label: "API Logs", icon: Code },
                    { href: "/admin/audit/login", label: "Login Logs", icon: History },
                ]
            }
        ]
    },
    {
        label: "Automation",
        links: [
            { href: "/admin/automation/workflows", label: "Workflow Builder", icon: GitMerge },
            { href: "/admin/automation/tasks", label: "Scheduled Tasks", icon: Calendar },
            { href: "/admin/automation/queue", label: "Queue Manager", icon: List },
            { href: "/admin/automation/background", label: "Background Jobs", icon: Cpu },
            { href: "/admin/automation/webhooks", label: "Webhooks", icon: Webhook },
            { href: "/admin/automation/integrations", label: "Integrations", icon: ToyBrick },
        ]
    },
    {
        label: "Integrations",
        links: [
            { href: "/admin/integrations/keys", label: "API Keys", icon: Key },
            { href: "/admin/integrations/oauth", label: "OAuth Apps", icon: Lock },
            { href: "/admin/integrations/webhooks", label: "Webhooks", icon: Webhook },
            { href: "/admin/integrations/stripe", label: "Stripe", icon: CreditCard },
            { href: "/admin/integrations/razorpay", label: "Razorpay", icon: CreditCard },
            { href: "/admin/integrations/google", label: "Google", icon: Globe },
            { href: "/admin/integrations/microsoft", label: "Microsoft", icon: LayoutDashboard },
            { href: "/admin/integrations/slack", label: "Slack", icon: MessageSquare },
            { href: "/admin/integrations/discord", label: "Discord", icon: MessagesSquare },
            { href: "/admin/integrations/zapier", label: "Zapier", icon: Zap },
            { href: "/admin/integrations/n8n", label: "n8n", icon: GitMerge },
        ]
    },
    {
        label: "Infrastructure",
        links: [
            { href: "/admin/infra/health", label: "System Health", icon: Activity },
            { href: "/admin/infra/monitoring", label: "Monitoring", icon: MonitorSmartphone },
            { href: "/admin/infra/status", label: "Server Status", icon: Server },
            { href: "/admin/infra/db", label: "Database", icon: Database },
            { href: "/admin/infra/redis", label: "Redis", icon: Database },
            { href: "/admin/infra/storage", label: "Storage", icon: HardDrive },
            { href: "/admin/infra/cache", label: "Cache", icon: Zap },
            { href: "/admin/infra/cdn", label: "CDN", icon: Globe },
            { href: "/admin/infra/queue", label: "Queue", icon: List },
            { href: "/admin/infra/logs", label: "Logs", icon: FileText },
        ]
    },
    {
        label: "Database",
        links: [
            { href: "/admin/db/tables", label: "Tables", icon: Database },
            { href: "/admin/db/sql", label: "SQL Console", icon: Code },
            { href: "/admin/db/backups", label: "Backups", icon: Archive },
            { href: "/admin/db/restore", label: "Restore", icon: RefreshCw },
            { href: "/admin/db/migrations", label: "Migrations", icon: GitMerge },
            { href: "/admin/db/indexes", label: "Indexes", icon: Search },
            { href: "/admin/db/performance", label: "Performance", icon: Activity },
        ]
    },
    {
        label: "Assets",
        links: [
            { href: "/admin/assets/media", label: "Media Library", icon: ImageIcon },
            { href: "/admin/assets/images", label: "Images", icon: ImageIcon },
            { href: "/admin/assets/videos", label: "Videos", icon: PlayCircle },
            { href: "/admin/assets/documents", label: "Documents", icon: FileText },
            { href: "/admin/assets/icons", label: "Icons", icon: Star },
            { href: "/admin/assets/fonts", label: "Fonts", icon: Type },
            { href: "/admin/assets/brand", label: "Brand Assets", icon: Palette },
        ]
    },
    {
        label: "Localization",
        links: [
            { href: "/admin/locale/languages", label: "Languages", icon: Languages },
            { href: "/admin/locale/translations", label: "Translations", icon: FileText },
            { href: "/admin/locale/currency", label: "Currency", icon: Banknote },
            { href: "/admin/locale/regions", label: "Regions", icon: Map },
            { href: "/admin/locale/timezones", label: "Time Zones", icon: Calendar },
        ]
    },
    {
        label: "Feature Management",
        links: [
            { href: "/admin/features/flags", label: "Feature Flags", icon: ToggleRight },
            { href: "/admin/features/experiments", label: "Experiments", icon: FlaskConical },
            { href: "/admin/features/ab-tests", label: "A/B Tests", icon: SplitSquareHorizontal },
            { href: "/admin/features/canary", label: "Canary Releases", icon: Activity },
            { href: "/admin/features/rollouts", label: "Rollouts", icon: GitMerge },
        ]
    },
    {
        label: "Marketplace",
        links: [
            { href: "/admin/marketplace/plugins", label: "Plugins", icon: ToyBrick },
            { href: "/admin/marketplace/themes", label: "Themes", icon: Palette },
            { href: "/admin/marketplace/components", label: "Components", icon: LayoutTemplate },
            { href: "/admin/marketplace/templates", label: "Templates", icon: Layers },
            { href: "/admin/marketplace/extensions", label: "Extensions", icon: Puzzle },
        ]
    },
    {
        label: "Developer",
        links: [
            { href: "/admin/dev/api", label: "API Explorer", icon: Code },
            { href: "/admin/dev/graphql", label: "GraphQL Playground", icon: Database },
            { href: "/admin/dev/sdk", label: "SDK", icon: ToyBrick },
            { href: "/admin/dev/cli", label: "CLI", icon: Code },
            { href: "/admin/dev/events", label: "Event Logs", icon: Activity },
            { href: "/admin/dev/settings", label: "Developer Settings", icon: Settings },
        ]
    },
    {
        label: "Support",
        links: [
            { href: "/admin/support/help", label: "Help Center", icon: HelpCircle },
            { href: "/admin/support/docs", label: "Documentation", icon: BookOpen },
            { href: "/admin/support/tickets", label: "Tickets", icon: Ticket },
            { href: "/admin/support/feedback", label: "Feedback", icon: MessageSquare },
            { href: "/admin/support/changelog", label: "Changelog", icon: History },
            { href: "/admin/support/releases", label: "Release Notes", icon: FileText },
        ]
    },
    {
        label: "System Administration & Observability",
        links: [
            { href: "/admin/system/observability", label: "Observability Center", icon: Activity },
            { href: "/admin/system/security", label: "Security Command Center", icon: ShieldAlert },
        ]
    },
    {
        label: "Platform Settings",
        subGroups: [
            {
                label: "General",
                links: [
                    { href: "/admin/settings/general", label: "General Settings", icon: Settings },
                    { href: "/admin/settings/branding", label: "Branding", icon: Palette },
                    { href: "/admin/settings/domain", label: "Domain", icon: Globe },
                    { href: "/admin/settings/email", label: "Email", icon: Mail },
                    { href: "/admin/settings/storage", label: "Storage", icon: HardDrive },
                ]
            },
            {
                label: "Authentication",
                links: [
                    { href: "/admin/settings/auth/login", label: "Login", icon: LogIn },
                    { href: "/admin/settings/auth/sso", label: "SSO", icon: Key },
                    { href: "/admin/settings/auth/mfa", label: "MFA", icon: ShieldCheck },
                    { href: "/admin/settings/auth/password", label: "Password Policy", icon: Lock },
                ]
            },
            {
                label: "System",
                links: [
                    { href: "/admin/settings/system/env", label: "Environment", icon: Server },
                    { href: "/admin/settings/system/backups", label: "Backups", icon: Archive },
                    { href: "/admin/settings/system/maintenance", label: "Maintenance Mode", icon: Wrench },
                    { href: "/admin/settings/system/cache", label: "Cache", icon: Zap },
                    { href: "/admin/settings/system/scheduler", label: "Scheduler", icon: Calendar },
                ]
            },
            {
                label: "Advanced",
                links: [
                    { href: "/admin/settings/advanced/features", label: "Feature Configuration", icon: ToggleRight },
                    { href: "/admin/settings/advanced/code", label: "Custom Code", icon: Code },
                    { href: "/admin/settings/advanced/env", label: "Environment Variables", icon: Server },
                    { href: "/admin/settings/advanced/secrets", label: "Secrets", icon: Key },
                    { href: "/admin/settings/advanced/licensing", label: "Licensing", icon: FileText },
                ]
            }
        ]
    },
    {
        label: "Account",
        links: [
            { href: "/admin/account/profile", label: "My Profile", icon: User },
            { href: "/admin/account/preferences", label: "Preferences", icon: Settings },
            { href: "/admin/account/notifications", label: "Notifications", icon: Bell },
            { href: "/admin/account/tokens", label: "API Tokens", icon: Code },
            { href: "/admin/account/sessions", label: "Sessions", icon: MonitorSmartphone },
            { href: "/admin/account/activity", label: "Activity", icon: Activity },
            { href: "/admin/account/logout", label: "Logout", icon: LogOut },
        ]
    }
]

const userLinks = [
    { href: "/feed", label: "Feed", icon: LayoutDashboard, exact: true },
    { href: "/user/profile", label: "My Profile", icon: User },
    { href: "/user/applications", label: "Applications", icon: Briefcase },
    { href: "/user/saved", label: "Saved Jobs", icon: Bookmark },
    { href: "/challenges", label: "Challenge Arena", icon: Code },
    { href: "/roadmap", label: "AI Roadmaps", icon: Zap },
    { href: "/user/messages", label: "Messages", icon: Mail },
    { href: "/competitions/teams", label: "Hackathons & Teams", icon: Users },
    { href: "/github", label: "OS Contribution", icon: Activity },
    { href: "/search/candidates", label: "Discover Talent", icon: Globe },
    { href: "/user/skills", label: "Skills & Credentials", icon: ShieldCheck },
    { href: "/user/insights", label: "AI Insights", icon: Brain },
    { href: "/user/settings", label: "Settings", icon: Settings },
]

const companyLinks = [
    { href: "/company/dashboard", label: "Company Dashboard", icon: LayoutDashboard },
    { href: "/company/jobs", label: "Job Management", icon: Briefcase },
    { href: "/company/ats", label: "ATS", icon: Boxes },
    { href: "/user/messages", label: "Messages", icon: Mail },
    { href: "/search/talent", label: "Talent Discovery", icon: Globe },
    { href: "/company/branding", label: "Company Branding", icon: Building2 },
    { href: "/company/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/company/sponsorships", label: "Learning Sponsorship", icon: Brain },
    { href: "/company/pipeline", label: "Talent Pipeline", icon: Users },
    { href: "/company/team", label: "Team Management", icon: Users },
]

const recruiterLinks = [
    { href: "/recruiter/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/search/talent", label: "Talent Search", icon: Globe },
    { href: "/recruiter/pipeline", label: "ATS Pipeline", icon: Boxes },
    { href: "/recruiter/jobs", label: "Job Management", icon: Briefcase },
    { href: "/user/messages", label: "Messages", icon: Mail },
    { href: "/recruiter/candidates", label: "Candidate Management", icon: Users },
    { href: "/recruiter/interviews", label: "Interviews", icon: Activity },
    { href: "/recruiter/reports", label: "Reports", icon: FileText },
    { href: "/recruiter/insights", label: "Recruiter Insights", icon: Brain },
]

export function Sidebar({ role, className, variant = "default" }: SidebarProps) {
    const pathname = usePathname()
    const { logout, user } = useAuth()

    const isActiveLink = (href: string, exact = false) => {
        if (exact) return pathname === href
        return pathname === href || pathname.startsWith(href + "/")
    }

    const accentColor = ["super_admin", "admin", "security_admin", "support_admin", "ai_admin"].includes(role) ? "rose" : "primary"
    const accentClass = ["super_admin", "admin", "security_admin", "support_admin", "ai_admin"].includes(role) ? "text-rose-400" : "text-primary"
    const accentBg = ["super_admin", "admin", "security_admin", "support_admin", "ai_admin"].includes(role) ? "bg-rose-500/15 border-rose-500/20" : "bg-primary/10 border-primary/20"
    const accentGlow = ["super_admin", "admin", "security_admin", "support_admin", "ai_admin"].includes(role) ? "bg-rose-500/10" : "bg-primary/10"

    const renderAdminNav = () => (
        <nav className={cn(
            "flex-1 overflow-y-auto custom-scrollbar",
            variant === "default" ? "px-4 py-4" : "px-0 py-2"
        )}>
            {adminNavGroups.map((group) => (
                <div key={group.label} className="mb-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 px-3 mb-3">
                        {group.label}
                    </p>
                    <div className="space-y-1">
                        {group.links && group.links.map((link) => {
                            const isActive = isActiveLink(link.href, (link as any).exact)
                            return (
                                <Link key={link.href} href={link.href} className="block relative group/item">
                                    <motion.div 
                                        whileTap={{ scale: 0.98 }}
                                        className={cn(
                                            "flex items-center gap-3 px-3 h-10 rounded-xl transition-colors duration-300 relative overflow-hidden",
                                            isActive
                                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                                                : "text-muted-foreground hover:text-foreground/90 hover:bg-muted/50"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="admin-active-bar"
                                                className="absolute left-0 top-2 bottom-2 w-0.5 bg-rose-500 rounded-r-full"
                                                transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
                                            />
                                        )}
                                        <motion.div whileHover={{ x: 2 }} className="flex items-center gap-3 w-full">
                                            <link.icon className={cn("w-4 h-4 shrink-0 transition-transform", isActive ? "text-rose-400" : "group-hover/item:text-foreground/80")} />
                                            <span className={cn("text-xs font-bold tracking-tight", isActive ? "text-rose-200" : "")}>{link.label}</span>
                                            {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto shrink-0 text-rose-500/40" />}
                                        </motion.div>
                                    </motion.div>
                                </Link>
                            )
                        })}
                        {group.subGroups && group.subGroups.map((subGroup: any, idx: number) => (
                            <div key={idx} className="mt-4 mb-2">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-3 mb-2">
                                    {subGroup.label}
                                </p>
                                <div className="space-y-1 pl-2 border-l border-border/50 ml-2">
                                    {subGroup.links.map((link: any) => {
                                        const isActive = isActiveLink(link.href, link.exact)
                                        return (
                                            <Link key={link.href} href={link.href} className="block relative group/item">
                                                <motion.div 
                                                    whileTap={{ scale: 0.98 }}
                                                    className={cn(
                                                        "flex items-center gap-3 px-3 h-9 rounded-xl transition-colors duration-300 relative overflow-hidden",
                                                        isActive
                                                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                                                            : "text-muted-foreground hover:text-foreground/90 hover:bg-muted/50"
                                                    )}
                                                >
                                                    {isActive && (
                                                        <motion.div
                                                            layoutId={`admin-active-bar-sub-${idx}-${link.href}`}
                                                            className="absolute left-0 top-2 bottom-2 w-0.5 bg-rose-500 rounded-r-full"
                                                            transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
                                                        />
                                                    )}
                                                    <motion.div whileHover={{ x: 2 }} className="flex items-center gap-3 w-full">
                                                        <link.icon className={cn("w-3.5 h-3.5 shrink-0 transition-transform", isActive ? "text-rose-400" : "group-hover/item:text-foreground/80")} />
                                                        <span className={cn("text-[11px] font-bold tracking-tight", isActive ? "text-rose-200" : "")}>{link.label}</span>
                                                        {isActive && <ChevronRight className="w-3 h-3 ml-auto shrink-0 text-rose-500/40" />}
                                                    </motion.div>
                                                </motion.div>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </nav>
    )

    const { company, role: companyRole, permissions: permArray } = useCompany()

    const renderSimpleNav = () => {
        let links = role === "company" ? companyLinks : userLinks;
        
        // Dynamically point to the user's unique profile URL
        links = links.map(link => {
            if (link.href === "/user/profile" && user?.id) {
                return { ...link, href: `/in/${user.username || user.id}` }
            }
            return link;
        });
        
        const myPerms = Array.isArray(permArray) ? permArray : []
        
        // Role-based filtering for Company using relational permissions
        if (role === "company") {
            links = links.filter(link => {
                if (link.label === "Company Branding" && !myPerms.includes("can_manage_branding")) return false;
                if (link.label === "Analytics" && !myPerms.includes("can_view_company_analytics")) return false;
                if (link.label === "Job Management" && !myPerms.includes("can_create_jobs") && !myPerms.includes("can_edit_jobs")) return false;
                if (link.label === "ATS" && !myPerms.includes("can_manage_ats") && !myPerms.includes("can_view_applications")) return false;
                if (link.label === "Talent Pipeline" && !myPerms.includes("can_manage_team")) return false;
                return true;
            });
        }
        
        return (
            <nav className={cn(
                "flex-1 space-y-1 overflow-y-auto custom-scrollbar",
                variant === "default" ? "px-4 py-6" : "px-0 py-2"
            )}>
                {links.map((link) => {
                    const href = link.href
                    const isActive = isActiveLink(href, (link as any).exact)
                    return (
                        <Link key={link.href} href={href} className="block relative group/item">
                            <motion.div 
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "flex items-center gap-3 px-3 h-11 rounded-xl transition-colors duration-300 relative overflow-hidden",
                                    isActive
                                        ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_hsl(var(--primary)/0.1)]"
                                        : "text-muted-foreground hover:text-foreground/90 hover:bg-muted/50"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="user-active-bar"
                                        className="absolute left-0 top-2 bottom-2 w-0.5 bg-primary rounded-r-full"
                                        transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
                                    />
                                )}
                                <motion.div whileHover={{ x: 2 }} className="flex items-center gap-3 w-full">
                                    <link.icon className={cn("w-4.5 h-4.5 shrink-0 transition-transform", isActive ? "text-primary" : "")} />
                                    <span className={cn("text-sm font-bold tracking-tight", isActive ? "text-foreground" : "")}>{link.label}</span>
                                </motion.div>
                            </motion.div>
                        </Link>
                    )
                })}
            </nav>
        )
    }

    return (
        <aside className={cn(
            variant === "default"
                ? "w-64 flex flex-col h-screen sticky top-0 shrink-0 z-50 glass border-r border-border"
                : "w-full flex flex-col h-full bg-transparent border-none",
            className
        )}>
            {/* Ambient glow */}
            {variant === "default" && (
                <div className={cn("absolute top-0 -left-20 w-40 h-40 blur-[120px] pointer-events-none opacity-20", accentGlow)} />
            )}

            {/* Logo */}
            {variant === "default" && (
                <div className="px-6 pt-8 pb-6 border-b border-border shrink-0">
                    <Link href="/" className="flex items-center gap-3 group mb-2">
                        <div className={cn("p-2 rounded-2xl border backdrop-blur-md shadow-lg transition-all duration-300 group-hover:scale-105",
                            ["super_admin", "admin", "security_admin", "support_admin", "ai_admin"].includes(role) ? "bg-rose-500/20 border-rose-500/30" : "bg-primary/20 border-primary/30"
                        )}>
                            <ShieldCheck className={cn("w-5 h-5", ["super_admin", "admin", "security_admin", "support_admin", "ai_admin"].includes(role) ? "text-rose-400" : "text-primary")} />
                        </div>
                        <div>
                            <p className="text-base font-black tracking-tighter text-gradient leading-none">Best Hiring Tool</p>
                            <p className={cn("text-[9px] uppercase tracking-[0.3em] font-black leading-tight mt-1",
                                ["super_admin", "admin", "security_admin", "support_admin", "ai_admin"].includes(role) ? "text-rose-500/60" : "text-primary/60"
                            )}>
                                {["super_admin", "admin", "security_admin", "support_admin", "ai_admin"].includes(role) ? "Admin Terminal" : role === "company" ? "Recruiter Hub" : "Talent Engine"}
                            </p>
                        </div>
                    </Link>

                    {["super_admin", "admin", "security_admin", "support_admin", "ai_admin"].includes(role) && (
                        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-400/70">All Systems Operational</span>
                        </div>
                    )}
                </div>
            )}

            {/* Navigation */}
            {["super_admin", "admin", "security_admin", "support_admin", "ai_admin"].includes(role) ? renderAdminNav() : renderSimpleNav()}

            {/* Footer */}
            {variant === "default" && (
                <div className="p-3 border-t border-white/[0.06] space-y-1.5 shrink-0">
                    {user && (
                        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-muted/50 border border-border/50 mb-2">
                            <div className={cn(
                                "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0",
                                ["super_admin", "admin", "security_admin", "support_admin", "ai_admin"].includes(role) ? "bg-rose-500/20 text-rose-400" : "bg-primary/20 text-primary"
                            )}>
                                {(user.name || user.name || "?").charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold truncate text-foreground/90">{user.name || user.name || "User"}</p>
                                <p className="text-[8px] uppercase tracking-widest text-muted-foreground font-bold">{user.role || role}</p>
                            </div>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-red-500/50 hover:text-red-400 hover:bg-red-500/10 transition-all h-9 px-3 rounded-xl group text-xs font-medium"
                        onClick={logout}
                    >
                        <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                        Sign Out
                    </Button>
                </div>
            )}
        </aside>
    )
}
