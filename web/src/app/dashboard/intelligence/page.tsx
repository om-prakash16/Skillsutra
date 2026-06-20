"use client";

import React from "react";
import { Sparkles, TrendingUp, Network, CheckCircle, Search, Target, Users, MapPin, Briefcase } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockMatches = [
  {
    id: "c1",
    name: "Alex Mercer",
    role: "Senior Backend Engineer",
    location: "San Francisco, CA (Hybrid)",
    experience: "8 YOE",
    matchScore: 94,
    status: "OPEN_TO_WORK",
    proofScore: 890,
    skills: ["Python", "AWS", "FastAPI", "Postgres"],
    reasons: [
      "Has a verified Proof Score of 890 in Backend Systems (Top 5%).",
      "Knowledge Graph indicates strong AWS and Docker experience which matches your Job requirements.",
      "Candidate recently solved a distributed locking assessment with a perfect execution score."
    ]
  },
  {
    id: "c2",
    name: "Sarah Jenkins",
    role: "Full Stack Developer",
    location: "Remote",
    experience: "5 YOE",
    matchScore: 82,
    status: "PASSIVE",
    proofScore: 810,
    skills: ["React", "TypeScript", "Node.js", "Redis"],
    reasons: [
      "Strong React skills match Frontend requirements.",
      "Slight gap in Postgres experience, but high aptitude score suggests fast learning."
    ]
  }
];

export default function TalentIntelligence() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-muted/10 min-h-screen">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-indigo-500" /> Talent Intelligence
          </h1>
          <p className="text-muted-foreground mt-1">AI-driven candidate discovery and market trends.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto bg-background border p-1 rounded-lg shadow-sm">
          <Button variant="ghost" className="bg-muted text-foreground">Recommendations</Button>
          <Button variant="ghost" className="text-muted-foreground">Market Trends</Button>
          <Button variant="ghost" className="text-muted-foreground">Saved Searches</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Feed: AI Matches */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" /> Top Matches for "Senior Backend Engineer"
            </h2>
            <Button variant="outline" size="sm"><Search className="w-4 h-4 mr-2" /> Refine Match Criteria</Button>
          </div>

          <div className="space-y-4">
            {mockMatches.map(match => (
              <Card key={match.id} className="border-l-4 overflow-hidden" style={{ borderLeftColor: match.matchScore > 90 ? '#22c55e' : '#f59e0b' }}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    
                    {/* Left: Score & Meta */}
                    <div className="flex flex-col items-center justify-center bg-muted/30 p-4 rounded-xl min-w-[120px]">
                      <div className="relative flex items-center justify-center w-20 h-20">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-muted stroke-current"
                            strokeWidth="3" fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className={`${match.matchScore > 90 ? 'text-green-500' : 'text-amber-500'} stroke-current`}
                            strokeWidth="3" fill="none"
                            strokeDasharray={`${match.matchScore}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-2xl font-black">{match.matchScore}</span>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Match</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={`mt-3 ${match.status === 'OPEN_TO_WORK' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-700'}`}>
                        {match.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>

                    {/* Middle: Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold">{match.name}</h3>
                          <p className="font-medium text-indigo-600">{match.role}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">Reach Out</Button>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 text-sm text-muted-foreground mt-2 mb-4">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {match.location}</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {match.experience}</span>
                      </div>

                      <div className="flex gap-2 flex-wrap mb-4">
                        {match.skills.map(skill => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AI Explainability Box */}
                  <div className="mt-4 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 rounded-lg p-4">
                    <h4 className="text-sm font-bold flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-400">
                      <Sparkles className="w-4 h-4" /> Why AI Recommended This Candidate
                    </h4>
                    <ul className="space-y-1.5">
                      {match.reasons.map((reason, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar: Market Insights */}
        <div className="space-y-6">
          
          {/* Trending Tech */}
          <Card>
            <CardHeader className="pb-3">
              <h3 className="font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" /> Trending Skills
              </h3>
              <p className="text-xs text-muted-foreground">Based on global search volume</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Rust</span>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">+45%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">FastAPI</span>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">+32%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">LLM Ops</span>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">+120%</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Graph Snapshot */}
          <Card>
            <CardHeader className="pb-3">
              <h3 className="font-bold flex items-center gap-2">
                <Network className="w-5 h-5 text-purple-500" /> Skill Graph Intelligence
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                When hiring for <span className="font-bold text-foreground">Python</span>, our Knowledge Graph suggests looking for:
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-purple-200">Django</Badge>
                <Badge variant="outline" className="border-purple-200">FastAPI</Badge>
                <Badge variant="outline" className="border-purple-200">Docker</Badge>
                <Badge variant="outline" className="border-purple-200">Postgres</Badge>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
