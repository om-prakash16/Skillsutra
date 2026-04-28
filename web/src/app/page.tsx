import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/features/landing/components/hero-section"
import { VisionManifest } from "@/features/landing/components/vision-manifest"
import { Categories } from "@/features/landing/components/categories"
import { FeaturedJobs } from "@/features/landing/components/featured-jobs"
import { WhyChooseUs } from "@/features/landing/components/why-choose-us"
import { StatsSection } from "@/features/landing/components/stats-section"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <VisionManifest />
        <StatsSection />
        <Categories />
        <FeaturedJobs />
        <WhyChooseUs />
        {/* Testimonials could go here */}
      </main>
    </div>
  )
}
