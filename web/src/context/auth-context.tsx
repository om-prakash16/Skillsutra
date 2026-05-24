"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { keycloak, initKeycloak, getToken } from "@/lib/keycloak"
import { fetchWithAuth } from "@/lib/api/api-client"

type UserRole = "user" | "company" | "admin"

interface User {
    id: string
    keycloak_id: string
    name: string
    email: string
    role: UserRole
    roles: string[]
    wallet_address?: string
    user_code?: string
    profile_data: any
    dynamic_profile_data?: any
    companies?: any[]
}

interface AuthContextType {
    user: User | null
    token: string | null
    isLoading: boolean
    isAuthenticated: boolean
    signInWithGoogle: (role?: string) => Promise<void>
    signInWithGitHub: (role?: string) => Promise<void>
    signInWithApple: (role?: string) => Promise<void>
    login: (role?: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()

    /**
     * After Keycloak login, sync user to local DB and hydrate state.
     */
    const syncUser = useCallback(async (accessToken: string) => {
        try {
            // Call /auth/sync to ensure user exists in local PostgreSQL
            const syncData = await fetchWithAuth("/auth/sync", {
                method: "POST",
                headers: { Authorization: `Bearer ${accessToken}` },
            })

            // Call /auth/me for full user data
            const meData = await fetchWithAuth("/auth/me", {
                headers: { Authorization: `Bearer ${accessToken}` },
            })

            const roles: string[] = syncData?.roles || meData?.roles || ["user"]
            const primaryRole = (
                roles.includes("admin") ? "admin" :
                roles.includes("company") ? "company" : "user"
            ) as UserRole

            setUser({
                id: syncData?.user_id || meData?.local_id || meData?.sub || "",
                keycloak_id: syncData?.keycloak_id || meData?.sub || "",
                name: syncData?.name || meData?.name || "",
                email: syncData?.email || meData?.email || "",
                role: primaryRole,
                roles,
                wallet_address: meData?.wallet_address || "",
                user_code: syncData?.user_code || meData?.user_code || "",
                profile_data: meData?.profile_data || {},
                dynamic_profile_data: meData?.dynamic_profile_data || {},
            })
            setIsAuthenticated(true)
        } catch (err: any) {
            console.error("[auth] user sync failed:", err)
            toast.error("Failed to sync user data")
        }
    }, [])

    // Initialize Keycloak on mount
    useEffect(() => {
        let cancelled = false

        const init = async () => {
            try {
                const authenticated = await initKeycloak()
                if (cancelled) return

                if (authenticated && keycloak.token) {
                    setToken(keycloak.token)
                    // Store token for fetchWithAuth compatibility
                    localStorage.setItem("auth_token", keycloak.token)
                    await syncUser(keycloak.token)
                }
            } catch (err) {
                console.error("[auth] keycloak init failed:", err)
            } finally {
                if (!cancelled) setIsLoading(false)
            }
        }

        init()

        // Set up token refresh interval
        const refreshInterval = setInterval(async () => {
            if (keycloak.authenticated) {
                const freshToken = await getToken()
                if (freshToken) {
                    setToken(freshToken)
                    localStorage.setItem("auth_token", freshToken)
                } else {
                    // Session expired
                    setUser(null)
                    setToken(null)
                    setIsAuthenticated(false)
                    localStorage.removeItem("auth_token")
                }
            }
        }, 30000) // Check every 30 seconds

        return () => {
            cancelled = true
            clearInterval(refreshInterval)
        }
    }, [syncUser])

    /**
     * Social login helpers — redirect to Keycloak with identity provider hint.
     */
    const signInWithGoogle = async (role = "user") => {
        setIsLoading(true)
        // Store requested role so we can use it after redirect
        localStorage.setItem("requested_role", role)
        keycloak.login({ idpHint: "google" })
    }

    const signInWithGitHub = async (role = "user") => {
        setIsLoading(true)
        localStorage.setItem("requested_role", role)
        keycloak.login({ idpHint: "github" })
    }

    const signInWithApple = async (role = "user") => {
        setIsLoading(true)
        localStorage.setItem("requested_role", role)
        keycloak.login({ idpHint: "apple" })
    }

    /**
     * Generic login — opens Keycloak's login page (email/password + social options).
     */
    const login = async (role = "user") => {
        setIsLoading(true)
        localStorage.setItem("requested_role", role)
        keycloak.login()
    }

    /**
     * Logout from both Keycloak and the app.
     */
    const logout = () => {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("requested_role")
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax"
        setToken(null)
        setUser(null)
        setIsAuthenticated(false)
        toast.info("Signed out")
        keycloak.logout({ redirectUri: `${window.location.origin}/auth/login` })
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated,
                signInWithGoogle,
                signInWithGitHub,
                signInWithApple,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
    return ctx
}
