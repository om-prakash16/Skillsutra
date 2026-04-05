"use client";

import { useAuth } from "@/context/auth-context";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Zap, Loader2, ArrowRight, Table, CheckCircle, Clock, Calendar, Search } from "lucide-react";
import Link from "next/link";

export default function CandidateApplications() {
  const { user } = useAuth();
  const [apps, setApps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchApps();
  }, [user?.id]);

  const fetchApps = async () => {
    try {
      const token = localStorage.getItem("sp_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/user?user_id=${user?.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setApps(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
        case 'applied': return 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20';
        case 'shortlisted': return 'bg-primary/10 text-primary border-primary/20';
        case 'interview': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        case 'hired': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        case 'rejected': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
        default: return 'bg-white/5 text-white border-white/10';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-12">
      <div>
        <h1 className="text-5xl font-black font-heading tracking-tighter italic">Application Tracking</h1>
        <p className="text-muted-foreground mt-2">Scale your career with real-time status and AI insights.</p>
      </div>

      {isLoading ? (
        <div className="py-24 flex justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-6">
            {apps.length === 0 ? (
                <Card className="bg-white/5 border-white/10 p-12 text-center space-y-6">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                        <Briefcase className="w-8 h-8 text-neutral-500" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold italic font-heading tracking-tight">No Active Applications</h3>
                        <p className="text-neutral-500">You haven't applied to any roles yet. Our AI is waiting to find your match.</p>
                    </div>
                    <Link href="/jobs">
                        <Button className="bg-white text-black hover:bg-neutral-200 font-black px-8">
                            BROWSE MARKETPLACE <Search className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="space-y-4">
                    {apps.map(app => (
                        <Card key={app.id} className="bg-white/5 border-white/10 backdrop-blur-xl group hover:border-primary/30 transition-all duration-300">
                             <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black italic text-primary group-hover:bg-primary/10 transition-colors">
                                        {app.jobs?.companies?.company_name?.[0] || 'C'}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{app.jobs?.companies?.company_name}</p>
                                        <h3 className="text-xl font-black italic tracking-tight">{app.jobs?.title}</h3>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                                            <Zap className="w-3 h-3 fill-emerald-500 text-emerald-500" /> AI MATCH
                                        </p>
                                        <p className="text-lg font-black italic text-white">{app.ai_match_score}%</p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> APPLIED ON
                                        </p>
                                        <p className="text-lg font-black italic text-white uppercase">{new Date(app.created_at).toLocaleDateString()}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Badge className={`px-4 py-1 uppercase tracking-widest font-black italic text-[10px] ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </Badge>
                                    </div>

                                    <Link href={`/jobs/${app.job_id}`}>
                                        <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-white hover:bg-white/10">
                                            <ArrowRight className="w-5 h-5" />
                                        </Button>
                                    </Link>
                                </div>
                             </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
      )}

      <Card className="bg-primary/5 border border-primary/20 p-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-1">
              <h4 className="text-xl font-black italic tracking-tight flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" /> Verified Pipeline Active
              </h4>
              <p className="text-sm text-neutral-500">Your Proof Score and skill credentials are automatically synced with your applications.</p>
          </div>
          <div className="flex gap-4">
              <Link href="/user/profile">
                  <Button variant="outline" className="border-white/10 hover:bg-white/5 font-black text-[10px] uppercase">
                      UPDATE PROFILE
                  </Button>
              </Link>
          </div>
      </Card>
    </div>
  );
}
