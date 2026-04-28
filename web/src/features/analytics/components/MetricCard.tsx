'use client';

import { Card } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, TrendingUp, HelpCircle } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  description: string;
  icon: React.ElementType;
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  trend, 
  description, 
  icon: Icon,
  className 
}: MetricCardProps) {
  const isPositive = trend && trend > 0;

  return (
    <Card className={cn(
      "p-6 bg-card/20 backdrop-blur-xl border-primary/10 hover:border-primary/30 transition-all",
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-4 h-4 text-muted-foreground/40 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{title}</p>
        <div className="flex items-baseline justify-between">
          <h3 className="text-3xl font-black tracking-tighter">{value}</h3>
          {trend !== undefined && (
            <div className={cn(
              "flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full",
              isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
            )}>
              {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2">
         <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn("h-full bg-primary transition-all duration-1000 ease-out", isPositive ? "opacity-100" : "opacity-40")}
              style={{ width: isPositive ? '75%' : '40%' }}
            />
         </div>
         <span className="text-[10px] font-bold uppercase text-muted-foreground/40 tracking-tighter">Velocity Spike</span>
      </div>
    </Card>
  );
}
