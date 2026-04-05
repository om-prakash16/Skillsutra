"use client";

import { useAuth } from "@/context/auth-context";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, DollarSign, Calendar, Zap, ArrowLeft, Loader2, CheckCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function JobDetails() {
  const { user } = useAuth();
  const { id } = useParams();
  const router = useRouter();
  
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (id) fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/details/${id}`);
      const data = await res.json();
      setJob(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
        router.push("/login");
        return;
    }
    setIsApplying(true);
    try {
      const token = localStorage.getItem("sp_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/apply`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ job_id: id, candidate_id: user.id })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Applied successfully! AI Match Score: ${data.ai_match_score}%`);
        setApplied(true);
      } else {
        throw new Error(data.detail);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  if (!job) return <div className="min-h-screen flex items-center justify-center text-white">Job not found.</div>;

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/jobs" className="inline-flex items-center text-neutral-500 hover:text-white transition-colors gap-2 font-black italic uppercase tracking-tighter">
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="space-y-4 flex-1">
                <div className="space-y-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-0.5 text-[10px] font-black italic">
                        {job.companies?.company_name}
                    </Badge>
                    <h1 className="text-5xl font-black font-heading tracking-tighter italic">{job.title}</h1>
                </div>
                <div className="flex flex-wrap gap-6 text-neutral-400 font-medium">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location || 'Remote'}</span>
                    <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {job.salary_range || 'Competitive'}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Posted {new Date(job.created_at).toLocaleDateString()}</span>
                </div>
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur-xl w-full md:w-80">
                <CardContent className="p-6 space-y-6">
                    <div className="flex justify-between items-center text-center">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none">AI Match</p>
                           <p className="text-3xl font-black text-emerald-500 italic">88%</p>
                        </div>
                        <div className="h-10 w-[1px] bg-white/10" />
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none">Reputation</p>
                           <p className="text-3xl font-black text-primary italic">742</p>
                        </div>
                    </div>
                    {applied ? (
                        <Button disabled className="w-full h-14 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 font-black">
                            <CheckCircle className="w-5 h-5 mr-2" /> APPLICATION SENT
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleApply} 
                            disabled={isApplying}
                            className="w-full h-14 bg-white text-black hover:bg-neutral-200 font-black tracking-tight"
                        >
                            {isApplying ? <Loader2 className="w-6 h-6 animate-spin" /> : <><ShieldCheck className="w-5 h-5 mr-2" /> APPLY NOW</>}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-12 items-start border-t border-white/10">
            <div className="lg:col-span-2 space-y-12">
                <div className="space-y-4">
                    <h2 className="text-2xl font-black font-heading tracking-tight italic flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-primary" /> Role Description
                    </h2>
                    <p className="text-neutral-400 leading-relaxed text-lg whitespace-pre-wrap">{job.description}</p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-black font-heading tracking-tight italic flex items-center gap-2">
                        <Zap className="w-6 h-6 text-primary" /> Required Architecture
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {job.skills_required.map((skill: string) => (
                            <Badge key={skill} className="bg-white/5 border-white/10 text-neutral-300 py-2 px-4 shadow-xl">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold italic">Verification Logic</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-neutral-500">
                        <p>This job requires a verified on-chain identity and a Proof Score of at least 500.</p>
                        <ul className="space-y-2 list-disc list-inside">
                            <li>Identity Hash Check</li>
                            <li>Skill Credential Link</li>
                            <li>Multi-company RLS Isolation</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
