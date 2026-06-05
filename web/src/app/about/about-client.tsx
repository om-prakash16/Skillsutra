"use client"

import { motion, Variants } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    Code2,
    Target,
    Shield,
    Users,
    GitBranch,
    BarChart3,
    Search,
    CheckCircle2,
    Zap
} from "lucide-react"

// Stagger animation variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1, y: 0,
        transition: { type: "spring", stiffness: 100, damping: 15 }
    }
}

export function AboutClient() {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden pb-20 selection:bg-primary/30">
            {/* Ambient Animated Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-pulse opacity-50" />
                <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full opacity-40" />
            </div>

            <div className="relative z-10">
                {/* 1. Immersive Hero Section */}
                <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col items-center justify-center text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col items-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-8">
                            <Zap className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold tracking-widest uppercase text-primary">Intelligence Engine</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-black font-heading tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40 drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]">
                            Rewiring the <br className="hidden md:block" /> Hiring Ecosystem
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
                            A specialized platform bridging the gap between elite engineering talent and forward-thinking companies through verifiable signal.
                        </p>
                    </motion.div>
                </section>

                <div className="container mx-auto px-4 max-w-5xl space-y-32 py-12">

                    {/* 2. Platform Overview */}
                    <motion.section 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="relative p-8 md:p-12 rounded-[2.5rem] bg-muted/20 border border-white/5 backdrop-blur-xl overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                        <motion.div variants={itemVariants} className="relative z-10 max-w-3xl">
                            <h2 className="text-3xl md:text-4xl font-bold font-heading tracking-tight mb-6">Beyond the Resume</h2>
                            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                                <p>
                                    Best Hiring Tool integrates direct data sources like GitHub and on-chain verifications to move beyond static resumes, offering a dynamic, proof-based representation of true technical skill.
                                </p>
                                <p>
                                    We provide a dual-sided ecosystem: developers gain visibility based on their actual code contributions, while companies access a noise-free, signal-rich talent pool. We prioritize salary transparency, precise role fit, and technical maturity.
                                </p>
                            </div>
                        </motion.div>
                    </motion.section>

                    {/* 3. Who It Is For - Glassmorphic Cards */}
                    <section className="space-y-12">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold font-heading tracking-tight mb-4">Built for Both Sides</h2>
                            <p className="text-muted-foreground max-w-xl mx-auto">Symmetrical value for those looking for work, and those looking for workers.</p>
                        </motion.div>

                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            className="grid md:grid-cols-2 gap-6"
                        >
                            <motion.div variants={itemVariants} whileHover={{ scale: 1.02, y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                                <Card className="h-full bg-background/60 border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <CardHeader className="relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4 border border-blue-500/30">
                                            <Users className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <CardTitle className="text-2xl text-white">Job Seekers</CardTitle>
                                        <CardDescription className="text-blue-200/60 text-base">Engineers & Developers</CardDescription>
                                    </CardHeader>
                                    <CardContent className="relative z-10">
                                        <ul className="space-y-4 text-muted-foreground">
                                            {[
                                                "Discover deeply relevant technical roles",
                                                "Showcase real skills through code, not keywords",
                                                "Gain transparent market & salary insights"
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                                    <span className="leading-snug">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div variants={itemVariants} whileHover={{ scale: 1.02, y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                                <Card className="h-full bg-background/60 border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <CardHeader className="relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4 border border-emerald-500/30">
                                            <Target className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <CardTitle className="text-2xl text-white">Companies</CardTitle>
                                        <CardDescription className="text-emerald-200/60 text-base">Hiring Teams & Managers</CardDescription>
                                    </CardHeader>
                                    <CardContent className="relative z-10">
                                        <ul className="space-y-4 text-muted-foreground">
                                            {[
                                                "Find high-signal, pre-vetted engineering talent",
                                                "Eliminate noise and spam in your hiring funnel",
                                                "Evaluate candidates on verifiable technical work"
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                                    <span className="leading-snug">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </section>

                    {/* 4. Bento Box Grid */}
                    <section className="space-y-12">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold font-heading tracking-tight mb-4">Key Differentiators</h2>
                        </motion.div>

                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                            {/* Large Item */}
                            <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-muted/30 to-muted/10 border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-colors duration-700" />
                                <GitBranch className="w-10 h-10 text-primary mb-6 relative z-10" />
                                <h3 className="text-2xl font-bold mb-3 relative z-10 text-white">Deep Static Analysis</h3>
                                <p className="text-muted-foreground text-lg relative z-10 max-w-md">
                                    We evaluate technical strengths directly from source code activity, repository complexity, and contribution history—not self-reported skills.
                                </p>
                            </motion.div>

                            {/* Standard Items */}
                            <motion.div variants={itemVariants} className="bg-muted/20 border border-white/5 p-6 rounded-3xl">
                                <Code2 className="w-8 h-8 text-blue-400 mb-4" />
                                <h3 className="text-xl font-bold mb-2 text-white">Project Focus</h3>
                                <p className="text-muted-foreground text-sm">Highlights architecture, stacks, and true technical complexity over superficial job titles.</p>
                            </motion.div>

                            <motion.div variants={itemVariants} className="bg-muted/20 border border-white/5 p-6 rounded-3xl">
                                <Search className="w-8 h-8 text-emerald-400 mb-4" />
                                <h3 className="text-xl font-bold mb-2 text-white">AI Evaluation</h3>
                                <p className="text-muted-foreground text-sm">Employs senior-level heuristics to assess role fit, code quality, and engineering maturity.</p>
                            </motion.div>

                            <motion.div variants={itemVariants} className="md:col-span-3 bg-primary/5 border border-primary/20 p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-center justify-between overflow-hidden relative">
                                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
                                <div className="flex-1 relative z-10">
                                    <h3 className="text-2xl font-bold text-white mb-2">Transparent Market Insights</h3>
                                    <p className="text-primary-foreground/80">Clear, data-backed visibility into exact salaries and role trends across the global market.</p>
                                </div>
                                <BarChart3 className="w-16 h-16 text-primary/40 relative z-10" />
                            </motion.div>
                        </motion.div>
                    </section>

                    {/* 5. Product Philosophy */}
                    <motion.section 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="py-12 border-t border-white/10"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold font-heading tracking-tight mb-12 text-center">Product Philosophy</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { title: "Signal over Keywords", desc: "We prioritize verifiable data and demonstrated capability over resume keyword stuffing and formatting tricks." },
                                { title: "Clarity over Volume", desc: "Our objective is facilitating high-relevance, exact-match connections rather than simply maximizing application numbers." },
                                { title: "Honest Scope", desc: "We commit absolutely to data transparency, removing inherent bias, and presenting professional information objectively." }
                            ].map((item, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15, duration: 0.6 }}
                                    className="flex flex-col gap-4 text-center md:text-left items-center md:items-start"
                                >
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border border-white/10">
                                        <span className="text-lg font-bold text-primary">0{i + 1}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                </div>
            </div>
        </div>
    )
}
