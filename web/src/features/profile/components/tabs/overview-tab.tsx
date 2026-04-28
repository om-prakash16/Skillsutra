'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function OverviewTab({ data }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 p-6 bg-card/20 backdrop-blur-xl border-primary/10">
        <h3 className="text-lg font-bold mb-4 tracking-tight uppercase text-xs text-muted-foreground/60">Professional Biography</h3>
        <p className="text-muted-foreground leading-relaxed italic">"{data.basic.bio}"</p>
      </Card>
      
      <Card className="p-6 bg-card/20 backdrop-blur-xl border-primary/10">
         <h3 className="text-lg font-bold mb-4 tracking-tight uppercase text-xs text-muted-foreground/60">Core Competencies</h3>
         <div className="flex flex-wrap gap-2">
            {data.skills.map((skill: any) => (
                <Badge key={skill.name} variant="secondary" className="bg-primary/5 text-primary border-primary/10">
                    {skill.name}
                </Badge>
            ))}
         </div>
      </Card>
    </div>
  );
}
