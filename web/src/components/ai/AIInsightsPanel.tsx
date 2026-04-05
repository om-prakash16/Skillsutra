"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, Star, AlertCircle, Lightbulb, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AIInsightsProps {
    data: {
        strengths: string[];
        missing_skills: string[];
        recommendations: string[];
    } | null;
    isLoading: boolean;
}

export function AIInsightsPanel({ data, isLoading }: AIInsightsProps) {
  if (isLoading) {
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-md animate-pulse">
        <CardContent className="h-[300px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden relative group transition-all duration-500 hover:border-primary/30">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Brain className="w-24 h-24 text-primary" />
      </div>

      <CardHeader>
        <CardTitle className="text-2xl font-black font-heading tracking-tight flex items-center gap-2 italic">
          <Brain className="w-6 h-6 text-primary" /> AI Career Intelligence
        </CardTitle>
        <CardDescription>Strategic evaluation of your multi-modal professional footprint.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Strengths */}
        <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase text-emerald-500 tracking-widest flex items-center gap-1">
                <Star className="w-3 h-3" /> Core Verticals
            </h4>
            <div className="flex flex-wrap gap-2">
                {data.strengths.map((s, i) => (
                    <Badge key={i} className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 text-xs">
                        {s}
                    </Badge>
                ))}
            </div>
        </div>

        {/* Gaps */}
        <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase text-rose-500 tracking-widest flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Growth Gaps
            </h4>
            <div className="flex flex-wrap gap-2">
                {data.missing_skills.map((s, i) => (
                    <Badge key={i} className="bg-rose-500/10 text-rose-500 border-rose-500/20 px-3 py-1 text-xs italic">
                        {s}
                    </Badge>
                ))}
            </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase text-amber-500 tracking-widest flex items-center gap-1">
                <Lightbulb className="w-3 h-3" /> Strategic Roadmap
            </h4>
            <ul className="space-y-2">
                {data.recommendations.map((r, i) => (
                    <li key={i} className="text-sm text-neutral-400 pl-4 border-l-2 border-white/10 hover:border-amber-500/50 transition-colors">
                        {r}
                    </li>
                ))}
            </ul>
        </div>
      </CardContent>
    </Card>
  );
}
