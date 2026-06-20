"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle2, ShieldCheck, Zap, Users, ArrowRight, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CompaniesLandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            
            <section className="pt-20 md:pt-32 pb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/30 text-primary dark:text-blue-400 font-medium text-sm mb-8">
                        <Building2 className="w-4 h-4" /> For Employers & Startups
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
                        Stop Reading Resumes.<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary">Start Hiring Proof.</span>
                    </h1>
                    
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        Our AI-driven Applicant Tracking System instantly matches your job requirements against cryptographically verified developer Proof Scores.
                    </p>
                    
                    <div className="flex justify-center items-center gap-4">
                        <Link href="/auth/register?type=company">
                            <Button size="lg" className="h-14 px-8 text-base font-bold bg-primary hover:bg-primary/80 shadow-xl shadow-primary/20">
                                Post a Job for Free <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Zero Noise", desc: "Candidates must pass technical Proof Score assessments before they can apply.", icon: ShieldCheck },
                            { title: "Instant AI Matching", desc: "Our engine reads your job description and surfaces the top 5% of candidates automatically.", icon: Zap },
                            { title: "Built-In ATS", desc: "No need for external tools. Track candidates from application to hired entirely natively.", icon: Users }
                        ].map((feature, i) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={i} 
                                className="bg-card border rounded-2xl p-8"
                            >
                                <feature.icon className="w-10 h-10 text-primary mb-6" />
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
