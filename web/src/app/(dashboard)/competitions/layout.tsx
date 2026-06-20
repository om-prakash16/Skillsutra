"use client"
import UserLayout from "@/app/user/layout"

export default function Layout({ children }: { children: React.ReactNode }) {
    return <UserLayout>{children}</UserLayout>
}
