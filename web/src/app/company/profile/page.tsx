"use client"

import ProfilePage from "@/app/user/profile/page"

export default function CompanyProfile() {
    // Re-use the existing profile system for companies since they edit their user entity
    // The company layout wrapper will automatically provide the correct sidebar and breadcrumbs
    return <ProfilePage />
}
