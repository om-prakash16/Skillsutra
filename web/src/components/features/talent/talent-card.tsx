'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Talent } from '@/lib/mock-api/talent';
import { MapPin, Briefcase, CheckCircle2, Zap, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface TalentCardProps {
  talent: Talent;
}

export function TalentCard({ talent }: TalentCardProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="group relative overflow-hidden bg-card/20 backdrop-blur-xl border-primary/10 hover:border-primary/30 transition-all hover:shadow-[0_0_40px_-12px_rgba(var(--primary-rgb),0.2)]">
      <div className="p-6 space-y-6">
        
        {/* Profile Header */}
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <div className="relative">
                <Avatar className="w-14 h-14 border-2 border-primary/20">
                    <AvatarImage src={talent.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {getInitials(talent.name)}
                    </AvatarFallback>
                </Avatar>
                {talent.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                    </div>
                )}
            </div>
            <div>
                <h3 className="font-bold text-lg leading-none tracking-tight group-hover:text-primary transition-colors flex items-center gap-1.5">
                    {talent.name}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" />
                </h3>
                <p className="text-sm text-muted-foreground mt-1.5">{talent.title}</p>
            </div>
          </div>
          
          <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[10px] font-black uppercase tracking-tighter">
             <Zap className="w-3 h-3 mr-1" />
             {talent.availability}
          </Badge>
        </div>

        {/* Visual Progress */}
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">
                <span>Profile Completion</span>
                <span>{talent.completion}%</span>
            </div>
            <Progress value={talent.completion} className="h-1.5" />
        </div>

        {/* Talent Intelligence */}
        <div className="flex flex-wrap gap-x-4 gap-y-2">
            <div className="flex items-center text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">
                <MapPin className="w-3 h-3 mr-1.5 text-primary" />
                {talent.location}
            </div>
            <div className="flex items-center text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">
                <Briefcase className="w-3 h-3 mr-1.5 text-primary" />
                {talent.experience} Experience
            </div>
        </div>

        {/* Skill Matrix */}
        <div className="pt-2 flex flex-wrap gap-1.5">
            {talent.skills.slice(0, 4).map(skill => (
                <Badge key={skill} variant="secondary" className="bg-background/50 text-[10px] py-0 px-2 font-medium">#{skill}</Badge>
            ))}
            {talent.skills.length > 4 && (
                <Badge variant="outline" className="text-[10px] py-0 px-2 border-primary/10">+{talent.skills.length - 4}</Badge>
            )}
        </div>
      </div>

      <Link href={`/talent/${talent.id}`} className="absolute inset-0 z-10" aria-label={`View ${talent.name}'s profile`} />
    </Card>
  );
}
