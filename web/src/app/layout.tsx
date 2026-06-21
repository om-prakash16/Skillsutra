import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/auth-context";
import { MainLayoutWrapper } from "@/components/layout/main-layout-wrapper";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryProvider } from "@/components/providers/query-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CMSProvider } from "@/context/cms-context";
import { API_BASE_URL } from "@/lib/api/api-client";
import { Toaster } from "@/components/ui/sonner";
import { SmoothScroll } from "@/components/providers/smooth-scroll";


export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return {
    title: {
      template: '%s | SkillSutra',
      default: 'SkillSutra | AI-Powered Talent Verification & Hiring Platform'
    },
    description: "Replace resumes with verified Proof Scores. AI-powered skill verification, semantic JD matching, and platform credentials. Built with Next.js 16, FastAPI, Gemini AI, and infrastructure.",
    keywords: ["AI hiring", "skill verification", "proof scores", "talent matching", "Gemini AI", "infrastructure", "infrastructure credentials", "resume verification"],
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: 'SkillSutra | AI-Powered Talent Verification',
      description: 'Replace resumes with verified Proof Scores. AI-powered skill verification.',
      url: baseUrl,
      siteName: 'SkillSutra',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'SkillSutra | AI-Powered Talent Verification',
      description: 'Replace resumes with verified Proof Scores. AI-powered skill verification.',
    },
  };
}

import { OrganizationSchema, WebSiteSchema } from "@/components/seo/schema";
import { Analytics } from "@/components/seo/analytics";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="antialiased font-sans bg-background text-foreground selection:bg-primary/20">
        <OrganizationSchema />
        <WebSiteSchema />
        <Analytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
            <QueryProvider>
              <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "dummy_client_id"}>
                <AuthProvider>
                  <CMSProvider>
                    <SmoothScroll />
                    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden opacity-20 dark:opacity-40">
                      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
                      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 blur-[150px] rounded-full" />
                    </div>
                    <Navbar />
                    <MainLayoutWrapper>
                      {children}
                    </MainLayoutWrapper>
                    <Footer />
                    <MobileNav />
                  </CMSProvider>
                </AuthProvider>
              </GoogleOAuthProvider>
            </QueryProvider>
          <Toaster position="top-center" richColors offset={80} toastOptions={{ className: "mt-4" }} />
        </ThemeProvider>
      </body>
    </html>
  );
}
