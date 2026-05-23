"use client"

import { useState } from "react"
import { fetchWithAuth } from "@/lib/api/api-client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Github, GitPullRequest, Search, ExternalLink, Sparkles, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export default function GithubPage() {
    const [handle, setHandle] = useState("")
    const [scanning, setScanning] = useState(false)
    const [activity, setActivity] = useState<any>(null)
    const [selectedLang, setSelectedLang] = useState("javascript")
    const [searchingIssues, setSearchingIssues] = useState(false)
    const [issues, setIssues] = useState<any[]>([])

    const languages = ["javascript", "python", "typescript", "go", "rust"]

    const handleScan = async () => {
        if (!handle) return
        setScanning(true)
        setActivity(null)
        try {
            const res = await fetchWithAuth(`/github/activity?username=${encodeURIComponent(handle)}`)
            if (res.status === "success" && res.data) {
                setActivity(res.data)
                toast.success("GitHub profile footprint scan complete!")
            }
        } catch (err: any) {
            console.error(err)
            toast.error(err.message || "Failed to scan GitHub profile.")
        } finally {
            setScanning(false)
        }
    }

    const handleFindIssues = async () => {
        setSearchingIssues(true)
        setIssues([])
        try {
            const res = await fetchWithAuth(`/github/good-issues?language=${selectedLang}`)
            setIssues(res.items || [])
            toast.success("Discovered good first issues!")
        } catch (err) {
            console.error(err)
            toast.error("Failed to load issues.")
        } finally {
            setSearchingIssues(false)
        }
    }

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-10 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 blur-[180px] -z-10 rounded-full" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight flex items-center gap-3">
                        CONTRIBUTION HUB <Github className="w-8 h-8 text-primary" />
                    </h1>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">
                        Scan your GitHub footprint, calculate git velocity, and locate Good First Issues.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Scanner */}
                <div className="space-y-6">
                    <div className="glass border-white/5 p-8 rounded-[2rem] space-y-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <GitPullRequest className="w-5 h-5 text-primary" /> Footprint Scan
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">GitHub Handle</label>
                                <div className="flex gap-2">
                                    <input 
                                        placeholder="octocat"
                                        value={handle}
                                        onChange={(e) => setHandle(e.target.value)}
                                        className="flex-1 bg-black/45 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                    <Button 
                                        onClick={handleScan}
                                        disabled={scanning || !handle}
                                        className="h-11 px-4 rounded-xl text-xs font-bold tracking-widest uppercase"
                                    >
                                        {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : "SCAN"}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {activity && (
                            <div className="space-y-6 border-t border-white/5 pt-6 animate-fade-in">
                                <div className="space-y-1 bg-primary/5 border border-primary/10 rounded-2xl p-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5" /> AI Profile Insight
                                    </h4>
                                    <p className="text-xs text-muted-foreground italic leading-relaxed mt-1">{activity.insight}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Repositories</p>
                                        <p className="text-2xl font-black text-white mt-1">{activity.total_repositories}</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Stars Earned</p>
                                        <p className="text-2xl font-black text-white mt-1">{activity.stars_earned}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Core Metrics</h4>
                                    <div className="space-y-2 text-xs font-medium text-muted-foreground">
                                        <div className="flex justify-between">
                                            <span>Architectural Complexity:</span>
                                            <span className="font-bold text-white">{activity.metrics?.architectural_complexity_handling}/100</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Weekly Commit Velocity:</span>
                                            <span className="font-bold text-white">{activity.metrics?.commit_velocity_weekly} Commits</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Code Quality Index:</span>
                                            <span className="font-bold text-white">{activity.metrics?.code_quality_index}/100</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Issue Finder */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass border-white/5 p-8 rounded-[2rem] space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Search className="w-5 h-5 text-primary" /> Open Source Discovery
                            </h2>
                            
                            <div className="flex gap-2">
                                <select 
                                    value={selectedLang}
                                    onChange={(e) => setSelectedLang(e.target.value)}
                                    className="bg-black/45 border border-white/5 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                                >
                                    {languages.map(lang => (
                                        <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                                    ))}
                                </select>
                                <Button 
                                    onClick={handleFindIssues}
                                    disabled={searchingIssues}
                                    className="h-9 px-4 rounded-xl text-[10px] font-bold tracking-widest uppercase gap-1.5"
                                >
                                    {searchingIssues ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "SEARCH"}
                                </Button>
                            </div>
                        </div>

                        {issues.length === 0 ? (
                            <div className="text-center py-24 border border-dashed border-white/5 rounded-[2rem] max-w-md mx-auto">
                                <AlertCircle className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                <p className="text-[11px] font-black uppercase tracking-widest text-white/50">Browse OS Issues by Language.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {issues.map((issue, idx) => (
                                    <div key={idx} className="bg-white/5 border border-white/5 p-5 rounded-2xl hover:border-primary/20 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                        <div className="space-y-1">
                                            <h4 className="text-md font-bold text-white line-clamp-1">{issue.title}</h4>
                                            <div className="flex flex-wrap gap-1.5 pt-1.5">
                                                {issue.labels?.map((label: any, labelIdx: number) => (
                                                    <span 
                                                        key={labelIdx}
                                                        className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md text-white/95"
                                                        style={{ backgroundColor: `#${label.color || '555'}` }}
                                                    >
                                                        {label.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <a href={issue.html_url} target="_blank" rel="noreferrer">
                                            <Button variant="ghost" className="h-10 text-[10px] font-bold uppercase tracking-widest gap-1 border border-white/5 hover:bg-white/5">
                                                CONTRIBUTE <ExternalLink className="w-3.5 h-3.5" />
                                            </Button>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
