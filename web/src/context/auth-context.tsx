"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient"
import type { Session, AuthChangeEvent } from "@supabase/supabase-js"
import { useWallet } from "@solana/wallet-adapter-react"

type UserRole = "user" | "company" | "admin"

interface User {
    id: string
    name: string
    email: string
    role: UserRole
    wallet_address: string
    profile_data: any
    dynamic_profile_data?: any
}


interface AuthContextType {
    user: User | null
    isLoading: boolean
    walletLogin: () => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    // Listen to Supabase auth state changes on mount
    useEffect(() => {
        const fetchUserData = async (session: Session) => {
            // First get basic data from metadata
            const metaRole = (session.user.user_metadata?.role as UserRole) || "user"
            
            // Try to fetch real role from 'users' table
            const { data: profile } = await supabase
                .from('users')
                .select('role, full_name, wallet_address, profile_data, dynamic_profile_data')
                .eq('id', session.user.id)
                .single()


            const role = (profile?.role as UserRole) || metaRole
            const name = profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User"

            setUser({
                id: session.user.id,
                name,
                email: session.user.email || "",
                role,
                wallet_address: profile?.wallet_address || "",
                profile_data: profile?.profile_data || {},
                dynamic_profile_data: profile?.dynamic_profile_data || {},
            })
            setIsLoading(false)

        }

        // Check existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchUserData(session)
            } else {
                setIsLoading(false)
            }
        })

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                fetchUserData(session)
            } else {
                setUser(null)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const { publicKey, signMessage, connected, disconnect } = useWallet()

    const walletLogin = async () => {
        if (!publicKey || !signMessage) {
            toast.error("Wallet not connected or doesn't support signing")
            return
        }

        setIsLoading(true)
        try {
            const walletAddress = publicKey.toBase58()
            const message = `Login to this best hiring tool\n\nWallet: ${walletAddress}\nTimestamp: ${Date.now()}`
            const encodedMessage = new TextEncoder().encode(message)
            const signature = await signMessage(encodedMessage)
            
            // Convert Uint8Array to Hex for the backend.
            const signatureHex = Array.from(signature)
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/wallet-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    wallet_address: walletAddress,
                    message: message,
                    signature: signatureHex
                })
            })

            const data = await res.json()
            if (res.ok) {
                localStorage.setItem("sp_token", data.access_token)
                setUser({
                    id: "user_id_from_jwt", // Typically decoded from JWT
                    name: `User-${walletAddress.substring(0, 4)}`,
                    email: "",
                    role: data.role as UserRole,
                    wallet_address: walletAddress,
                    profile_data: {}
                })
                toast.success("Authenticated successfully")
                router.push("/dashboard")
            } else {
                throw new Error(data.detail || "Authentication failed")
            }
        } catch (err: any) {
            console.error(err)
            toast.error(err.message || "Failed to sign in with wallet")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("sp_token")
        if (token) {
            // Validate token and set user...
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    }, [])

    const logout = async () => {
        localStorage.removeItem("sp_token")
        setUser(null)
        if (connected) await disconnect()
        toast.info("Logged out successfully")
        router.push("/login")
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, walletLogin, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
