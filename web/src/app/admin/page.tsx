"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    Database, 
    ToggleLeft, 
    GitMerge, 
    Settings2, 
    Users,
    Activity,
    ArrowUpRight,
    TrendingUp,
    Briefcase,
    Hexagon
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { api } from "@/lib/api/api-client";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ 
      total_users: 0, 
      total_jobs: 0, 
      total_nfts: 0, 
      platform_health: "Optimal",
      growth_data: [
          { name: "Mon", users: 120, jobs: 45 },
          { name: "Tue", users: 150, jobs: 52 },
          { name: "Wed", users: 180, jobs: 61 },
          { name: "Thu", users: 220, jobs: 80 },
          { name: "Fri", users: 280, jobs: 95 },
          { name: "Sat", users: 310, jobs: 110 },
          { name: "Sun", users: 350, jobs: 130 }
      ]
  });

  useEffect(() => {
    // In production, this would fetch from /api/v1/analytics/admin
    // using api.analytics.admin()
    // For now, testing with mocked trend data for rendering
    const fetchStats = async () => {
        try {
            const data = await api.analytics.admin();
            if(data && !data.detail) {
                setStats(prev => ({...prev, ...data}));
            }
        } catch (e) {
            console.error("Failed to fetch analytics", e);
        }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight flex items-center gap-4 text-white">
              <Activity className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.8)]" /> 
              Terminal Command
            </h1>
            <p className="text-muted-foreground mt-3 text-lg">
              Global parameters, structural configurations, and system-wide intelligence.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">System Active</span>
          </div>
      </div>

      {/* Global Meta Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Platform Health" value={stats.platform_health} icon={Activity} color="text-primary" />
          <StatCard label="Total Users" value={stats.total_users.toString()} icon={Users} color="text-blue-500" />
          <StatCard label="Active Portals (Jobs)" value={stats.total_jobs.toString()} icon={Briefcase} color="text-amber-500" />
          <StatCard label="Synthesized NFTs" value={stats.total_nfts.toString()} icon={Hexagon} color="text-fuchsia-500" />
      </div>

      {/* Live Trajectory Chart */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
          <CardHeader>
              <CardTitle className="text-xl font-bold tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" /> Systems Trajectory
              </CardTitle>
          </CardHeader>
          <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.growth_data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                        <Area type="monotone" dataKey="jobs" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorJobs)" />
                    </AreaChart>
                </ResponsiveContainer>
              </div>
          </CardContent>
      </Card>

      {/* Control Matrices */}
      <div>
        <h2 className="text-2xl font-bold tracking-wider mb-6 text-white/90">Control Matrices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <ModuleLink 
                href="/admin/schema" 
                title="Profile Schema Engine" 
                desc="Dynamically alter the structural matrix of professional profiles."
                icon={Database}
                color="bg-blue-500/10 text-blue-500 border-blue-500/20"
            />
            <ModuleLink 
                href="/admin/features" 
                title="Global Overrides" 
                desc="Feature flags to enable/disable specific platform protocols."
                icon={ToggleLeft}
                color="bg-amber-500/10 text-amber-500 border-amber-500/20"
            />
            <ModuleLink 
                href="/admin/skills" 
                title="Taxonomy Synthesizer" 
                desc="Manage hierarchical definitions for the skill matching engine."
                icon={GitMerge}
                color="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
            />
            <ModuleLink 
                href="/admin/ai-config" 
                title="Resonance Tuning" 
                desc="Adjust semantic weighting algorithms for the AI evaluator."
                icon={Settings2}
                color="bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20"
            />
            <ModuleLink 
                href="/admin/users" 
                title="Entity Management" 
                desc="Direct observation and override of registered individuals."
                icon={Users}
                color="bg-rose-500/10 text-rose-500 border-rose-500/20"
            />
            <ModuleLink 
                href="/admin/logs" 
                title="Audit Stream" 
                desc="Real-time chronological ledger of all platform administrative actions."
                icon={Activity}
                color="bg-primary/10 text-primary border-primary/20"
            />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
    return (
        <Card className="bg-white/5 border-white/10 backdrop-blur-md relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-700 group-hover:opacity-30 ${color.replace('text-', 'bg-')}`} />
            <CardContent className="p-6 relative z-10">
                <div className="flex justify-between items-start">
                    <p className="text-[11px] font-black uppercase text-muted-foreground tracking-[0.2em]">{label}</p>
                    <Icon className={`w-5 h-5 ${color} opacity-80`} />
                </div>
                <p className="text-4xl font-black mt-4 tracking-tighter text-white drop-shadow-md">{value}</p>
            </CardContent>
        </Card>
    )
}

function ModuleLink({ href, title, desc, icon: Icon, color }: any) {
    return (
        <div className="group block h-full">
            <Card className="bg-white/5 border-white/10 backdrop-blur-md h-full transition-all duration-500 hover:border-white/30 hover:bg-white-[0.08] cursor-pointer relative overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-black/60 hover:-translate-y-1">
                <Link href={href} className="absolute inset-0 z-10" />
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${color.replace('text-', 'bg-').split(' ')[0]}`} />
                
                <CardHeader className="relative z-10 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-4 rounded-2xl border ${color} shadow-inner`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-white transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1 duration-300" />
                    </div>
                    <CardTitle className="tracking-tight text-xl mb-2 text-white/90 group-hover:text-white">{title}</CardTitle>
                    <CardDescription className="leading-relaxed text-sm text-white/50 group-hover:text-white/70 mt-auto">{desc}</CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}
