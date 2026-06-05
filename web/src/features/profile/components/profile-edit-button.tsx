"use client"

import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

export function ProfileEditButton({ username }: { username: string }) {
    const { user, isAuthenticated } = useAuth()

    if (!isAuthenticated || user?.username !== username) {
        return null
    }

    return (
        <div className="absolute top-6 right-6 md:top-8 md:right-8 z-50">
            <Link href={`/in/${user?.username || user?.id}`}>
                <Button variant="premium" size="sm" className="shadow-2xl font-black uppercase tracking-widest text-[10px] gap-2">
                    <Edit className="w-3.5 h-3.5" />
                    Edit Profile
                </Button>
            </Link>
        </div>
    )
}
