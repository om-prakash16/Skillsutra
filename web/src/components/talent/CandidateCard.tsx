'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function CandidateCard({ name, role, score, skills }: { name: string, role: string, score: number, skills: string[] }) {
  return (
    <Card className="p-6 bg-card/20 hover:border-primary/50 transition-all cursor-pointer group">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <Avatar className="w-16 h-16 border-2 border-primary/20 group-hover:border-primary/40 transition-all">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold">
              {name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{name}</h3>
            <p className="text-muted-foreground">{role}</p>
            <div className="flex gap-2 mt-2">
              {skills.slice(0, 3).map(skill => (
                <Badge key={skill} variant="secondary" className="text-[10px] uppercase font-black uppercase tracking-widest bg-primary/10 text-primary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground uppercase font-bold tracking-tight">Proof Score</div>
          <div className="text-2xl font-black text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.3)]">{score}</div>
        </div>
      </div>
    </Card>
  );
}
