"use client"

import { motion } from "framer-motion"
import { Map, Flag, CheckCircle2, Circle, ArrowRight, TrendingUp } from "lucide-react"

export default function UserRoadmapPage() {
    return (
        <div className="space-y-8">
            <header>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-4 text-xs font-bold tracking-widest uppercase text-primary">
                    <Map className="w-3.5 h-3.5" /> Career Path
                </div>
                <h1 className="text-3xl font-black font-heading tracking-tight mb-2">Your Career Roadmap</h1>
                <p className="text-muted-foreground">A personalized progression plan based on your current skills and target roles.</p>
            </header>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Timeline */}
                <div className="md:col-span-2 space-y-6">
                    <div className="relative border-l-2 border-primary/20 ml-4 md:ml-6 pb-4">
                        
                        {/* Completed Milestone */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative mb-12 pl-8">
                            <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">Frontend Fundamentals</h3>
                            <p className="text-sm text-muted-foreground mb-4">Mastered React, Tailwind CSS, and core accessibility patterns.</p>
                            <div className="p-4 bg-muted/20 border border-white/5 rounded-xl flex items-center justify-between opacity-60">
                                <span className="text-sm font-medium">React Hooks Deep Dive</span>
                                <span className="text-xs text-primary font-bold">COMPLETED</span>
                            </div>
                        </motion.div>

                        {/* Current Milestone */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="relative mb-12 pl-8">
                            <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-primary shadow-[0_0_15px_hsl(var(--primary)/0.5)] flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">Full-Stack Transition</h3>
                            <p className="text-sm text-muted-foreground mb-4">You are currently focusing on backend architecture and API design.</p>
                            
                            <div className="space-y-3">
                                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors cursor-pointer group">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">PostgreSQL Database Modeling</span>
                                        <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="w-full bg-background rounded-full h-1.5">
                                        <div className="bg-primary h-1.5 rounded-full" style={{ width: "65%" }}></div>
                                    </div>
                                </div>
                                <div className="p-4 bg-muted/20 border border-white/5 rounded-xl hover:border-white/20 transition-colors cursor-pointer">
                                    <span className="text-sm font-medium text-white/70">GraphQL API Design</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Future Milestone */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="relative pl-8">
                            <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-background border-2 border-white/20 flex items-center justify-center">
                                <Circle className="w-4 h-4 text-white/40" />
                            </div>
                            <h3 className="text-lg font-bold text-white/50 mb-1">Senior Architecture</h3>
                            <p className="text-sm text-white/30">System design, microservices, and extreme scale.</p>
                        </motion.div>
                        
                    </div>
                </div>

                {/* Sidebar Widget */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 backdrop-blur-sm sticky top-8">
                        <Flag className="w-8 h-8 text-blue-400 mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">Target Role</h3>
                        <div className="text-2xl font-black font-heading text-blue-400 mb-4">Senior Full-Stack Engineer</div>
                        <p className="text-sm text-muted-foreground mb-6">
                            Based on market data, acquiring PostgreSQL and System Design skills will increase your target salary by an estimated 24%.
                        </p>
                        <button className="w-full py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm transition-colors">
                            Adjust Target
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
