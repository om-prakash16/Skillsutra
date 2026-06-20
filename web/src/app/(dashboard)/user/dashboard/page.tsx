"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Bookmark, FileText, TrendingUp, Route, ChevronRight, Compass, Sparkles, Activity, Search, Clock, Calendar, MessageSquare, AlertCircle } from "lucide-react"

import Link from "next/link"
import { ProofScoreDisplay } from "@/components/ai/ProofScoreDisplay"
import { AIInsightsPanel } from "@/components/ai/AIInsightsPanel"
import { useAuth } from "@/context/auth-context"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { api, userApi } from "@/lib/api/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"

export default function UserDashboard() {
    const { user, isLoading: isAuthLoading } = useAuth()
    const router = useRouter()

    // Fetch AI Scores
    const { data: scoresData, isLoading: isScoresLoading } = useQuery({
        queryKey: ["userScores"],
        queryFn: async () => {
            try {
                const res = await api.ai.getScores();
                return res || {
                    skill_score: 0,
                    project_score: 0,
                    experience_score: 0,
                    proof_score: 0
                };
            } catch (error) {
                return {
                    skill_score: 0,
                    project_score: 0,
                    experience_score: 0,
                    proof_score: 0
                };
            }
        },
        enabled: !!user
    });

    // Fetch Applications
    const { data: applications, isLoading: isAppsLoading } = useQuery({
        queryKey: ["userApplications"],
        queryFn: async () => {
            try {
                const res = await api.applications.user();
                return Array.isArray(res) ? res : (res?.data || []);
            } catch (error) {
                return [];
            }
        },
        enabled: !!user
    });

    // Fetch Activity Timeline
    const { data: activities, isLoading: isActivityLoading } = useQuery({
        queryKey: ["userActivity"],
        queryFn: async () => {
            try {
                const res = await api.activity.user(5);
                return Array.isArray(res) ? res : (res?.data || []);
            } catch (error) {
                return [];
            }
        },
        enabled: !!user
    });

    // Fetch Insights
    const { data: insightsData, isLoading: isInsightsLoading } = useQuery({
        queryKey: ["userInsights"],
        queryFn: async () => {
            try {
                const res = await api.insights.user();
                return res || { strengths: [], missing_skills: [], recommendations: [] };
            } catch (error) {
                return { strengths: [], missing_skills: [], recommendations: [] };
            }
        },
        enabled: !!user
    });

    if (isAuthLoading) return null;
    
    if (!user) {
        router.push("/auth/login")
        return null;
    }

    const pendingAppsCount = applications?.filter((app: any) => app.status !== "rejected" && app.status !== "hired")?.length || 0;

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 space-y-12 relative animate-in fade-in duration-700">
            {/* Background Ambient Glows */}
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 blur-[120px] -z-10 rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-500/10 blur-[120px] -z-10 rounded-full pointer-events-none" />
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-6xl font-black font-heading tracking-tighter italic uppercase leading-none text-foreground drop-shadow-sm">
                        Welcome back, <br className="md:hidden" /><span className="text-primary">{user?.name?.split(' ')[0] || 'User'}</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="h-px w-12 md:w-24 bg-gradient-to-r from-primary to-transparent" />
                        <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-muted-foreground whitespace-nowrap">
                            Strategic Intelligence & Analytics
                        </p>
                    </div>
                </div>
                
                {/* Quick Action Rail */}
                <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <Link href="/jobs/search">
                        <Button variant="premium" className="rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform group whitespace-nowrap">
                            <Search className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                            Explore Opportunities
                        </Button>
                    </Link>
                    <Link href="/user/messages">
                        <Button variant="outline" className="rounded-xl bg-background/50 backdrop-blur-md hover:bg-muted/80 hover:scale-105 transition-transform whitespace-nowrap">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Inbox
                        </Button>
                    </Link>
                    <Link href="/user/saved">
                        <Button variant="outline" className="rounded-xl bg-background/50 backdrop-blur-md hover:bg-muted/80 hover:scale-105 transition-transform whitespace-nowrap">
                            <Bookmark className="w-4 h-4 mr-2" />
                            Saved
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Proof Score Widget */}
                    <div className="hover:scale-[1.01] transition-transform duration-300">
                        <ProofScoreDisplay 
                            scores={scoresData} 
                            isLoading={isScoresLoading} 
                        />
                    </div>

                    {/* Active Deployments (Applications) Widget */}
                    <Card className="glass border border-white/10 dark:border-white/5 rounded-[2rem] overflow-hidden shadow-2xl relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <CardHeader className="border-b border-border/30 p-6 bg-muted/30">
                            <CardTitle className="text-xl font-black italic uppercase tracking-tight text-foreground flex items-center gap-3">
                                <Route className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" /> 
                                Active Deployments
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 relative z-10">
                            {isAppsLoading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-24 w-full rounded-xl" />
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-6xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/50">
                                        {pendingAppsCount}
                                    </p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">
                                        Applications in Pipeline
                                    </p>
                                    
                                    {applications && applications.length > 0 && (
                                        <div className="space-y-3 mb-6 text-left">
                                            {applications.slice(0, 2).map((app: any) => (
                                                <div key={app.id} className="bg-background/40 backdrop-blur-sm p-3 rounded-xl border border-border/50 flex items-center justify-between group/item hover:border-primary/30 transition-colors">
                                                    <div className="truncate pr-4">
                                                        <p className="text-sm font-bold truncate">{app.job_title}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{app.company_name}</p>
                                                    </div>
                                                    <div className="shrink-0 bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest">
                                                        {app.status}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <Link href="/user/applications">
                                        <Button variant="outline" className="w-full rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                                            View Full Pipeline
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                
                {/* Right Column */}
                <div className="lg:col-span-8 space-y-8">
                    {/* AI Insights Widget */}
                    <div className="hover:scale-[1.01] transition-transform duration-300">
                        <AIInsightsPanel 
                            data={insightsData} 
                            isLoading={isInsightsLoading} 
                        />
                    </div>

                    {/* Recent Activity Timeline Widget */}
                    <Card className="glass border border-white/10 dark:border-white/5 rounded-[2rem] overflow-hidden shadow-2xl relative">
                        <CardHeader className="border-b border-border/30 p-6 bg-muted/30">
                            <CardTitle className="text-xl font-black italic uppercase tracking-tight text-foreground flex items-center gap-3">
                                <Activity className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" /> 
                                Operational Log
                            </CardTitle>
                            <CardDescription>Recent activity and platform events</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            {isActivityLoading ? (
                                <div className="space-y-6">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex gap-4">
                                            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                                            <div className="space-y-2 flex-1">
                                                <Skeleton className="h-4 w-3/4" />
                                                <Skeleton className="h-3 w-1/4" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : activities && activities.length > 0 ? (
                                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:to-transparent">
                                    {activities.map((activity: any, index: number) => (
                                        <div key={activity.id || index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-background bg-primary/20 text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-[2px] md:ml-0 z-10 transition-transform group-hover:scale-125">
                                                <Clock className="w-3 h-3" />
                                            </div>
                                            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl glass border border-border/50 hover:border-primary/30 transition-colors shadow-sm ml-4 md:ml-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                                        {activity.action_type.replace(/_/g, ' ')}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                                        {activity.created_at ? formatDistanceToNow(new Date(activity.created_at), { addSuffix: true }) : 'Recently'}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-foreground">
                                                    {activity.description || "Performed an action on the platform."}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                    <p className="text-muted-foreground font-medium">No recent activity found.</p>
                                    <Link href="/jobs/search">
                                        <Button variant="link" className="mt-2 text-primary">
                                            Start exploring jobs
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
