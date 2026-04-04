"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import {
    LayoutDashboard, Users, Briefcase, Flag, Ticket,
    Shield, Cpu, LogOut, ChevronRight, Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
    { href: "/staff/dashboard",   label: "Dashboard",      icon: LayoutDashboard },
    { href: "/staff/users",       label: "User Moderation", icon: Users },
    { href: "/staff/jobs",        label: "Job Moderation",  icon: Briefcase },
    { href: "/staff/reports",     label: "Reports & Flags", icon: Flag },
    { href: "/staff/tickets",     label: "Support Tickets", icon: Ticket },
    { href: "/staff/nft-monitor", label: "NFT Monitor",     icon: Shield },
]

function StaffSidebar() {
    const pathname = usePathname()
    return (
        <aside className="hidden md:flex flex-col w-64 min-h-screen bg-slate-950 border-r border-slate-800 text-slate-100 sticky top-0">
            <div className="px-6 py-5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-violet-400" />
                    <span className="font-bold text-lg tracking-tight">Staff Panel</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">SkillProof AI Operations</p>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const active = pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                                active
                                    ? "bg-violet-600/20 text-violet-300 border border-violet-600/30"
                                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                            )}
                        >
                            <span className="flex items-center gap-3">
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </span>
                            {active && <ChevronRight className="w-3 h-3 opacity-60" />}
                        </Link>
                    )
                })}
            </nav>
            <div className="px-3 py-4 border-t border-slate-800">
                <Link
                    href="/auth/login"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </Link>
            </div>
        </aside>
    )
}

export default function StaffLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading) {
            if (!user) router.push("/auth/login")
            else if (user.role !== "staff" && user.role !== "admin") router.push("/user/dashboard")
        }
    }, [user, isLoading, router])

    if (isLoading || !user) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-950">
                <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100">
            <StaffSidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="p-6 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
