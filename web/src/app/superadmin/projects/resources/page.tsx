"use client";

import React, { useState } from "react";
import { 
  Users2, Search, Filter, Calendar, Zap, AlertTriangle, 
  ChevronLeft, ChevronRight, BarChart3, Target, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const mockResources = [
  { id: "USR-01", name: "Sarah Jenkins", role: "Frontend Lead", capacity: 40, assigned: 45, allocation: 112, projects: 3, status: "Overbooked" },
  { id: "USR-02", name: "Michael Chang", role: "UX Designer", capacity: 40, assigned: 35, allocation: 87, projects: 2, status: "Optimal" },
  { id: "USR-03", name: "David Foster", role: "Backend Engineer", capacity: 40, assigned: 40, allocation: 100, projects: 2, status: "At Capacity" },
  { id: "USR-04", name: "Anita Desai", role: "Product Manager", capacity: 40, assigned: 20, allocation: 50, projects: 1, status: "Available" },
  { id: "USR-05", name: "James Wilson", role: "QA Engineer", capacity: 32, assigned: 0, allocation: 0, projects: 0, status: "On Leave" },
];

export default function ResourceManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResources = mockResources.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resource Management</h1>
          <p className="text-muted-foreground mt-1">Track team capacity, workloads, and HRMS-linked availability.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><BarChart3 className="w-4 h-4 mr-2" /> Capacity Report</Button>
          <Button><Users2 className="w-4 h-4 mr-2" /> Allocate Resources</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Users2 className="w-4 h-4 text-primary" /> Total Headcount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42</div>
            <p className="text-xs text-muted-foreground mt-1">Active team members</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-500" /> Avg. Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground mt-1 text-emerald-500 font-medium">Optimal range</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" /> Overbooked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">Members &gt; 100% capacity</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" /> Out of Office
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">Synced from HRMS</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50 mb-4">
          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                className="pl-9 h-9 bg-muted/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-border/50 rounded-md p-1 bg-muted/30">
              <Button variant="ghost" size="icon" className="h-7 w-7"><ChevronLeft className="w-4 h-4" /></Button>
              <div className="px-3 text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" /> October 2026
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7"><ChevronRight className="w-4 h-4" /></Button>
            </div>
            <Button variant="outline" size="sm" className="h-9"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="p-4 border border-border/50 rounded-xl bg-card hover:border-primary/40 transition-colors flex flex-col md:flex-row items-start md:items-center gap-6">
                
                <div className="flex items-center gap-4 min-w-[250px]">
                  <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">{resource.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-sm">{resource.name}</h3>
                    <p className="text-xs text-muted-foreground">{resource.role}</p>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{resource.projects} Projects</span>
                    <span>{resource.assigned}h / {resource.capacity}h</span>
                  </div>
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full ${
                        resource.allocation > 100 ? "bg-rose-500" :
                        resource.allocation > 80 ? "bg-emerald-500" :
                        resource.allocation > 0 ? "bg-blue-500" :
                        "bg-transparent"
                      }`}
                      style={{ width: `${Math.min(resource.allocation, 100)}%` }}
                    />
                    {resource.allocation > 100 && (
                      <div 
                        className="absolute top-0 h-full bg-rose-500/50 rounded-r-full stripe-pattern"
                        style={{ left: "100%", width: `${resource.allocation - 100}%` }}
                      />
                    )}
                  </div>
                </div>

                <div className="min-w-[120px] text-right">
                  <Badge variant="outline" className={
                    resource.status === "Overbooked" ? "bg-rose-500/10 text-rose-600 border-rose-500/20" :
                    resource.status === "Optimal" || resource.status === "At Capacity" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                    resource.status === "Available" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                    "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  }>
                    {resource.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    {resource.allocation}% Alloc.
                  </p>
                </div>

              </div>
            ))}
            {filteredResources.length === 0 && (
              <div className="h-32 flex items-center justify-center text-muted-foreground border border-dashed border-border/50 rounded-lg">
                No resources found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
