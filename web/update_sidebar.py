import re

with open("e:/Project/Ram/web/src/components/layout/sidebar.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add ChevronDown to imports if not there
if "ChevronDown" not in content:
    content = content.replace("ChevronRight,", "ChevronRight, ChevronDown,")

# Define NavGroup component to be inserted before renderAdminNav
nav_group_component = """
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
"""

if "import React" not in content:
    content = 'import React from "react"\n' + content

if "AnimatePresence" not in content:
    content = content.replace('import { motion }', 'import { motion, AnimatePresence }')

# Find renderAdminNav
render_admin_nav_idx = content.find("const renderAdminNav = () =>")
if render_admin_nav_idx != -1:
    content = content[:render_admin_nav_idx] + nav_group_component + "\n" + content[render_admin_nav_idx:]

# Replace the internal map loop with NavGroup component
start_marker = "            {adminNavGroups.map((group, idx) => ("
end_marker = "            ))} "

# Using regex to replace the block
pattern = r"\{adminNavGroups\.map\(\(group, idx\) => \(\s*<div key=\{idx\}.*?</div>\s*\)\)\}"

new_map_code = """{adminNavGroups.map((group, idx) => (
                <NavGroup key={idx} group={group} idx={idx} isActiveLink={isActiveLink} />
            ))}"""

content = re.sub(r"\{adminNavGroups\.map\(\(group, idx\) => \([\s\S]*?</div>\n\s*\)\)\}", new_map_code, content)

with open("e:/Project/Ram/web/src/components/layout/sidebar.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Accordion successfully added to sidebar")
