'use client';

import { JobCard } from '@/components/shared/job-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { publicApi } from '@/lib/api/public-api';
import { Loader2 } from 'lucide-react';
import { useCMS } from '@/context/cms-context';

export function FeaturedJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getVal } = useCMS();
  
  const title = getVal("landing", "featured_jobs_title", "Featured Requisitions");
  const subtitle = getVal("landing", "featured_jobs_subtitle", "Top roles at verified professional organizations seeking high-fidelity talent.");
  
  const titleParts = title.split(" ");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await publicApi.jobs.list();
        setJobs(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch (err) {
        console.error("Failed to fetch featured jobs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-7xl space-y-16">
        <div className="text-center space-y-4">
            <div className="flex justify-center">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-micro px-6 py-2 rounded-full shadow-premium">
                    Opportunities
                </Badge>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                {titleParts[0]} <span className="text-primary italic font-black">{titleParts.slice(1).join(" ")}</span>
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
                {subtitle}
            </p>
        </div>

        {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Scanning marketplace nodes...</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
                {jobs.length === 0 && (
                    <div className="col-span-full py-20 text-center glass border-dashed border-white/10 rounded-[2rem]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Awaiting fresh role deployments...</p>
                    </div>
                )}
            </div>
        )}

        <div className="flex justify-center pt-8">
            <Link href="/jobs">
                <Button variant="outline" className="h-12 px-10 rounded-xl bg-card border-primary/20 hover:border-primary/50 text-xs font-bold uppercase tracking-widest transition-all">
                    Explore Directory
                </Button>
            </Link>
        </div>
      </div>
    </section>
  );
}
