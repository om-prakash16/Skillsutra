"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { fetchWithAuth } from "@/lib/api/api-client"
import { Loader2, Target, Route, ShieldCheck, Compass, CheckCircle2, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export default function CandidateCareerOSPage() {
    const params = useParams()
    const candidateId = params.id as string
    
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchWithAuth(`/career/os/hr-view/${candidateId}`).then(res => {
            if (res.status === "success") {
                setData(res.data)
            }
            setLoading(false)
        })
    }, [candidateId])

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Loading Candidate Career OS...</p>
            </div>
        )
    }

    if (!data) {
        return <div className="p-8">Candidate data unavailable.</div>
    }

    const { visions, roadmap } = data

    return (
        <div className="space-y-12">
            <div className="glass p-8 rounded-[2rem] border-border/50 border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ShieldCheck className="w-48 h-48 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-foreground flex items-center gap-3">
                    <Target className="w-6 h-6 text-primary" /> Candidate Career Vision
                </h2>
                <p className="text-sm text-muted-foreground max-w-2xl mb-8">
                    Review the candidate's long-term professional goals and trajectory. Personal daily habits are kept private.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    {['1_YEAR', '3_YEAR', '5_YEAR'].map(type => (
                        <div key={type} className="bg-black/40 p-6 rounded-2xl border border-border/50">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">{type.replace('_', ' ')} GOALS</h4>
                            <div className="space-y-3">
                                {visions.filter((v: any) => v.timeline_type === type).map((v: any, i: number) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                        <span className="text-sm text-foreground font-medium leading-relaxed">{v.title}</span>
                                    </div>
                                ))}
                                {visions.filter((v: any) => v.timeline_type === type).length === 0 && (
                                    <p className="text-xs text-muted-foreground italic">No goals documented.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass p-8 rounded-[2rem] border-border/50">
                <h2 className="text-2xl font-bold mb-8 text-foreground flex items-center gap-3">
                    <Route className="w-6 h-6 text-primary" /> Active Roadmap: {roadmap?.target_role || 'None'}
                </h2>
                
                {roadmap ? (
                    <div className="space-y-8 relative">
                        <div className="absolute left-[39px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary via-primary/30 to-transparent -z-10" />
                        
                        <div className="pl-2 mb-8">
                            <div className="w-full bg-muted/50 h-2.5 rounded-full overflow-hidden border border-border/50 max-w-md">
                                <div className="bg-primary h-full transition-all duration-700" style={{ width: `${(roadmap.current_milestone_index / roadmap.nodes_json.length) * 100}%` }} />
                            </div>
                            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mt-2">
                                Completion: {Math.round((roadmap.current_milestone_index / roadmap.nodes_json.length) * 100)}%
                            </p>
                        </div>

                        <div className="space-y-12">
                            {roadmap.nodes_json.map((node: any, idx: number) => {
                                const isCompleted = idx < roadmap.current_milestone_index
                                const isActive = idx === roadmap.current_milestone_index
                                
                                return (
                                    <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="flex gap-8 items-start">
                                        <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center border-2 z-10 transition-all flex-shrink-0 ${isCompleted ? "bg-primary/20 border-primary text-primary" : isActive ? "bg-black border-primary text-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)]" : "bg-muted/50 border-border/50 text-muted-foreground"}`}>
                                            {isCompleted ? <CheckCircle2 className="w-8 h-8" /> : <Star className="w-8 h-8" />}
                                        </div>

                                        <div className={`flex-1 glass p-8 rounded-[2rem] border transition-all ${isActive ? "border-primary/30 bg-primary/5" : "border-border/50"}`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-xl font-bold tracking-tight text-foreground">{node.milestone}</h4>
                                                {isCompleted && <Badge variant="outline" className="text-emerald-400 border-emerald-500/20 text-micro">COMPLETED</Badge>}
                                                {isActive && <Badge variant="outline" className="text-primary border-primary/20 text-micro">ACTIVE</Badge>}
                                            </div>
                                            <ul className="space-y-3.5">
                                                {node.tasks.map((task: string, taskIdx: number) => (
                                                    <li key={taskIdx} className="text-sm text-muted-foreground flex items-center gap-3">
                                                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isCompleted ? 'bg-primary' : isActive ? 'bg-primary/50' : 'bg-muted-foreground/30'}`} />
                                                        {task}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Compass className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">Candidate has not generated a career roadmap yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
