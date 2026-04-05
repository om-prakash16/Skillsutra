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
      <Card className="bg-white/5 border-white/10 backdrop-blur-md animate-pulse">
        <CardContent className="h-[200px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!scores) return null;

  return (
    <Card className="bg-[#0A0A0A] border-white/10 overflow-hidden relative border-t-primary/20 backdrop-blur-xl">
      <CardHeader className="text-center pb-0 space-y-4">
        <div className="mx-auto inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 border border-primary/20">
          <Zap className="w-8 h-8 text-primary" />
        </div>
        <div>
           <h3 className="text-[10px] font-black uppercase text-primary tracking-widest mb-1">Authenticated Proof Score</h3>
           <h2 className="text-6xl font-black italic tracking-tighter text-white">{scores.proof_score}%</h2>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        <div className="grid grid-cols-1 gap-6">
            <ScoreMetric 
                label="Skills & Verifications" 
                value={scores.skill_score} 
                weight={40} 
                color="text-emerald-500" 
                icon={GraduationCap}
            />
            <ScoreMetric 
                label="Project Complexity" 
                value={scores.project_score} 
                weight={30} 
                color="text-blue-500" 
                icon={Rocket}
            />
            <ScoreMetric 
                label="Industry Experience" 
                value={scores.experience_score} 
                weight={30} 
                color="text-fuchsia-500" 
                icon={Github}
            />
        </div>

        <div className="pt-4 text-center">
            <Badge variant="outline" className="bg-white/5 border-white/10 py-1 px-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500 transition-all hover:bg-white/10 hover:border-primary/30 hover:text-white cursor-default">
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
