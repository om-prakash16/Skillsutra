"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient"
import type { Session } from "@supabase/supabase-js"

type UserRole = "user" | "company" | "admin"

interface User {
    id: string
    name: string
    email: string
    role: UserRole
    wallet_address?: string
    user_code?: string
    profile_data: any
    dynamic_profile_data?: any
}

interface AuthContextType {
    user: User | null
    token: string | null
    isLoading: boolean
    signInWithGoogle: (role?: string) => Promise<void>
    login: (email: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    // Hydrate user state from an active Supabase session on mount.
    // Also subscribes to auth state changes for SSO / magic link flows.
    useEffect(() => {
        const hydrateUser = async (session: Session) => {
            const metaRole = (session.user.user_metadata?.role as UserRole) || "user"

            const { data: profile } = await supabase
                .from("users")
                .select("role, full_name, wallet_address, user_code, profile_data, dynamic_profile_data")
                .eq("id", session.user.id)
                .single()

            const role = (profile?.role as UserRole) || metaRole
            const name =
                profile?.full_name ||
                session.user.user_metadata?.full_name ||
                session.user.email?.split("@")[0] ||
                "User"

            setUser({
                id: session.user.id,
                name,
                email: session.user.email || "",
                role,
                wallet_address: profile?.wallet_address || "",
                user_code: profile?.user_code || "",
                profile_data: profile?.profile_data || {},
                dynamic_profile_data: profile?.dynamic_profile_data || {},
            })
            setIsLoading(false)
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                hydrateUser(session)
            } else {
                setIsLoading(false)
            }
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                hydrateUser(session)
            } else {
                setUser(null)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    // Also check for our custom JWT in localStorage (wallet auth path).
    useEffect(() => {
        const storedToken = localStorage.getItem("auth_token")
        if (storedToken) setToken(storedToken)
        setIsLoading(false)
    }, [])

    const signInWithGoogle = async (role = "user") => {
        setIsLoading(true)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                    data: {
                        role: role
                    }
                }
            })

            if (error) throw error
        } catch (err: any) {
            console.error("[auth] google login failed:", err)
            toast.error(err.message || "Google sign in failed")
            setIsLoading(false)
        }
    }
    const login = async (email: string, password: string) => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error
            if (!data.session) throw new Error("Login failed")

            // Store token for fetchWithAuth compatibility
            localStorage.setItem("auth_token", data.session.access_token)
            setToken(data.session.access_token)

            const metaRole = (data.user?.user_metadata?.role as string)?.toLowerCase() || "user"
            
            toast.success("Welcome back!")
            if (metaRole === "admin") {
                router.push("/admin")
            } else if (metaRole === "company") {
                router.push("/company/dashboard")
            } else {
                router.push("/user/dashboard")
            }
        } catch (err: any) {
            console.error("[auth] login failed:", err)
            toast.error(err.message || "Login failed")
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        localStorage.removeItem("auth_token")
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax"
        setToken(null)
        setUser(null)
        await supabase.auth.signOut()
        toast.info("Signed out")
        router.push("/auth/login")
    }

    return (
        <AuthContext.Provider value={{ user, token, isLoading, signInWithGoogle, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
    return ctx
}
