import re
import os

sidebar_path = "src/components/layout/sidebar.tsx"
app_dir = "src/app"

with open(sidebar_path, "r", encoding="utf-8") as f:
    content = f.read()

# Extract all hrefs
# Look for href: "/some/path"
links = re.findall(r'href:\s*["\'](/[^"\']+)["\']', content)

missing_routes = []
valid_routes = []

for link in set(links):
    # Determine the directory path
    # Next.js app router: /superadmin/dashboard -> src/app/superadmin/dashboard/page.tsx
    # Wait, some might use dynamic routes or route groups like (public) or (auth).
    # But for admin panels, it's usually direct /superadmin/...
    
    # Strip leading slash
    route_path = link.lstrip("/")
    
    # Common locations to check
    possible_paths = [
        os.path.join(app_dir, route_path, "page.tsx"),
        os.path.join(app_dir, "(authenticated)", route_path, "page.tsx"),
        os.path.join(app_dir, "(public)", route_path, "page.tsx"),
        os.path.join(app_dir, "(auth)", route_path, "page.tsx"),
    ]
    
    # We might have dynamic segments e.g. /users/[id], but sidebar links are static mostly
    # except maybe if they are /user/profile
    
    found = False
    for p in possible_paths:
        if os.path.exists(p):
            found = True
            break
            
    if found:
        valid_routes.append(link)
    else:
        # Also check if it's a file without directory (e.g. src/app/feed.tsx) - Nextjs doesn't do this, it's feed/page.tsx
        missing_routes.append(link)

print(f"Total Unique Sidebar Links: {len(set(links))}")
print(f"Valid Routes Found: {len(valid_routes)}")
print(f"Missing Routes: {len(missing_routes)}")
print("\n--- Missing Routes ---")
for r in sorted(missing_routes):
    print(r)

# Generate a missing routes shell creation script
with open("create_missing_routes.ps1", "w") as f:
    for r in sorted(missing_routes):
        # Convert /some/path to src/app/some/path
        dir_path = "src/app" + r.replace("/", "\\")
        f.write(f'New-Item -ItemType Directory -Force -Path "{dir_path}" | Out-Null\n')
        f.write(f'Set-Content -Path "{dir_path}\\page.tsx" -Value "`"use client`";`r`n`r`nexport default function Placeholder() {{`r`n  return <div className=`"p-8`"><h1>Page Under Construction</h1><p>{r}</p></div>`r`n}}"\n')

print("\nGenerated create_missing_routes.ps1")
