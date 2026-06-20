"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api/api-client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import {
    Users,
    MessageSquare,
    AlertTriangle,
    Flag,
    ShieldBan,
    CheckCircle2,
    Search,
    Loader2
} from "lucide-react"

export default function CommunityModerationPage() {
    const [loading, setLoading] = useState(false)

    const [reports, setReports] = useState<any[]>([])

    useEffect(() => {
        fetchReports()
    }, [])

    const fetchReports = async () => {
        setLoading(true)
        try {
            const res = await api.get('/admin/reports?status=pending')
            setReports(res.data || [])
        } catch (error) {
            console.error("Failed to fetch reports", error)
        } finally {
            setLoading(false)
        }
    }

    const handleResolve = async (id: string, type: string, action: string) => {
        try {
            if (action === "ban") {
                // To ban user, we might need target_id
                const report = reports.find(r => r.id === id)
                if (report?.target_id) {
                    await api.patch(`/admin/users/${report.target_id}/status`, { status: "banned" })
                }
            }
            // Mark report as resolved
            await api.patch('/admin/reports/resolve', { id, type, status: "resolved" })
            fetchReports()
        } catch (error) {
            console.error("Failed to resolve report", error)
        }
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(20,184,166,0.8)]" />
                        <Badge variant="outline" className="glass border-teal-500/30 text-teal-400 px-4 font-black tracking-widest text-[9px] uppercase rounded-full">
                            Content Moderation
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter text-foreground">
                        Community <span className="text-teal-500">Oversight</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl">
                        Review reported content, manage user bans, and enforce community guidelines across the platform.
                    </p>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="glass border-border/50 rounded-[1.5rem]">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Pending Reports</p>
                                <p className="text-3xl font-black font-mono text-amber-500">{reports.length}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-border/50 rounded-[1.5rem]">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Bans</p>
                                <p className="text-3xl font-black font-mono text-rose-500">142</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                                <ShieldBan className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-border/50 rounded-[1.5rem]">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Auto-Flagged (24h)</p>
                                <p className="text-3xl font-black font-mono text-indigo-500">89</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                <Flag className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-border/50 rounded-[1.5rem]">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Resolution Time</p>
                                <p className="text-3xl font-black font-mono text-emerald-500">1.2h</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Reported Content Queue */}
            <Card className="glass border-border/50 rounded-[1.5rem] overflow-hidden">
                <CardHeader className="border-b border-border/30 bg-muted/20 pb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Moderation Queue</CardTitle>
                                <CardDescription>User-reported and AI-flagged content requiring manual review.</CardDescription>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="glass border-border font-bold text-xs h-9">
                                Auto-Resolve Safe
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-border/30">
                        {reports.length === 0 && !loading && (
                            <div className="p-10 text-center text-muted-foreground font-bold">
                                No pending reports! You're all caught up.
                            </div>
                        )}
                        {loading && (
                            <div className="p-10 flex justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-teal-500/50" />
                            </div>
                        )}
                        {!loading && reports.map((report, i) => (
                            <motion.div 
                                key={report.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="p-6 hover:bg-muted/30 transition-colors flex flex-col md:flex-row gap-6 md:items-center justify-between group"
                            >
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest bg-muted/50 border-border">
                                            {report.type}
                                        </Badge>
                                        <span className="text-xs font-mono text-muted-foreground">Target: {report.target}</span>
                                        <span className="text-xs text-muted-foreground">• {new Date(report.created_at).toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm font-medium text-foreground italic border-l-2 border-teal-500/50 pl-3">
                                        "{report.reason}"
                                    </p>
                                    <div className="flex items-center gap-2 pt-2">
                                        <AlertTriangle className="w-3 h-3 text-rose-500" />
                                        <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">Reported by: {report.reporter}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <Button onClick={() => handleResolve(report.id, report.type, "ignore")} variant="outline" className="h-9 glass border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10">
                                        Ignore & Keep
                                    </Button>
                                    <Button onClick={() => handleResolve(report.id, report.type, "delete")} variant="outline" className="h-9 glass border-rose-500/30 text-rose-500 hover:bg-rose-500/10">
                                        Delete Content
                                    </Button>
                                    <Button onClick={() => handleResolve(report.id, report.type, "ban")} variant="outline" className="h-9 glass border-rose-500 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white">
                                        Ban User
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
