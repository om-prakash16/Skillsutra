"use client";

import React, { useState } from "react";
import { 
  Clock, Calendar as CalendarIcon, PlayCircle, StopCircle, 
  BarChart3, Download, Plus, Filter, FileText, ChevronLeft, ChevronRight, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockTimeEntries = [
  { id: "TE-001", task: "Design System Tokens", project: "Q4 Marketing Campaign", date: "Today", duration: "2h 30m", billable: true, status: "Draft" },
  { id: "TE-002", task: "Daily Standup", project: "Enterprise HRMS Launch", date: "Today", duration: "30m", billable: false, status: "Submitted" },
  { id: "TE-003", task: "API Rate Limiting", project: "Enterprise HRMS Launch", date: "Yesterday", duration: "4h 15m", billable: true, status: "Approved" },
  { id: "TE-004", task: "Client Kickoff Meeting", project: "Sales Kickoff 2027", date: "Yesterday", duration: "1h 00m", billable: true, status: "Approved" },
  { id: "TE-005", task: "Update Terms of Service", project: "Compliance Audit v2", date: "Oct 15", duration: "3h 45m", billable: true, status: "Invoiced" },
];

export default function TimeTrackingPage() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Time Tracking</h1>
          <p className="text-muted-foreground mt-1">Log hours, manage timesheets, and track billable utilization.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Button><Plus className="w-4 h-4 mr-2" /> Manual Entry</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm bg-card border-l-4 border-l-primary relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10" />
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Active Timer</p>
            <div className="flex justify-between items-end">
              <div className="text-3xl font-bold font-mono text-primary">
                {isTimerRunning ? "01:24:15" : "00:00:00"}
              </div>
              <Button 
                size="icon" 
                variant={isTimerRunning ? "destructive" : "default"} 
                className="h-10 w-10 rounded-full shadow-lg"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
              >
                {isTimerRunning ? <StopCircle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 truncate">
              {isTimerRunning ? "Working on: Design System Tokens" : "No active task"}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" /> Hours This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">32.5h</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-emerald-500 font-medium">85%</span>&nbsp;Utilization
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" /> Billable Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">28.0h</div>
            <p className="text-xs text-muted-foreground mt-1">Out of 32.5 total hours</p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-500" /> Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">14.5h</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting manager review</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-border/50 rounded-md p-1 bg-muted/30">
              <Button variant="ghost" size="icon" className="h-7 w-7"><ChevronLeft className="w-4 h-4" /></Button>
              <div className="px-3 text-sm font-medium flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" /> This Week (Oct 12 - 18)
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7"><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
            <Button variant="outline" size="sm" className="h-9"><FileText className="w-4 h-4 mr-2" /> Submit Timesheet</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Task & Project</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTimeEntries.map((entry) => (
                <TableRow key={entry.id} className="group">
                  <TableCell className="font-medium text-sm">
                    {entry.date}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{entry.task}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{entry.project}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`font-normal ${entry.billable ? 'bg-blue-500/10 text-blue-600' : 'bg-muted'}`}>
                      {entry.billable ? 'Billable' : 'Non-billable'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm font-medium">
                    {entry.duration}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      entry.status === "Approved" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                      entry.status === "Invoiced" ? "bg-purple-500/10 text-purple-600 border-purple-500/20" :
                      entry.status === "Submitted" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                      "bg-muted text-muted-foreground border-border"
                    }>
                      {entry.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.status === "Draft" ? (
                      <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">Edit</Button>
                    ) : (
                      <Button variant="ghost" size="sm" className="text-muted-foreground">View</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
