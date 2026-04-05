"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Zap, Target, Award } from "lucide-react";

interface MetricCardProps {
    title: string;
    value: string | number;
    description: string;
    trend?: number;
    icon: 'zap' | 'target' | 'award' | 'trend';
    color?: string;
}

export function MetricCard({ title, value, description, trend, icon, color = "text-primary" }: MetricCardProps) {
  return (
    <Card className="bg-[#050505] border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        {getIcon(icon, "w-24 h-24 " + color)}
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
            {getIcon(icon, "w-5 h-5 " + color)}
            {trend && (
                <div className={`flex items-center gap-1 text-[10px] font-black italic ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{title}</h4>
        <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black italic tracking-tighter leading-none">{value}</span>
        </div>
        <p className="text-[10px] text-neutral-600 font-medium italic mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}

function getIcon(icon: string, className: string) {
    switch (icon) {
        case 'zap': return <Zap className={className} />;
        case 'target': return <Target className={className} />;
        case 'award': return <Award className={className} />;
        case 'trend': return <TrendingUp className={className} />;
        default: return <TrendingUp className={className} />;
    }
}
