"use client"

import { motion } from "framer-motion"
import { Cpu, ShieldCheck, CheckCircle2, Code2 } from "lucide-react"

export default function AssessmentsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden pt-20 pb-20">
            {/* Ambient Animated Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-emerald-600/10 blur-[150px] rounded-full animate-pulse opacity-40" />
            </div>

            <div className="relative z-10 container mx-auto px-4 max-w-5xl">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md mb-8">
                        <Cpu className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold tracking-widest uppercase text-emerald-400">Intelligence Engine</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tight mb-6 text-white">
                        Assessments That Prove Capability
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Move beyond algorithmic puzzles. Our engine evaluates candidates in real-world scenarios, testing architecture, debugging, and system design.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">How It Works</h2>
                        <ul className="space-y-6">
                            {[
                                { title: "Context-Aware Scenarios", desc: "Candidates are dropped into existing, messy codebases and asked to implement features or fix bugs." },
                                { title: "AI-Powered Evaluation", desc: "Our engine reviews code quality, efficiency, and edge-case handling just like a Senior Staff Engineer would." },
                                { title: "Anti-Cheat Protection", desc: "Advanced plagiarism detection and behavioral tracking ensures the integrity of every submission." }
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-muted border border-white/10 flex items-center justify-center shrink-0">
                                        <span className="font-bold text-emerald-400">{i + 1}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">{item.title}</h4>
                                        <p className="text-muted-foreground text-sm leading-relaxed mt-1">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                        <div className="p-8 rounded-3xl bg-background border border-white/5 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
                            <ShieldCheck className="w-12 h-12 text-emerald-400 mb-6 relative z-10" />
                            <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Verifiable Skill Badges</h3>
                            <p className="text-muted-foreground mb-6 relative z-10">
                                Candidates who pass our rigorous assessments earn on-platform badges. These badges are cryptographically verified and give employers absolute confidence in their technical capability.
                            </p>
                            <div className="flex flex-wrap gap-2 relative z-10">
                                {["React Architecture", "PostgreSQL Optimization", "System Design", "Node.js Performance"].map((badge, i) => (
                                    <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> {badge}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
