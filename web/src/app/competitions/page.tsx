"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api/api-client"
import { Button } from "@/components/ui/button"
import { Trophy, Code, Target, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function CompetitionsPage() {
    const [competitions, setCompetitions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchComps = async () => {
            try {
                const res = await api.get("/competitions/")
                setCompetitions(res.data || [])
            } catch (err) {
                console.error("Failed to fetch competitions", err)
            } finally {
                setLoading(false)
            }
        }
        fetchComps()
    }, [])

    const getIcon = (type: string) => {
        switch (type) {
            case "hackathon": return <Code className="w-5 h-5 text-primary" />
            case "bounty": return <Target className="w-5 h-5 text-green-500" />
            default: return <Trophy className="w-5 h-5 text-yellow-500" />
        }
    }

    return (
        <div className="min-h-screen flex flex-col pt-24 pb-12 px-4 sm:px-8 container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black font-heading italic uppercase tracking-tight mb-2">Active Challenges</h1>
                    <p className="text-[11px] font-black uppercase tracking-widest text-white/40">Hackathons, Bounties & Grants</p>
                </div>
                <Link href="/competitions/preferences">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-white/10 text-[10px] font-black uppercase tracking-widest">
                        Customize Preferences
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 glass rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : competitions.length === 0 ? (
                <div className="text-center py-32 glass rounded-[3rem] border-white/5">
                    <Trophy className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="text-[11px] font-black uppercase tracking-widest text-white/50">No Active Competitions</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {competitions.map((comp) => (
                        <div key={comp.id} className="glass border-white/5 rounded-3xl p-6 flex flex-col hover:border-primary/30 transition-colors group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        {getIcon(comp.comp_type)}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 bg-white/5 px-3 py-1 rounded-full">
                                        {comp.comp_type}
                                    </span>
                                </div>
                                {comp.status === "open" && (
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                )}
                            </div>
                            
                            <h3 className="text-xl font-bold mb-2 line-clamp-1">{comp.title}</h3>
                            <p className="text-sm text-white/60 mb-6 line-clamp-2 flex-1">{comp.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-6">
                                {comp.skills_required?.slice(0, 3).map((skill: string) => (
                                    <span key={skill} className="text-[10px] font-black uppercase tracking-widest text-primary/80 bg-primary/10 px-2 py-1 rounded-md">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                    {comp.deadline ? `Ends ${new Date(comp.deadline).toLocaleDateString()}` : "No deadline"}
                                </span>
                                {comp.url && (
                                    <Link href={comp.url} target="_blank">
                                        <Button variant="ghost" size="sm" className="h-8 gap-2 hover:bg-white/5">
                                            <span className="text-[10px] font-black uppercase tracking-widest">View</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
