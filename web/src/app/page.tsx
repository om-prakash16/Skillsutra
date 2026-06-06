import { cookies } from 'next/headers'
import { decodeJwt } from 'jose'

import { HeroSection } from "@/features/landing/components/hero-section"
import { VisionManifest } from "@/features/landing/components/vision-manifest"
import { Categories } from "@/features/landing/components/categories"
import { FeaturedJobs } from "@/features/landing/components/featured-jobs"
import { WhyChooseUs } from "@/features/landing/components/why-choose-us"
import { StatsSection } from "@/features/landing/components/stats-section"
import { Testimonials } from "@/features/landing/components/testimonials"
import { FAQSection } from "@/features/landing/components/faq-section"
import { FinalCTA } from "@/features/landing/components/final-cta"
import { Integrations } from "@/features/landing/components/integrations"
import { Roadmap } from "@/features/landing/components/roadmap"

import { UnifiedFeed } from "@/features/feed/components/unified-feed"

export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  
  if (token) {
    try {
      const payload: any = decodeJwt(token)
      let role = "user"
      if (payload && payload.roles && Array.isArray(payload.roles)) {
         role = payload.roles[0]?.toLowerCase()
      } else if (payload && payload.role) {
         role = payload.role?.toLowerCase()
      }

      // Render the unified feed with the detected role
      return <UnifiedFeed role={role} />
    } catch (e) {
       console.error("Home JWT Decode Error:", e)
       // fallthrough to landing page if invalid
    }
  }

  // Marketing Landing Page for Guests
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <VisionManifest />
        <StatsSection />
        <Categories />
        <FeaturedJobs />
        <Integrations />
        <WhyChooseUs />
        <Roadmap />
        <Testimonials />
        <FAQSection />
        <FinalCTA />
      </main>
    </div>
  )
}
