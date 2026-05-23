"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fetchWithAuth } from "@/lib/api/api-client"
import {
    Shield,
    Zap,
    GitBranch,
    Code2,
    Trophy,
    RefreshCw,
    TrendingUp,
    Star,
    Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// API helpers (match backend endpoints under /ai)
const reputationApi = {
    getScore: () => fetchWithAuth("/ai/score"),
    recalculate: () => fetchWithAuth("/ai/recalculate", { method: "POST" }),
}

interface BreakdownItem {
    key: string
    label: string
    icon: React.ElementType
    color: string
    glowColor: string
}

const BREAKDOWN_META: BreakdownItem[] = [
    { key: "skills_score", label: "Skills & Quizzes", icon: Shield, color: "text-violet-400", glowColor: "bg-violet-500" },
    { key: "project_score", label: "Projects", icon: Code2, color: "text-cyan-400", glowColor: "bg-cyan-500" },
    { key: "github_score", label: "GitHub Activity", icon: GitBranch, color: "text-emerald-400", glowColor: "bg-emerald-500" },
    { key: "hackathons_score", label: "Hackathons", icon: Trophy, color: "text-amber-400", glowColor: "bg-amber-500" },
    { key: "challenges_score", label: "Coding Challenges", icon: Zap, color: "text-rose-400", glowColor: "bg-rose-500" },
]

const LEVEL_COLORS: Record<string, { bg: string; border: string; text: string }> = {
    Master: { bg: "bg-amber-500/15", border: "border-amber-500/30", text: "text-amber-400" },
    Expert: { bg: "bg-violet-500/15", border: "border-violet-500/30", text: "text-violet-400" },
    Intermediate: { bg: "bg-cyan-500/15", border: "border-cyan-500/30", text: "text-cyan-400" },
    Junior: { bg: "bg-emerald-500/15", border: "border-emerald-500/30", text: "text-emerald-400" },
    Beginner: { bg: "bg-white/10", border: "border-white/20", text: "text-white/60" },
}

function ScoreGauge({ score, maxScore }: { score: number; maxScore: number }) {
    const pct = Math.min((score / maxScore) * 100, 100)
    const radius = 90
    const circumference = 2 * Math.PI * radius
    const dashOffset = circumference - (pct / 100) * circumference

    return (
        <div className="relative w-56 h-56 mx-auto">
            <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                {/* Track */}
                <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                {/* Progress */}
                <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    className="transition-all duration-[1500ms] ease-out"
                />
                <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                </defs>
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-5xl font-black italic tracking-tighter text-white tabular-nums">{score}</p>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mt-1">/ {maxScore}</p>
            </div>
        </div>
    )
}

function BreakdownBar({ item, value }: { item: BreakdownItem; value: number }) {
    const Icon = item.icon
    const pct = Math.min(value, 100)

    return (
        <div className="group">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                    <Icon className={cn("w-4 h-4", item.color)} />
                    <span className="text-xs font-bold text-white/70 group-hover:text-white/90 transition-colors">
                        {item.label}
                    </span>
                </div>
                <span className={cn("text-xs font-black tabular-nums", item.color)}>
                    {value.toFixed(0)}
                </span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                <div
                    className={cn("h-full rounded-full transition-all duration-[1200ms] ease-out relative", item.glowColor)}
                    style={{ width: `${pct}%`, opacity: 0.7 }}
                >
                    <div className="absolute inset-0 rounded-full blur-sm" style={{ background: "inherit", opacity: 0.5 }} />
                </div>
            </div>
        </div>
    )
}

export function ReputationTab() {
    const queryClient = useQueryClient()

    const { data, isLoading, error } = useQuery({
        queryKey: ["reputationScore"],
        queryFn: async () => {
            const res = await reputationApi.getScore()
            return res?.data ?? res
        },
        staleTime: 1000 * 60 * 2,
    })

    const recalcMutation = useMutation({
        mutationFn: reputationApi.recalculate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reputationScore"] })
            toast.success("Reputation score recalculated!")
        },
        onError: () => toast.error("Recalculation failed. Try again."),
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="glass rounded-[3rem] p-12 border-white/5 text-center">
                <p className="text-white/40 text-sm font-bold">Unable to load reputation data.</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => queryClient.invalidateQueries({ queryKey: ["reputationScore"] })}>
                    Retry
                </Button>
            </div>
        )
    }

    const totalScore = data.total_score ?? 0
    const maxScore = data.max_score ?? 1000
    const level = data.level ?? "Beginner"
    const breakdown = data.breakdown ?? {}
    const weights = data.weights ?? {}
    const levelStyle = LEVEL_COLORS[level] ?? LEVEL_COLORS.Beginner

    return (
        <div className="grid gap-10 lg:grid-cols-3">
            {/* Left — Score Gauge + Level */}
            <div className="space-y-8">
                <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    <CardHeader className="pt-10 px-8 text-center">
                        <CardTitle className="text-lg font-black uppercase italic tracking-tight flex items-center justify-center gap-2">
                            <Star className="w-5 h-5 text-primary" /> Reputation Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 pb-10 flex flex-col items-center">
                        <ScoreGauge score={totalScore} maxScore={maxScore} />

                        <Badge className={cn("mt-6 py-1.5 px-5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border", levelStyle.bg, levelStyle.border, levelStyle.text)}>
                            {level}
                        </Badge>

                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-6 rounded-full text-[10px] font-black uppercase tracking-widest gap-2"
                            onClick={() => recalcMutation.mutate()}
                            disabled={recalcMutation.isPending}
                        >
                            {recalcMutation.isPending ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <RefreshCw className="w-3.5 h-3.5" />
                            )}
                            Recalculate
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Right — Breakdown + Weights */}
            <div className="lg:col-span-2 space-y-8">
                <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
                    <CardHeader className="pt-10 px-8 md:px-12">
                        <CardTitle className="text-lg font-black uppercase italic tracking-tight flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-violet-400" /> Score Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 md:px-12 pb-12 space-y-6">
                        {BREAKDOWN_META.map((item) => (
                            <BreakdownBar
                                key={item.key}
                                item={item}
                                value={breakdown[item.key] ?? 0}
                            />
                        ))}
                    </CardContent>
                </Card>

                <Card className="glass border-white/5 rounded-[2.5rem]">
                    <CardHeader className="pt-8 px-8 md:px-12">
                        <CardTitle className="text-sm font-black uppercase italic tracking-[0.1em] text-white/50">
                            Weight Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 md:px-12 pb-10">
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                            {BREAKDOWN_META.map((item) => {
                                const w = weights[item.key.replace("_score", "")] ?? 0
                                return (
                                    <div key={item.key} className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                                        <item.icon className={cn("w-5 h-5 mx-auto mb-2", item.color)} />
                                        <p className="text-lg font-black italic tracking-tighter text-white/80">{(w * 100).toFixed(0)}%</p>
                                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 mt-1">{item.label}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
