"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Briefcase, ShieldCheck, User, Search, Bell, LayoutDashboard, Users, Globe, BarChart3, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"

const guestNav = [
    { id: "home", href: "/", label: "Home", icon: Home },
    { id: "jobs", href: "/jobs", label: "Jobs", icon: Briefcase },
    { id: "verify", href: "/verify", label: "Verify", icon: ShieldCheck },
    { id: "talent", href: "/talent", label: "Talent", icon: Search },
]

const userNav = [
    { id: "home", href: "/user/dashboard", label: "Home", icon: Home },
    { id: "apps", href: "/user/applications", label: "Apps", icon: Briefcase },
    { id: "notif", href: "/notifications", label: "Alerts", icon: Bell },
    { id: "discover", href: "/search/candidates", label: "Discover", icon: Globe },
    { id: "profile", href: "/user/profile", label: "Profile", icon: User },
]

const recruiterNav = [
    { id: "dash", href: "/recruiter/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "cands", href: "/recruiter/candidates", label: "Candidates", icon: Users },
    { id: "jobs", href: "/recruiter/jobs", label: "Jobs", icon: Briefcase },
    { id: "notif", href: "/notifications", label: "Alerts", icon: Bell },
    { id: "profile", href: "/recruiter/profile", label: "Profile", icon: User },
]

const companyNav = [
    { id: "dash", href: "/company/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "jobs", href: "/company/jobs", label: "Jobs", icon: Briefcase },
    { id: "talent", href: "/search/talent", label: "Talent", icon: Search },
    { id: "analytics", href: "/company/analytics", label: "Stats", icon: BarChart3 },
    { id: "profile", href: "/company/profile", label: "Profile", icon: User },
]

const adminNav = [
    { id: "dash", href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", href: "/admin/users", label: "Users", icon: Users },
    { id: "cms", href: "/admin/cms", label: "CMS", icon: Globe },
    { id: "alerts", href: "/admin/reports", label: "Alerts", icon: AlertTriangle },
    { id: "profile", href: "/admin/profile", label: "Profile", icon: User },
]

export function MobileNav() {
    const pathname = usePathname()
    const { user, isAuthenticated, isLoading } = useAuth()

    if (isLoading) return null;

    let navItems = guestNav;
    if (isAuthenticated && user) {
        if (user.role === 'admin') navItems = adminNav;
        else if (user.role === 'company') navItems = companyNav;
        else if (user.role === 'recruiter') navItems = recruiterNav;
        else navItems = userNav;
    }

    return (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-md h-16 glass rounded-2xl border-border shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl flex items-center justify-around px-2 border border-t-white/20">
            {navItems.map((item) => {
                const Icon = item.icon
                let targetHref = item.href;
                
                // Route unauthenticated users to login for the profile icon (if they somehow get it)
                if (item.id === "profile" && !isAuthenticated) {
                    targetHref = `/auth/login?redirectedFrom=${encodeURIComponent(item.href)}`;
                } else if (item.id === "profile" && user?.username) {
                    targetHref = `/${user.username}`;
                }
                
                const isActive = pathname === targetHref || (targetHref !== "/" && pathname?.startsWith(targetHref))
                
                return (
                    <Link key={item.id} href={targetHref} className="relative flex flex-col items-center justify-center w-12 h-12 group">
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            className={cn(
                                "p-2 rounded-xl transition-all duration-300",
                                isActive 
                                    ? "bg-primary/20 text-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)]" 
                                    : "text-muted-foreground/60 hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5]" : "stroke-[1.5]")} />
                        </motion.div>
                        {isActive && (
                            <motion.div 
                                layoutId="mobile-nav-active"
                                className="absolute -top-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_hsl(var(--primary)/0.8)]"
                            />
                        )}
                        <span className={cn(
                            "text-[8px] font-black uppercase tracking-tighter mt-0.5 transition-all",
                            isActive ? "text-primary opacity-100" : "opacity-0"
                        )}>
                            {item.label}
                        </span>
                    </Link>
                )
            })}
        </div>
    )
}
