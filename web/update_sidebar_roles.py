import re

with open('src/components/layout/sidebar.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Rename adminNavGroups to superAdminNavGroups
content = content.replace('const adminNavGroups = [', 'const superAdminNavGroups = [')

# Add the new adminNavGroups above superAdminNavGroups
new_admin_nav = """
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

"""

content = content.replace('const superAdminNavGroups = [', new_admin_nav + 'const superAdminNavGroups = [')

# In the render logic:
# const showAdminPanel = ["super_admin", "admin", "security_admin", "support_admin", "ai_admin"].includes(role) && isAdminPath
# change it to support both.

# Find the render logic
replace_render = """
    const isSuperAdminPath = pathname.startsWith("/superadmin")
    const isStandardAdminPath = pathname.startsWith("/admin") && !isSuperAdminPath

    const showSuperAdminPanel = ["super_admin", "security_admin", "support_admin", "ai_admin"].includes(role) && isSuperAdminPath
    const showAdminPanel = ["super_admin", "admin", "moderator"].includes(role) && isStandardAdminPath

    const isAnyAdmin = showSuperAdminPanel || showAdminPanel

    const accentColor = isAnyAdmin ? "rose" : "primary"
    const accentClass = isAnyAdmin ? "text-rose-400" : "text-primary"
    const accentBg = isAnyAdmin ? "bg-rose-500/15 border-rose-500/20" : "bg-primary/10 border-primary/20"
    const accentGlow = isAnyAdmin ? "bg-rose-500/10" : "bg-primary/10"
"""

content = re.sub(
    r'const isAdminPath = pathname.startsWith\("/superadmin"\).*?const accentGlow = showAdminPanel \? "bg-rose-500/10" : "bg-primary/10"',
    replace_render.strip(),
    content,
    flags=re.DOTALL
)

# And down in the nav mapping:
# let activeGroups = []
# if (showAdminPanel) activeGroups = adminNavGroups
# change to use both.

replace_groups = """
    let activeGroups: any[] = []
    if (showSuperAdminPanel) activeGroups = superAdminNavGroups
    else if (showAdminPanel) activeGroups = adminNavGroups
    else if (role === "company") activeGroups = companyLinks
    else if (role === "recruiter") activeGroups = recruiterLinks
    else activeGroups = userLinks
"""

content = re.sub(
    r'let activeGroups: any\[\] = \[\]\s*if \(showAdminPanel\) activeGroups = adminNavGroups\s*else if \(role === "company"\) activeGroups = companyLinks\s*else if \(role === "recruiter"\) activeGroups = recruiterLinks\s*else activeGroups = userLinks',
    replace_groups.strip(),
    content,
    flags=re.DOTALL
)

with open('src/components/layout/sidebar.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Sidebar roles separated successfully.")
