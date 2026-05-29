"use client"

import { useState, useEffect } from "react"
import { fetchWithAuth } from "@/lib/api/api-client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Loader2, Route, Compass, CheckCircle2, ChevronRight, Sparkles, Star, Target, TrendingUp, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function RoadmapPage() {
    const [roadmap, setRoadmap] = useState<any>(null)
    const [gapAnalysis, setGapAnalysis] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [customRole, setCustomRole] = useState("")

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                const res = await fetchWithAuth("/career/roadmap")
                if (res.status === "success" && res.data) {
                    setRoadmap(res.data)
                    // Fetch gap analysis for active roadmap target role
                    const gapRes = await fetchWithAuth(`/career/gap-analysis?target_role=${encodeURIComponent(res.data.target_role)}`)
                    if (gapRes.status === "success") {
                        setGapAnalysis(gapRes.data)
                    }
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchRoadmap()
    }, [])

    const handleGenerate = async () => {
        if (!customRole.trim()) {
            toast.error("Please enter a target role.")
            return
        }

        setGenerating(true)
        try {
            const gapRes = await fetchWithAuth(`/career/gap-analysis?target_role=${encodeURIComponent(customRole)}`)
            if (gapRes.status === "success") {
                setGapAnalysis(gapRes.data)
            }

            const res = await fetchWithAuth("/career/roadmap/generate", {
                method: "POST",
                body: JSON.stringify({ target_role: customRole })
            })
            if (res.status === "success" && res.data) {
                setRoadmap(res.data)
                toast.success(`Generated custom AI roadmap for ${customRole}!`)
            }
        } catch (err) {
            console.error(err)
            toast.error("Failed to generate roadmap.")
        } finally {
            setGenerating(false)
        }
    }

    const handleAdvance = async () => {
        if (!roadmap) return
        const nextIndex = roadmap.current_milestone_index + 1
        if (nextIndex > roadmap.nodes_json.length) return
        
        try {
            const res = await fetchWithAuth("/career/roadmap/milestone", {
                method: "PATCH",
                body: JSON.stringify({
                    roadmap_id: roadmap.id,
                    new_index: nextIndex
                })
            })
            if (res.status === "success") {
                setRoadmap({ ...roadmap, current_milestone_index: nextIndex })
                toast.success("Milestone cleared! Keep leveling up!")
            }
        } catch (err) {
            console.error(err)
            toast.error("Failed to update milestone.")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen py-32 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Hydrating Career Roadmap...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 md:px-8 max-w-6xl mx-auto space-y-12 relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[150px] -z-10 rounded-full" />
            
            <div className="border-b border-border/50 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight flex items-center gap-3">
                        AI ROADMAPS <Route className="w-8 h-8 text-primary" />
                    </h1>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">
                        Map skills, conquer milestones, and unlock enterprise-level career velocity.
                    </p>
                </div>
            </div>

            {/* Generator Panel */}
            <div className="glass border-border/50 p-8 rounded-[2rem] space-y-6">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Compass className="w-5 h-5 text-primary" /> Define Your Target Role
                </h3>
                
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 w-full relative">
                        <Input 
                            value={customRole}
                            onChange={(e) => setCustomRole(e.target.value)}
                            placeholder="e.g. Senior Machine Learning Engineer, Full Stack Web3 Developer..."
                            className="bg-muted/50 border-border text-foreground h-12 rounded-xl pl-12 font-medium"
                        />
                        <Target className="w-5 h-5 text-muted-foreground absolute left-4 top-3.5" />
                    </div>
                    <Button 
                        onClick={handleGenerate}
                        disabled={generating}
                        className="h-12 px-8 rounded-xl text-xs font-bold tracking-widest uppercase gap-2 w-full md:w-auto"
                    >
                        {generating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> ANALYZING GAPS & PATH
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" /> GENERATE DYNAMIC PATH
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {gapAnalysis && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass p-6 rounded-3xl border-border/50 space-y-4 col-span-1 md:col-span-2">
                        <h4 className="text-lg font-bold flex items-center gap-2 text-foreground">
                            <TrendingUp className="w-5 h-5 text-primary" /> Skill Gap Analysis
                        </h4>
                        
                        <div className="space-y-4">
                            <div>
                                <h5 className="text-xs uppercase tracking-widest font-bold text-emerald-400 mb-2">Verified Skills (Have)</h5>
                                <div className="flex flex-wrap gap-2">
                                    {gapAnalysis.current_skills?.map((s: string) => (
                                        <Badge key={s} variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{s}</Badge>
                                    ))}
                                    {(!gapAnalysis.current_skills || gapAnalysis.current_skills.length === 0) && (
                                        <span className="text-xs text-muted-foreground italic">No verified skills found.</span>
                                    )}
                                </div>
                            </div>
                            
                            <div>
                                <h5 className="text-xs uppercase tracking-widest font-bold text-rose-400 mb-2">Missing Skills (Need)</h5>
                                <div className="flex flex-wrap gap-2">
                                    {gapAnalysis.missing_skills?.map((s: string) => (
                                        <Badge key={s} variant="outline" className="bg-rose-500/10 text-rose-400 border-rose-500/20">{s}</Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="glass p-6 rounded-3xl border-border/50 space-y-4 col-span-1 flex flex-col justify-center items-center text-center">
                        <h4 className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Readiness Score</h4>
                        <div className="text-6xl font-black text-foreground relative">
                            {gapAnalysis.readiness_score}%
                        </div>
                        <p className="text-xs text-muted-foreground max-w-[200px]">
                            Your current alignment with the {gapAnalysis.target_role} role.
                        </p>
                    </div>
                </div>
            )}

            {/* Roadmap Timeline */}
            {roadmap ? (
                <div className="space-y-8 relative">
                    <div className="absolute left-[39px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary via-primary/30 to-transparent -z-10" />

                    <div className="pl-2">
                        <h2 className="text-2xl font-bold text-foreground mb-2">Target Path: {roadmap.target_role}</h2>
                        <div className="w-full bg-muted/50 h-2.5 rounded-full overflow-hidden border border-border/50 mt-4 max-w-md">
                            <div 
                                className="bg-primary h-full transition-all duration-700" 
                                style={{ width: `${(roadmap.current_milestone_index / roadmap.nodes_json.length) * 100}%` }}
                            />
                        </div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mt-2">
                            Completion: {Math.round((roadmap.current_milestone_index / roadmap.nodes_json.length) * 100)}% ({roadmap.current_milestone_index}/{roadmap.nodes_json.length} Milestones)
                        </p>
                    </div>

                    <div className="space-y-12">
                        {roadmap.nodes_json.map((node: any, idx: number) => {
                            const isCompleted = idx < roadmap.current_milestone_index
                            const isActive = idx === roadmap.current_milestone_index
                            
                            return (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex gap-8 items-start"
                                >
                                    {/* Timeline Node Icon */}
                                    <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center border-2 z-10 transition-all flex-shrink-0 ${
                                        isCompleted 
                                            ? "bg-primary/20 border-primary text-primary" 
                                            : isActive 
                                                ? "bg-black border-primary text-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)] animate-pulse" 
                                                : "bg-muted/50 border-border/50 text-muted-foreground"
                                    }`}>
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-8 h-8" />
                                        ) : (
                                            <Star className="w-8 h-8" />
                                        )}
                                    </div>

                                    {/* Milestone Card */}
                                    <div className={`flex-1 glass p-8 rounded-[2rem] border transition-all ${
                                        isActive ? "border-primary/30 bg-primary/5" : "border-border/50"
                                    }`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-xl font-bold tracking-tight text-foreground">{node.milestone}</h4>
                                            {isCompleted && (
                                                <Badge variant="outline" className="text-emerald-400 border-emerald-500/20 text-micro">COMPLETED</Badge>
                                            )}
                                            {isActive && (
                                                <Badge variant="outline" className="text-primary border-primary/20 text-micro">ACTIVE</Badge>
                                            )}
                                        </div>

                                        <ul className="space-y-3.5 mb-6">
                                            {node.tasks.map((task: string, taskIdx: number) => (
                                                <li key={taskIdx} className="text-sm text-muted-foreground flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isCompleted ? 'bg-primary' : isActive ? 'bg-primary/50' : 'bg-muted-foreground/30'}`} />
                                                    {task}
                                                </li>
                                            ))}
                                        </ul>

                                        {isActive && (
                                            <div className="flex justify-end">
                                                <Button 
                                                    onClick={handleAdvance}
                                                    className="h-10 px-5 rounded-lg text-micro font-bold tracking-widest uppercase gap-1.5"
                                                >
                                                    CLEAR MILESTONE <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            ) : null}
            
            {!roadmap && !loading && !gapAnalysis && (
                <div className="text-center py-24 glass rounded-[3rem] border-border/50 border-dashed max-w-md mx-auto mt-12">
                    <Compass className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">No active roadmap path selected.</p>
                </div>
            )}
        </div>
    )
}
