import { redirect } from "next/navigation"

export default async function UserRedirectPage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params
    
    try {
        const baseUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"
        const response = await fetch(`${baseUrl}/users/public/${userId}`, { cache: 'no-store' })
        
        if (response.ok) {
            const data = await response.json()
            const username = data?.data?.profile?.username
            if (username) {
                redirect(`/in/${username}`)
            }
        }
    } catch (e) {
        // Fallback below
    }
    
    // Fallback if not found or no username
    redirect(`/in/${userId}`)
}
