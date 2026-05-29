"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { login as apiLogin, signup as apiSignup, refreshSession as apiRefreshSession, logout as apiLogout, me as apiMe, verifyMagicLink } from "@/lib/api/auth-api"

type UserRole = "user" | "company" | "admin" | "recruiter" | string

interface User {
    id: string
    username?: string
    keycloak_id?: string // Deprecated
    name: string
    email: string
    role: UserRole
    roles: string[]
    wallet_address?: string
    user_code?: string
    profile_data?: any
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
    loginUser: (data: any) => Promise<void>
    loginWithMagicLink: (token: string) => Promise<void>
    signupUser: (data: any) => Promise<void>
    logout: () => void
    setAuthSession: (user: User, accessToken: string, refreshToken: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()

    useEffect(() => {
        let cancelled = false;
        
        const init = async () => {
            const storedToken = localStorage.getItem("accessToken")
            const refreshToken = localStorage.getItem("refreshToken")
            
            if (storedToken || refreshToken) {
                try {
                    // Fetch real user from backend. If token is expired, 
                    // apiMe will now automatically refresh it because of fetchWithAuth interceptor!
                    const realUser = await apiMe()
                    setUser(realUser)
                    setToken(localStorage.getItem("accessToken"))
                    setIsAuthenticated(true)
                } catch (error: any) {
                    console.error("Token validation failed:", error)
                    
                    // Don't log user out on 500s or Network errors
                    const isNetworkError = error.message === "Failed to fetch" || error.message?.includes("Network");
                    const isServerError = error.message?.includes("500") || error.message?.includes("502") || error.message?.includes("503");
                    
                    if (!isNetworkError && !isServerError) {
                        localStorage.removeItem("accessToken")
                        localStorage.removeItem("refreshToken")
                        document.cookie = "auth_token=; path=/; max-age=0;"
                        setToken(null)
                        setUser(null)
                        setIsAuthenticated(false)
                    } else {
                        // Optimistically keep authenticated state on server/network jitter
                        setToken(localStorage.getItem("accessToken"))
                        setIsAuthenticated(true)
                    }
                }
            } else {
                setIsAuthenticated(false)
            }
            if (!cancelled) setIsLoading(false)
        }
        
        init()
        
        return () => {
            cancelled = true
        }
    }, [])

    const signInWithGoogle = async (role = "user") => {
        setIsLoading(true)
        localStorage.setItem("requested_role", role)
        // Redirect to the login page where the proper GoogleLogin button is rendered
        router.push('/auth/login?role=' + role)
        setIsLoading(false)
    }

    const signInWithGitHub = async (role = "user") => {
        setIsLoading(true)
        localStorage.setItem("requested_role", role)
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/auth/oauth/github/url`
    }

    const loginUser = async (data: any) => {
        setIsLoading(true)
        try {
            const result = await apiLogin(data)
            localStorage.setItem("accessToken", result.access_token)
            localStorage.setItem("refreshToken", result.refresh_token)
            document.cookie = `auth_token=${result.access_token}; path=/; max-age=86400; SameSite=Lax`
            setToken(result.access_token)
            
            // Fetch user profile so role guard doesn't kick us out
            const realUser = await apiMe()
            setUser(realUser)
            setIsAuthenticated(true)
            
            toast.success("Logged in successfully")
            
            if (realUser?.role === "admin") {
                router.push("/admin")
            } else if (realUser?.role === "company") {
                router.push("/company/dashboard")
            } else {
                router.push("/user/dashboard")
            }
        } catch (err: any) {
            toast.error(err.message || "Login failed")
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    const loginWithMagicLink = async (magicToken: string) => {
        setIsLoading(true)
        try {
            const result = await verifyMagicLink(magicToken)
            localStorage.setItem("accessToken", result.access_token)
            localStorage.setItem("refreshToken", result.refresh_token)
            document.cookie = `auth_token=${result.access_token}; path=/; max-age=86400; SameSite=Lax`
            setToken(result.access_token)
            
            const realUser = await apiMe()
            setUser(realUser)
            setIsAuthenticated(true)
            
            toast.success("Logged in successfully")
            
            if (realUser?.role === "admin") {
                router.push("/admin")
            } else if (realUser?.role === "company") {
                router.push("/company/dashboard")
            } else {
                router.push("/user/dashboard")
            }
        } catch (err: any) {
            toast.error(err.message || "Magic link verification failed")
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    const signupUser = async (data: any) => {
        setIsLoading(true)
        try {
            await apiSignup(data)
            await loginUser({ email_or_username: data.email, password: data.password })
        } catch (err: any) {
            toast.error(err.message || "Signup failed")
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        const refresh = localStorage.getItem("refreshToken")
        if (refresh) {
            try {
                await apiLogout(refresh)
            } catch (e) {}
        }
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax"
        setToken(null)
        setUser(null)
        setIsAuthenticated(false)
        toast.info("Signed out")
        router.push("/auth/login")
    }

    const setAuthSession = (userPayload: User, accessToken: string, refreshToken: string) => {
        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("refreshToken", refreshToken)
        document.cookie = `auth_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`
        setToken(accessToken)
        setUser(userPayload)
        setIsAuthenticated(true)
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
                loginUser,
                loginWithMagicLink,
                signupUser,
                logout,
                setAuthSession,
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
