"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"

type AllowedRole = "user" | "company" | "admin"

/**
 * Client-side role guard hook.
 * 
 * Redirects users who are not authenticated or lack the required role.
 * Works alongside the middleware.ts server-side guard for defense-in-depth.
 * 
 * @param allowedRoles - Array of roles that are permitted access
 * @returns { user, isLoading, isAuthorized } 
 * 
 * @example
 * ```tsx
 * const { user, isLoading, isAuthorized } = useRoleGuard(["admin"])
 * if (isLoading || !isAuthorized) return <Loader />
 * ```
 */
export function useRoleGuard(allowedRoles: AllowedRole[]) {
    const { user, isLoading, isAuthenticated } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    const isAuthorized = isAuthenticated && user && allowedRoles.includes(user.role as AllowedRole)

    useEffect(() => {
        if (isLoading) return

        if (!isAuthenticated) {
            router.replace(`/auth/login?redirectedFrom=${encodeURIComponent(pathname)}`)
            return
        }

        if (user && !allowedRoles.includes(user.role as AllowedRole)) {
            // Redirect to the appropriate dashboard based on actual role
            switch (user.role) {
                case "admin":
                    router.replace("/admin")
                    break
                case "company":
                    router.replace("/company/dashboard")
                    break
                default:
                    router.replace("/user/dashboard")
            }
        }
    }, [user, isLoading, isAuthenticated, router, allowedRoles, pathname])

    return { user, isLoading, isAuthorized }
}
