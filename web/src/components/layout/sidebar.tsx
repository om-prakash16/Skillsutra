"use client"
import React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard, User, Briefcase, Bookmark, Settings, LogOut, Building2, Users, 
    Zap, Code, Brain, Boxes, History, ShieldAlert, Fingerprint, FileText, BarChart3, 
    Flag, Tags, Globe, Cpu, Activity, ChevronRight, ChevronDown, CreditCard, ShieldCheck, Key, 
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
import { useAppShellStore } from "@/store/app-shell-store"

interface SidebarProps {
    role: "super_admin" | "admin" | "career_professional" | "company" | "mentor" | "moderator" | "user" | string
    className?: string
    variant?: "default" | "mobile"
}


const adminNavGroups = [
    {
        label: "Platform Admin",
        links: [
            { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
        ]
    },
    {
        label: "CMS & Content",
        links: [
            { href: "/admin/cms/pages", label: "Pages", icon: FileText },
            { href: "/admin/cms/builder", label: "Visual Builder", icon: MousePointerClick },
            { href: "/admin/cms/blog", label: "Blog", icon: FileText },
            { href: "/admin/cms/media", label: "Media Library", icon: ImageIcon },
        ]
    },
    {
        label: "Moderation",
        links: [
            { href: "/admin/moderation/users", label: "Users", icon: Users },
            { href: "/admin/moderation/community", label: "Community Feed", icon: MessagesSquare },
        ]
    },
    {
        label: "Support",
        links: [
            { href: "/admin/support/tickets", label: "Tickets", icon: Ticket },
        ]
    }
]

const superAdminNavGroups = [
    {
        label: "Dashboard",
        links: [
            { href: "/superadmin", label: "Overview", icon: LayoutDashboard, exact: true },
            { href: "/superadmin/dashboard/executive", label: "Executive Dashboard", icon: BarChart3 },
            { href: "/superadmin/dashboard/activity", label: "Activity Feed", icon: Activity },
            { href: "/superadmin/dashboard/quick-actions", label: "Quick Actions", icon: Zap },
            { href: "/superadmin/dashboard/favorites", label: "Favorites", icon: Star },
            { href: "/superadmin/dashboard/recent", label: "Recent Activity", icon: History },
        ]
    },
    {
        label: "Platform Management",
        links: [
            { href: "/superadmin/platform", label: "Overview", icon: LayoutDashboard },
            { href: "/superadmin/platform/tenants", label: "Tenants", icon: Building2 },
            { href: "/superadmin/platform/organizations", label: "Organizations", icon: Network },
            { href: "/superadmin/platform/workspaces", label: "Workspaces", icon: SplitSquareHorizontal },
            { href: "/superadmin/platform/domains", label: "Domains", icon: Globe },
            { href: "/superadmin/platform/regions", label: "Regions", icon: Map },
            { href: "/superadmin/platform/feature-flags", label: "Feature Flags", icon: ToggleRight },
            { href: "/superadmin/platform/quotas", label: "Quotas", icon: BarChart3 },
            { href: "/superadmin/platform/plans", label: "Plans", icon: CreditCard },
            { href: "/superadmin/platform/usage", label: "Usage", icon: Activity },
            { href: "/superadmin/platform/maintenance", label: "Maintenance", icon: Wrench },
        ]
    },
    {
        label: "Identity & Access",
        links: [
            { href: "/superadmin/identity", label: "Dashboard", icon: LayoutDashboard },
            { href: "/superadmin/identity/users", label: "Users", icon: Users },
            { href: "/superadmin/identity/invitations", label: "Invitations", icon: Mail },
            { href: "/superadmin/identity/organizations", label: "Organizations", icon: Building2 },
            { href: "/superadmin/identity/groups", label: "User Groups", icon: Users2 },
            { href: "/superadmin/identity/roles", label: "Roles", icon: ShieldCheck },
            { href: "/superadmin/identity/permissions", label: "Permissions", icon: Key },
            { href: "/superadmin/identity/sessions", label: "Sessions", icon: MonitorSmartphone },
            { href: "/superadmin/identity/devices", label: "Devices", icon: Cpu },
            { href: "/superadmin/identity/api-keys", label: "API Keys", icon: Code },
            { href: "/superadmin/identity/oauth", label: "OAuth Apps", icon: Puzzle },
            { href: "/superadmin/identity/mfa", label: "MFA", icon: Lock },
            { href: "/superadmin/identity/verification", label: "Verification", icon: ShieldCheck },
            { href: "/superadmin/identity/login-history", label: "Login History", icon: History },
            { href: "/superadmin/identity/security-events", label: "Security Events", icon: ShieldAlert },
            { href: "/superadmin/identity/impersonation", label: "Impersonation", icon: Fingerprint },
            { href: "/superadmin/identity/audit", label: "Audit Logs", icon: Database },
        ]
    },
    {
        label: "Authorization",
        links: [
            { href: "/superadmin/authorization", label: "Dashboard", icon: LayoutDashboard },
            { href: "/superadmin/authorization/roles", label: "Roles", icon: ShieldCheck },
            { href: "/superadmin/authorization/roles/platform", label: "Platform Roles", icon: Globe },
            { href: "/superadmin/authorization/roles/tenant", label: "Tenant Roles", icon: Building2 },
            { href: "/superadmin/authorization/roles/workspace", label: "Workspace Roles", icon: SplitSquareHorizontal },
            { href: "/superadmin/authorization/library", label: "Permission Library", icon: Key },
            { href: "/superadmin/authorization/groups", label: "Permission Groups", icon: Users2 },
            { href: "/superadmin/authorization/policies", label: "Policies (ABAC)", icon: FileText },
            { href: "/superadmin/authorization/templates", label: "Role Templates", icon: Copy },
            { href: "/superadmin/authorization/delegation", label: "Delegation", icon: GitMerge },
            { href: "/superadmin/authorization/temporary", label: "Temporary Access", icon: Clock },
            { href: "/superadmin/authorization/approval-matrix", label: "Approval Matrix", icon: CheckCircle2 },
            { href: "/superadmin/authorization/requests", label: "Access Requests", icon: Inbox },
            { href: "/superadmin/authorization/features", label: "Feature Access", icon: ToggleRight },
            { href: "/superadmin/authorization/resources", label: "Resource Permissions", icon: FolderLock },
            { href: "/superadmin/authorization/simulate", label: "Simulate Access", icon: PlayCircle },
            { href: "/superadmin/authorization/audit", label: "Audit", icon: History },
        ]
    },
    {
        label: "CMS & Experience",
        links: [
            { href: "/superadmin/cms", label: "Dashboard", icon: LayoutDashboard },
            { href: "/superadmin/cms/pages", label: "Pages", icon: FileText },
            { href: "/superadmin/cms/collections", label: "Collections", icon: Database },
            { href: "/superadmin/cms/entries", label: "Content Entries", icon: ListTree },
            { href: "/superadmin/cms/builder", label: "Visual Builder", icon: MousePointerClick },
            { href: "/superadmin/cms/components", label: "Components", icon: Puzzle },
            { href: "/superadmin/cms/templates", label: "Templates", icon: LayoutTemplate },
            { href: "/superadmin/cms/blocks", label: "Global Blocks", icon: Box },
            { href: "/superadmin/cms/navigation", label: "Navigation", icon: LinkIcon },
            { href: "/superadmin/cms/media", label: "Media Library", icon: ImageIcon },
            { href: "/superadmin/cms/forms", label: "Forms", icon: FormInput },
            { href: "/superadmin/cms/popups", label: "Popups", icon: MessageSquare },
            { href: "/superadmin/cms/seo", label: "SEO", icon: Search },
            { href: "/superadmin/cms/routes", label: "Routes & Slugs", icon: Route },
            { href: "/superadmin/cms/themes", label: "Themes", icon: Palette },
            { href: "/superadmin/cms/localization", label: "Localization", icon: Globe },
            { href: "/superadmin/cms/publishing", label: "Publishing", icon: Send },
            { href: "/superadmin/cms/ai", label: "AI Content", icon: Bot },
        ]
    },
    {
        label: "Recruitment",
        subGroups: [
            {
                label: "Jobs",
                links: [
                    { href: "/superadmin/jobs", label: "All Jobs", icon: Briefcase },
                    { href: "/superadmin/jobs/drafts", label: "Draft Jobs", icon: FileText },
                    { href: "/superadmin/jobs/published", label: "Published Jobs", icon: CheckCircle2 },
                    { href: "/superadmin/jobs/scheduled", label: "Scheduled Jobs", icon: Calendar },
                    { href: "/superadmin/jobs/archived", label: "Archived Jobs", icon: Archive },
                ]
            },
            {
                label: "Applications",
                links: [
                    { href: "/superadmin/applications", label: "All Applications", icon: FileSpreadsheet },
                    { href: "/superadmin/applications/pipeline", label: "Pipeline", icon: GitMerge },
                    { href: "/superadmin/applications/shortlisted", label: "Shortlisted", icon: Star },
                    { href: "/superadmin/applications/interviews", label: "Interviews", icon: MessagesSquare },
                    { href: "/superadmin/applications/offers", label: "Offers", icon: Award },
                    { href: "/superadmin/applications/hired", label: "Hired", icon: CheckCircle2 },
                    { href: "/superadmin/applications/rejected", label: "Rejected", icon: UserX },
                ]
            },
            {
                label: "ATS",
                links: [
                    { href: "/superadmin/ats/pool", label: "Talent Pool", icon: Users },
                    { href: "/superadmin/ats/requisitions", label: "Requisitions", icon: ClipboardList },
                    { href: "/superadmin/ats/skills", label: "Skills Library", icon: GraduationCap },
                    { href: "/superadmin/ats/questions", label: "Question Bank", icon: HelpCircle },
                    { href: "/superadmin/ats/resumes", label: "Resume Database", icon: FileSpreadsheet },
                    { href: "/superadmin/ats/search", label: "Candidate Search", icon: Search },
                    { href: "/superadmin/ats/notes", label: "Candidate Notes", icon: FileText },
                    { href: "/superadmin/ats/tags", label: "Candidate Tags", icon: Tags },
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
                    { href: "/superadmin/projects/workspace", label: "Workspace Dashboard", icon: LayoutDashboard },
                    { href: "/superadmin/projects/board", label: "Sprint Board", icon: Kanban },
                    { href: "/superadmin/projects/tasks", label: "My Tasks", icon: CheckSquare },
                ]
            },
            {
                label: "Planning",
                links: [
                    { href: "/superadmin/projects/time", label: "Time Tracking", icon: Clock },
                    { href: "/superadmin/projects/resources", label: "Resource Workload", icon: Users2 },
                    { href: "/superadmin/projects/wiki", label: "Knowledge Base", icon: BookOpen },
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
                    { href: "/superadmin/erp/dashboard", label: "Executive Dashboard", icon: BarChart3 },
                    { href: "/superadmin/erp/finance", label: "General Ledger", icon: Landmark },
                ]
            },
            {
                label: "Supply Chain & Ops",
                links: [
                    { href: "/superadmin/erp/procurement", label: "Procurement & Vendors", icon: ShoppingCart },
                    { href: "/superadmin/erp/contracts", label: "Contract Management", icon: FileSignature },
                    { href: "/superadmin/erp/inventory", label: "Inventory & Assets", icon: Package },
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
                    { href: "/superadmin/ecosystem/marketplace", label: "App Marketplace", icon: Store },
                    { href: "/superadmin/ecosystem/integrations", label: "Installed Plugins", icon: Puzzle },
                ]
            },
            {
                label: "Developer Tools",
                links: [
                    { href: "/superadmin/ecosystem/api", label: "API & Webhooks", icon: Webhook },
                    { href: "/superadmin/ecosystem/developer", label: "Developer Portal", icon: Terminal },
                    { href: "/superadmin/ecosystem/portals", label: "Partner Portals", icon: Globe },
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
                    { href: "/superadmin/hrms/dashboard", label: "HR Dashboard", icon: LayoutDashboard },
                    { href: "/superadmin/hrms/directory", label: "Employee Directory", icon: Users },
                    { href: "/superadmin/hrms/org-chart", label: "Organization Chart", icon: Network },
                ]
            },
            {
                label: "Lifecycle & Time",
                links: [
                    { href: "/superadmin/hrms/onboarding", label: "Onboarding & Offboarding", icon: UserPlus },
                    { href: "/superadmin/hrms/attendance", label: "Time & Attendance", icon: Clock },
                    { href: "/superadmin/hrms/leave", label: "Leave Center", icon: CalendarOff },
                    { href: "/superadmin/hrms/documents", label: "Documents", icon: FileCheck },
                ]
            },
            {
                label: "Performance & Ops",
                links: [
                    { href: "/superadmin/hrms/performance", label: "Performance & Goals", icon: Target },
                    { href: "/superadmin/hrms/assets", label: "Assets", icon: Laptop },
                    { href: "/superadmin/hrms/expenses", label: "Expenses", icon: Receipt },
                ]
            }
        ]
    },
    {
        label: "Community",
        links: [
            { href: "/superadmin/community/feed", label: "Feed", icon: LayoutDashboard },
            { href: "/superadmin/community/posts", label: "Posts", icon: FileText },
            { href: "/superadmin/community/discussions", label: "Discussions", icon: MessagesSquare },
            { href: "/superadmin/community/questions", label: "Questions", icon: HelpCircle },
            { href: "/superadmin/community/comments", label: "Comments", icon: MessageSquare },
            { href: "/superadmin/community/reports", label: "Reports", icon: AlertOctagon },
            { href: "/superadmin/community/polls", label: "Polls", icon: BarChart3 },
            { href: "/superadmin/community/events", label: "Events", icon: Calendar },
            { href: "/superadmin/community/groups", label: "Groups", icon: Users2 },
            { href: "/superadmin/community/mentorship", label: "Mentorship", icon: GraduationCap },
        ]
    },
    {
        label: "Learning",
        links: [
            { href: "/superadmin/learning/courses", label: "Courses", icon: BookOpen },
            { href: "/superadmin/learning/lessons", label: "Lessons", icon: FileText },
            { href: "/superadmin/learning/modules", label: "Modules", icon: Layers },
            { href: "/superadmin/learning/quizzes", label: "Quizzes", icon: FileQuestion },
            { href: "/superadmin/learning/certificates", label: "Certificates", icon: Award },
            { href: "/superadmin/learning/skills", label: "Skills", icon: Zap },
            { href: "/superadmin/learning/paths", label: "Learning Paths", icon: Map },
        ]
    },
    {
        label: "CMS",
        subGroups: [
            {
                label: "Website",
                links: [
                    { href: "/superadmin/cms/pages", label: "Pages", icon: PanelTop },
                    { href: "/superadmin/cms/navigation", label: "Navigation", icon: Navigation },
                    { href: "/superadmin/cms/header", label: "Header Builder", icon: AlignVerticalSpaceAround },
                    { href: "/superadmin/cms/footer", label: "Footer Builder", icon: AlignVerticalSpaceAround },
                    { href: "/superadmin/cms/mega-menu", label: "Mega Menu", icon: Layers },
                    { href: "/superadmin/cms/landing", label: "Landing Pages", icon: LayoutTemplate },
                ]
            },
            {
                label: "Content",
                links: [
                    { href: "/superadmin/cms/blog", label: "Blog", icon: FileText },
                    { href: "/superadmin/cms/categories", label: "Categories", icon: FolderOpen },
                    { href: "/superadmin/cms/tags", label: "Tags", icon: Tags },
                    { href: "/superadmin/cms/authors", label: "Authors", icon: Users },
                    { href: "/superadmin/cms/media", label: "Media Library", icon: ImageIcon },
                    { href: "/superadmin/cms/files", label: "File Manager", icon: FileArchive },
                ]
            },
            {
                label: "Builder",
                links: [
                    { href: "/superadmin/cms/components", label: "Components", icon: ToyBrick },
                    { href: "/superadmin/cms/sections", label: "Sections", icon: LayoutDashboard },
                    { href: "/superadmin/cms/templates", label: "Templates", icon: LayoutTemplate },
                    { href: "/superadmin/cms/global", label: "Global Components", icon: Globe },
                    { href: "/superadmin/cms/theme", label: "Theme Builder", icon: Palette },
                    { href: "/superadmin/cms/tokens", label: "Design Tokens", icon: Type },
                ]
            },
            {
                label: "SEO",
                links: [
                    { href: "/superadmin/cms/seo", label: "Meta Manager", icon: Search },
                    { href: "/superadmin/cms/sitemap", label: "Sitemap", icon: Map },
                    { href: "/superadmin/cms/redirects", label: "Redirects", icon: GitMerge },
                    { href: "/superadmin/cms/robots", label: "Robots", icon: Settings },
                    { href: "/superadmin/cms/schema", label: "Schema", icon: Code },
                    { href: "/superadmin/cms/og", label: "Open Graph", icon: Share2 },
                ]
            }
        ]
    },
    {
        label: "AI Center",
        links: [
            { href: "/superadmin/ai/dashboard", label: "AI Dashboard", icon: Brain },
            { href: "/superadmin/ai/models", label: "AI Models", icon: Cpu },
            { href: "/superadmin/ai/prompts", label: "AI Prompts", icon: MessageSquare },
            { href: "/superadmin/ai/assistants", label: "AI Assistants", icon: User },
            { href: "/superadmin/ai/workflows", label: "AI Workflows", icon: GitMerge },
            { href: "/superadmin/ai/automation", label: "AI Automation", icon: Zap },
            { href: "/superadmin/ai/analytics", label: "AI Analytics", icon: BarChart3 },
            { href: "/superadmin/ai/usage", label: "AI Usage", icon: Activity },
            { href: "/superadmin/ai/costs", label: "AI Cost Monitor", icon: Banknote },
        ]
    },
    {
        label: "Marketing",
        links: [
            { href: "/superadmin/marketing/campaigns", label: "Campaigns", icon: Megaphone },
            { href: "/superadmin/marketing/newsletters", label: "Newsletters", icon: MailCheck },
            { href: "/superadmin/marketing/popups", label: "Popups", icon: AlertOctagon },
            { href: "/superadmin/marketing/announcements", label: "Announcement Bar", icon: Flag },
            { href: "/superadmin/marketing/push", label: "Push Notifications", icon: Bell },
            { href: "/superadmin/marketing/sms", label: "SMS", icon: Smartphone },
            { href: "/superadmin/marketing/whatsapp", label: "WhatsApp", icon: MessageSquare },
            { href: "/superadmin/marketing/emails", label: "Email Campaigns", icon: Mail },
            { href: "/superadmin/marketing/referrals", label: "Referral System", icon: Users },
        ]
    },
    {
        label: "Communication",
        links: [
            { href: "/superadmin/comm/notifications", label: "Notifications", icon: Bell },
            { href: "/superadmin/comm/emails", label: "Email Center", icon: Mail },
            { href: "/superadmin/comm/templates", label: "Templates", icon: LayoutTemplate },
            { href: "/superadmin/comm/inbox", label: "Inbox", icon: Mail },
            { href: "/superadmin/comm/chat", label: "Chat", icon: MessageSquare },
            { href: "/superadmin/comm/tickets", label: "Support Tickets", icon: Ticket },
            { href: "/superadmin/comm/messages", label: "Contact Messages", icon: MessagesSquare },
        ]
    },
    {
        label: "Finance",
        links: [
            { href: "/superadmin/finance/revenue", label: "Revenue", icon: Landmark },
            { href: "/superadmin/finance/payments", label: "Payments", icon: CreditCard },
            { href: "/superadmin/finance/transactions", label: "Transactions", icon: Receipt },
            { href: "/superadmin/finance/refunds", label: "Refunds", icon: RefreshCw },
            { href: "/superadmin/finance/invoices", label: "Invoices", icon: FileText },
            { href: "/superadmin/finance/taxes", label: "Taxes", icon: FileSpreadsheet },
            { href: "/superadmin/finance/coupons", label: "Coupons", icon: Ticket },
            { href: "/superadmin/finance/wallet", label: "Wallet", icon: Wallet },
            { href: "/superadmin/finance/payouts", label: "Payouts", icon: Banknote },
        ]
    },
    {
        label: "Billing",
        links: [
            { href: "/superadmin/billing/plans", label: "Plans", icon: Layers },
            { href: "/superadmin/billing/subscriptions", label: "Subscriptions", icon: CreditCard },
            { href: "/superadmin/billing/usage", label: "Usage", icon: Activity },
            { href: "/superadmin/billing/licenses", label: "Licenses", icon: Key },
            { href: "/superadmin/billing/credits", label: "Credits", icon: Star },
            { href: "/superadmin/billing/api", label: "API Usage", icon: Code },
        ]
    },
    {
        label: "Analytics",
        links: [
            { href: "/superadmin/analytics/dashboard", label: "Executive Dashboard", icon: BarChart3 },
            { href: "/superadmin/analytics/users", label: "Users", icon: Users },
            { href: "/superadmin/analytics/companies", label: "Companies", icon: Building2 },
            { href: "/superadmin/analytics/jobs", label: "Jobs", icon: Briefcase },
            { href: "/superadmin/analytics/revenue", label: "Revenue", icon: Landmark },
            { href: "/superadmin/analytics/engagement", label: "Engagement", icon: Activity },
            { href: "/superadmin/analytics/traffic", label: "Traffic", icon: Globe },
            { href: "/superadmin/analytics/ai", label: "AI Analytics", icon: Brain },
            { href: "/superadmin/analytics/reports", label: "Reports", icon: FileText },
            { href: "/superadmin/analytics/funnels", label: "Funnels", icon: Filter },
        ]
    },
    {
        label: "Search",
        links: [
            { href: "/superadmin/search/universal", label: "Universal Search", icon: Search },
            { href: "/superadmin/search/analytics", label: "Search Analytics", icon: BarChart3 },
            { href: "/superadmin/search/index", label: "Search Index", icon: Database },
            { href: "/superadmin/search/synonyms", label: "Search Synonyms", icon: Languages },
        ]
    },
    {
        label: "Security",
        subGroups: [
            {
                label: "Security",
                links: [
                    { href: "/superadmin/security/dashboard", label: "Security Dashboard", icon: ShieldCheck },
                    { href: "/superadmin/security/threats", label: "Threat Detection", icon: ShieldAlert },
                    { href: "/superadmin/security/policies", label: "Security Policies", icon: FileText },
                    { href: "/superadmin/security/firewall", label: "Firewall Rules", icon: Server },
                    { href: "/superadmin/security/limits", label: "Rate Limits", icon: Activity },
                    { href: "/superadmin/security/api", label: "API Security", icon: Code },
                ]
            },
            {
                label: "Audit",
                links: [
                    { href: "/superadmin/audit/logs", label: "Audit Logs", icon: Fingerprint },
                    { href: "/superadmin/audit/users", label: "User Activity", icon: Users },
                    { href: "/superadmin/audit/admins", label: "Admin Activity", icon: Key },
                    { href: "/superadmin/audit/api", label: "API Logs", icon: Code },
                    { href: "/superadmin/audit/login", label: "Login Logs", icon: History },
                ]
            }
        ]
    },
    {
        label: "Automation",
        links: [
            { href: "/superadmin/automation/workflows", label: "Workflow Builder", icon: GitMerge },
            { href: "/superadmin/automation/tasks", label: "Scheduled Tasks", icon: Calendar },
            { href: "/superadmin/automation/queue", label: "Queue Manager", icon: List },
            { href: "/superadmin/automation/background", label: "Background Jobs", icon: Cpu },
            { href: "/superadmin/automation/webhooks", label: "Webhooks", icon: Webhook },
            { href: "/superadmin/automation/integrations", label: "Integrations", icon: ToyBrick },
        ]
    },
    {
        label: "Integrations",
        links: [
            { href: "/superadmin/integrations/keys", label: "API Keys", icon: Key },
            { href: "/superadmin/integrations/oauth", label: "OAuth Apps", icon: Lock },
            { href: "/superadmin/integrations/webhooks", label: "Webhooks", icon: Webhook },
            { href: "/superadmin/integrations/stripe", label: "Stripe", icon: CreditCard },
            { href: "/superadmin/integrations/razorpay", label: "Razorpay", icon: CreditCard },
            { href: "/superadmin/integrations/google", label: "Google", icon: Globe },
            { href: "/superadmin/integrations/microsoft", label: "Microsoft", icon: LayoutDashboard },
            { href: "/superadmin/integrations/slack", label: "Slack", icon: MessageSquare },
            { href: "/superadmin/integrations/discord", label: "Discord", icon: MessagesSquare },
            { href: "/superadmin/integrations/zapier", label: "Zapier", icon: Zap },
            { href: "/superadmin/integrations/n8n", label: "n8n", icon: GitMerge },
        ]
    },
    {
        label: "Infrastructure",
        links: [
            { href: "/superadmin/infra/health", label: "System Health", icon: Activity },
            { href: "/superadmin/infra/monitoring", label: "Monitoring", icon: MonitorSmartphone },
            { href: "/superadmin/infra/status", label: "Server Status", icon: Server },
            { href: "/superadmin/infra/db", label: "Database", icon: Database },
            { href: "/superadmin/infra/redis", label: "Redis", icon: Database },
            { href: "/superadmin/infra/storage", label: "Storage", icon: HardDrive },
            { href: "/superadmin/infra/cache", label: "Cache", icon: Zap },
            { href: "/superadmin/infra/cdn", label: "CDN", icon: Globe },
            { href: "/superadmin/infra/queue", label: "Queue", icon: List },
            { href: "/superadmin/infra/logs", label: "Logs", icon: FileText },
        ]
    },
    {
        label: "Database",
        links: [
            { href: "/superadmin/db/tables", label: "Tables", icon: Database },
            { href: "/superadmin/db/sql", label: "SQL Console", icon: Code },
            { href: "/superadmin/db/backups", label: "Backups", icon: Archive },
            { href: "/superadmin/db/restore", label: "Restore", icon: RefreshCw },
            { href: "/superadmin/db/migrations", label: "Migrations", icon: GitMerge },
            { href: "/superadmin/db/indexes", label: "Indexes", icon: Search },
            { href: "/superadmin/db/performance", label: "Performance", icon: Activity },
        ]
    },
    {
        label: "Assets",
        links: [
            { href: "/superadmin/assets/media", label: "Media Library", icon: ImageIcon },
            { href: "/superadmin/assets/images", label: "Images", icon: ImageIcon },
            { href: "/superadmin/assets/videos", label: "Videos", icon: PlayCircle },
            { href: "/superadmin/assets/documents", label: "Documents", icon: FileText },
            { href: "/superadmin/assets/icons", label: "Icons", icon: Star },
            { href: "/superadmin/assets/fonts", label: "Fonts", icon: Type },
            { href: "/superadmin/assets/brand", label: "Brand Assets", icon: Palette },
        ]
    },
    {
        label: "Localization",
        links: [
            { href: "/superadmin/locale/languages", label: "Languages", icon: Languages },
            { href: "/superadmin/locale/translations", label: "Translations", icon: FileText },
            { href: "/superadmin/locale/currency", label: "Currency", icon: Banknote },
            { href: "/superadmin/locale/regions", label: "Regions", icon: Map },
            { href: "/superadmin/locale/timezones", label: "Time Zones", icon: Calendar },
        ]
    },
    {
        label: "Feature Management",
        links: [
            { href: "/superadmin/features/flags", label: "Feature Flags", icon: ToggleRight },
            { href: "/superadmin/features/experiments", label: "Experiments", icon: FlaskConical },
            { href: "/superadmin/features/ab-tests", label: "A/B Tests", icon: SplitSquareHorizontal },
            { href: "/superadmin/features/canary", label: "Canary Releases", icon: Activity },
            { href: "/superadmin/features/rollouts", label: "Rollouts", icon: GitMerge },
        ]
    },
    {
        label: "Marketplace",
        links: [
            { href: "/superadmin/marketplace/plugins", label: "Plugins", icon: ToyBrick },
            { href: "/superadmin/marketplace/themes", label: "Themes", icon: Palette },
            { href: "/superadmin/marketplace/components", label: "Components", icon: LayoutTemplate },
            { href: "/superadmin/marketplace/templates", label: "Templates", icon: Layers },
            { href: "/superadmin/marketplace/extensions", label: "Extensions", icon: Puzzle },
        ]
    },
    {
        label: "Developer",
        links: [
            { href: "/superadmin/dev/api", label: "API Explorer", icon: Code },
            { href: "/superadmin/dev/graphql", label: "GraphQL Playground", icon: Database },
            { href: "/superadmin/dev/sdk", label: "SDK", icon: ToyBrick },
            { href: "/superadmin/dev/cli", label: "CLI", icon: Code },
            { href: "/superadmin/dev/events", label: "Event Logs", icon: Activity },
            { href: "/superadmin/dev/settings", label: "Developer Settings", icon: Settings },
        ]
    },
    {
        label: "Support",
        links: [
            { href: "/superadmin/support/help", label: "Help Center", icon: HelpCircle },
            { href: "/superadmin/support/docs", label: "Documentation", icon: BookOpen },
            { href: "/superadmin/support/tickets", label: "Tickets", icon: Ticket },
            { href: "/superadmin/support/feedback", label: "Feedback", icon: MessageSquare },
            { href: "/superadmin/support/changelog", label: "Changelog", icon: History },
            { href: "/superadmin/support/releases", label: "Release Notes", icon: FileText },
        ]
    },
    {
        label: "System Administration & Observability",
        links: [
            { href: "/superadmin/system/observability", label: "Observability Center", icon: Activity },
            { href: "/superadmin/system/security", label: "Security Command Center", icon: ShieldAlert },
        ]
    },
    {
        label: "Platform Settings",
        subGroups: [
            {
                label: "General",
                links: [
                    { href: "/superadmin/settings/general", label: "General Settings", icon: Settings },
                    { href: "/superadmin/settings/branding", label: "Branding", icon: Palette },
                    { href: "/superadmin/settings/domain", label: "Domain", icon: Globe },
                    { href: "/superadmin/settings/email", label: "Email", icon: Mail },
                    { href: "/superadmin/settings/storage", label: "Storage", icon: HardDrive },
                ]
            },
            {
                label: "Authentication",
                links: [
                    { href: "/superadmin/settings/auth/login", label: "Login", icon: LogIn },
                    { href: "/superadmin/settings/auth/sso", label: "SSO", icon: Key },
                    { href: "/superadmin/settings/auth/mfa", label: "MFA", icon: ShieldCheck },
                    { href: "/superadmin/settings/auth/password", label: "Password Policy", icon: Lock },
                ]
            },
            {
                label: "System",
                links: [
                    { href: "/superadmin/settings/system/env", label: "Environment", icon: Server },
                    { href: "/superadmin/settings/system/backups", label: "Backups", icon: Archive },
                    { href: "/superadmin/settings/system/maintenance", label: "Maintenance Mode", icon: Wrench },
                    { href: "/superadmin/settings/system/cache", label: "Cache", icon: Zap },
                    { href: "/superadmin/settings/system/scheduler", label: "Scheduler", icon: Calendar },
                ]
            },
            {
                label: "Advanced",
                links: [
                    { href: "/superadmin/settings/advanced/features", label: "Feature Configuration", icon: ToggleRight },
                    { href: "/superadmin/settings/advanced/code", label: "Custom Code", icon: Code },
                    { href: "/superadmin/settings/advanced/env", label: "Environment Variables", icon: Server },
                    { href: "/superadmin/settings/advanced/secrets", label: "Secrets", icon: Key },
                    { href: "/superadmin/settings/advanced/licensing", label: "Licensing", icon: FileText },
                ]
            }
        ]
    },

    {
        label: "Routing & Delivery",
        subGroups: [
            {
                label: "Traffic Control",
                links: [
                    { href: "/superadmin/routing/dashboard", label: "Dashboard", icon: LayoutDashboard },
                    { href: "/superadmin/routing/routes", label: "Route Manager", icon: Route },
                    { href: "/superadmin/routing/redirects", label: "Redirects", icon: GitMerge },
                    { href: "/superadmin/routing/domains", label: "Domains", icon: Globe },
                ]
            },
            {
                label: "Navigation & SEO",
                links: [
                    { href: "/superadmin/routing/navigation", label: "Navigation Menus", icon: Navigation },
                    { href: "/superadmin/routing/seo", label: "SEO Settings", icon: Search },
                ]
            }
        ]
    },
    {
        label: "Account",
        links: [
            { href: "/superadmin/account/profile", label: "My Profile", icon: User },
            { href: "/superadmin/account/preferences", label: "Preferences", icon: Settings },
            { href: "/superadmin/account/notifications", label: "Notifications", icon: Bell },
            { href: "/superadmin/account/tokens", label: "API Tokens", icon: Code },
            { href: "/superadmin/account/sessions", label: "Sessions", icon: MonitorSmartphone },
            { href: "/superadmin/account/activity", label: "Activity", icon: Activity },
            { href: "/superadmin/account/logout", label: "Logout", icon: LogOut },
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

    const isSuperAdminPath = pathname.startsWith("/superadmin")
    const isStandardAdminPath = pathname.startsWith("/admin") && !isSuperAdminPath

    const showSuperAdminPanel = ["super_admin", "security_admin", "support_admin", "ai_admin"].includes(role) && isSuperAdminPath
    const showAdminPanel = ["super_admin", "admin", "moderator"].includes(role) && isStandardAdminPath

    const isAnyAdmin = showSuperAdminPanel || showAdminPanel

    const accentColor = isAnyAdmin ? "rose" : "primary"
    const accentClass = isAnyAdmin ? "text-rose-400" : "text-primary"
    const accentBg = isAnyAdmin ? "bg-rose-500/15 border-rose-500/20" : "bg-primary/10 border-primary/20"
    const accentGlow = isAnyAdmin ? "bg-rose-500/10" : "bg-primary/10"

    
const NavGroup = ({ group, idx, isActiveLink }: { group: any, idx: number, isActiveLink: (href: string, exact?: boolean) => boolean }) => {
    const [isExpanded, setIsExpanded] = React.useState(true)
    
    // Check if any link in this group is active to auto-expand
    React.useEffect(() => {
        let hasActive = false;
        if (group.links) {
            hasActive = hasActive || group.links.some((l: any) => isActiveLink(l.href, l.exact))
        }
        if (group.subGroups) {
            hasActive = hasActive || group.subGroups.some((sg: any) => sg.links.some((l: any) => isActiveLink(l.href, l.exact)))
        }
        if (hasActive) {
            setIsExpanded(true)
        }
    }, [group, isActiveLink])

    return (
        <div className="mb-6">
            <div 
                className="flex items-center justify-between px-3 mb-2 cursor-pointer group/header hover:bg-muted/30 py-1.5 rounded-lg transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 group-hover/header:text-muted-foreground transition-colors">
                    {group.label}
                </p>
                <ChevronDown className={cn("w-3 h-3 text-muted-foreground/30 transition-transform duration-200", isExpanded ? "" : "-rotate-90")} />
            </div>
            
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-1 overflow-hidden"
                    >
                        {group.links && group.links.map((link: any) => {
                            const isActive = isActiveLink(link.href, link.exact)
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
                        {group.subGroups && group.subGroups.map((subGroup: any, sIdx: number) => (
                            <div key={sIdx} className="mt-4 mb-2">
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
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const handleNavWheel = (e: React.WheelEvent<HTMLElement>) => {
        const target = e.currentTarget
        const { scrollTop, scrollHeight, clientHeight } = target
        const atTop = scrollTop <= 0 && e.deltaY < 0
        const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0
        if (atTop || atBottom) {
            e.stopPropagation()
        }
    }

    const renderAdminNav = () => (
        <div className="flex-1 relative overflow-hidden flex flex-col" style={{ minHeight: 0 }}>
            {/* Top Scroll Shadow */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none opacity-90" />
            
            <nav 
                data-lenis-prevent="true"
                onWheel={handleNavWheel}
                className={cn(
                    "flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative z-0",
                    variant === "default" ? "px-4 py-4" : "px-0 py-2"
                )}
                style={{ minHeight: 0, overscrollBehavior: "contain", contain: "strict" }}
            >
                {adminNavGroups.map((group, idx) => (
                    <NavGroup key={idx} group={group} idx={idx} isActiveLink={isActiveLink} />
                ))}
            </nav>

            {/* Bottom Scroll Shadow */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none opacity-90" />
        </div>
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
            <div className="flex-1 relative overflow-hidden flex flex-col" style={{ minHeight: 0 }}>
                {/* Top Scroll Shadow */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none opacity-90" />
                
                <nav 
                    data-lenis-prevent="true"
                    onWheel={handleNavWheel}
                    className={cn(
                        "flex-1 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative z-0",
                        variant === "default" ? "px-4 py-6" : "px-0 py-2"
                    )}
                    style={{ minHeight: 0, overscrollBehavior: "contain", contain: "strict" }}
                >
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

                {/* Bottom Scroll Shadow */}
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none opacity-90" />
            </div>
        )
    }

    const { sidebarWidth, sidebarCollapsed } = useAppShellStore()

    return (
        <aside 
            className={cn(
                variant === "default"
                    ? "flex flex-col shrink-0 z-50 glass border-r border-border transition-all duration-300 ease-in-out"
                    : "w-full flex flex-col h-full bg-transparent border-none",
                className
            )}
            style={variant === "default" ? { 
                width: sidebarCollapsed ? "80px" : `${sidebarWidth}px`,
                height: "100vh",
                maxHeight: "100vh",
                position: "sticky" as const,
                top: 0,
            } : undefined}
        >
            {/* Ambient glow */}
            {variant === "default" && (
                <div className={cn("absolute top-0 -left-20 w-40 h-40 blur-[120px] pointer-events-none opacity-20", accentGlow)} />
            )}

            {/* Logo */}
            {variant === "default" && (
                <div className="px-6 pt-8 pb-6 border-b border-border shrink-0">
                    <Link href="/superadmin" className="flex items-center gap-3 group mb-2">
                        <div className={cn("p-2 rounded-2xl border backdrop-blur-md shadow-lg transition-all duration-300 group-hover:scale-105",
                            showAdminPanel ? "bg-rose-500/20 border-rose-500/30" : "bg-primary/20 border-primary/30"
                        )}>
                            <ShieldCheck className={cn("w-5 h-5", showAdminPanel ? "text-rose-400" : "text-primary")} />
                        </div>
                        <div>
                            <p className="text-base font-black tracking-tighter text-gradient leading-none">Best Hiring Tool</p>
                            <p className={cn("text-[9px] uppercase tracking-[0.3em] font-black leading-tight mt-1",
                                showAdminPanel ? "text-rose-500/60" : "text-primary/60"
                            )}>
                                {showAdminPanel ? "Admin Terminal" : role === "company" ? "Recruiter Hub" : "Talent Engine"}
                            </p>
                        </div>
                    </Link>

                    {showAdminPanel && (
                        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-400/70">All Systems Operational</span>
                        </div>
                    )}
                </div>
            )}

            {/* Navigation */}
            {showAdminPanel ? renderAdminNav() : renderSimpleNav()}

            {/* Footer */}
            {variant === "default" && (
                <div className="p-3 border-t border-white/[0.06] space-y-1.5 shrink-0">
                    {user && (
                        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-muted/50 border border-border/50 mb-2">
                            <div className={cn(
                                "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0",
                                showAdminPanel ? "bg-rose-500/20 text-rose-400" : "bg-primary/20 text-primary"
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
