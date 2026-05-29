"use client";

import { useAuth } from "@/context/auth-context";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/api-client";
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
  
  const [applied, setApplied] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: ["jobDetail", id],
    queryFn: () => api.jobs.details(id as string),
    enabled: !!id
  });

  const applyMutation = useMutation({
    mutationFn: (jobId: string) => api.jobs.apply(jobId),
    onSuccess: (data) => {
      toast.success(`Application Sent! AI Match: ${data.match_score}%`, {
          description: "Your personalized skill assessment is now ready in your dashboard.",
          duration: 5000,
      });
      setApplied(true);
      setTimeout(() => {
          router.push("/user/applications");
      }, 3000);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to apply");
    }
  });

  const handleApply = async () => {
    if (!user) {
        router.push("/auth/login");
        return;
    }
    applyMutation.mutate(id as string);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  if (!job) return <div className="min-h-screen flex items-center justify-center text-foreground">Job not found.</div>;

  return (
    <div className="min-h-screen py-24 pb-12 px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        <Link href="/jobs" className="inline-flex items-center text-muted-foreground hover:text-primary transition-all gap-3 font-black uppercase tracking-[0.2em] text-[10px] glass px-4 py-2 rounded-full">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="space-y-6 flex-1">
                <div className="space-y-4">
                    <Badge variant="outline" className="glass text-primary px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                        {job.companies?.company_name}
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-black font-heading tracking-tighter text-gradient leading-none">{job.title}</h1>
                </div>
                <div className="flex flex-wrap gap-8 text-muted-foreground font-bold uppercase text-[10px] tracking-widest">
                    <span className="flex items-center gap-2.5"><MapPin className="w-4 h-4 text-primary" /> {job.location || 'Remote'}</span>
                    <span className="flex items-center gap-2.5"><DollarSign className="w-4 h-4 text-primary" /> {job.salary_range || 'Competitive'}</span>
                    <span className="flex items-center gap-2.5"><Calendar className="w-4 h-4 text-primary" /> Posted {new Date(job.created_at).toLocaleDateString()}</span>
                </div>
            </div>

            <Card className="glass w-full md:w-96 rounded-[2rem] border-border shadow-2xl overflow-hidden group">
                <CardContent className="p-8 space-y-8">
                    <div className="flex justify-between items-center text-center">
                        <div className="space-y-2">
                           <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.3em] leading-none">AI Match</p>
                           <p className="text-4xl font-black text-emerald-500 italic">88%</p>
                        </div>
                        <div className="h-12 w-[1px] bg-muted/50" />
                        <div className="space-y-2">
                           <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.3em] leading-none">Reputation</p>
                           <p className="text-4xl font-black text-primary italic">742</p>
                        </div>
                    </div>
                    {applied ? (
                        <Button disabled className="w-full h-16 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 font-black rounded-2xl">
                            <CheckCircle className="w-6 h-6 mr-3" /> APPLICATION SENT
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleApply} 
                            disabled={applyMutation.isPending}
                            variant="premium"
                            className="w-full h-16 rounded-2xl"
                        >
                            {applyMutation.isPending ? <Loader2 className="w-7 h-7 animate-spin" /> : <><ShieldCheck className="w-6 h-6 mr-3" /> APPLY NOW</>}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 pt-16 items-start border-t border-border/50">
            <div className="lg:col-span-2 space-y-16">
                <div className="space-y-6">
                    <h2 className="text-3xl font-black font-heading tracking-tight flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                            <Briefcase className="w-6 h-6 text-primary" />
                        </div>
                        Role Description
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-xl font-medium opacity-90 whitespace-pre-wrap">{job.description}</p>
                </div>

                <div className="space-y-8">
                    <h2 className="text-3xl font-black font-heading tracking-tight flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                            <Zap className="w-6 h-6 text-primary" />
                        </div>
                        Required Architecture
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {job.skills_required.map((skill: string) => (
                            <Badge key={skill} className="glass border-border/50 text-muted-foreground py-3 px-6 text-xs font-black uppercase tracking-widest rounded-xl hover:text-foreground transition-colors">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <Card className="glass rounded-3xl border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-black uppercase tracking-[0.2em] opacity-40">Verification Logic</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 text-sm font-medium text-muted-foreground">
                        <p>This job requires a verified platform identity and a Proof Score of at least <span className="text-foreground font-black">500</span>.</p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Identity Hash Check</li>
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Skill Credential Link</li>
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Multi-company RLS Isolation</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
