"use client"

import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { useRoleGuard } from "@/hooks/useRoleGuard"
import { Sidebar } from "@/components/layout/sidebar"
import { Footer } from "@/components/layout/footer"
import { Loader2 } from "lucide-react"

export default function UserLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isLoading, isAuthorized } = useRoleGuard(["user", "admin"])

    if (isLoading || !isAuthorized) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-muted/20">
            <Sidebar role="user" className="hidden lg:flex" />
            <main className="flex-1 w-full pt-16">
                <Breadcrumbs />
                <div className="container mx-auto p-8 max-w-6xl min-h-[calc(100vh-200px)]">
                    {children}
                </div>
                <Footer forceVisible />
            </main>
        </div>
    )
}
