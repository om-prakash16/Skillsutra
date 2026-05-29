'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Company } from '@/types';
import { Building2, Users, MapPin, ArrowUpRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Card className="group relative overflow-hidden glass border-black/5 dark:border-border/50 hover:border-primary/40 transition-all duration-500 rounded-3xl shadow-premium">
      <div className="p-6 space-y-5">
        {/* Branding Hub */}
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 p-2.5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
             <Building2 className="w-6 h-6 text-primary" />
          </div>
          {company.hiringStatus === "Actively Hiring" && (
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 text-micro font-bold tracking-widest rounded-lg">
               <Sparkles className="w-3.5 h-3.5 mr-1.5" />
               HIRING {company.openPositions} ROLES
            </Badge>
          )}
        </div>

        {/* Intelligence Context */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors flex items-center gap-2">
            {company.name}
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-y-1 translate-x-1 transition-all" />
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed h-10">
            {company.description}
          </p>
        </div>

        {/* Physical Context */}
        <div className="flex flex-wrap gap-y-2 gap-x-6">
            <div className="flex items-center text-micro font-bold text-muted-foreground/40">
                <MapPin className="w-3.5 h-3.5 mr-2 text-primary/60" />
                {company.location}
            </div>
            <div className="flex items-center text-micro font-bold text-muted-foreground/40">
                <Users className="w-3.5 h-3.5 mr-2 text-primary/60" />
                {company.size} EMPLOYEES
            </div>
        </div>

        <div className="pt-4 border-t border-black/5 dark:border-border/50">
             <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-primary/5 text-primary text-micro py-0.5 px-2.5 font-bold rounded-md">#{company.industry.split(' ')[0]}</Badge>
                {company.tags.slice(0, 2).map(tag => (
                   <Badge key={tag} variant="outline" className="text-micro py-0.5 px-2.5 border-black/5 dark:border-border text-muted-foreground/60 rounded-md">#{tag}</Badge>
                ))}
             </div>
        </div>
      </div>
      
      <Link href={`/companies/${company.id}`} className="absolute inset-0 z-10" aria-label={`View ${company.name} profile`} />
    </Card>
  );
}
