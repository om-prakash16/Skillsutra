import { type LucideIcon } from "lucide-react";

export type NavBadge = {
  text: string;
  variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
};

export type NavItem = {
  id: string;
  label: string;
  icon?: string; // String name of the Lucide icon (e.g., 'LayoutDashboard')
  href?: string;
  description?: string;
  roles?: string[]; // Array of roles allowed to see this item
  permissions?: string[]; // specific permissions
  badges?: NavBadge;
  children?: NavItem[]; // Used for Level 2 (Module Sections) and Level 3 (Sub Pages)
};

export const superAdminNavigation: NavItem[] = [
  {
    id: "dashboard-main",
    label: "Dashboard",
    icon: "LayoutDashboard",
    children: [
      { id: "dash-overview", label: "Overview", icon: "LayoutDashboard", href: "/superadmin" },
      { id: "dash-exec", label: "Executive Dashboard", icon: "BarChart3", href: "/superadmin/dashboard/executive" },
      { id: "dash-activity", label: "Activity Feed", icon: "Activity", href: "/superadmin/dashboard/activity" },
    ]
  },
  {
    id: "platform-management",
    label: "Platform Management",
    icon: "Globe",
    children: [
      { id: "plat-tenants", label: "Tenants", icon: "Building2", href: "/superadmin/platform/tenants" },
      { id: "plat-orgs", label: "Organizations", icon: "Network", href: "/superadmin/platform/organizations" },
      { id: "plat-domains", label: "Domains", icon: "Globe", href: "/superadmin/platform/domains" },
      { id: "plat-flags", label: "Feature Flags", icon: "ToggleRight", href: "/superadmin/platform/feature-flags" },
      { id: "plat-plans", label: "Plans & Quotas", icon: "CreditCard", href: "/superadmin/platform/plans" },
    ]
  },
  {
    id: "identity-access",
    label: "Identity & Access",
    icon: "Users",
    children: [
      { id: "iam-users", label: "Users", icon: "Users", href: "/superadmin/identity/users" },
      { id: "iam-invites", label: "Invitations", icon: "Mail", href: "/superadmin/identity/invitations" },
      { id: "iam-sessions", label: "Sessions", icon: "MonitorSmartphone", href: "/superadmin/identity/sessions" },
      { id: "iam-verification", label: "Verification", icon: "ShieldCheck", href: "/superadmin/identity/verification" },
      { id: "iam-audit", label: "Audit Logs", icon: "Database", href: "/superadmin/identity/audit" },
    ]
  },
  {
    id: "authorization",
    label: "Authorization",
    icon: "ShieldCheck",
    children: [
      { id: "authz-roles", label: "Roles", icon: "ShieldCheck", href: "/superadmin/authorization/roles" },
      { id: "authz-groups", label: "Groups", icon: "Users2", href: "/superadmin/authorization/groups" },
      { id: "authz-policies", label: "Policies (ABAC)", icon: "FileText", href: "/superadmin/authorization/policies" },
      { id: "authz-requests", label: "Access Requests", icon: "Inbox", href: "/superadmin/authorization/requests", badges: { text: "12", variant: "warning" } },
    ]
  },
  {
    id: "cms",
    label: "CMS & Experience",
    icon: "LayoutTemplate",
    children: [
      { id: "cms-dashboard", label: "Dashboard", icon: "LayoutDashboard", href: "/superadmin/cms" },
      { id: "cms-pages", label: "Pages", icon: "FileText", href: "/superadmin/cms/pages" },
      { id: "cms-builder", label: "Visual Builder", icon: "MousePointerClick", href: "/superadmin/cms/builder" },
      { id: "cms-media", label: "Media Library", icon: "Image", href: "/superadmin/cms/media" },
      { id: "cms-forms", label: "Forms", icon: "FormInput", href: "/superadmin/cms/forms" },
    ]
  },
  {
    id: "recruitment",
    label: "Recruitment",
    icon: "Briefcase",
    children: [
      { id: "ats-jobs", label: "Jobs", icon: "Briefcase", href: "/superadmin/jobs" },
      { id: "ats-apps", label: "Applications", icon: "FileSpreadsheet", href: "/superadmin/applications" },
      { id: "ats-pool", label: "Talent Pool", icon: "Users", href: "/superadmin/ats/pool" },
    ]
  },
  {
    id: "ai-center",
    label: "AI Center",
    icon: "Brain",
    children: [
      { id: "ai-dashboard", label: "AI Dashboard", icon: "Brain", href: "/superadmin/ai/dashboard" },
      { id: "ai-prompts", label: "AI Prompts", icon: "MessageSquare", href: "/superadmin/ai/prompts" },
      { id: "ai-workflows", label: "AI Workflows", icon: "GitMerge", href: "/superadmin/ai/workflows" },
      { id: "ai-analytics", label: "AI Analytics", icon: "BarChart3", href: "/superadmin/ai/analytics" },
    ]
  },
  {
    id: "finance",
    label: "Finance & Billing",
    icon: "Landmark",
    children: [
      { id: "fin-dashboard", label: "Finance Dashboard", icon: "Landmark", href: "/superadmin/finance/dashboard" },
      { id: "fin-payments", label: "Payments", icon: "CreditCard", href: "/superadmin/finance/payments" },
      { id: "fin-invoices", label: "Invoices", icon: "FileText", href: "/superadmin/finance/invoices" },
      { id: "fin-plans", label: "Billing Plans", icon: "Layers", href: "/superadmin/billing/plans" },
    ]
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    icon: "Server",
    children: [
      { id: "infra-health", label: "System Health", icon: "Activity", href: "/superadmin/infra/health" },
      { id: "infra-db", label: "Database", icon: "Database", href: "/superadmin/db/tables" },
      { id: "infra-redis", label: "Redis", icon: "Database", href: "/superadmin/infra/redis" },
      { id: "infra-logs", label: "Logs", icon: "FileText", href: "/superadmin/infra/logs" },
    ]
  },
  {
    id: "system",
    label: "System Settings",
    icon: "Settings",
    children: [
      { id: "sys-general", label: "General Settings", icon: "Settings", href: "/superadmin/settings/general" },
      { id: "sys-auth", label: "Authentication", icon: "Lock", href: "/superadmin/settings/auth/login" },
      { id: "sys-advanced", label: "Advanced", icon: "Code", href: "/superadmin/settings/advanced/features" },
    ]
  }
];
