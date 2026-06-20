"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api/api-client"
import { motion } from "framer-motion"
import {
    Activity,
    Database,
    Server,
    Mail,
    RefreshCw,
    Loader2,
    CheckCircle2,
    XCircle,
    Cpu,
    Network
} from "lucide-react"

export default function SystemHealthPage() {
    const [health, setHealth] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        fetchHealth()
    }, [])

    const fetchHealth = async () => {
        setRefreshing(true)
        try {
            const data = await api.get(`/admin/system-health`)
            setHealth(data)
        } catch (err) {
            console.error("Failed to fetch system health", err)
            // Mock data for development if backend fails
            setHealth({
                overall: "degraded",
                database: { status: "healthy", latency_ms: 2 },
                redis: { status: "unhealthy", error: "Connection refused" },
                backend: { status: "healthy" }
            })
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500/40" />
            </div>
        )
    }

    const isOperational = health?.overall === "operational"

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_rgba(0,0,0,0.8)] ${isOperational ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-rose-500 shadow-rose-500/50'}`} />
                        <Badge variant="outline" className={`glass px-4 font-black tracking-widest text-[9px] uppercase rounded-full ${isOperational ? 'border-emerald-500/30 text-emerald-400' : 'border-rose-500/30 text-rose-400'}`}>
                            {isOperational ? "All Systems Operational" : "System Degraded"}
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter text-foreground">
                        System <span className={isOperational ? "text-emerald-500" : "text-rose-500"}>Health</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl">
                        Real-time monitoring of platform infrastructure, databases, and third-party services.
                    </p>
                </div>
                
                <Button 
                    onClick={fetchHealth} 
                    disabled={refreshing}
                    variant="outline"
                    className="rounded-xl font-bold gap-2 px-6 h-11 glass border-border hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh Status
                </Button>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                
                {/* Database */}
                <Card className="glass border-border/50 rounded-[1.5rem] overflow-hidden">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${health?.database?.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                <Database className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-black uppercase tracking-wider">Primary DB</CardTitle>
                                <CardDescription className="text-xs font-medium mt-0.5 text-muted-foreground/70">PostgreSQL 15</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</span>
                            {health?.database?.status === 'healthy' ? (
                                <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Healthy</Badge>
                            ) : (
                                <Badge className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/20"><XCircle className="w-3 h-3 mr-1" /> Unhealthy</Badge>
                            )}
                        </div>
                        {health?.database?.latency_ms !== undefined && (
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Latency</span>
                                <span className="text-sm font-black font-mono">{health.database.latency_ms}ms</span>
                            </div>
                        )}
                        {health?.database?.error && (
                            <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-400 font-mono break-all">
                                {health.database.error}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Redis */}
                <Card className="glass border-border/50 rounded-[1.5rem] overflow-hidden">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${health?.redis?.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                <Server className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-black uppercase tracking-wider">Redis Cache</CardTitle>
                                <CardDescription className="text-xs font-medium mt-0.5 text-muted-foreground/70">In-memory Store</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</span>
                            {health?.redis?.status === 'healthy' ? (
                                <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Healthy</Badge>
                            ) : (
                                <Badge className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/20"><XCircle className="w-3 h-3 mr-1" /> Unhealthy</Badge>
                            )}
                        </div>
                        {health?.redis?.error && (
                            <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-400 font-mono break-all">
                                {health.redis.error}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* API Backend */}
                <Card className="glass border-border/50 rounded-[1.5rem] overflow-hidden">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${health?.backend?.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                <Cpu className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-black uppercase tracking-wider">API Backend</CardTitle>
                                <CardDescription className="text-xs font-medium mt-0.5 text-muted-foreground/70">FastAPI Workers</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</span>
                            {health?.backend?.status === 'healthy' ? (
                                <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Healthy</Badge>
                            ) : (
                                <Badge className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/20"><XCircle className="w-3 h-3 mr-1" /> Unhealthy</Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* SMTP Email */}
                <Card className="glass border-border/50 rounded-[1.5rem] overflow-hidden opacity-60">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-black uppercase tracking-wider">Email Delivery</CardTitle>
                                <CardDescription className="text-xs font-medium mt-0.5 text-muted-foreground/70">SMTP Server</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</span>
                            <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/20">Unmonitored</Badge>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
