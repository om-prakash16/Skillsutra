"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api/api-client"
import { motion } from "framer-motion"
import { ProvisionUserModal } from "@/components/admin/provision-user-modal"
import {
    GraduationCap,
    Loader2,
    Search,
    PlusCircle,
    UserX,
    User,
    Calendar,
    Star
} from "lucide-react"

interface Mentor {
    id: string
    email: string
    username: string
    first_name: string
    last_name: string
    status: string
}

export default function MentorsPage() {
    const [mentors, setMentors] = useState<Mentor[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchMentors()
    }, [])

    const fetchMentors = async () => {
        setLoading(true)
        try {
            const data = await api.get(`/admin/users?role=mentor&limit=100`)
            setMentors(data?.data?.users || [])
        } catch (err) {
            console.error("Failed to fetch mentors", err)
            setMentors([])
        } finally {
            setLoading(false)
        }
    }

    const filtered = mentors.filter(m => 
        m.email?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.username?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                        <Badge variant="outline" className="glass border-blue-500/30 text-blue-400 px-4 font-black tracking-widest text-[9px] uppercase rounded-full">
                            Expert Network
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter text-foreground">
                        Platform <span className="text-blue-500">Mentors</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl">
                        Manage the network of industry experts, their verification status, and availability.
                    </p>
                </div>
                
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search mentors..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full md:w-64 h-11 rounded-xl bg-background/50 border border-border text-sm text-foreground focus:outline-none focus:border-blue-500/50 transition-all"
                        />
                    </div>
                    <ProvisionUserModal
                        role="mentor"
                        onSuccess={fetchMentors}
                        trigger={
                            <Button className="rounded-xl font-bold bg-blue-500 hover:bg-blue-600 text-white gap-2 px-6 h-11">
                                <PlusCircle className="w-4 h-4" />
                                Onboard Mentor
                            </Button>
                        }
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500/40" />
                </div>
            ) : filtered.length === 0 ? (
                <Card className="glass border-border/50 rounded-[2rem]">
                    <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
                        <GraduationCap className="w-16 h-16 text-blue-500/30" />
                        <p className="text-muted-foreground/60 font-bold text-sm uppercase tracking-widest">
                            No mentors found
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((mentor, idx) => (
                        <motion.div
                            key={mentor.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Card className="glass border-border/50 rounded-[1.5rem] overflow-hidden hover:border-blue-500/20 transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                                                <GraduationCap className="w-5 h-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-bold text-base truncate max-w-[150px]">
                                                    {mentor.first_name} {mentor.last_name}
                                                </h3>
                                                <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                                                    {mentor.email}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={mentor.status === 'active' ? "text-emerald-400 border-emerald-400/30 bg-emerald-500/5" : "text-zinc-400 border-zinc-400/30 bg-zinc-500/5"}>
                                            {mentor.status}
                                        </Badge>
                                    </div>
                                    <div className="mt-4 flex gap-3 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-amber-500" />
                                            <span>4.9 Avg</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3 text-blue-500" />
                                            <span>12 Sessions</span>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-between gap-2">
                                        <Button variant="outline" size="sm" className="flex-1 rounded-lg text-xs font-bold glass">
                                            View Profile
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-lg text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 glass border-rose-500/20">
                                            <UserX className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
