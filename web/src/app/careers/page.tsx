"use client"

import { motion } from "framer-motion"
import { Users, Briefcase, Zap, Globe, ArrowRight } from "lucide-react"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden pb-20">
            {/* Ambient Animated Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse opacity-50" />
                <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[60%] bg-primary/10 blur-[150px] rounded-full opacity-40" />
            </div>

            <div className="relative z-10 pt-32 px-4 max-w-6xl mx-auto space-y-24">
                {/* Hero */}
                <motion.section 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md mb-8">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold tracking-widest uppercase text-blue-400">Join the Team</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black font-heading tracking-tight mb-6 text-white">
                        Build the Future of Hiring
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        We are a small, elite team of engineers and designers building the intelligence layer for the technical job market.
                    </p>
                </motion.section>

                {/* Values Grid */}
                <motion.section 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-3 gap-6"
                >
                    {[
                        { icon: Zap, title: "Move Fast", desc: "We ship quickly and iterate. No bureaucracy." },
                        { icon: Globe, title: "Remote First", desc: "Work from anywhere in the world asynchronously." },
                        { icon: Briefcase, title: "Extreme Ownership", desc: "Take full responsibility for features end-to-end." }
                    ].map((val, i) => (
                        <motion.div key={i} variants={itemVariants} className="bg-muted/20 border border-white/5 p-8 rounded-3xl backdrop-blur-md">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 border border-primary/30">
                                <val.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{val.title}</h3>
                            <p className="text-muted-foreground">{val.desc}</p>
                        </motion.div>
                    ))}
                </motion.section>

                {/* Open Positions */}
                <motion.section 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-muted/10 border border-white/5 rounded-3xl p-8 md:p-12"
                >
                    <h2 className="text-3xl font-bold text-white mb-8">Open Positions</h2>
                    <div className="space-y-4">
                        {[
                            { role: "Senior Full-Stack Engineer", dept: "Engineering", type: "Remote" },
                            { role: "Product Designer", dept: "Design", type: "Remote" },
                            { role: "Developer Relations Advocate", dept: "Marketing", type: "Remote" }
                        ].map((job, i) => (
                            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl bg-background/50 border border-white/5 hover:border-primary/50 transition-colors group cursor-pointer">
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{job.role}</h4>
                                    <div className="flex gap-4 text-sm text-muted-foreground font-medium">
                                        <span>{job.dept}</span>
                                        <span>&bull;</span>
                                        <span>{job.type}</span>
                                    </div>
                                </div>
                                <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors mt-4 md:mt-0" />
                            </div>
                        ))}
                    </div>
                </motion.section>
            </div>
        </div>
    )
}
