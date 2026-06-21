"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Activity, Server, Database, RefreshCw, Cpu, HardDrive, Wifi, ShieldCheck, Zap, Globe, Gauge } from "lucide-react"
import { Button } from "@/components/ui/button"

const MOCK_SERVICES = [
    { name: "API Gateway", icon: Globe, status: "healthy", latency: "42ms", uptime: "99.99%" },
    { name: "Primary Database (PostgreSQL)", icon: Database, status: "healthy", latency: "14ms", uptime: "99.95%" },
    { name: "Redis Cache", icon: Zap, status: "healthy", latency: "2ms", uptime: "100%" },
    { name: "Background Workers (Celery)", icon: Cpu, status: "healthy", latency: "N/A", uptime: "99.9%" },
    { name: "Vector Database (PgVector)", icon: Database, status: "healthy", latency: "56ms", uptime: "99.9%" },
    { name: "Blob Storage (S3)", icon: HardDrive, status: "healthy", latency: "112ms", uptime: "99.99%" },
    { name: "AI Provider (Gemini)", icon: Activity, status: "warning", latency: "850ms", uptime: "99.8%" },
]

export default function SystemDiagnosticsPage() {
    const [isRefreshing, setIsRefreshing] = useState(false)

    const handleRefresh = () => {
        setIsRefreshing(true)
        setTimeout(() => setIsRefreshing(false), 2000)
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-500 border border-blue-500/30">
                            <Activity className="w-5 h-5" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">System Diagnostics</h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl text-sm">
                        Real-time telemetry and health diagnostics for all critical infrastructure components.
                    </p>
                </div>
                
                <Button 
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="h-10 text-xs font-bold gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    Run Diagnostics
                </Button>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-3 text-muted-foreground">
                        <Gauge className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Global Load</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-black">24</span>
                        <span className="text-sm font-bold text-muted-foreground mb-1">%</span>
                    </div>
                </div>
                
                <div className="p-5 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-3 text-emerald-500">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">System Health</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-black">98.5</span>
                        <span className="text-sm font-bold text-emerald-500 mb-1">%</span>
                    </div>
                </div>
                
                <div className="p-5 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-3 text-blue-500">
                        <Wifi className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Active Conns</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-black">1,402</span>
                    </div>
                </div>
                
                <div className="p-5 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-3 text-rose-500">
                        <Server className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Active Nodes</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-black">8</span>
                        <span className="text-sm font-bold text-muted-foreground mb-1">/ 8</span>
                    </div>
                </div>
            </div>

            {/* Service List */}
            <div className="bg-muted/30 border border-border/50 rounded-2xl overflow-hidden backdrop-blur-xl p-6">
                <h2 className="text-lg font-black mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Infrastructure Components
                </h2>
                
                <div className="space-y-4">
                    {MOCK_SERVICES.map((service, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-background/50 border border-border/50">
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-lg border ${
                                    service.status === 'healthy' 
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                                        : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                }`}>
                                    <service.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">{service.name}</h3>
                                    <p className="text-xs text-muted-foreground">Uptime: {service.uptime}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Latency</p>
                                    <p className="font-mono text-xs font-bold">{service.latency}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                                    <div className="flex items-center gap-2 justify-end">
                                        <div className={`w-2 h-2 rounded-full ${
                                            service.status === 'healthy' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                                        }`} />
                                        <span className={`text-xs font-bold uppercase tracking-wider ${
                                            service.status === 'healthy' ? 'text-emerald-500' : 'text-amber-500'
                                        }`}>{service.status}</span>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest border-border/50 bg-background/50">
                                    Logs
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
