"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isDashboard = pathname?.startsWith("/user") || 
                        pathname?.startsWith("/company") || 
                        pathname?.startsWith("/superadmin") ||
                        pathname?.startsWith("/admin") // Fallback just in case
    
    return (
        <main className={cn(
            "flex-1 w-full relative",
            isDashboard 
                ? "h-screen overflow-hidden" 
                : "min-h-screen pt-20 pb-24 md:pb-0"
        )}>
            {children}
        </main>
    )
}
