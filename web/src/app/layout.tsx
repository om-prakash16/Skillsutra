import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/auth-context";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { QueryProvider } from "@/components/providers/query-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CMSProvider } from "@/context/cms-context";
import { API_BASE_URL } from "@/lib/api/api-client";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap',
});

const headingFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "SkillSutra | AI-Powered Talent Verification & Hiring Platform",
    description: "Replace resumes with verified Proof Scores. AI-powered skill verification, semantic JD matching, and on-chain credentials. Built with Next.js 16, FastAPI, Gemini AI, and Blockchain.",
    keywords: "AI hiring, skill verification, proof scores, talent matching, Gemini AI, Blockchain, blockchain credentials, resume verification",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${headingFont.variable} scroll-smooth`}>
      <body className="antialiased font-sans bg-background text-foreground selection:bg-primary/20">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
            <QueryProvider>
                <AuthProvider>
                  <CMSProvider>
                    <SmoothScroll />
                    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden opacity-20 dark:opacity-40">
                      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
                      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 blur-[150px] rounded-full" />
                    </div>
                    <Navbar />
                    <main className="flex-1 w-full relative min-h-screen pt-20 pb-24 md:pb-0">
                      {children}
                    </main>
                    <Footer />
                    <MobileNav />
                  </CMSProvider>
                </AuthProvider>
            </QueryProvider>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
