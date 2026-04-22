"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Activity, 
    ShieldCheck, 
    ShieldAlert, 
    Search, 
    Loader2, 
    Terminal, 
    Clock, 
    Filter, 
    ChevronRight,
    Lock,
    Eye,
    Zap,
    Scale,
    Cpu
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/lib/api/api-client"
import { cn } from "@/lib/utils"

export default function GlobalAuditPage() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    useEffect(() => {
        fetchAudit()
    }, [])

    const fetchAudit = async () => {
        setLoading(true)
        try {
            const data = await api.activity.admin(100)
            setEvents(data || [])
        } catch (e) {
            console.error("Administrative telemetry failure", e)
        } finally {
            setLoading(false)
        }
    }

    const filteredEvents = events.filter(e => 
        e.description?.toLowerCase().includes(search.toLowerCase()) || 
        e.actor_id?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-12 pb-20">
            {/* Admin Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
                <div className="space-y-3">
                    <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-4 font-black tracking-widest text-[9px] uppercase italic">
                        Platform Governance Node
                    </Badge>
                    <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter text-white uppercase flex items-center gap-6">
                        Audit <span className="text-primary">Ledger</span>
                        <Lock className="w-12 h-12 text-primary animate-pulse" />
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl font-medium">
                        Unified platform telemetry interface for staff oversight, compliance monitoring, and transactional forensics.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
                    <Button onClick={fetchAudit} variant="ghost" size="icon" className="h-10 w-10 text-white/20 hover:text-primary">
                        <Zap className={cn("w-5 h-5", loading && "animate-spin")} />
                    </Button>
                </div>
            </div>

            {/* Live Telemetry Card */}
            <Card className="bg-[#020202] border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden border-t-primary/40 border-t-2">
                <CardHeader className="bg-white/[0.02] border-b border-white/10 p-10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <Cpu className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black italic uppercase tracking-tighter">Event Archive</CardTitle>
                                <CardDescription className="font-mono text-[10px] uppercase opacity-30 italic">Monitoring system-wide signals across all roles.</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:flex-none">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <Input 
                                    placeholder="Search by Actor ID or Description..." 
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="bg-white/5 border-white/10 pl-10 h-12 rounded-xl text-xs w-full md:w-80 font-mono"
                                />
                            </div>
                            <Button variant="outline" className="h-12 w-12 rounded-xl bg-white/5 border-white/10 hover:bg-white/10">
                                <Filter className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-white/[0.01]">
                            <TableRow className="border-b border-white/5 h-16 hover:bg-transparent">
                                <TableHead className="px-10 font-black uppercase text-[10px] tracking-[0.2em] text-white/30">Timestamp / Signal</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-[0.2em] text-white/30">Actor Role</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-[0.2em] text-white/30">Protocol Description</TableHead>
                                <TableHead className="text-center font-black uppercase text-[10px] tracking-[0.2em] text-white/30">Entity Vector</TableHead>
                                <TableHead className="text-right px-10 font-black uppercase text-[10px] tracking-[0.2em] text-white/30">TX Hash</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-48 text-center">
                                        <Loader2 className="w-12 h-12 animate-spin text-primary/40 mx-auto mb-6" />
                                        <p className="text-white/20 font-black italic uppercase tracking-[0.4em] text-xs">Synchronizing Archive Matrix...</p>
                                    </TableCell>
                                </TableRow>
                            ) : filteredEvents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-32 text-center text-white/10 italic font-black tracking-widest uppercase text-xs">
                                        No telemetry signals detected.
                                    </TableCell>
                                </TableRow>
                            ) : filteredEvents.map((event, idx) => (
                                <motion.tr 
                                    key={event.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.02 }}
                                    className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group"
                                >
                                    <TableCell className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary/5 group-hover:border-primary/40 transition-all">
                                                <Terminal className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-mono text-white tracking-widest">[{new Date(event.created_at).toLocaleTimeString([], { hour12: false })}]</p>
                                                <Badge variant="outline" className="bg-white/5 border-none text-[8px] font-black uppercase tracking-[0.2em] px-0 text-primary/60">{event.event_type}</Badge>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(
                                            "font-black uppercase text-[9px] px-3 py-1 italic tracking-widest border-white/10",
                                            event.actor_role === 'admin' ? "bg-primary/10 text-primary border-primary/20" : "bg-white/5 text-white/40"
                                        )}>
                                            {event.actor_role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="max-w-md">
                                        <p className="text-sm font-medium text-white/80 italic leading-relaxed">{event.description}</p>
                                        <p className="text-[9px] font-mono text-white/10 mt-1 uppercase">Actor: {event.actor_id}</p>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="border-none bg-white/5 text-[9px] font-mono tracking-tighter opacity-40">
                                            {event.entity_type || 'GLOBAL'}:{event.entity_id?.slice(0, 8) || 'SYSTEM'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right px-10">
                                        <div className="flex items-center justify-end gap-3">
                                            <span className="text-[10px] font-mono text-white/20 group-hover:text-primary/40 transition-colors">#{event.id.slice(0, 10)}</span>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/10 hover:text-white rounded-lg">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Governance Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 opacity-30 hover:opacity-100 transition-opacity duration-700">
                {[
                    { title: 'Transactional Integrity', val: 'Verified', icon: <ShieldCheck className="w-5 h-5 text-emerald-500"/> },
                    { title: 'System-Wide Signals', val: events.length, icon: <Activity className="w-5 h-5 text-primary"/> },
                    { title: 'Oversight Consensus', val: 'Active', icon: <Scale className="w-5 h-5 text-amber-500"/> }
                ].map(stat => (
                    <div key={stat.title} className="p-8 border border-white/5 bg-white/[0.02] rounded-3xl flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">{stat.title}</p>
                            <p className="text-2xl font-black text-white">{stat.val}</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                             {stat.icon}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
