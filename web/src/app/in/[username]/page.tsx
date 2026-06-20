import { Metadata } from "next"
import { notFound } from "next/navigation"
import ClientProfileWrapper from "./client-profile-wrapper"

interface PageProps {
    params: Promise<{
        username: string
    }>
}

async function getProfile(username: string) {
    try {
        const baseUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"
        const response = await fetch(`${baseUrl}/profiles/public/${username}`, {
            cache: 'no-store'
        })
        if (!response.ok) return null
        const json = await response.json()
        return json.data
    } catch (e) {
        return null
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = await params
    const profile = await getProfile(username)
    
    if (!profile) {
        return { title: "Profile Not Found | SkillSutra" }
    }
    
    const p = profile.profile || {}
    const canonicalDomain = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://skillsutra.com"
    
    return {
        title: `${p.username || username} - ${p.headline || 'Professional'} | SkillSutra`,
        description: p.about || `Check out ${p.username || username}'s verified professional profile on SkillSutra.`,
        openGraph: {
            title: `${p.username || username} | SkillSutra`,
            description: p.about || "Verified Professional Profile",
            images: [
                {
                    url: p.banner_url || "/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Profile Banner",
                }
            ]
        },
        alternates: {
            canonical: `${canonicalDomain}/in/${username}`,
        }
    }
}

export default async function PublicProfilePage({ params }: PageProps) {
    const { username } = await params
    return <ClientProfileWrapper username={username} />
}
