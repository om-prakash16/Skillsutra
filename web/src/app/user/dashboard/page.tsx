"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Bookmark, FileText, TrendingUp } from "lucide-react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ProofScoreDisplay } from "@/components/ai/ProofScoreDisplay"
import { AIInsightsPanel } from "@/components/ai/AIInsightsPanel"
import { Sparkles } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function UserDashboard() {
    const { user } = useAuth()
    const [aiData, setAiData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (user?.id) {
            fetchAIData()
        }
    }, [user?.id])

    const fetchAIData = async () => {
        try {
            const token = localStorage.getItem("auth_token")
            // In a real flow, we'd trigger /analyze if scores are missing or stale
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/scores/${user?.id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setAiData(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const stats = [
        { label: "Applied Jobs", value: 12, icon: Briefcase, href: "/user/applications" },
        { label: "Saved Jobs", value: 5, icon: Bookmark, href: "/user/saved" },
        { label: "Interviews", value: 2, icon: TrendingUp, href: "/user/applications" },
        { label: "Profile Views", value: 45, icon: FileText, href: "/user/profile" },
    ]

    return (
        <div className="space-y-10 pb-12">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black font-heading text-gradient tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground font-medium">Welcome back, <span className="text-foreground">{user?.name || 'User'}</span>. Here's your career intelligence overview.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Link key={i} href={stat.href} className="block transition-transform hover:scale-[1.02] active:scale-95">
                        <Card className="glass cursor-pointer h-full hover:border-primary/40 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    {stat.label}
                                </CardTitle>
                                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                                    <stat.icon className="h-4 w-4 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black">{stat.value}</div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 space-y-8">
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Recent Applications</CardTitle>
                        </CardHeader>
                        <CardContent className="py-10">
                            <div className="flex flex-col items-center justify-center text-center space-y-4">
                                <div className="p-4 rounded-full bg-muted/30">
                                    <Briefcase className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground font-medium max-w-[200px]">You haven't applied to any jobs recently.</p>
                                <Link href="/jobs">
                                    <Button variant="premium" size="sm">Explore Opportunities</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <AIInsightsPanel 
                        isLoading={isLoading} 
                        data={aiData?.analysis || {
                            strengths: ["FastAPI", "React", "Next.js"],
                            missing_skills: ["Solana", "Rust"],
                            recommendations: ["Complete the Solana development path", "Add a Rust project to portfolio"]
                        }} 
                    />
                </div>

                <div className="col-span-3 space-y-8">
                    <ProofScoreDisplay 
                        isLoading={isLoading} 
                        scores={aiData || {
                            skill_score: 85,
                            project_score: 75,
                            experience_score: 90,
                            proof_score: 82.5
                        }} 
                    />

                    <Card className="glass relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/20 transition-all" />
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl font-bold">
                                <Sparkles className="w-5 h-5 text-primary" /> Profile Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center py-10">
                                <div className="relative w-40 h-40 rounded-full border-8 border-muted flex items-center justify-center shadow-inner">
                                    <span className="text-4xl font-black tracking-tight">80%</span>
                                    <svg className="absolute top-0 left-0 w-full h-full -rotate-90">
                                        <circle 
                                            cx="80" cy="80" r="76" 
                                            fill="none" stroke="currentColor" strokeWidth="8" 
                                            strokeDasharray={477} strokeDashoffset={477 * (1 - 0.8)}
                                            className="text-primary"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-center text-xs text-muted-foreground italic font-black uppercase tracking-widest mt-2">Add your GitHub to reach 100%</p>
                            <Link href="/user/profile">
                                <Button className="w-full mt-8 font-bold" variant="outline">Complete Profile</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
