"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Activity, 
    Users, 
    UserPlus, 
    Briefcase, 
    CheckCircle2, 
    XCircle,
    Loader2,
    Clock,
    Search,
    BarChart3,
    History,
    ShieldCheck
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api/api-client"
import { useAuth } from "@/context/auth-context"
import { cn } from "@/lib/utils"

export default function TeamOpsLogPage() {
    const { user } = useAuth()
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("")

    useEffect(() => {
        if (user) fetchActivity()
    }, [user])

    const fetchActivity = async () => {
        setLoading(true)
        try {
            const data = await api.activity.company(50)
            setEvents(data || [])
        } catch (e) {
            console.error("Team telemetry sync failure", e)
        } finally {
            setLoading(false)
        }
    }

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'company_create': return <ShieldCheck className="w-5 h-5 text-primary" />
            case 'job_created': return <Briefcase className="w-5 h-5 text-emerald-500" />
            case 'member_invited': return <UserPlus className="w-5 h-5 text-blue-500" />
            case 'application_shortlisted': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            case 'application_rejected': return <XCircle className="w-5 h-5 text-rose-500" />
            default: return <Activity className="w-5 h-5 text-white/40" />
        }
    }

    const filteredEvents = events.filter(e => 
        e.description?.toLowerCase().includes(filter.toLowerCase()) || 
        e.event_type?.toLowerCase().includes(filter.toLowerCase())
    )

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            {/* Ops Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/5 text-emerald-500 tracking-widest uppercase font-black text-[10px] px-4 py-1">
                        Team Operations: Command Ledger
                    </Badge>
                    <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white leading-none">
                        Hiring <span className="text-emerald-500 text-opacity-80">Timeline.</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl font-medium">
                        Audit trail of organizational growth. Track recruitment decisions, team expansions, and strategic profile matches.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <Input 
                            placeholder="Scan ops logs..." 
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                            className="bg-transparent border-none pl-10 h-10 w-48 text-xs font-mono"
                        />
                    </div>
                    <Button onClick={fetchActivity} variant="ghost" size="icon" className="h-10 w-10 text-white/40 hover:text-white">
                        <History className={cn("w-5 h-5", loading && "animate-pulse")} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Stats Sidebar */}
                <div className="space-y-6">
                    <Card className="bg-white/5 border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden">
                        <BarChart3 className="absolute -top-4 -right-4 w-24 h-24 text-white/5 rotate-12" />
                        <div className="relative z-10 space-y-6">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Total Team Actions</p>
                                <p className="text-4xl font-black text-white">{events.length}</p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold italic">
                                    <span className="text-white/40">Efficiency Rating</span>
                                    <span className="text-emerald-500">92%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                     <div className="h-full w-[92%] bg-emerald-500 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-3">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            <h4 className="text-xs font-black uppercase tracking-widest text-primary">Compliance Node</h4>
                        </div>
                        <p className="text-[10px] italic text-primary/60 leading-relaxed">
                            Team operations are logged for administrative oversight. Decisions cannot be modified once synchronized with the command ledger.
                        </p>
                    </div>
                </div>

                {/* Main Log */}
                <Card className="lg:col-span-2 bg-[#020202] border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                    <CardHeader className="bg-white/[0.02] border-b border-white/5 p-8 flex flex-row items-center justify-between">
                         <div>
                            <CardTitle className="text-xl font-black italic uppercase tracking-widest flex items-center gap-3">
                                <Users className="w-6 h-6 text-emerald-500" /> Operational Stream
                            </CardTitle>
                            <CardDescription className="text-xs font-mono uppercase opacity-30 tracking-tight italic">Consolidated organizational telemetry</CardDescription>
                         </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-white/5">
                            {loading ? (
                                [1,2,3,4,5].map(i => (
                                    <div key={i} className="p-8 flex items-center gap-6 opacity-20 animate-pulse">
                                        <div className="w-10 h-10 bg-white/20 rounded-xl" />
                                        <div className="space-y-2 flex-1">
                                            <div className="h-4 w-64 bg-white/20 rounded" />
                                            <div className="h-3 w-32 bg-white/10 rounded" />
                                        </div>
                                    </div>
                                ))
                            ) : filteredEvents.length === 0 ? (
                                <div className="py-32 text-center space-y-4">
                                    <Activity className="w-12 h-12 text-white/5 mx-auto" />
                                    <p className="text-white/20 font-black italic uppercase tracking-widest text-xs">No organizational signals detected.</p>
                                </div>
                            ) : filteredEvents.map((event, idx) => (
                                <motion.div 
                                    key={event.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="p-8 flex items-center gap-6 group hover:bg-white/[0.02] transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-emerald-500/30 transition-colors shadow-xl">
                                        {getEventIcon(event.event_type)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                         <div className="flex justify-between items-center">
                                            <p className="font-bold text-white group-hover:text-emerald-500 transition-colors tracking-tight">{event.description}</p>
                                            <span className="text-[10px] font-mono text-white/10">ID:{event.id.slice(0,6)}</span>
                                         </div>
                                         <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/20 italic">
                                            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(event.created_at).toLocaleString()}</span>
                                            <span className="flex items-center gap-1.5 text-emerald-500/40"><ShieldCheck className="w-3 h-3" /> System Verified</span>
                                         </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
