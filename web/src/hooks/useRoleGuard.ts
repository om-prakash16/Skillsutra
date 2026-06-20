"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"

type AllowedRole = "super_admin" | "admin" | "career_professional" | "company" | "mentor" | "moderator" | "user"

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

        if (isAuthenticated && !user) {
            // Edge case: AuthContext optimistically kept auth state but couldn't fetch user (e.g. 500/502 error)
            router.replace(`/auth/login?error=server_unreachable`)
            return
        }

        if (user && !allowedRoles.includes(user.role as AllowedRole)) {
            // Redirect to the appropriate dashboard based on actual role
            switch (user.role) {
                case "super_admin":
                case "admin":
                    router.replace("/admin")
                    break
                case "company":
                    router.replace("/company/dashboard")
                    break
                case "mentor":
                    router.replace("/mentor")
                    break
                case "moderator":
                    router.replace("/moderation")
                    break
                case "career_professional":
                case "user":
                default:
                    router.replace("/feed")
            }
        }
    }, [user, isLoading, isAuthenticated, router, allowedRoles, pathname])

    return { user, isLoading, isAuthorized }
}
