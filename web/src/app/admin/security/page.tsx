"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShieldAlert, ShieldCheck, Activity, Users, Globe, Lock, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { publicApi } from "@/lib/api/public-api"
import { formatDistanceToNow } from "date-fns"

export default function AdminSecurityOverview() {
    // For a real app, this would hit an admin-only endpoint: /api/v1/admin/security/overview
    // We mock the structure here for the UI layout.
    const mockSecurityStats = {
        active_sessions: 1420,
        trusted_devices: 853,
        high_severity_events: 12,
        average_security_score: 84
    }

    const mockRecentEvents = [
        { id: 1, user_email: "ceo@example.com", event: "NEW_DEVICE_LOGIN", severity: "high", ip: "192.168.1.1", created_at: new Date().toISOString() },
        { id: 2, user_email: "dev@example.com", event: "PASSWORD_CHANGED", severity: "medium", ip: "10.0.0.1", created_at: new Date(Date.now() - 3600000).toISOString() },
        { id: 3, user_email: "unknown", event: "FAILED_LOGIN", severity: "low", ip: "8.8.8.8", created_at: new Date(Date.now() - 7200000).toISOString() },
    ]

    return (
        <div className="space-y-12 animate-in fade-in duration-1000 pb-24 relative z-10">
            {/* Hero Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                        <Badge variant="outline" className="glass border-emerald-500/30 text-emerald-500 px-4 font-black tracking-widest text-[9px] uppercase rounded-full">
                            Security Posture: Nominal
                        </Badge>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black font-heading tracking-tighter text-foreground uppercase italic flex items-center gap-6 text-gradient">
                        Global <span className="text-emerald-500">Security</span> 
                        <ShieldCheck className="w-12 h-12 text-emerald-500" />
                    </h1>
                    <p className="text-muted-foreground text-xl max-w-2xl font-medium opacity-80">
                        Platform-wide threat monitoring, session auditing, and security score distributions.
                    </p>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card className="glass border-border/50 rounded-[2rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 flex items-center gap-2"><Globe className="w-4 h-4" /> Active Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-5xl font-black text-foreground tracking-tighter">{mockSecurityStats.active_sessions}</p>
                    </CardContent>
                </Card>
                <Card className="glass border-border/50 rounded-[2rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 flex items-center gap-2"><Lock className="w-4 h-4" /> Trusted Devices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-5xl font-black text-foreground tracking-tighter">{mockSecurityStats.trusted_devices}</p>
                    </CardContent>
                </Card>
                <Card className="glass border-border/50 rounded-[2rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 flex items-center gap-2"><Activity className="w-4 h-4" /> Avg Security Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-5xl font-black text-foreground tracking-tighter">{mockSecurityStats.average_security_score}</p>
                    </CardContent>
                </Card>
                <Card className="glass border-rose-500/30 rounded-[2rem] shadow-2xl relative overflow-hidden bg-rose-500/5">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-rose-500/20 blur-[50px] rounded-full" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> High Sev Events (24h)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-5xl font-black text-rose-500 tracking-tighter">{mockSecurityStats.high_severity_events}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Events List */}
            <Card className="glass border-border/50 rounded-[2.5rem] shadow-2xl overflow-hidden">
                <CardHeader className="border-b border-border/50 p-8">
                    <CardTitle className="text-xl font-black italic uppercase tracking-tight text-foreground flex items-center gap-3">
                        <ShieldAlert className="w-6 h-6 text-primary" /> Live Threat Stream
                    </CardTitle>
                    <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Global security events across all users</CardDescription>
                </CardHeader>
                <CardContent className="p-0 divide-y divide-border/50">
                    {mockRecentEvents.map(event => (
                        <div key={event.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/5 transition-colors gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${event.severity === 'high' ? 'bg-rose-500/20 text-rose-500' : event.severity === 'medium' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-foreground text-sm uppercase tracking-wide">{event.event}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{event.user_email} • {event.ip}</p>
                                </div>
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                {formatDistanceToNow(new Date(event.created_at))} ago
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
