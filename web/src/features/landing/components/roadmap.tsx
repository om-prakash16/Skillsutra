"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Rocket, Shield, Zap, Globe } from "lucide-react"

const PHASES = [
    {
        title: "Phase 1: Foundation",
        status: "Completed",
        icon: Shield,
        items: ["Core Verification Engine", "Verified Identity Protocol", "Basic Talent Search", "Secure OAuth Integration"]
    },
    {
        title: "Phase 2: Intelligence",
        status: "In Progress",
        icon: Zap,
        items: ["AI Proof Scoring v2", "Skill Resonance Matching", "Deterministic Assessments", "Ecosystem Integrations"]
    },
    {
        title: "Phase 3: Scale",
        status: "Upcoming",
        icon: Rocket,
        items: ["Global Talent Marketplace", "Automated Payroll Sync", "Enterprise Whitelabeling", "Mobile Identity Node"]
    },
    {
        title: "Phase 4: Ecosystem",
        status: "Planned",
        icon: Globe,
        items: ["Cross-Chain Verification", "Decentralized Reputation", "Universal Identity Hub", "Open Protocol API"]
    }
]

export function Roadmap() {
    return (
        <section className="py-24 bg-muted/5 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center space-y-4 mb-16">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-micro px-6 py-2 rounded-full shadow-premium">
                        Future
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        Our <span className="text-primary italic font-black">Roadmap</span>
                    </h2>
                    <p className="text-muted-foreground text-base max-w-xl mx-auto">
                        The future of verified professional identity. Follow our progress as we build the world's most trusted hiring ecosystem.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {PHASES.map((phase, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="relative"
                        >
                            <div className="glass p-8 rounded-3xl border-white/5 h-full space-y-6 shadow-premium group hover:border-primary/20 transition-all duration-500">
                                <div className="flex justify-between items-start">
                                    <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                                        <phase.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <Badge variant="outline" className={`text-micro px-3 py-1 rounded-lg ${
                                        phase.status === "Completed" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                        phase.status === "In Progress" ? "bg-primary/10 text-primary border-primary/20" :
                                        "bg-muted/10 text-muted-foreground border-white/5"
                                    }`}>
                                        {phase.status}
                                    </Badge>
                                </div>
                                <h3 className="text-lg font-bold">{phase.title}</h3>
                                <ul className="space-y-3">
                                    {phase.items.map((item, j) => (
                                        <li key={j} className="flex items-center gap-3 text-xs text-muted-foreground">
                                            {phase.status === "Completed" ? (
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                            ) : (
                                                <Circle className="w-4 h-4 text-muted-foreground/30 shrink-0" />
                                            )}
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
