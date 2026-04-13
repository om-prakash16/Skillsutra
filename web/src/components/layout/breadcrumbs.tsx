"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const labelMap: Record<string, string> = {
    dashboard: "Nexus Home",
    company: "Mission Control",
    candidate: "Candidate Core",
    admin: "Governance",
    talent: "Personnel Discovery",
    jobs: "Job Archive",
    applicants: "Personnel Resonance",
    post: "Launch Mission",
    manage: "Fleet Management",
    profile: "Identity Sync",
    assessments: "Skill Verification"
}

export function Breadcrumbs() {
    const pathname = usePathname()
    if (!pathname || pathname === "/") return null

    const segments = pathname.split("/").filter(Boolean)
    
    return (
        <nav className="flex items-center gap-2 px-6 py-4 bg-[#050505]/50 backdrop-blur-xl border-b border-white/5 overflow-x-auto whitespace-nowrap no-scrollbar">
            <Link 
                href="/" 
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-primary transition-colors"
            >
                <Zap className="w-3.5 h-3.5" />
                Nexus
            </Link>

            {segments.map((segment, index) => {
                const isLast = index === segments.length - 1
                const href = `/${segments.slice(0, index + 1).join("/")}`
                const label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
                
                // Skip hex/uuid IDs
                if (segment.length > 20 || /^[0-9a-f-]+$/.test(segment)) return null

                return (
                    <div key={href} className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-white/10" />
                        <Link
                            href={href}
                            className={cn(
                                "text-[10px] font-black uppercase tracking-widest transition-all",
                                isLast 
                                    ? "text-primary italic pointer-events-none" 
                                    : "text-white/40 hover:text-white"
                            )}
                        >
                            {label}
                        </Link>
                    </div>
                )
            })}
        </nav>
    )
}
