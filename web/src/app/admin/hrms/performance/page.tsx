"use client";

import React, { useState } from "react";
import { 
  Target, TrendingUp, Award, Calendar, ChevronRight, MessageSquare, Plus, BrainCircuit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const upcomingReviews = [
  { id: "R-001", employee: "Sarah Jenkins", type: "Q3 Performance Review", date: "Oct 25, 2026", status: "Scheduled", manager: "Marcus Johnson", initial: "SJ" },
  { id: "R-002", employee: "David Foster", type: "Annual Review", date: "Nov 02, 2026", status: "Self-Review Pending", manager: "Lisa Thompson", initial: "DF" },
  { id: "R-003", employee: "Emma Wilson", type: "Probation Review (90 Days)", date: "Oct 28, 2026", status: "Drafting", manager: "Anita Desai", initial: "EW" },
];

const companyGoals = [
  { id: "G-001", title: "Launch Enterprise Platform v2.0", progress: 75, status: "On Track", owner: "Engineering" },
  { id: "G-002", title: "Achieve $5M in Q4 ARR", progress: 42, status: "At Risk", owner: "Sales" },
  { id: "G-003", title: "Reduce Churn Rate to <2%", progress: 90, status: "On Track", owner: "Customer Success" },
];

export default function PerformanceCenterPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance & Goals</h1>
          <p className="text-muted-foreground mt-1">Manage OKRs, performance reviews, and continuous feedback.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><MessageSquare className="w-4 h-4 mr-2" /> Request Feedback</Button>
          <Button><Plus className="w-4 h-4 mr-2" /> Create Review Cycle</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Company OKRs (Q4 2026)</CardTitle>
                <CardDescription>Top-level organizational objectives</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">View All</Button>
            </CardHeader>
            <CardContent className="space-y-6 mt-4">
              {companyGoals.map(goal => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-foreground">{goal.title}</span>
                    <Badge variant="outline" className={
                      goal.status === "On Track" ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/10" : "text-amber-500 border-amber-500/20 bg-amber-500/10"
                    }>{goal.status}</Badge>
                  </div>
                  <Progress value={goal.progress} className={`h-2 ${goal.status === 'At Risk' ? '[&>div]:bg-amber-500' : ''}`} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Owned by: {goal.owner}</span>
                    <span>{goal.progress}% completed</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="flex items-center">
                  <BrainCircuit className="w-5 h-5 mr-2 text-primary" />
                  AI Performance Insights
                </CardTitle>
                <CardDescription>Generated from continuous feedback and goal tracking</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-foreground/90 leading-relaxed">
                <p>Based on the current trajectory, the <strong>Engineering department</strong> has shown a 24% increase in velocity. However, <strong>Sales</strong> is trending behind the Q4 ARR target. AI recommends triggering mid-quarter check-ins for the Sales team and adjusting the pipeline forecast.</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" size="sm" className="bg-background">Schedule Check-ins</Button>
                  <Button variant="secondary" size="sm" className="bg-background">View Detailed Analysis</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 space-y-6">
          <Card className="border-border/50 shadow-sm bg-card h-full">
            <CardHeader>
              <CardTitle>Upcoming Reviews</CardTitle>
              <CardDescription>Action required soon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 mt-2">
              {upcomingReviews.map((review) => (
                <div key={review.id} className="group relative p-4 rounded-xl border border-border/50 hover:border-primary/40 transition-colors bg-muted/20">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="secondary" className="bg-background text-xs font-normal">
                      {review.date}
                    </Badge>
                    <Badge variant="outline" className={
                      review.status === "Scheduled" ? "text-blue-500 border-blue-500/20 bg-blue-500/10" : 
                      review.status === "Drafting" ? "text-amber-500 border-amber-500/20 bg-amber-500/10" :
                      "text-rose-500 border-rose-500/20 bg-rose-500/10"
                    }>
                      {review.status}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{review.type}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Avatar className="w-5 h-5">
                      <AvatarFallback className="text-[8px] bg-primary/10 text-primary">{review.initial}</AvatarFallback>
                    </Avatar>
                    <span>{review.employee}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-4 bg-background justify-between">
                    Open Review <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
