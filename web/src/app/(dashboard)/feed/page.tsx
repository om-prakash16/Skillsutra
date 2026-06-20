import { cookies } from 'next/headers'
import { verifyServerToken } from '@/lib/auth-utils'
import { UnifiedFeed } from "@/features/feed/components/unified-feed"
import { redirect } from 'next/navigation'

export default async function FeedPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  
  if (!token) {
    redirect('/')
  }

  const payload = await verifyServerToken(token)
  if (!payload) {
    redirect('/')
  }

  try {
    let role = "user"
    if (payload && payload.roles && Array.isArray(payload.roles)) {
       role = (payload.roles[0] as string)?.toLowerCase()
    } else if (payload && payload.role) {
       role = (payload.role as string)?.toLowerCase()
    }

    // Render the unified feed with the detected role
    return <UnifiedFeed role={role} />
  } catch (e) {
     console.error("Feed JWT Decode Error:", e)
     redirect('/')
  }
}
