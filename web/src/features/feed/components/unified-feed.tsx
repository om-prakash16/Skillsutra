"use client"

import { useAuth } from "@/context/auth-context"
import { MiniProfile } from "@/features/feed/components/mini-profile"
import { PostCreator } from "@/features/feed/components/post-creator"
import { PostCard, Post } from "@/features/feed/components/post-card"
import { TrendingWidget } from "@/features/feed/components/trending-widget"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api/api-client"
import { 
    GraduationCap, Briefcase, Users, Filter, BarChart, 
    Bell, Building2, TrendingUp, Activity, ShieldAlert
} from "lucide-react"
import Link from "next/link"
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

export function UnifiedFeed({ role = "user" }: { role?: string }) {
    const { user, isLoading: authLoading } = useAuth()

    const { data: posts, isLoading: feedLoading } = useQuery({
        queryKey: ["feed", role],
        queryFn: async () => {
            // Only job seekers currently fetch the generic post feed
            if (role !== "user") return []
            const res = await api.feed.getPosts()
            return res.data
        },
        enabled: role === "user"
    })

    const { data: adminMetrics } = useQuery({
        queryKey: ["adminMetrics"],
        queryFn: async () => {
            const res = await api.admin.getDashboard()
            return res
        },
        enabled: role === "admin"
    })

    const { data: funnelAnalytics } = useQuery({
        queryKey: ["funnelAnalytics"],
        queryFn: async () => {
            const res = await api.recruiter.getFunnel()
            return res
        },
        enabled: role === "recruiter" || role === "company"
    })

    if (authLoading) return null

    return (
        <div className="min-h-screen bg-background/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar (Universal Profile context) */}
                    <div className="hidden lg:block lg:col-span-3 space-y-6">
                        {role === "company" ? (
                            <div className="p-6 glass rounded-3xl border border-border/50 text-center">
                                <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                    <Building2 className="w-10 h-10 text-primary" />
                                </div>
                                <h2 className="font-black text-lg">{user?.name || "Company Portal"}</h2>
                                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">Enterprise Hub</p>
                            </div>
                        ) : role === "admin" ? (
                            <div className="p-6 glass rounded-3xl border border-border/50 text-center">
                                <div className="w-20 h-20 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
                                    <ShieldAlert className="w-10 h-10 text-red-500" />
                                </div>
                                <h2 className="font-black text-lg">{user?.name || "Admin"}</h2>
                                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">God Mode</p>
                            </div>
                        ) : (
                            <MiniProfile user={user} />
                        )}
                        
                        {/* Role-specific left widgets */}
                        {role === "user" && (
                            <div className="p-6 glass rounded-3xl border border-border/50">
                                <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Your Progress</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 text-primary rounded-xl"><Briefcase className="w-4 h-4" /></div>
                                        <div>
                                            <p className="text-xs font-bold">Applications</p>
                                            <p className="text-xs text-muted-foreground">3 pending</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl"><GraduationCap className="w-4 h-4" /></div>
                                        <div>
                                            <p className="text-xs font-bold">Learning</p>
                                            <p className="text-xs text-muted-foreground">2 courses active</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {role === "recruiter" && (
                            <div className="p-6 glass rounded-3xl border border-border/50">
                                <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Pipeline Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 text-primary rounded-xl"><Users className="w-4 h-4" /></div>
                                        <div>
                                            <p className="text-xs font-bold">Total Candidates</p>
                                            <p className="text-xs text-muted-foreground">1,245</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl"><Filter className="w-4 h-4" /></div>
                                        <div>
                                            <p className="text-xs font-bold">Active Roles</p>
                                            <p className="text-xs text-muted-foreground">8 open reqs</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {role === "company" && (
                            <div className="p-6 glass rounded-3xl border border-border/50">
                                <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Employer Branding</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold">Profile Views</span>
                                        <span className="text-primary">+14%</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold">Followers</span>
                                        <span className="text-primary">12.4k</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main Content Area */}
                    <div className={`col-span-1 space-y-6 ${role === "company" || role === "admin" ? "lg:col-span-9" : "lg:col-span-6"}`}>
                        {role === "user" && (
                            <>
                                <PostCreator user={user} />
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <hr className="flex-1 border-border/50" />
                                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest px-2">Sort by: Relevance</span>
                                        <hr className="flex-1 border-border/50" />
                                    </div>

                                    {feedLoading ? (
                                        <div className="text-center text-muted-foreground py-10">Loading personalized feed...</div>
                                    ) : posts && posts.length > 0 ? (
                                        posts.map((post: Post) => (
                                            <PostCard key={post.id} post={post} />
                                        ))
                                    ) : (
                                        <div className="text-center text-muted-foreground py-10">
                                            No posts yet. Discover new connections and opportunities!
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {role === "recruiter" && (
                            <>
                                <div className="glass p-8 rounded-3xl border border-border/50 text-center space-y-4">
                                    <BarChart className="w-12 h-12 text-primary mx-auto opacity-50" />
                                    <h2 className="text-2xl font-black tracking-tight">Recruiter Workspace</h2>
                                    <p className="text-sm text-muted-foreground">Welcome back! Here are the latest insights and candidate recommendations for your open roles.</p>
                                </div>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="glass p-6 rounded-3xl border border-border/50 flex gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <Bell className="w-4 h-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">Candidate AI Match <span className="text-primary">• New</span></p>
                                                <p className="text-xs text-muted-foreground mt-1">We found 5 new highly qualified candidates for the Senior Backend Engineer role.</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {role === "company" && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Link href="/company/jobs" className="glass p-6 rounded-3xl border border-border/50 hover:bg-muted/30 transition-colors">
                                        <Activity className="w-8 h-8 text-indigo-500 mb-4" />
                                        <h3 className="text-2xl font-black">{funnelAnalytics?.funnel?.applied ? Math.floor(funnelAnalytics.funnel.applied / 10) : 45}</h3>
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest">Active Jobs</p>
                                    </Link>
                                    <Link href="/company/ats" className="glass p-6 rounded-3xl border border-border/50 hover:bg-muted/30 transition-colors">
                                        <Users className="w-8 h-8 text-emerald-500 mb-4" />
                                        <h3 className="text-2xl font-black">{funnelAnalytics?.funnel?.applied || "2,401"}</h3>
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest">Total Applicants</p>
                                    </Link>
                                    <div className="glass p-6 rounded-3xl border border-border/50">
                                        <TrendingUp className="w-8 h-8 text-amber-500 mb-4" />
                                        <h3 className="text-2xl font-black">{funnelAnalytics?.funnel?.hired || 12}</h3>
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest">Hires this month</p>
                                    </div>
                                </div>
                                <div className="glass p-8 rounded-3xl border border-border/50 h-[400px] flex flex-col justify-center text-center">
                                    <h2 className="text-xl font-black tracking-tight mb-6">Hiring Analytics Pipeline</h2>
                                    {funnelAnalytics?.funnel ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RechartsBarChart data={[
                                                { name: "Applied", count: funnelAnalytics.funnel.applied },
                                                { name: "Screening", count: funnelAnalytics.funnel.screening },
                                                { name: "Assessment", count: funnelAnalytics.funnel.assessment },
                                                { name: "Interview", count: funnelAnalytics.funnel.interview },
                                                { name: "Offer", count: funnelAnalytics.funnel.offer },
                                                { name: "Hired", count: funnelAnalytics.funnel.hired }
                                            ]}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                                <XAxis dataKey="name" stroke="#888" tick={{fill: '#888', fontSize: 12}} />
                                                <YAxis stroke="#888" tick={{fill: '#888', fontSize: 12}} />
                                                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#111', borderColor: '#333', borderRadius: '8px'}} />
                                                <Bar dataKey="count" fill="var(--theme-primary)" radius={[4, 4, 0, 0]} />
                                            </RechartsBarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Loading funnel metrics...</p>
                                    )}
                                </div>
                            </>
                        )}

                        {role === "admin" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="glass p-6 rounded-3xl border border-border/50">
                                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Users</h3>
                                    <p className="text-3xl font-black">{adminMetrics?.metrics?.total_users || 0}</p>
                                </div>
                                <div className="glass p-6 rounded-3xl border border-border/50">
                                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Active Jobs</h3>
                                    <p className="text-3xl font-black text-primary">{adminMetrics?.metrics?.active_jobs || 0}</p>
                                </div>
                                <div className="glass p-6 rounded-3xl border border-border/50">
                                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Companies</h3>
                                    <p className="text-3xl font-black text-emerald-500">{adminMetrics?.metrics?.total_companies || 0}</p>
                                </div>
                                <div className="glass p-6 rounded-3xl border border-border/50">
                                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">System Load</h3>
                                    <p className="text-3xl font-black text-amber-500">Stable</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar (Only for User/Recruiter) */}
                    {(role === "user" || role === "recruiter") && (
                        <div className="hidden lg:block lg:col-span-3 space-y-6">
                            {role === "user" ? (
                                <>
                                    <TrendingWidget />
                                    <div className="p-6 glass rounded-3xl border border-border/50">
                                        <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Recommended Jobs</h3>
                                        <div className="space-y-4">
                                            <div className="p-3 bg-muted/30 rounded-2xl">
                                                <p className="text-sm font-bold">Frontend Engineer</p>
                                                <p className="text-xs text-muted-foreground">TechCorp Inc. • Remote</p>
                                                <p className="text-[10px] text-primary font-bold mt-2 uppercase">92% Match</p>
                                            </div>
                                            <div className="p-3 bg-muted/30 rounded-2xl">
                                                <p className="text-sm font-bold">Full Stack Developer</p>
                                                <p className="text-xs text-muted-foreground">StartupX • Hybrid</p>
                                                <p className="text-[10px] text-primary font-bold mt-2 uppercase">85% Match</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="p-6 glass rounded-3xl border border-border/50">
                                    <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Top Matches</h3>
                                    <div className="text-center py-8 text-sm text-muted-foreground">
                                        Review new applicants
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
