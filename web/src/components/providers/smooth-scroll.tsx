"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import Lenis from "lenis"

const DASHBOARD_ROUTES = [
    "/user", "/company", "/superadmin", "/admin",
    "/feed", "/challenges", "/roadmap", "/competitions",
    "/github", "/search", "/settings", "/profile", "/in",
    "/hr", "/bounties", "/applications", "/dashboard",
    "/assessments", "/notifications", "/post-job", "/quiz", "/recruiter", "/staff"
]

export function SmoothScroll() {
    const pathname = usePathname()
    const isDashboard = DASHBOARD_ROUTES.some(route => pathname?.startsWith(route))

    useEffect(() => {
        // Never activate Lenis on dashboard routes - the AppShell handles its own scrolling
        if (isDashboard) return

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            touchMultiplier: 2,
        })

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => {
            lenis.destroy()
        }
    }, [isDashboard])

    return null
}
