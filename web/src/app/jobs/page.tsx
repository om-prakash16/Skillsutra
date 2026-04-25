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
    if (user) fetchJobs();
    else fetchJobs(); // Fetch public list
  }, [user]);

  const fetchJobs = async () => {
    try {
      const url = user?.id 
        ? `${process.env.NEXT_PUBLIC_API_URL}/jobs/list?user_id=${user.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/jobs/list`;
      
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
    <div className="min-h-screen py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-6">
           <Badge variant="outline" className="glass text-primary px-6 py-2 uppercase tracking-[0.3em] font-black rounded-full">
             AI-Powered Marketplace
           </Badge>
           <h1 className="text-6xl md:text-8xl font-black font-heading tracking-tighter text-gradient leading-none">Find Your <br />Next Impact.</h1>
           <p className="text-muted-foreground max-w-2xl mx-auto text-xl font-medium opacity-80">Browse high-fidelity roles verified by <span className="text-foreground">Proof Scores</span> and real-time AI matching intelligence.</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 glass p-3 rounded-[2rem] border-white/5 shadow-2xl">
           <div className="flex-1 relative group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
             <Input 
                placeholder="Search roles, companies, or stacks..." 
                className="bg-transparent border-none pl-16 h-16 text-xl focus-visible:ring-0 placeholder:text-muted-foreground/30 font-medium"
                value={search}
                onChange={e => setSearch(e.target.value)}
             />
           </div>
           <Button className="h-16 px-10 glass border-white/10 hover:border-primary/50 text-foreground font-black tracking-widest uppercase text-xs rounded-2xl transition-all">
              <Filter className="w-5 h-5 mr-3 text-primary" /> Advanced Filters
           </Button>
        </div>

        {/* Job Grid */}
        {isLoading ? (
          <div className="py-24 flex justify-center items-center">
             <Loader2 className="w-16 h-16 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map(job => (
              <JobCard key={job.id} job={job} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function JobCard({ job, user }: { job: any, user: any }) {
    return (
        <Card className="glass group hover:border-primary/40 transition-all duration-500 flex flex-col rounded-[2.5rem] overflow-hidden border-white/5">
            <CardHeader className="relative overflow-hidden pt-10 px-8">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-15 transition-all duration-500 group-hover:scale-110">
                    <Briefcase className="w-24 h-24 text-primary" />
                </div>
                <div className="space-y-3 relative z-10">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{job.companies?.company_name}</p>
                    <CardTitle className="text-2xl font-black tracking-tight leading-tight group-hover:text-gradient transition-all duration-500">{job.title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-8 px-8 pb-8 relative z-10">
                <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                    <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary" /> {job.location || 'Remote'}</span>
                    <span className="flex items-center gap-2"><DollarSign className="w-3.5 h-3.5 text-primary" /> {job.salary_range || 'Competitive'}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                    {job.skills_required.slice(0, 3).map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="glass bg-white/5 text-[9px] text-muted-foreground border-white/5 font-black uppercase tracking-widest py-1 px-3">
                            {skill}
                        </Badge>
                    ))}
                    {job.skills_required.length > 3 && (
                        <span className="text-[9px] text-muted-foreground/30 font-black tracking-widest uppercase ml-1">+{job.skills_required.length - 3} MORE</span>
                    )}
                </div>
            </CardContent>
            <CardFooter className="p-8 pt-6 border-t border-white/5 mt-auto bg-white/5 relative z-10">
                {user ? (
                   <div className="w-full flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-1">
                         <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">AI Match</span>
                         <span className={`text-xl font-black italic flex items-center gap-2 ${
                            (job.ai_match_percentage || 0) > 70 ? 'text-emerald-500' : 'text-amber-500'
                         }`}>
                            <Zap className={`w-4 h-4 ${(job.ai_match_percentage || 0) > 70 ? 'fill-emerald-500' : 'fill-amber-500'}`} /> 
                            {job.ai_match_percentage || 0}%
                         </span>
                      </div>
                      <Link href={`/jobs/${job.id}`} className="flex-shrink-0">
                        <Button variant="premium" size="sm" className="h-12 px-6 group/btn">
                            DETAILS <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                   </div>
                ) : (
                   <Link href="/login" className="w-full">
                      <Button variant="outline" className="w-full h-12 border-white/10 hover:bg-white/5 font-black uppercase text-[10px] tracking-widest rounded-xl">
                         SIGN IN TO APPLY
                      </Button>
                   </Link>
                )}
            </CardFooter>
        </Card>
    )
}
