"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { MobileNav } from "@/components/layout/mobile-nav"
import { SmoothScroll } from "@/components/providers/smooth-scroll"

const DASHBOARD_ROUTES = [
    "/user", "/company", "/superadmin", "/admin",
    "/feed", "/challenges", "/roadmap", "/competitions",
    "/github", "/search", "/settings", "/profile", "/in",
    "/hr", "/bounties", "/applications", "/dashboard",
    "/assessments", "/notifications", "/post-job", "/quiz", "/recruiter", "/staff"
]

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isDashboard = DASHBOARD_ROUTES.some(route => pathname?.startsWith(route))

    // Lock html + body scrolling on dashboard routes
    useEffect(() => {
        const html = document.documentElement
        const body = document.body

        if (isDashboard) {
            html.style.overflow = "hidden"
            html.style.height = "100%"
            body.style.overflow = "hidden"
            body.style.height = "100%"
            html.classList.remove("scroll-smooth")
        } else {
            html.style.overflow = ""
            html.style.height = ""
            body.style.overflow = ""
            body.style.height = ""
            html.classList.add("scroll-smooth")
        }

        return () => {
            html.style.overflow = ""
            html.style.height = ""
            body.style.overflow = ""
            body.style.height = ""
        }
    }, [isDashboard])

    return (
        <>
            {!isDashboard && <SmoothScroll />}
            {!isDashboard && <Navbar />}

            <main className={cn(
                "w-full relative",
                isDashboard
                    ? "h-screen flex flex-col overflow-hidden"
                    : "flex-1 min-h-screen pt-20 pb-24 md:pb-0"
            )}>
                {children}
            </main>

            {!isDashboard && <Footer />}
            {!isDashboard && <MobileNav />}
        </>
    )
}
