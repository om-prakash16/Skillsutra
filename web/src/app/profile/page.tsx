"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function MyProfilePage() {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading) {
            if (user?.id) {
                router.replace(user.username ? `/in/${user.username}` : `/in/${user.id}`)
            } else {
                router.replace("/auth/login")
            }
        }
    }, [user, isLoading, router])

    return null
}
