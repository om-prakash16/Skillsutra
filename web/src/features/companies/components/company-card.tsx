'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Company } from '@/lib/mock-api/companies';
import { Building2, Users, MapPin, ArrowUpRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Card className="group overflow-hidden bg-card/20 backdrop-blur-xl border-primary/10 hover:border-primary/30 transition-all hover:shadow-[0_0_40px_-12px_rgba(var(--primary-rgb),0.2)]">
      <div className="p-6 space-y-5">
        {/* Branding Hub */}
        <div className="flex justify-between items-start">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-indigo-600/10 border border-primary/5 p-3 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
             <Building2 className="w-8 h-8 text-primary" />
          </div>
          {company.hiringStatus === "Actively Hiring" && (
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter">
               <Sparkles className="w-3 h-3 mr-1" />
               Hiring {company.openPositions} Roles
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
        <div className="flex flex-wrap gap-y-2 gap-x-4">
            <div className="flex items-center text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">
                <MapPin className="w-3 h-3 mr-1.5 text-primary" />
                {company.location}
            </div>
            <div className="flex items-center text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">
                <Users className="w-3 h-3 mr-1.5 text-primary" />
                {company.size} employees
            </div>
        </div>

        <div className="pt-2 border-t border-primary/5">
             <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="bg-background/50 text-[10px] py-0 px-2 font-medium">#{company.industry.split(' ')[0]}</Badge>
                {company.tags.slice(0, 2).map(tag => (
                   <Badge key={tag} variant="outline" className="text-[10px] py-0 px-2 border-primary/10 opacity-70">#{tag}</Badge>
                ))}
             </div>
        </div>
      </div>
      
      <Link href={`/companies/${company.id}`} className="absolute inset-0 z-10" aria-label={`View ${company.name} profile`} />
    </Card>
  );
}
