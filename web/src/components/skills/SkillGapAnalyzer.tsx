"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { userApi } from "@/lib/api/user-api";

interface GapData {
  required_skills: { skill_name: string; importance: string }[];
  matched: { skill_name: string; importance: string; user_proficiency: string; proof_score: number }[];
  gaps: { skill_name: string; importance: string; required_proficiency: string; category: string }[];
  gap_score: number;
  recommendations: string[];
}

export default function SkillGapAnalyzer({ jobs }: { jobs: { id: string; title: string }[] }) {
  const [selectedJobId, setSelectedJobId] = useState("");
  const [gapData, setGapData] = useState<GapData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedJobId) return;
    setLoading(true);
    userApi.skillGraph
      .getGaps(selectedJobId)
      .then((res: GapData) => setGapData(res))
      .catch(() => setGapData(null))
      .finally(() => setLoading(false));
  }, [selectedJobId]);

  const importanceColor: Record<string, string> = {
    required: "text-red-400 bg-red-500/10 border-red-500/20",
    preferred: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    nice_to_have: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  };

  return (
    <Card className="border-white/5 bg-zinc-950/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <span className="text-amber-400">🎯</span> Skill Gap Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedJobId} onValueChange={setSelectedJobId}>
          <SelectTrigger className="bg-zinc-900/50 border-white/10">
            <SelectValue placeholder="Select a job to compare..." />
          </SelectTrigger>
          <SelectContent>
            {jobs.map((job) => (
              <SelectItem key={job.id} value={job.id}>
                {job.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {loading && (
          <div className="text-center py-6 text-sm text-zinc-500 animate-pulse">
            Analyzing skill gaps...
          </div>
        )}

        {gapData && !loading && (
          <>
            {/* Score overview */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/30 border border-white/5">
              <div className="text-center">
                <div className={`text-3xl font-bold ${gapData.gap_score <= 20 ? "text-green-400" : gapData.gap_score <= 50 ? "text-amber-400" : "text-red-400"}`}>
                  {(100 - gapData.gap_score).toFixed(0)}%
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">MATCH</div>
              </div>
              <div className="flex-1">
                <Progress value={100 - gapData.gap_score} className="h-2" />
                <div className="flex justify-between mt-1.5 text-[11px] text-zinc-500">
                  <span>{gapData.matched.length} matched</span>
                  <span>{gapData.gaps.length} gaps</span>
                </div>
              </div>
            </div>

            {/* Matched Skills */}
            {gapData.matched.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                  ✓ Skills You Have
                </h4>
                <div className="space-y-1">
                  {gapData.matched.map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-green-500/5 border border-green-500/10">
                      <span className="text-sm text-green-400">{m.skill_name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500 capitalize">{m.user_proficiency}</span>
                        <Badge variant="outline" className={`text-[9px] ${importanceColor[m.importance] || ""}`}>
                          {m.importance}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gap Skills */}
            {gapData.gaps.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                  ✗ Skills to Learn
                </h4>
                <div className="space-y-1">
                  {gapData.gaps.map((g, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-red-500/5 border border-red-500/10">
                      <span className="text-sm text-red-400">{g.skill_name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500 capitalize">{g.required_proficiency}</span>
                        <Badge variant="outline" className={`text-[9px] ${importanceColor[g.importance] || ""}`}>
                          {g.importance}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {gapData.recommendations.length > 0 && (
              <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                <h4 className="text-xs font-semibold text-cyan-400 mb-2">💡 Recommendations</h4>
                <ul className="space-y-1">
                  {gapData.recommendations.map((rec, i) => (
                    <li key={i} className="text-xs text-zinc-400">
                      • {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {!selectedJobId && !loading && (
          <div className="text-center py-8 text-sm text-zinc-600">
            Select a job to see how your skills compare to its requirements.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
