'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SalaryStatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  subtext: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export function SalaryStatCard({ 
  title, 
  value, 
  icon: Icon, 
  subtext, 
  sentiment = 'neutral' 
}: SalaryStatCardProps) {
  return (
    <Card className="p-6 bg-card/20 backdrop-blur-xl border-primary/10">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className={cn(
            "text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full",
            sentiment === 'positive' ? "bg-emerald-500/10 text-emerald-400" : 
            sentiment === 'negative' ? "bg-rose-500/10 text-rose-400" : "bg-muted text-muted-foreground"
        )}>
            {sentiment}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{title}</p>
        <h3 className="text-2xl font-black">{value}</h3>
        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/40">{subtext}</p>
      </div>
    </Card>
  );
}
