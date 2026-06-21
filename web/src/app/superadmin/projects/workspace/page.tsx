"use client";

import React from "react";
import { 
  LayoutDashboard, Plus, Search, Filter, FolderOpen, Briefcase, Users,
  Clock, CheckCircle2, AlertTriangle, TrendingUp, BarChart3, Star, MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const mockProjects = [
  { id: "PRJ-101", name: "Q4 Marketing Campaign", team: "Marketing", status: "On Track", progress: 75, members: 8, due: "Dec 15, 2026", favorite: true },
  { id: "PRJ-102", name: "Enterprise HRMS Launch", team: "Engineering", status: "At Risk", progress: 60, members: 12, due: "Nov 30, 2026", favorite: true },
  { id: "PRJ-103", name: "Sales Kickoff 2027", team: "Sales", status: "Planning", progress: 10, members: 4, due: "Jan 10, 2027", favorite: false },
  { id: "PRJ-104", name: "Compliance Audit v2", team: "Legal", status: "On Track", progress: 40, members: 3, due: "Oct 25, 2026", favorite: true },
];

const mockActivity = [
  { id: 1, user: "Sarah Jenkins", action: "completed task", target: "Finalize budget approval", time: "10 mins ago", project: "Q4 Marketing Campaign" },
  { id: 2, user: "Michael Chang", action: "commented on", target: "UI Mockups", time: "1 hour ago", project: "Enterprise HRMS Launch" },
  { id: 3, user: "David Foster", action: "created new epic", target: "Vendor Negotiation", time: "2 hours ago", project: "Sales Kickoff 2027" },
];

export default function WorkspaceDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspace Overview</h1>
          <p className="text-muted-foreground mt-1">Cross-functional visibility across all active projects and portfolios.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><FolderOpen className="w-4 h-4 mr-2" /> Browse Portfolios</Button>
          <Button><Plus className="w-4 h-4 mr-2" /> New Project</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" /> Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-emerald-500">
              <TrendingUp className="w-3 h-3 mr-1" /> +3 this week
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Tasks Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">186</div>
            <p className="text-xs text-muted-foreground mt-1">Across all projects</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" /> Time Logged
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">420h</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <BarChart3 className="w-3 h-3 mr-1" /> Billable: 380h
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> At Risk Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Favorite Projects</CardTitle>
                <CardDescription>Your pinned workspaces and ongoing projects.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search projects..." className="pl-9 bg-muted/50 h-9" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {mockProjects.filter(p => p.favorite).map(project => (
                  <div key={project.id} className="p-4 rounded-xl border border-border/50 bg-card hover:shadow-md transition-all group cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          <FolderOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{project.name}</h3>
                          <p className="text-xs text-muted-foreground">{project.team}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500 hover:bg-amber-500/10"><Star className="w-4 h-4 fill-amber-500" /></Button>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1.5" />
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t border-border/50">
                      <div className="flex -space-x-2">
                        {[...Array(Math.min(project.members, 3))].map((_, i) => (
                          <Avatar key={i} className="h-6 w-6 border-2 border-background">
                            <AvatarFallback className="text-[8px] bg-primary/20 text-primary">U{i}</AvatarFallback>
                          </Avatar>
                        ))}
                        {project.members > 3 && (
                          <div className="h-6 w-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[8px] font-medium text-muted-foreground">
                            +{project.members - 3}
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className={
                        project.status === "On Track" ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/10" :
                        "text-amber-500 border-amber-500/20 bg-amber-500/10"
                      }>{project.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates across your workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockActivity.map(activity => (
                  <div key={activity.id} className="flex gap-4">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">{activity.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{" "}
                        <span className="text-muted-foreground">{activity.action}</span>{" "}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <FolderOpen className="w-3 h-3" />
                        <span>{activity.project}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-sm text-muted-foreground">View all activity</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
