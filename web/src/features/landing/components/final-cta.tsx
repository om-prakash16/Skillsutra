"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { useCMS } from "@/context/cms-context"

export function FinalCTA() {
    const { getVal } = useCMS();
    return (
        <section className="py-32 relative overflow-hidden">
            {/* Aurora Volumetric lighting - slowly moving atmospheric lights */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20">
                <motion.div 
                    animate={{
                        x: [0, 60, -30, 0],
                        y: [0, -40, 30, 0],
                        scale: [1, 1.1, 0.95, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/8 blur-[160px] rounded-full" 
                />
                <motion.div 
                    animate={{
                        x: [0, -40, 50, 0],
                        y: [0, 30, -40, 0],
                        scale: [1, 0.9, 1.15, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-secondary/8 blur-[180px] rounded-full" 
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#080808_1px,transparent_1px),linear-gradient(to_bottom,#080808_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-8 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="glass border border-white/5 rounded-[3rem] p-12 md:p-24 shadow-premium relative overflow-hidden group/cta transition-all duration-700 hover:border-primary/20 hover:-translate-y-1"
                >
                    {/* Hover Glow Ring Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-700 -z-10" />
                    
                    {/* Breathing glow highlights in background */}
                    <motion.div 
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" 
                    />
                    <motion.div 
                        animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/5 blur-[100px] rounded-full pointer-events-none" 
                    />

                    <div className="space-y-8 relative z-10">
                        <div className="flex justify-center">
                            <div className="bg-primary/10 text-primary p-4.5 rounded-2xl border border-primary/20 shadow-premium-hover animate-float">
                                <Sparkles className="w-7 h-7" />
                            </div>
                        </div>
                        
                        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight max-w-3xl mx-auto">
                            {getVal('cta', 'title_part1', 'Ready to')} <span className="text-primary italic font-black bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">{getVal('cta', 'title_part2', 'Modernize')}</span> {getVal('cta', 'title_part3', 'Your Hiring?')}
                        </h2>
                        
                        <p className="text-muted-foreground text-base md:text-lg font-normal max-w-2xl mx-auto leading-relaxed">
                            {getVal('cta', 'subtitle', "Join the world's most innovative companies and engineers on the first verified identity marketplace. Start building your legacy today.")}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6">
                            <Link href="/auth/register" className="w-full sm:w-auto">
                                <Button variant="premium" className="w-full sm:w-auto h-14 px-10 text-micro font-bold shadow-premium rounded-2xl active-click hover:shadow-glow-primary transition-all">
                                    Get Started Now <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/pricing" className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full sm:w-auto h-14 px-10 text-micro font-bold rounded-2xl border-white/10 hover:border-primary/50 hover:bg-white/5 transition-all active-click">
                                    View Pricing
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
