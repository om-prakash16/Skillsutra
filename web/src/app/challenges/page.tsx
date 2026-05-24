"use client"

import { useState, useEffect } from "react"
import { fetchWithAuth } from "@/lib/api/api-client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Code2, Play, CheckCircle2, XCircle, Trophy, Sparkles } from "lucide-react"
import { toast } from "sonner"

export default function ChallengesPage() {
    const [challenges, setChallenges] = useState<any[]>([])
    const [selectedChall, setSelectedChall] = useState<any>(null)
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [results, setResults] = useState<any>(null)

    useEffect(() => {
        const fetchChalls = async () => {
            try {
                const res = await fetchWithAuth("/challenges/")
                if (res.status === "success") {
                    setChallenges(res.data)
                    if (res.data.length > 0) {
                        setSelectedChall(res.data[0])
                        setCode(res.data[0].code_template)
                    }
                }
            } catch (err) {
                console.error(err)
                toast.error("Failed to load challenges")
            } finally {
                setLoading(false)
            }
        }
        fetchChalls()
    }, [])

    const handleSelect = (chall: any) => {
        setSelectedChall(chall)
        setCode(chall.code_template)
        setResults(null)
    }

    const handleSubmit = async () => {
        if (!selectedChall) return
        setSubmitting(true)
        setResults(null)
        try {
            const res = await fetchWithAuth(`/challenges/${selectedChall.id}/submit`, {
                method: "POST",
                body: JSON.stringify({ code })
            })
            setResults(res)
            if (res.passed) {
                toast.success(`Congratulations! Earned +${res.score_earned} reputation points!`)
            } else {
                toast.error("Test cases failed. Check your logic.")
            }
        } catch (err) {
            console.error(err)
            toast.error("Submission failed.")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen py-32 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Booting Coding Arena...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-10 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 blur-[180px] -z-10 rounded-full" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight flex items-center gap-3">
                        CHALLENGE ARENA <Code2 className="w-8 h-8 text-primary" />
                    </h1>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">
                        Settle claims, build reputation, and verify raw coding velocity.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-4 py-2.5 rounded-2xl shadow-inner">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-bold tracking-wider text-muted-foreground">MULTIPLIER ACTIVE: 1.5x</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Challenges Sidebar */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/50 mb-2">Select Mission</h3>
                    {challenges.map((chall) => (
                        <div 
                            key={chall.id}
                            onClick={() => handleSelect(chall)}
                            className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${
                                selectedChall?.id === chall.id 
                                    ? "bg-primary/10 border-primary/40 shadow-[0_0_20px_hsl(var(--primary)/0.1)]"
                                    : "bg-white/5 border-white/5 hover:border-white/20"
                            }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <Badge variant="outline" className={`text-micro px-2 py-0.5 rounded-md ${
                                    chall.difficulty === "Easy" ? "text-emerald-400 border-emerald-500/20" : "text-amber-400 border-amber-500/20"
                                }`}>
                                    {chall.difficulty}
                                </Badge>
                                <span className="text-[10px] font-black text-primary">+{chall.points} PTS</span>
                            </div>
                            <h4 className="text-lg font-bold tracking-tight text-white">{chall.title}</h4>
                        </div>
                    ))}
                </div>

                {/* Code Workspace */}
                <div className="lg:col-span-2 space-y-6">
                    {selectedChall && (
                        <div className="glass border-white/5 p-8 rounded-[2rem] space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-white mb-2">{selectedChall.title}</h2>
                                <p className="text-sm text-muted-foreground leading-relaxed">{selectedChall.description}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Javascript Workspace
                                </label>
                                <textarea
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    rows={12}
                                    className="w-full bg-black/45 border border-white/5 rounded-2xl p-6 font-mono text-sm text-emerald-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button 
                                    onClick={handleSubmit}
                                    disabled={submitting || !code}
                                    className="h-12 px-6 rounded-xl text-xs font-bold tracking-widest uppercase gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" /> RUNNING TESTS
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4" /> SUBMIT SOLUTION
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Run Results Output */}
                            {results && (
                                <div className="border border-white/5 bg-black/25 rounded-2xl p-6 space-y-4 shadow-inner">
                                    <div className="flex items-center gap-3">
                                        {results.passed ? (
                                            <>
                                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                                <span className="text-sm font-bold uppercase tracking-wider text-emerald-500">ALL TEST CASES PASSED</span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-6 h-6 text-red-500" />
                                                <span className="text-sm font-bold uppercase tracking-wider text-red-500">SOME TEST CASES FAILED</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="space-y-2 font-mono text-xs">
                                        {results.test_results?.map((tc: any, index: number) => (
                                            <div key={index} className={`p-4 rounded-xl border ${
                                                tc.passed ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-300" : "bg-red-500/5 border-red-500/10 text-red-300"
                                            }`}>
                                                {tc.error ? (
                                                    <p>Error: {tc.error}</p>
                                                ) : (
                                                    <>
                                                        <p>Test #{index + 1}: {tc.passed ? "PASSED" : "FAILED"}</p>
                                                        <p className="mt-1 opacity-70">Input: {JSON.stringify(tc.input)}</p>
                                                        <p className="opacity-70">Expected: {JSON.stringify(tc.expected)} | Actual: {JSON.stringify(tc.actual)}</p>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
