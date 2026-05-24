"use client"

import { useState, useEffect } from "react"
import { fetchWithAuth } from "@/lib/api/api-client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Route, Compass, CheckCircle2, ChevronRight, Sparkles, Star } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function RoadmapPage() {
    const [roadmap, setRoadmap] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [selectedRole, setSelectedRole] = useState("Backend Developer")

    const roles = ["Backend Developer", "AI Engineer", "Frontend Developer"]

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                const res = await fetchWithAuth("/career/roadmap")
                if (res.status === "success" && res.data) {
                    setRoadmap(res.data)
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
        setGenerating(true)
        try {
            const res = await fetchWithAuth("/career/roadmap/generate", {
                method: "POST",
                body: JSON.stringify({ target_role: selectedRole })
            })
            if (res.status === "success" && res.data) {
                setRoadmap(res.data)
                toast.success(`Generated custom AI roadmap for ${selectedRole}!`)
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
        <div className="min-h-screen pt-28 pb-16 px-4 md:px-8 max-w-5xl mx-auto space-y-12 relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[150px] -z-10 rounded-full" />
            
            <div className="border-b border-white/5 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
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
            <div className="glass border-white/5 p-8 rounded-[2rem] space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Compass className="w-5 h-5 text-primary" /> Choose Your Trajectory
                </h3>
                
                <div className="flex flex-wrap gap-3">
                    {roles.map((role) => (
                        <button
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            className={`px-6 py-3 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all ${
                                selectedRole === role 
                                    ? "bg-primary text-black border-primary font-black shadow-lg"
                                    : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>

                <div className="flex justify-end pt-2">
                    <Button 
                        onClick={handleGenerate}
                        disabled={generating}
                        className="h-12 px-8 rounded-xl text-xs font-bold tracking-widest uppercase gap-2"
                    >
                        {generating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> GENERATING ROADMAP
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" /> GENERATE DYNAMIC PATH
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Roadmap Timeline */}
            {roadmap ? (
                <div className="space-y-8 relative">
                    <div className="absolute left-[39px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary via-primary/30 to-transparent -z-10" />

                    <div className="pl-2">
                        <h2 className="text-2xl font-bold text-white mb-2">Target Path: {roadmap.target_role}</h2>
                        <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5 mt-4 max-w-md">
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
                                    <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center border-2 z-10 transition-all ${
                                        isCompleted 
                                            ? "bg-primary/20 border-primary text-primary" 
                                            : isActive 
                                                ? "bg-black border-primary text-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)] animate-pulse" 
                                                : "bg-white/5 border-white/5 text-muted-foreground"
                                    }`}>
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-8 h-8" />
                                        ) : (
                                            <Star className="w-8 h-8" />
                                        )}
                                    </div>

                                    {/* Milestone Card */}
                                    <div className={`flex-1 glass p-8 rounded-[2rem] border transition-all ${
                                        isActive ? "border-primary/30 bg-primary/5" : "border-white/5"
                                    }`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-xl font-bold tracking-tight text-white">{node.milestone}</h4>
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
                                                    <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-primary' : isActive ? 'bg-primary/50' : 'bg-muted-foreground/30'}`} />
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
            ) : (
                <div className="text-center py-24 glass rounded-[3rem] border-white/5 border-dashed max-w-md mx-auto">
                    <Compass className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="text-[11px] font-black uppercase tracking-widest text-white/50">No active roadmap path selected.</p>
                </div>
            )}
        </div>
    )
}
