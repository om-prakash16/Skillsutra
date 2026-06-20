"use client";

import React, { useState } from "react";
import { 
  CheckSquare, Search, Filter, Calendar, FolderOpen, AlignLeft,
  ChevronDown, MessageSquare, PlayCircle, Clock, Plus, Flame, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockTasks = [
  { id: "TASK-1024", title: "Design System Tokens", project: "Q4 Marketing Campaign", priority: "Medium", due: "Today", status: "In Progress", type: "Task" },
  { id: "TASK-1021", title: "User Onboarding Flow", project: "Enterprise HRMS Launch", priority: "High", due: "Tomorrow", status: "To Do", type: "Story" },
  { id: "TASK-1010", title: "Database Migration", project: "Enterprise HRMS Launch", priority: "Urgent", due: "Oct 10, 2026", status: "Done", type: "Task" },
  { id: "TASK-0955", title: "Prepare Q3 Metrics Deck", project: "Sales Kickoff 2027", priority: "Medium", due: "Next Week", status: "Backlog", type: "Task" },
  { id: "TASK-0842", title: "Update Privacy Policy", project: "Compliance Audit v2", priority: "High", due: "Oct 25, 2026", status: "To Do", type: "Task" },
];

export default function MyTasksPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTasks = mockTasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    task.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage all your assignments across all workspaces and projects.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><CheckCircle2 className="w-4 h-4 mr-2" /> Mark all done</Button>
          <Button><Plus className="w-4 h-4 mr-2" /> Create Task</Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-muted/50 border border-border/50 p-1">
            <TabsTrigger value="list" className="rounded-md px-4"><AlignLeft className="w-4 h-4 mr-2" /> List</TabsTrigger>
            <TabsTrigger value="board" className="rounded-md px-4"><CheckSquare className="w-4 h-4 mr-2" /> Board</TabsTrigger>
            <TabsTrigger value="calendar" className="rounded-md px-4"><Calendar className="w-4 h-4 mr-2" /> Calendar</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-9 h-9 bg-muted/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
          </div>
        </div>

        <TabsContent value="list" className="mt-0">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Task Name</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id} className="group hover:bg-muted/20">
                      <TableCell>
                        <button className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                          ${task.status === "Done" ? "border-emerald-500 bg-emerald-500" : "border-muted-foreground hover:border-primary"}`}>
                          {task.status === "Done" && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className={`font-medium ${task.status === "Done" ? "text-muted-foreground line-through" : "group-hover:text-primary transition-colors cursor-pointer"}`}>
                            {task.title}
                          </span>
                          <span className="text-xs text-muted-foreground">{task.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <FolderOpen className="w-3.5 h-3.5 mr-1.5" /> {task.project}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {task.priority === "Urgent" ? <Flame className="w-3.5 h-3.5 text-rose-500" /> :
                           task.priority === "High" ? <Flame className="w-3.5 h-3.5 text-amber-500" /> : null}
                          <span className="text-sm">{task.priority}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm ${task.due === "Today" ? "text-rose-500 font-medium" : task.due === "Tomorrow" ? "text-amber-500 font-medium" : "text-muted-foreground"}`}>
                          {task.due}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          task.status === "Done" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                          task.status === "In Progress" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                          task.status === "To Do" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                          "bg-muted text-muted-foreground border-border"
                        }>
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {task.status !== "Done" && (
                          <Button variant="ghost" size="sm" className="h-8 text-primary hover:bg-primary/10">
                            <PlayCircle className="w-4 h-4 mr-1.5" /> Start Timer
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredTasks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                        No tasks found. Take a break!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
