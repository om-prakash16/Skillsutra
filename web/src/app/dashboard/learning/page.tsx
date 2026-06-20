"use client";

import React from "react";
import { BookOpen, PlayCircle, Trophy, Target, ArrowRight, BrainCircuit, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LearningDashboard() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Learning Hub</h1>
        <p className="text-muted-foreground mt-1">Upskill to increase your Proof Score.</p>
      </div>

      {/* AI Recommendation Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <BrainCircuit className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <Badge className="bg-white/20 hover:bg-white/20 text-white border-none mb-3">AI RECOMMENDATION</Badge>
          <h2 className="text-2xl font-bold mb-2">Mastering System Design</h2>
          <p className="text-indigo-100 mb-6">
            Based on your recent Proof Score assessment, you struggled with identifying bottlenecks in distributed databases. We recommend this masterclass to improve your backend score by ~45 points.
          </p>
          <div className="flex gap-3">
            <Button className="bg-white text-indigo-600 hover:bg-indigo-50 border-none font-bold">
              Start Course
            </Button>
            <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
              View Syllabus
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        
        {/* Active Courses */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold">In Progress</h3>
          
          <Card className="hover:border-indigo-500/50 transition-colors">
            <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center shrink-0 border">
                <BookOpen className="w-12 h-12 text-muted-foreground/50" />
              </div>
              <div className="flex-1 w-full space-y-4">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-lg">Advanced React Patterns & Performance</h4>
                    <Badge variant="outline" className="text-green-600 bg-green-50">60% Complete</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Taught by Sarah Jenkins (Ex-Meta)</p>
                </div>
                
                <div className="space-y-1">
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground text-right">4 modules remaining</p>
                </div>
                
                <Button className="w-full md:w-auto"><PlayCircle className="w-4 h-4 mr-2" /> Resume Course</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Goals & Badges */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-500" /> Current Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Reach 900+ Global Score</span>
                  <span className="text-muted-foreground">845 / 900</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" /> Earned Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-1 w-16">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center border-2 border-yellow-400">
                    <Trophy className="w-6 h-6 text-yellow-600" />
                  </div>
                  <span className="text-[10px] text-center font-medium leading-tight">Top 10% React</span>
                </div>
                <div className="flex flex-col items-center gap-1 w-16">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-400">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-[10px] text-center font-medium leading-tight">Verified Profile</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  );
}
