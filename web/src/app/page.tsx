import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
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

export default function Home() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth_token')
  
  if (token) {
    redirect('/feed')
  }

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
