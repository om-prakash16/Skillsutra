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
    <div className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
           <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 uppercase tracking-tighter font-black italic">
             AI-POWERED MARKETPLACE
           </Badge>
           <h1 className="text-6xl font-black font-heading tracking-tighter italic">Find Your Next Impact.</h1>
           <p className="text-muted-foreground max-w-2xl mx-auto">Browse high-fidelity roles verified by Proof Scores and AI matching.</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
           <div className="flex-1 relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
             <Input 
                placeholder="Search roles or companies..." 
                className="bg-transparent border-none pl-12 h-14 text-lg focus-visible:ring-0"
                value={search}
                onChange={e => setSearch(e.target.value)}
             />
           </div>
           <Button className="h-14 px-8 bg-white text-black hover:bg-neutral-200 font-black tracking-tight">
              <Filter className="w-5 h-5 mr-2" /> ADVANCED FILTERS
           </Button>
        </div>

        {/* Job Grid */}
        {isLoading ? (
          <div className="py-24 flex justify-center items-center">
             <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl group hover:border-primary/50 transition-all duration-500 flex flex-col">
            <CardHeader className="relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Briefcase className="w-20 h-20 text-white" />
                </div>
                <div className="space-y-2">
                    <p className="text-xs font-black text-primary uppercase tracking-widest">{job.companies?.company_name}</p>
                    <CardTitle className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{job.title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-neutral-400 font-medium">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location || 'Remote'}</span>
                    <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {job.salary_range || 'Competitive'}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                    {job.skills_required.slice(0, 3).map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="bg-white/5 text-[10px] text-neutral-300 border-white/10">
                            {skill}
                        </Badge>
                    ))}
                    {job.skills_required.length > 3 && (
                        <span className="text-[10px] text-neutral-500 font-bold">+{job.skills_required.length - 3} MORE</span>
                    )}
                </div>
            </CardContent>
            <CardFooter className="pt-4 border-t border-white/10 mt-auto">
                {user ? (
                   <div className="w-full flex items-center justify-between">
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">AI Match</span>
                         <span className={`text-lg font-black italic flex items-center gap-1 ${
                            (job.ai_match_percentage || 0) > 70 ? 'text-emerald-500' : 'text-amber-500'
                         }`}>
                            <Zap className={`w-4 h-4 ${
                                (job.ai_match_percentage || 0) > 70 ? 'fill-emerald-500' : 'fill-amber-500'
                            }`} /> {job.ai_match_percentage || 0}%
                         </span>
                      </div>
                      <Link href={`/jobs/${job.id}`}>
                        <Button className="h-11 bg-white text-black hover:bg-neutral-200 font-black px-6">
                            DETAILS <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                   </div>
                ) : (
                   <Link href="/login" className="w-full">
                      <Button variant="outline" className="w-full h-11 border-white/10 hover:bg-white/5 font-black">
                         SIGN IN TO APPLY
                      </Button>
                   </Link>
                )}
            </CardFooter>
        </Card>
    )
}
