"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation" // Use next/navigation for App Router
import { toast } from "sonner"

type UserRole = "user" | "company" | "admin"

interface User {
    id: string
    name: string
    email: string
    role: UserRole
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    login: (email: string, role: UserRole) => Promise<void>
    logout: () => void
    register: (name: string, email: string, role: UserRole) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(false) // Initial load
    const router = useRouter()

    // Mock checking session
    useEffect(() => {
        const storedUser = localStorage.getItem("job_portal_user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        // setIsLoading(false) // In a real app we'd wait for API
    }, [])

    const login = async (email: string, role: UserRole) => {
        setIsLoading(true)
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockUser: User = {
            id: "1",
            name: "John Doe", // Mock name
            email,
            role,
        }

        setUser(mockUser)
        localStorage.setItem("job_portal_user", JSON.stringify(mockUser))
        setIsLoading(false)
        toast.success(`Welcome back, ${mockUser.name}!`)

        // Redirect based on role
        if (role === "admin") router.push("/admin/dashboard")
        else if (role === "company") router.push("/company/dashboard")
        else router.push("/user/dashboard")
    }

    const register = async (name: string, email: string, role: UserRole) => {
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const mockUser: User = {
            id: "2",
            name,
            email,
            role, // Respect selected role
        }

        // Auto login after register
        setUser(mockUser)
        localStorage.setItem("job_portal_user", JSON.stringify(mockUser))
        setIsLoading(false)
        toast.success("Account created successfully!")

        if (role === "company") router.push("/company/dashboard")
        else router.push("/user/dashboard")
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("job_portal_user")
        toast.info("Logged out successfully")
        router.push("/auth/login")
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
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
