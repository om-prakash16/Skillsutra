"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function FinalCTA() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-primary/5 -z-10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full -z-10" />

            <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="glass border-white/5 rounded-[3rem] p-12 md:p-20 shadow-premium relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl -z-10 rounded-full" />
                    
                    <div className="space-y-8 relative z-10">
                        <div className="flex justify-center">
                            <div className="bg-primary/10 text-primary p-4 rounded-2xl border border-primary/20">
                                <Sparkles className="w-8 h-8" />
                            </div>
                        </div>
                        
                        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                            Ready to <span className="text-primary italic font-black">Modernize</span> Your Hiring?
                        </h2>
                        
                        <p className="text-muted-foreground text-lg md:text-xl font-normal max-w-2xl mx-auto">
                            Join the world's most innovative companies and engineers on the first verified identity marketplace. Start building your legacy today.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
                            <Link href="/auth/register" className="w-full sm:w-auto">
                                <Button variant="premium" className="w-full sm:w-auto h-14 px-10 text-micro font-bold shadow-premium rounded-2xl">
                                    Get Started Now <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/pricing" className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full sm:w-auto h-14 px-10 text-micro font-bold rounded-2xl border-black/10 dark:border-white/10 hover:border-primary/50 transition-all">
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
