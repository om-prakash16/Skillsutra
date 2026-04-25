"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    Users, 
    Building2, 
    Briefcase, 
    Zap, 
    Activity, 
    TrendingUp, 
    ShieldCheck, 
    Globe, 
    BrainCircuit,
    Fingerprint,
    Loader2,
    ArrowUpRight,
    Radar,
    Terminal,
    Database,
    ShieldAlert
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api/api-client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


export default function AdminDashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState("");

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000);
    // Live clock
    const tick = () => setNow(new Date().toLocaleTimeString('en-US', { hour12: false }));
    tick();
    const clock = setInterval(tick, 1000);
    return () => { clearInterval(interval); clearInterval(clock); };
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await api.analytics.admin();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const METRIC_CARDS = [
      { 
          label: "Active Entities", 
          value: stats?.totals?.users || 0, 
          trend: "+12.5%", 
          icon: Users, 
          color: "rose",
          desc: "Unique verified identities"
      },
      { 
          label: "Partner Nodes", 
          value: stats?.totals?.companies || 0, 
          trend: "+4.2%", 
          icon: Building2, 
          color: "indigo",
          desc: "Verified corporate entities"
      },
      { 
          label: "Network Load", 
          value: stats?.totals?.jobs || 0, 
          trend: "+22.1%", 
          icon: Briefcase, 
          color: "emerald",
          desc: "Active hiring opportunities"
      },
      { 
          label: "Total Applications", 
          value: stats?.totals?.applications || 0, 
          trend: "+8.9%", 
          icon: Fingerprint, 
          color: "amber",
          desc: "Platform-wide candidacies"
      }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-24 relative z-10">
      
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
              <Badge variant="outline" className="glass border-rose-500/30 text-rose-500 px-4 font-black tracking-widest text-[9px] uppercase rounded-full">
                System Status: Operational
              </Badge>
              {now && (
                <span className="font-mono text-[10px] font-black text-muted-foreground/60 tracking-widest">{now} UTC+5:30</span>
              )}
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-heading tracking-tighter text-white uppercase italic flex items-center gap-6 text-gradient">
            Global <span className="text-rose-500">Surveillance</span> 
            <Radar className="w-12 h-12 text-rose-500 animate-pulse" />
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl font-medium opacity-80">
            Real-time heuristic analysis of the Best Hiring ecosystem. Absolute oversight of user migration, corporate engagement, and neural matching efficiency.
          </p>
        </div>
        <div className="flex gap-4">
            <Link href="/admin/logs">
                <Button size="lg" variant="premium" className="h-16 px-10 rounded-2xl shadow-2xl">
                    <Activity className="w-6 h-6 mr-3" /> System Audit
                </Button>
            </Link>
        </div>
      </div>

      {/* Main Metric Array */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {METRIC_CARDS.map((card, idx) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                  <Card className="glass border-white/5 rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-white/20 cursor-default relative h-48 shadow-2xl">
                      <div className={`absolute top-0 left-0 w-1.5 h-full opacity-40`} style={{ backgroundColor: card.color === 'rose' ? '#f43f5e' : card.color === 'indigo' ? '#6366f1' : card.color === 'emerald' ? '#10b981' : '#f59e0b' }} />
                      <div className={`absolute -right-12 -top-12 w-40 h-40 blur-[80px] rounded-full transition-all duration-700 opacity-20 group-hover:opacity-40`} style={{ backgroundColor: card.color === 'rose' ? '#f43f5e' : card.color === 'indigo' ? '#6366f1' : card.color === 'emerald' ? '#10b981' : '#f59e0b' }} />
                      <CardHeader className="flex flex-row items-center justify-between pb-2 px-8 pt-8">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">{card.label}</CardTitle>
                        <card.icon className="w-5 h-5" style={{ color: card.color === 'rose' ? '#f43f5e' : card.color === 'indigo' ? '#6366f1' : card.color === 'emerald' ? '#10b981' : '#f59e0b' }} />
                      </CardHeader>
                      <CardContent className="px-8 pb-8">
                        {loading ? <Loader2 className="w-8 h-8 animate-spin text-white/10" /> : (
                            <div className="flex flex-col space-y-1">
                                <div className="flex items-baseline gap-4">
                                    <span className="text-5xl font-black text-white tracking-tighter">{card.value}</span>
                                    <span className="text-[11px] font-black text-emerald-500 flex items-center">
                                        <TrendingUp className="w-3.5 h-3.5 mr-1" /> {card.trend}
                                    </span>
                                </div>
                                <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">{card.desc}</span>
                            </div>
                        )}
                      </CardContent>
                  </Card>
              </motion.div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Neural Resonance Monitor (AI Stats) */}
          <Card className="glass lg:col-span-2 border-t-rose-500/30 border-t-[3px] rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/5 blur-[150px] rounded-full pointer-events-none" />
                <CardHeader className="border-b border-white/5 pb-8 px-10 pt-10">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-4">
                                <div className="p-3 glass rounded-2xl bg-rose-500/10 border-rose-500/20">
                                    <BrainCircuit className="w-6 h-6 text-rose-500" />
                                </div>
                                Neural Resonance Monitor
                            </CardTitle>
                            <CardDescription className="text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground/60">Heuristic Engine Performance Metrics</CardDescription>
                        </div>
                        <Link href="/admin/ai-config">
                            <Button variant="outline" size="sm" className="glass border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-rose-500 rounded-xl px-6 h-10">Modify Formula</Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="p-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-5">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">Matching Accuracy</span>
                                <span className="text-2xl font-black text-white italic">94.2%</span>
                            </div>
                            <div className="h-3 glass rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)] rounded-full" style={{ width: '94.2%' }} />
                            </div>
                        </div>
                        <div className="space-y-5">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">Compute Latency</span>
                                <span className="text-2xl font-black text-white italic">140ms</span>
                            </div>
                            <div className="h-3 glass rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)] rounded-full" style={{ width: '15%' }} />
                            </div>
                        </div>
                        <div className="space-y-5">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">Heuristic Load</span>
                                <span className="text-2xl font-black text-white italic">Low</span>
                            </div>
                            <div className="h-3 glass rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)] rounded-full" style={{ width: '22%' }} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-14 p-8 glass bg-black/60 border border-white/5 rounded-[2rem] relative group shadow-inner">
                        <div className="flex items-center gap-4 mb-6">
                            <Terminal className="w-5 h-5 text-indigo-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Real-time Matching Stream</span>
                        </div>
                        <div className="space-y-4 font-mono text-xs leading-relaxed">
                            <div className="flex gap-4 text-emerald-400/80">
                                <span className="text-muted-foreground/40 font-black">[14:22:01]</span>
                                <span>MATCH_SUCCESS: Candidate(0x7a...f2) paired with Job(FinTech Lead) | Score: 0.92</span>
                            </div>
                            <div className="flex gap-4 text-muted-foreground/60">
                                <span className="text-muted-foreground/40 font-black">[14:21:45]</span>
                                <span>HEURISTIC_INIT: RAG pipeline triggered for Python Backend evaluation...</span>
                            </div>
                            <div className="flex gap-4 text-rose-400/80">
                                <span className="text-muted-foreground/40 font-black">[14:21:12]</span>
                                <span>RESONANCE_LOW: Candidate(0x1c...e4) rejected for Senior Architect (Skill Gap: Rust)</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
          </Card>

          {/* Recharts Analytics Visualization */}
          <Card className="glass lg:col-span-3 mt-10 relative overflow-hidden border-t-indigo-500/30 border-t-[3px] rounded-[2.5rem] shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/5 pointer-events-none" />
              <CardHeader className="border-b border-white/5 pb-8 px-10 pt-10">
                  <div className="space-y-2">
                      <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-4">
                          <div className="p-3 glass rounded-2xl bg-indigo-500/10 border-indigo-500/20">
                              <TrendingUp className="w-6 h-6 text-indigo-500" />
                          </div>
                          Ecosystem Growth Trends
                      </CardTitle>
                      <CardDescription className="text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground/60">7-Day Moving Average for Users & Jobs</CardDescription>
                  </div>
              </CardHeader>
              <CardContent className="p-10 h-[450px]">
                  {loading ? (
                      <div className="flex items-center justify-center h-full">
                          <Loader2 className="w-12 h-12 animate-spin text-indigo-500/30" />
                      </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={stats?.trends || []}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5}/>
                                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis dataKey="name" stroke="#ffffff40" tick={{fill: '#ffffff60', fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} dy={10} />
                            <YAxis stroke="#ffffff40" tick={{fill: '#ffffff60', fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} dx={-10} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                                itemStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '12px' }}
                            />
                            <Area type="monotone" dataKey="users" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                            <Area type="monotone" dataKey="jobs" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorJobs)" />
                        </AreaChart>
                    </ResponsiveContainer>
                  )}
              </CardContent>
          </Card>


          {/* Operational Nexus (Quick Controls) */}
          <div className="space-y-8 lg:col-span-1">
              <h3 className="text-2xl font-black flex items-center gap-3 px-2 tracking-tight">
                 <Globe className="w-6 h-6 text-rose-500" /> Operational Nexus
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                  {[
                      { label: "Entity Registry", href: "/admin/users", icon: Users, color: "#f43f5e", count: stats?.totals?.users },
                      { label: "Partner Matrix", href: "/admin/companies", icon: Building2, color: "#6366f1", count: stats?.totals?.companies },
                      { label: "Network Load", href: "/admin/jobs", icon: Briefcase, color: "#10b981", count: stats?.totals?.jobs },
                      { label: "Applications", href: "/admin/applications", icon: ShieldCheck, color: "#f59e0b", count: stats?.totals?.applications },
                      { label: "Audit Stream", href: "/admin/logs", icon: Database, color: "#06b6d4" },
                      { label: "Digital Identity", href: "/admin/blockchain", icon: Fingerprint, color: "#3b82f6" },
                      { label: "Moderation Queue", href: "/admin/reports", icon: ShieldAlert, color: "#ef4444" },
                  ].map((link) => (
                      <Link key={link.label} href={link.href}>
                          <Card className="glass border-white/5 hover:border-white/20 transition-all duration-300 cursor-pointer group rounded-2xl shadow-xl hover:-translate-y-1">
                              <CardContent className="p-5 flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                      <div className="p-2.5 rounded-xl border transition-all duration-300 group-hover:scale-110 shadow-inner" style={{ backgroundColor: `${link.color}15`, borderColor: `${link.color}30` }}>
                                          <link.icon className="w-5 h-5" style={{ color: link.color }} />
                                      </div>
                                      <span className="font-black text-white tracking-wide text-xs uppercase">{link.label}</span>
                                  </div>
                                  {link.count !== undefined ? (
                                      <Badge variant="outline" className="font-mono font-black text-[10px] glass border-white/10 px-3 py-1 rounded-full">{link.count}</Badge>
                                  ) : <ArrowUpRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-white transition-colors" />}
                              </CardContent>
                          </Card>
                      </Link>
                  ))}
              </div>

              <Link href="/admin/reports" className="block pt-4">
                  <Card className="p-8 rounded-[2rem] glass bg-rose-500/10 border border-rose-500/20 flex flex-col items-center gap-5 text-center hover:bg-rose-500/20 transition-all cursor-pointer group shadow-2xl">
                      <div className="p-4 rounded-full bg-rose-500/20 border border-rose-500/30 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                        <ShieldAlert className="w-8 h-8 text-rose-500" />
                      </div>
                      <div className="space-y-2">
                          <h4 className="text-sm font-black italic uppercase tracking-widest text-rose-500">Override Authority</h4>
                          <p className="text-[10px] text-rose-500/70 font-bold uppercase tracking-[0.2em] leading-relaxed">Security protocols active. Immutably logged.</p>
                      </div>
                  </Card>
              </Link>
          </div>
      </div>
    </div>
  );
}
