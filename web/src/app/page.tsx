"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Users, BrainCircuit, PlayCircle, Fingerprint, Network, Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 dark:bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 dark:bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/30 text-primary dark:text-indigo-400 font-medium text-sm mb-8 border border-primary/10 dark:border-primary/80">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            The Resume is Dead. Welcome to the Proof Score.
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
            Hire <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary">Verified Talent.</span><br/>
            Not Good Resumes.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            SkillSutra replaces the traditional ATS with cryptographic skill verification, AI-driven assessments, and an integrated talent network. 
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-bold bg-primary hover:bg-primary/80 shadow-xl shadow-primary/20">
                Get Started for Free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-bold gap-2">
              <PlayCircle className="w-5 h-5" /> See How it Works
            </Button>
          </div>
        </div>

        {/* Hero Image / Dashboard Mockup */}
        <div className="mt-20 max-w-6xl mx-auto px-4 sm:px-6 relative perspective-1000">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 bottom-0 h-1/2"></div>
          <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-2xl p-2 md:p-4 transform rotate-x-12 scale-95 origin-bottom transition-transform hover:rotate-x-0 hover:scale-100 duration-500">
            <div className="rounded-lg border bg-background overflow-hidden aspect-[16/9] flex items-center justify-center relative">
              {/* Abstract Representation of the Proof Score Dashboard */}
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]"></div>
              <div className="flex gap-8 items-center z-10">
                <div className="w-64 h-64 border-[16px] border-primary rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.3)]">
                  <div className="text-6xl font-black text-primary">890</div>
                </div>
                <div className="space-y-4">
                  <div className="h-6 w-48 bg-muted rounded"></div>
                  <div className="h-4 w-64 bg-muted/50 rounded"></div>
                  <div className="h-4 w-32 bg-muted/50 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 bg-muted/30 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">A complete ecosystem for the modern workforce</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to hire, learn, and grow, all in one platform.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card border rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/50 text-primary dark:text-indigo-400 rounded-xl flex items-center justify-center mb-6">
                <Fingerprint className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Cryptographic Proof Scores</h3>
              <p className="text-muted-foreground leading-relaxed">
                Talent takes AI-driven coding challenges to earn verified Proof Scores across specific domains (Frontend, Backend, System Design).
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card border rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/50 text-primary dark:text-purple-400 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Applicant Tracking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Companies replace their legacy ATS. The AI automatically matches Job Requirements to candidate Proof Scores instantly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card border rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/50 text-primary dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                <Network className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Talent Network</h3>
              <p className="text-muted-foreground leading-relaxed">
                A built-in social feed, community forums, and mentor marketplace to foster continuous professional growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to join the future of work?</h2>
          <p className="text-xl text-muted-foreground mb-10">
            Join thousands of companies and engineers who have already made the switch to verified talent.
          </p>
          <Button size="lg" className="h-14 px-8 text-lg font-bold bg-foreground text-background hover:bg-foreground/90">
            Create Your Account
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t py-12 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Hexagon className="w-6 h-6 text-primary fill-primary/20" />
            <span className="font-bold text-lg tracking-tight">SkillSutra</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 SkillSutra Enterprise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
