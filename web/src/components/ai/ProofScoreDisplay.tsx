"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Zap, Rocket, GraduationCap, Github } from "lucide-react";

interface ProofScoreProps {
    scores: {
        skill_score: number;
        project_score: number;
        experience_score: number;
        proof_score: number;
    } | null;
    isLoading: boolean;
}

export function ProofScoreDisplay({ scores, isLoading }: ProofScoreProps) {
  if (isLoading) {
    return (
      <Card className="glass animate-pulse">
        <CardContent className="h-[200px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!scores) return null;

  return (
    <Card className="glass overflow-hidden relative border-t-primary/20 backdrop-blur-2xl rounded-3xl">
      <CardHeader className="text-center pt-10 pb-2 space-y-6">
        <div className="mx-auto inline-flex items-center justify-center p-4 rounded-2xl bg-primary/20 border border-primary/30 shadow-[0_0_30px_rgba(var(--primary),0.2)]">
          <Zap className="w-10 h-10 text-primary" />
        </div>
        <div>
           <h3 className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mb-2">Authenticated Proof Score</h3>
           <h2 className="text-7xl font-black italic tracking-tighter text-gradient">{scores.proof_score}%</h2>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        <div className="grid grid-cols-1 gap-6">
            <ScoreMetric 
                label="Skills & Verifications" 
                value={scores.skill_score} 
                weight={40} 
                color="text-emerald-400" 
                icon={GraduationCap}
            />
            <ScoreMetric 
                label="Project Complexity" 
                value={scores.project_score} 
                weight={30} 
                color="text-primary" 
                icon={Rocket}
            />
            <ScoreMetric 
                label="Industry Experience" 
                value={scores.experience_score} 
                weight={30} 
                color="text-secondary" 
                icon={Github}
            />
        </div>

        <div className="pt-6 text-center">
            <Badge variant="outline" className="glass py-2 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground transition-all hover:bg-white/5 hover:border-primary/50 hover:text-primary cursor-default rounded-full">
                AI RE-EVALUATION IN PROGRESS
            </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function ScoreMetric({ label, value, weight, color, icon: Icon }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="flex items-center gap-1 text-neutral-400 font-medium tracking-tight">
                    <Icon className="w-3 h-3" /> {label}
                </span>
                <span className={color}>{value}% <span className="text-neutral-600 font-normal">({weight}%)</span></span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ${color.replace('text-', 'bg-')}`} 
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}
