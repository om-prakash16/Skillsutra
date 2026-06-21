import re

with open('src/components/layout/sidebar.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I want to insert "Routing & Delivery" group just before "Account"
routing_group = """
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
    },"""

content = content.replace('    {\n        label: "Account",', routing_group + '\n    {\n        label: "Account",')

with open('src/components/layout/sidebar.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Routing added to sidebar")
