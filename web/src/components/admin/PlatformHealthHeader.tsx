"use client"

import { Activity, Database, Server, Cpu, HardDrive, Zap, Brain, Mail, CreditCard, Search, AlertTriangle, CheckCircle2, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function PlatformHealthHeader() {
    const [expanded, setExpanded] = useState(false)
    const [healthScore, setHealthScore] = useState(98.5)

    const services = [
        { name: "API", icon: Server, status: "healthy", latency: "45ms" },
        { name: "Database", icon: Database, status: "healthy", latency: "12ms" },
        { name: "Redis", icon: Zap, status: "healthy", latency: "2ms" },
        { name: "Workers", icon: Cpu, status: "healthy", latency: "0 pending" },
        { name: "Storage", icon: HardDrive, status: "healthy", latency: "105ms" },
        { name: "Queue", icon: Activity, status: "healthy", latency: "0 depth" },
        { name: "AI Engine", icon: Brain, status: "warning", latency: "850ms", issue: "Elevated latency on Gemini API" },
        { name: "SMTP", icon: Mail, status: "healthy", latency: "120ms" },
        { name: "Payments", icon: CreditCard, status: "healthy", latency: "230ms" },
        { name: "Search", icon: Search, status: "healthy", latency: "35ms" },
    ]

    return (
        <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/50">
            <div className="px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-muted/20 transition-colors" onClick={() => setExpanded(!expanded)}>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-emerald-400">All Systems Operational</span>
                    </div>
                    <div className="h-4 w-[1px] bg-border" />
                    <span className="text-xs font-medium text-muted-foreground">Platform Health: <span className="text-foreground font-black">{healthScore}%</span></span>
                    
                    {/* Active Warnings */}
                    <div className="hidden md:flex items-center gap-2 px-2 py-0.5 bg-amber-500/10 rounded-md border border-amber-500/20">
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                        <span className="text-[10px] font-bold text-amber-500">1 Warning</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">View Details</span>
                    <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform duration-300", expanded ? "rotate-180" : "")} />
                </div>
            </div>

            <motion.div 
                initial={false}
                animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
                className="overflow-hidden bg-muted/10 border-t border-white/[0.02]"
            >
                <div className="p-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                    {services.map((service, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                            <div className={cn(
                                "p-2 rounded-md",
                                service.status === "healthy" ? "bg-emerald-500/10 text-emerald-400" :
                                service.status === "warning" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"
                            )}>
                                <service.icon className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold">{service.name}</span>
                                <span className={cn(
                                    "text-[10px]",
                                    service.status === "healthy" ? "text-muted-foreground" :
                                    service.status === "warning" ? "text-amber-400" : "text-red-400"
                                )}>{service.latency}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
