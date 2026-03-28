"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { useAuth } from "@/context/auth-context"

export default function CompanyLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user } = useAuth()

    // Mock check for role
    // if (user?.role !== "company") redirect(...)

    return (
        <div className="flex min-h-screen bg-muted/20">
            <Sidebar role="company" />
            <main className="flex-1 overflow-y-auto h-screen">
                <div className="container mx-auto p-8 max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    )
}
