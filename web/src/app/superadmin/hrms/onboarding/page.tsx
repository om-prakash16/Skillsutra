"use client";

import React, { useState } from "react";
import { 
  UserPlus, CheckCircle2, Circle, Clock, Mail, ShieldCheck, Laptop, FileText, ChevronRight, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const onboardingQueue = [
  { 
    id: "OB-001", name: "Alex Kumar", role: "Engineering Manager", department: "Engineering", 
    startDate: "Oct 25, 2026", progress: 85, status: "In Progress", initial: "AK",
    tasks: [
      { name: "Offer Accepted", completed: true },
      { name: "Identity Verification", completed: true },
      { name: "Contract Signed", completed: true },
      { name: "IT Provisioning", completed: false },
      { name: "Welcome Email", completed: false },
    ]
  },
  { 
    id: "OB-002", name: "Jessica Smith", role: "Product Designer", department: "Design", 
    startDate: "Oct 28, 2026", progress: 40, status: "Awaiting Action", initial: "JS",
    tasks: [
      { name: "Offer Accepted", completed: true },
      { name: "Identity Verification", completed: true },
      { name: "Contract Signed", completed: false },
      { name: "IT Provisioning", completed: false },
      { name: "Welcome Email", completed: false },
    ]
  },
  { 
    id: "OB-003", name: "Marcus Johnson", role: "Account Executive", department: "Sales", 
    startDate: "Nov 02, 2026", progress: 20, status: "Pre-boarding", initial: "MJ",
    tasks: [
      { name: "Offer Accepted", completed: true },
      { name: "Identity Verification", completed: false },
      { name: "Contract Signed", completed: false },
      { name: "IT Provisioning", completed: false },
      { name: "Welcome Email", completed: false },
    ]
  }
];

export default function OnboardingCenterPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Onboarding Center</h1>
          <p className="text-muted-foreground mt-1">Track new hires from offer acceptance to their first day.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
          <Button><UserPlus className="w-4 h-4 mr-2" /> Add Onboarding Profile</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Total In Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Pre-boarding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">5</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">4</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Completed (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500">8</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="bg-muted/50 border border-border/50 p-1 mb-4">
          <TabsTrigger value="active" className="rounded-md">Active Onboarding</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-md">Completed</TabsTrigger>
          <TabsTrigger value="workflows" className="rounded-md">Workflows & Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {onboardingQueue.map((person) => (
            <Card key={person.id} className="border-border/50 shadow-sm hover:border-primary/30 transition-colors">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Left Side: Profile Info */}
                  <div className="p-6 border-b lg:border-b-0 lg:border-r border-border/50 lg:w-1/3 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-primary/10 text-primary">{person.initial}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-foreground">{person.name}</h3>
                          <p className="text-sm text-muted-foreground">{person.role}</p>
                          <p className="text-xs text-muted-foreground">{person.department}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1 text-sm">
                        <span className="font-medium">Overall Progress</span>
                        <span className="font-bold">{person.progress}%</span>
                      </div>
                      <Progress value={person.progress} className="h-2" />
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Start Date:</span>
                      <span className="font-medium">{person.startDate}</span>
                    </div>

                    <Badge variant="secondary" className={
                      person.status === "In Progress" ? "bg-blue-500/10 text-blue-500" :
                      person.status === "Awaiting Action" ? "bg-amber-500/10 text-amber-500" :
                      "bg-muted text-muted-foreground"
                    }>
                      {person.status}
                    </Badge>
                  </div>

                  {/* Right Side: Checklist */}
                  <div className="p-6 flex-1 flex flex-col justify-center">
                    <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-muted-foreground">Current Workflow Tasks</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {person.tasks.map((task, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground/50 shrink-0" />
                          )}
                          <span className={`text-sm ${task.completed ? 'text-foreground line-through opacity-50' : 'text-foreground font-medium'}`}>
                            {task.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                        View Full Checklist <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
