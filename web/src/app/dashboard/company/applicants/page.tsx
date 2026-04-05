"use client";

import { useAuth } from "@/context/auth-context";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, Zap, Loader2, ArrowRight, Table, Plus } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CompanyDashboard() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company_id") || "e92a40b0-7b77-4b6c-9df5-2e57600f53e6"; // Mock or from context
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [apps, setApps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [companyId]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("sp_token");
      // 1. Fetch Company Jobs
      const jobRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/list?company_id=${companyId}`);
      const jobData = await jobRes.json();
      setJobs(Array.isArray(jobData) ? jobData.filter((j: any) => j.company_id === companyId) : []);

      // 2. Fetch Applicants
      const appRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/company/${companyId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const appData = await appRes.json();
      setApps(Array.isArray(appData) ? appData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (appId: str, status: string) => {
    try {
      const token = localStorage.getItem("sp_token");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/${appId}/status?status=${status}`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
      });
      toast.success(`Applicant ${status}`);
      fetchData();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const sortedApps = [...apps].sort((a, b) => b.ai_match_score - a.ai_match_score);

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-12 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
           <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 italic">Enterprise Workspace</p>
           <h1 className="text-5xl font-black font-heading tracking-tighter italic">Hiring Control Center</h1>
        </div>
        <Link href="/dashboard/company/create-job">
           <Button className="bg-white text-black hover:bg-neutral-200 font-black h-12 flex items-center gap-2">
              <Plus className="w-5 h-5" /> POST NEW ROLE
           </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Jobs Stats */}
        <div className="space-y-6">
            <Card className="bg-white/5 border-white/10 flex items-center p-6 gap-6">
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <Briefcase className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h3 className="text-4xl font-black italic">{jobs.length}</h3>
                    <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Active Postings</p>
                </div>
            </Card>
            <Card className="bg-white/5 border-white/10 flex items-center p-6 gap-6">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Users className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                    <h3 className="text-4xl font-black italic">{apps.length}</h3>
                    <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Total Applicants</p>
                </div>
            </Card>
        </div>

        {/* Applicant Table */}
        <Card className="lg:col-span-2 bg-[#050505] border-white/10 backdrop-blur-3xl overflow-hidden relative border-t-primary/30">
            <CardHeader className="border-b border-white/10 p-8">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-2xl font-black italic">Applicant Pipeline</CardTitle>
                        <CardDescription>Multi-company SaaS isolation active.</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 text-[10px] uppercase font-black tracking-widest">
                        SORTING BY AI MATCH
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {isLoading ? (
                    <div className="py-24 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="p-4 text-[10px] font-black uppercase text-neutral-500 tracking-widest">Candidate</th>
                                    <th className="p-4 text-[10px] font-black uppercase text-neutral-500 tracking-widest">Target Role</th>
                                    <th className="p-4 text-[10px] font-black uppercase text-neutral-500 tracking-widest text-center">AI Match</th>
                                    <th className="p-4 text-[10px] font-black uppercase text-neutral-500 tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedApps.map(app => (
                                    <tr key={app.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-black italic">
                                                    {app.users?.full_name?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-sm">{app.users?.full_name || 'Anonymous'}</p>
                                                    <p className="text-[10px] font-mono text-neutral-500 italic">{app.users?.wallet_address?.substring(0, 8)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-medium text-neutral-300">{app.jobs?.title}</td>
                                        <td className="p-4 text-center">
                                            <span className="text-xl font-black italic text-emerald-500 flex items-center justify-center gap-1">
                                                <Zap className="w-4 h-4 fill-emerald-500" /> {app.ai_match_score}%
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    onClick={() => updateStatus(app.id, 'shortlisted')}
                                                    className="bg-primary/10 text-primary border-primary/30 h-8 font-black text-[10px]"
                                                >
                                                    SHORTLIST
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    onClick={() => updateStatus(app.id, 'interview')}
                                                    className="bg-white text-black hover:bg-neutral-200 h-8 font-black text-[10px]"
                                                >
                                                    INTERVIEW
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
