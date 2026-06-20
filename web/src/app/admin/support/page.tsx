"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api/api-client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import {
    LifeBuoy,
    MessageCircle,
    Search,
    User,
    CheckCircle2,
    Clock,
    AlertCircle,
    MoreVertical,
    Loader2
} from "lucide-react"

export default function SupportCenterPage() {
    const [tickets, setTickets] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchTickets()
    }, [])

    const fetchTickets = async () => {
        setLoading(true)
        try {
            const res = await api.get('/admin/tickets')
            setTickets(res.data || [])
        } catch (error) {
            console.error("Failed to fetch tickets", error)
        } finally {
            setLoading(false)
        }
    }

    const handleRespond = async (id: string) => {
        try {
            await api.patch(`/admin/tickets/${id}`, { status: "Closed" })
            fetchTickets()
        } catch (error) {
            console.error("Failed to update ticket", error)
        }
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                        <Badge variant="outline" className="glass border-cyan-500/30 text-cyan-400 px-4 font-black tracking-widest text-[9px] uppercase rounded-full">
                            Customer Success
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter text-foreground">
                        Support <span className="text-cyan-500">Center</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl">
                        Manage user support tickets, monitor customer success metrics, and oversee the help desk.
                    </p>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="glass border-border/50 rounded-[1.5rem]">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Open Tickets</p>
                                <p className="text-3xl font-black font-mono text-cyan-500">24</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                                <LifeBuoy className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-border/50 rounded-[1.5rem]">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Avg Response</p>
                                <p className="text-3xl font-black font-mono text-emerald-500">1.4h</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <Clock className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-border/50 rounded-[1.5rem]">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Resolution Rate</p>
                                <p className="text-3xl font-black font-mono text-emerald-500">92%</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-border/50 rounded-[1.5rem]">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Escalated</p>
                                <p className="text-3xl font-black font-mono text-rose-500">3</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Support Queue */}
            <Card className="glass border-border/50 rounded-[1.5rem] overflow-hidden">
                <CardHeader className="border-b border-border/30 bg-muted/20 pb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Support Ticket Queue</CardTitle>
                                <CardDescription>Incoming user requests and technical issues.</CardDescription>
                            </div>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Search tickets..." className="pl-9 bg-background/50 border-border rounded-xl w-full md:w-64" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-border/30">
                        {loading && (
                            <div className="p-10 flex justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-cyan-500/50" />
                            </div>
                        )}
                        {!loading && tickets.length === 0 && (
                            <div className="p-10 text-center text-muted-foreground font-bold">
                                No support tickets currently!
                            </div>
                        )}
                        {!loading && tickets.map((ticket, i) => (
                            <motion.div 
                                key={ticket.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="p-6 hover:bg-muted/30 transition-colors flex flex-col md:flex-row gap-6 md:items-center justify-between group"
                            >
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest bg-muted/50 border-border">
                                            {ticket.id}
                                        </Badge>
                                        <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-widest ${
                                            ticket.status === 'Open' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' :
                                            ticket.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                        }`}>
                                            {ticket.status}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3"/> {ticket.created_at ? new Date(ticket.created_at).toLocaleString() : ticket.time}</span>
                                    </div>
                                    <h3 className="font-bold text-foreground text-base">{ticket.subject}</h3>
                                    <div className="flex items-center gap-2 pt-1">
                                        <User className="w-3 h-3 text-muted-foreground" />
                                        <span className="text-xs font-mono text-muted-foreground">{ticket.user || ticket.user_id}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden md:block">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Priority</p>
                                        <p className={`font-mono text-sm font-bold ${
                                            ticket.priority === 'High' ? 'text-rose-400' :
                                            ticket.priority === 'Medium' ? 'text-amber-400' :
                                            'text-emerald-400'
                                        }`}>{ticket.priority}</p>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button onClick={() => handleRespond(ticket.id)} variant="outline" className="h-9 glass text-cyan-400 hover:text-cyan-500 hover:bg-cyan-500/10">
                                            Close Ticket
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
