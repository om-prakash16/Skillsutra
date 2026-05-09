"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Slack, Github, Mail, Globe, Cpu, Layers } from "lucide-react"

const INTEGRATIONS = [
    { name: "Slack", icon: Slack, color: "text-[#4A154B]" },
    { name: "GitHub", icon: Github, color: "text-[#181717]" },
    { name: "Google", icon: Globe, color: "text-[#4285F4]" },
    { name: "Discord", icon: Cpu, color: "text-[#5865F2]" },
    { name: "Supabase", icon: Layers, color: "text-[#3ECF8E]" },
    { name: "Postmark", icon: Mail, color: "text-[#FF6B6B]" },
]

export function Integrations() {
    return (
        <section className="py-24 bg-muted/5 border-y border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-micro px-6 py-2 rounded-full shadow-premium">
                            Ecosystem
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            Seamless <span className="text-primary italic font-black">Integrations</span>
                        </h2>
                        <p className="text-muted-foreground text-base max-w-xl mx-auto lg:mx-0">
                            Connect your existing workflow with our platform. From automated skill verification to real-time sync with your HR stack.
                        </p>
                    </div>

                    <div className="lg:w-1/2 grid grid-cols-2 md:grid-cols-3 gap-6">
                        {INTEGRATIONS.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -5 }}
                                className="glass p-6 rounded-2xl border-white/5 flex flex-col items-center justify-center gap-4 shadow-premium group transition-all duration-300 hover:border-primary/20"
                            >
                                <div className={`p-4 rounded-xl bg-white/5 group-hover:bg-primary/10 transition-colors ${item.color}`}>
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">{item.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
