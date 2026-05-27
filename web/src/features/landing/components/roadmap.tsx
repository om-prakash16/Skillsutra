"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Rocket, Shield, Zap, Globe } from "lucide-react"
import { useCMS } from "@/context/cms-context"

const PHASES = [
    {
        title: "Phase 1: Foundation",
        status: "Completed",
        icon: Shield,
        items: ["Core Verification Engine", "SkillProof AI Protocol", "Basic Talent Search", "Secure OAuth Integration"]
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
    const { getJson } = useCMS()
    const phasesList = getJson("landing", "roadmap") || PHASES;

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
                    {phasesList.map((phase: any, i: number) => {
                        // Dynamically map icon names if available, else fallback to predefined array order or a default
                        let Icon = Shield;
                        if (phase.icon === "Shield") Icon = Shield;
                        else if (phase.icon === "Zap") Icon = Zap;
                        else if (phase.icon === "Rocket") Icon = Rocket;
                        else if (phase.icon === "Globe") Icon = Globe;
                        else if (PHASES[i] && PHASES[i].icon) Icon = PHASES[i].icon;
                        
                        const isInProgress = phase.status === "In Progress";
                        const isCompleted = phase.status === "Completed";
                        
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="relative"
                            >
                                <div className={`glass p-8 rounded-3xl h-full space-y-6 transition-all duration-500 relative group ${
                                    isInProgress 
                                        ? "border-primary/30 shadow-floating bg-primary/[0.02]" 
                                        : "border-white/5 shadow-premium hover:border-primary/20"
                                }`}>
                                    {/* Accent Top Border for active phase */}
                                    {isInProgress && (
                                        <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                                    )}

                                    <div className="flex justify-between items-start">
                                        <div className={`p-3 rounded-2xl border ${
                                            isInProgress 
                                                ? "bg-primary/20 border-primary/30 animate-float" 
                                                : "bg-primary/10 border-primary/20"
                                        }`}>
                                            <Icon className={`w-6 h-6 ${isInProgress ? "text-primary" : "text-primary"}`} />
                                        </div>
                                        <Badge variant="outline" className={`text-micro px-3 py-1 rounded-lg font-mono ${
                                            isCompleted ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                            isInProgress ? "bg-primary/15 text-primary border-primary/30 animate-pulse-glow" :
                                            "bg-muted/10 text-muted-foreground border-white/5"
                                        }`}>
                                            {phase.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <h3 className="text-lg font-bold text-white font-heading">{phase.title}</h3>
                                    <ul className="space-y-3">
                                        {phase.items.map((item, j) => (
                                            <li key={j} className="flex items-center gap-3 text-xs text-muted-foreground">
                                                {isCompleted ? (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                                ) : isInProgress ? (
                                                    <motion.div 
                                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                                        transition={{ duration: 2, repeat: Infinity, delay: j * 0.2 }}
                                                        className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 ml-1.5 mr-1"
                                                    />
                                                ) : (
                                                    <Circle className="w-4 h-4 text-muted-foreground/30 shrink-0" />
                                                )}
                                                <span className={isInProgress ? "text-foreground/90 font-medium" : ""}>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}
