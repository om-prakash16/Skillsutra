"use client"

import { useAuth } from "@/context/auth-context"
import EditableProfile from "./editable-profile"
import PublicProfile from "./public-profile"
import { Loader2 } from "lucide-react"

export default function ClientProfileWrapper({ username }: { username: string }) {
    const { user, isLoading } = useAuth()
    
    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }
    
    // If the authenticated user is viewing their own profile via username
    if (user?.username?.toLowerCase() === username.toLowerCase() || user?.id === username) {
        return <EditableProfile />
    }
    
    return <PublicProfile talentId={username} />
}
