"use client";

import React, { useState } from "react";
import { Award, Briefcase, ChevronRight, CheckCircle2, ShieldCheck, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock Data representing the ProofScore and VerifiedSkill models
const mockProofScore = {
  global_score: 845,
  domain_scores: {
    frontend: 920,
    backend: 710,
    system_design: 850
  }
};

const mockVerifiedSkills = [
  { id: 1, skill: "React.js", level: "EXPERT", source: "AI_ASSESSMENT" },
  { id: 2, skill: "Node.js", level: "ADVANCED", source: "GITHUB_ANALYSIS" },
  { id: 3, skill: "System Design", level: "ADVANCED", source: "PEER_REVIEW" },
  { id: 4, skill: "GraphQL", level: "INTERMEDIATE", source: "AI_ASSESSMENT" },
];

export default function TalentDashboard() {
  const [recalculating, setRecalculating] = useState(false);

  const handleRecalculate = () => {
    setRecalculating(true);
    // Simulate hitting POST /talent/{user_id}/score/recalculate
    setTimeout(() => {
      setRecalculating(false);
    }, 2000);
  };

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Talent Portal</h1>
          <p className="text-muted-foreground mt-1">Replace your resume with verified proof.</p>
        </div>
        <Button onClick={handleRecalculate} disabled={recalculating} className="bg-gradient-to-r from-blue-600 to-indigo-600">
          {recalculating ? "Recalculating AI Score..." : "Recalculate Proof Score"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        {/* Main Column */}
        <div className="space-y-6">
          {/* Proof Score Hero Card */}
          <Card className="border-2 border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck className="w-48 h-48" />
            </div>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Target className="w-6 h-6 text-indigo-500" />
                Global Proof Score
              </CardTitle>
              <CardDescription>Your verified reputation across all domains</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center justify-center w-40 h-40 rounded-full border-8 border-indigo-500 bg-background shadow-xl">
                  <span className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-br from-indigo-500 to-purple-600">
                    {mockProofScore.global_score}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold mt-1 uppercase tracking-widest">Top 5%</span>
                </div>
                
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Frontend</span>
                      <span className="font-bold text-indigo-600">{mockProofScore.domain_scores.frontend}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Backend</span>
                      <span className="font-bold text-blue-600">{mockProofScore.domain_scores.backend}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '71%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">System Design</span>
                      <span className="font-bold text-purple-600">{mockProofScore.domain_scores.system_design}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verified Skills */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl">Verified Skills</CardTitle>
                <CardDescription>Skills backed by AI assessments and GitHub analysis</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Fully Verified
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {mockVerifiedSkills.map(skill => (
                  <div key={skill.id} className="flex justify-between items-center p-3 rounded-lg border bg-card">
                    <div>
                      <h4 className="font-semibold">{skill.skill}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono">{skill.source}</p>
                    </div>
                    <Badge variant={skill.level === "EXPERT" ? "default" : "outline"}>
                      {skill.level}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Assessments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Advanced React Patterns</p>
                  <p className="text-xs text-muted-foreground">Score: 94% • 2 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-purple-50 dark:bg-purple-900/20 text-purple-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Distributed Systems</p>
                  <p className="text-xs text-muted-foreground">Score: 88% • 1 week ago</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full text-xs" size="sm">
                View All History <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Applications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Stripe</span>
                </div>
                <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600">Technical Interview</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Netflix</span>
                </div>
                <Badge variant="outline" className="text-xs">AI Screening</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
