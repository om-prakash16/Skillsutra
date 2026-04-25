"use client";

import { useState, useEffect } from "react";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { SortDropdown } from "@/components/search/SortDropdown";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Zap, MapPin, GraduationCap, ArrowRight, Loader2, Star } from "lucide-react";
import Link from "next/link";

export default function CandidateDiscovery() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/candidates`);
      const data = await res.json();
      setCandidates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Header Section */}
        <div className="space-y-6">
           <Badge variant="outline" className="glass text-primary px-6 py-2 uppercase tracking-[0.3em] font-black rounded-full">
             Recruiter Discovery Engine
           </Badge>
           <h1 className="text-6xl md:text-8xl font-black font-heading tracking-tighter text-gradient leading-none">
             Discover <br />Top Talent.
           </h1>
           <p className="text-muted-foreground max-w-2xl text-xl font-medium opacity-80 leading-relaxed">
             Real-time candidate discovery powered by <span className="text-foreground">AI Proof Scores</span> and verified technical credentials with on-chain precision.
           </p>
        </div>

        {/* Search & Sort Bar */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 relative w-full group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                    placeholder="Search by skill, name, or professional summary..." 
                    className="h-16 glass border-white/10 pl-16 text-xl focus:border-primary/50 transition-all rounded-2xl shadow-2xl"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            <SortDropdown type="candidates" onSortChange={(s) => console.log(s)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1 glass p-8 rounded-3xl border-white/5">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-8">Refine Search</h3>
                <FilterSidebar type="candidates" onFilterChange={(f) => console.log(f)} />
            </div>

            {/* Results Grid */}
            <div className="lg:col-span-3">
                {isLoading ? (
                    <div className="py-24 flex justify-center"><Loader2 className="w-16 h-16 animate-spin text-primary" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {candidates.map(candidate => (
                            <CandidateCard key={candidate.id} data={candidate} />
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

function CandidateCard({ data }: { data: any }) {
    return (
        <Card className="glass hover:border-primary/40 transition-all duration-500 overflow-hidden relative group rounded-3xl">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-all duration-500 group-hover:scale-110">
                <Users className="w-24 h-24 text-primary" />
            </div>
            
            <CardHeader className="space-y-6 pt-8">
                <div className="flex justify-between items-start relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-2xl text-primary group-hover:bg-primary/20 transition-all shadow-lg">
                        {data.full_name?.[0] || 'U'}
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">AI Proof Score</p>
                        <p className="text-4xl font-black text-gradient italic flex items-center justify-end gap-2 mt-1">
                            <Zap className="w-5 h-5 fill-primary text-primary" /> {data.proof_score || 0}
                        </p>
                    </div>
                </div>
                <div>
                    <CardTitle className="text-2xl font-black tracking-tighter leading-none mb-2">{data.full_name || 'Anonymous professional'}</CardTitle>
                    <CardDescription className="text-muted-foreground font-bold flex items-center gap-2 uppercase text-[10px] tracking-widest">
                        <MapPin className="w-3.5 h-3.5 text-primary" /> {data.location || 'Remote-first'}
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="space-y-8 relative z-10">
                <div className="flex flex-wrap gap-2">
                    {data.skills?.slice(0, 3).map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="glass bg-white/5 text-[9px] text-muted-foreground border-white/5 uppercase font-black tracking-widest py-1 px-3">
                            {skill}
                        </Badge>
                    ))}
                    {data.skills?.length > 3 && (
                        <span className="text-[9px] text-muted-foreground/40 font-black tracking-widest uppercase ml-1">+{data.skills.length - 3} MORE</span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                    <div className="space-y-2">
                        <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.3em]">Experience</p>
                        <p className="text-xs font-black text-foreground">MID-LEVEL</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.3em]">Status</p>
                        <div className="flex gap-1.5">
                           <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                           <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">VERIFIED</span>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-4 pb-8">
                <Link href={`/u/${data.id}`} className="w-full">
                    <Button variant="premium" className="w-full h-14 group/btn">
                        VIEW FULL PROFILE <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
