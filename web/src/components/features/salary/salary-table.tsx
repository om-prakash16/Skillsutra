'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SalaryTableProps {
  title: string;
  data: { label: string; avg: number; subtext?: string }[];
}

export function SalaryTable({ title, data }: SalaryTableProps) {
  return (
    <Card className="bg-card/20 backdrop-blur-xl border border-primary/10">
      <CardHeader>
        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((row) => (
          <div key={row.label} className="flex justify-between items-center group">
            <div className="space-y-0.5">
               <p className="text-sm font-bold group-hover:text-primary transition-colors">{row.label}</p>
               {row.subtext && <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tight">{row.subtext}</p>}
            </div>
            <p className="font-black text-foreground">₹{row.avg} LPA</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
