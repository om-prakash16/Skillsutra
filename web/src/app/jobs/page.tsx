"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, DollarSign, Search, Filter, ArrowRight, Loader2, Zap } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function JobMarketplace() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    try {
      const url = user?.id 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/list?user_id=${user.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/list`;
      
      const res = await fetch(url);
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.companies?.company_name.toLowerCase().includes(search.toLowerCase())
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
           <Button variant="premium" className="h-14 px-8 text-xs font-bold tracking-widest uppercase rounded-2xl transition-all">
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
        <Card className="group relative overflow-hidden glass border-black/5 dark:border-white/5 hover:border-primary/40 transition-all duration-500 rounded-3xl shadow-premium">
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
                      <div className="flex flex-col gap-1">
                         <span className="text-micro text-muted-foreground/30">AI Resonance</span>
                         <span className={`text-xl font-bold italic flex items-center gap-2 ${
                            (job.ai_match_percentage || 0) > 70 ? 'text-emerald-500' : 'text-amber-500'
                         }`}>
                            <Zap className={`w-4 h-4 ${(job.ai_match_percentage || 0) > 70 ? 'fill-emerald-500/20' : 'fill-amber-500/20'}`} /> 
                            {job.ai_match_percentage || 0}%
                         </span>
                      </div>
                      <Link href={`/jobs/${job.id}`} className="flex-shrink-0">
                        <Button variant="premium" className="h-11 px-6 text-micro font-bold tracking-widest rounded-xl">
                            DETAILS <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                   </div>
                ) : (
                   <Link href="/login" className="w-full">
                      <Button variant="outline" className="w-full h-11 border-black/10 hover:border-primary/50 font-bold uppercase text-micro tracking-widest rounded-xl transition-all">
                         SIGN IN TO APPLY
                      </Button>
                   </Link>
                )}
            </CardFooter>
        </Card>
    )
}
