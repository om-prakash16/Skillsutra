"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, DollarSign, Search, Filter, ArrowRight, Loader2, Zap } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/api-client";

export default function JobMarketplace() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs', user?.id],
    queryFn: async () => {
      try {
        const response = await api.search.jobs("");
        if (response && response.items) {
            return Array.isArray(response.items) ? response.items : [];
        }
        return Array.isArray(response) ? response : [];
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        return [];
      }
    }
  });

  const filteredJobs = jobs.filter(job => 
    job.title?.toLowerCase().includes(search.toLowerCase()) ||
    job.companies?.company_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[180px] -z-10 rounded-full" />
      
      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        <div className="text-center space-y-10">
           <div className="flex justify-center">
               <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-micro px-6 py-2 rounded-full shadow-premium">
                 Marketplace Intelligence
               </Badge>
           </div>
           <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-tight">
             Find Your <br />
             <span className="text-primary italic font-black">Next Impact</span>
           </h1>
           <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg font-normal leading-relaxed">
             Browse high-fidelity roles verified by <span className="text-foreground font-bold">Proof Scores</span> and real-time AI matching intelligence.
           </p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 glass p-2 rounded-3xl border-white/5 shadow-premium">
           <div className="flex-1 relative group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
             <Input 
                placeholder="Search roles, companies, or skills..." 
                className="bg-transparent border-none pl-14 h-14 text-lg focus-visible:ring-0 placeholder:text-muted-foreground/30 font-medium"
                value={search}
                onChange={e => setSearch(e.target.value)}
             />
           </div>
           <Button 
              variant="premium" 
              className="h-14 px-8 text-xs font-bold tracking-widest uppercase rounded-2xl transition-all"
              onClick={() => alert("Advanced Filters Interface will be deployed in the next protocol update.")}
           >
              <Filter className="w-4 h-4 mr-2" /> Advanced Filters
           </Button>
        </div>

        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-6">
             <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
             <p className="text-micro text-muted-foreground/40 uppercase tracking-widest">Synthesizing Role Intersections...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredJobs.map(job => (
              <JobCard key={job.id} job={job} user={user} />
            ))}
            {filteredJobs.length === 0 && (
                <div className="col-span-full py-32 text-center glass border-dashed border-white/10 rounded-3xl">
                    <p className="text-micro text-muted-foreground/40">Awaiting role deployments matching your parameters...</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function JobCard({ job, user }: { job: any, user: any }) {
    return (
        <Card className="group relative overflow-hidden glass border-black/5 dark:border-white/5 hover:border-primary/40 transition-all duration-500 rounded-3xl shadow-premium flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 rounded-full group-hover:bg-primary/10 transition-colors" />
            
            <CardHeader className="relative overflow-hidden pt-10 px-8">
                <div className="space-y-3 relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="h-px w-6 bg-primary/40 group-hover:w-10 transition-all duration-500" />
                        <p className="text-micro text-primary font-bold">{job.companies?.company_name}</p>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-all duration-500">
                        {job.title}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-8 px-8 pb-8 relative z-10">
                <div className="flex flex-wrap gap-6 text-micro text-muted-foreground/50">
                    <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary/60" /> {job.location || 'Remote'}</span>
                    <span className="flex items-center gap-2"><DollarSign className="w-3.5 h-3.5 text-primary/60" /> {job.salary_range || 'Competitive'}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                    {job.skills_required.slice(0, 3).map((skill: string) => (
                        <Badge key={skill} variant="outline" className="glass border-black/5 dark:border-white/10 text-micro text-muted-foreground/60 py-1 px-3 rounded-lg group-hover:border-primary/20 group-hover:text-primary/80 transition-colors">
                            {skill}
                        </Badge>
                    ))}
                    {job.skills_required.length > 3 && (
                        <span className="text-micro text-muted-foreground/30 py-1">+{job.skills_required.length - 3} more</span>
                    )}
                </div>
            </CardContent>
            <CardFooter className="p-8 pt-6 border-t border-black/5 dark:border-white/5 mt-auto relative z-10">
                {user ? (
                   <div className="w-full flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-2 max-w-[60%]">
                         <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">AI Resonance</span>
                         <span className={`text-2xl font-black italic flex items-center gap-2 ${
                            (job.ai_match_percentage || 0) > 70 ? 'text-emerald-500' : 'text-amber-500'
                         }`}>
                            <Zap className={`w-5 h-5 ${(job.ai_match_percentage || 0) > 70 ? 'fill-emerald-500/20' : 'fill-amber-500/20'}`} /> 
                            {job.ai_match_percentage || 0}%
                         </span>
                         {job.match_reason && (
                             <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                                 {job.match_reason}
                             </p>
                         )}
                      </div>
                      <Link href={`/jobs/${job.id}`} className="flex-shrink-0 self-end">
                        <Button variant="premium" className="h-12 px-6 text-[10px] font-black tracking-widest uppercase rounded-xl">
                            DETAILS <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                   </div>
                ) : (
                   <Link href="/auth/login" className="w-full">
                      <Button variant="outline" className="w-full h-11 border-black/10 hover:border-primary/50 font-bold uppercase text-micro tracking-widest rounded-xl transition-all">
                         SIGN IN TO APPLY
                      </Button>
                   </Link>
                )}
            </CardFooter>
        </Card>
    )
}
