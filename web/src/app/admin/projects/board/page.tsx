"use client";

import React, { useState } from "react";
import { 
  Kanban, Plus, Search, Filter, MoreHorizontal, User, Paperclip, 
  MessageSquare, Calendar, ChevronDown, Flame, LayoutList, AlignLeft, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const initialColumns = [
  {
    id: "backlog",
    title: "Backlog",
    tasks: [
      { id: "TASK-1024", title: "Design System Tokens", type: "Task", priority: "Medium", assignee: "SJ", comments: 4, attachments: 2 },
      { id: "TASK-1025", title: "API Rate Limiting", type: "Story", priority: "High", assignee: "DF", comments: 1, attachments: 0 },
      { id: "TASK-1026", title: "Update Terms of Service", type: "Task", priority: "Low", assignee: "MC", comments: 0, attachments: 1 },
    ]
  },
  {
    id: "todo",
    title: "To Do",
    tasks: [
      { id: "TASK-1021", title: "User Onboarding Flow", type: "Story", priority: "High", assignee: "SJ", comments: 12, attachments: 3 },
      { id: "TASK-1022", title: "Fix Navigation Bug on Mobile", type: "Bug", priority: "Urgent", assignee: "AD", comments: 5, attachments: 1 },
    ]
  },
  {
    id: "in_progress",
    title: "In Progress",
    tasks: [
      { id: "TASK-1018", title: "Dashboard Analytics Widgets", type: "Story", priority: "High", assignee: "DF", comments: 8, attachments: 4 },
    ]
  },
  {
    id: "review",
    title: "In Review",
    tasks: [
      { id: "TASK-1015", title: "OAuth Integration", type: "Task", priority: "Medium", assignee: "MC", comments: 22, attachments: 0 },
    ]
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      { id: "TASK-1010", title: "Database Migration", type: "Task", priority: "High", assignee: "SJ", comments: 4, attachments: 0 },
      { id: "TASK-1011", title: "Stripe Webhooks", type: "Story", priority: "Medium", assignee: "AD", comments: 2, attachments: 0 },
    ]
  }
];

export default function BoardPage() {
  const [columns, setColumns] = useState(initialColumns);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredColumns = columns.map(col => ({
    ...col,
    tasks: col.tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      task.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }));

  return (
    <div className="p-6 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Q4 Engineering Sprint</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Sprint 14</Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">Oct 1 - Oct 14, 2026 • 24 Story Points Remaining</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center bg-muted/50 rounded-lg p-1 mr-2">
            <Button variant="ghost" size="sm" className="bg-background shadow-sm h-8 px-3 rounded-md">
              <Kanban className="w-4 h-4 mr-2" /> Board
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-3 text-muted-foreground">
              <LayoutList className="w-4 h-4 mr-2" /> List
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-3 text-muted-foreground hidden sm:flex">
              <Calendar className="w-4 h-4 mr-2" /> Timeline
            </Button>
          </div>
          
          <div className="flex -space-x-2 mr-2">
            {["SJ", "DF", "MC", "AD"].map((initial, i) => (
              <Avatar key={i} className="h-8 w-8 border-2 border-background cursor-pointer hover:z-10 relative">
                <AvatarFallback className="bg-primary/10 text-primary text-[10px]">{initial}</AvatarFallback>
              </Avatar>
            ))}
          </div>

          <Button><Plus className="w-4 h-4 mr-2" /> Create Issue</Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-9 h-9 bg-muted/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button variant="outline" size="sm" className="h-9 hidden sm:flex">
            Epic <ChevronDown className="w-3 h-3 ml-2" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 h-full min-w-max">
          {filteredColumns.map(column => (
            <div key={column.id} className="w-80 flex flex-col bg-muted/30 rounded-xl border border-border/50">
              <div className="p-3 flex items-center justify-between shrink-0 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{column.title}</h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {column.tasks.length}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6"><Plus className="w-4 h-4" /></Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Add Task</DropdownMenuItem>
                      <DropdownMenuItem>Sort column</DropdownMenuItem>
                      <DropdownMenuItem className="text-rose-500">Clear column</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
                {column.tasks.map(task => (
                  <div key={task.id} className="bg-card p-3 rounded-lg border border-border shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-grab active:cursor-grabbing group">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-[10px] font-normal uppercase tracking-wider bg-background border-border">
                        {task.id}
                      </Badge>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <h4 className="text-sm font-medium mb-3 leading-snug">{task.title}</h4>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          {task.type === "Bug" ? <Flame className="w-3.5 h-3.5 text-rose-500" /> : 
                           task.type === "Story" ? <AlignLeft className="w-3.5 h-3.5 text-emerald-500" /> : 
                           <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
                        </div>
                        {task.priority === "Urgent" || task.priority === "High" ? (
                          <div className="flex gap-0.5">
                            <div className="w-1.5 h-2.5 bg-rose-500 rounded-sm" />
                            <div className="w-1.5 h-2.5 bg-rose-500 rounded-sm" />
                            <div className="w-1.5 h-2.5 bg-rose-500 rounded-sm" />
                          </div>
                        ) : task.priority === "Medium" ? (
                          <div className="flex gap-0.5">
                            <div className="w-1.5 h-2.5 bg-amber-500 rounded-sm" />
                            <div className="w-1.5 h-2.5 bg-amber-500 rounded-sm" />
                            <div className="w-1.5 h-2.5 bg-muted rounded-sm" />
                          </div>
                        ) : (
                          <div className="flex gap-0.5">
                            <div className="w-1.5 h-2.5 bg-blue-500 rounded-sm" />
                            <div className="w-1.5 h-2.5 bg-muted rounded-sm" />
                            <div className="w-1.5 h-2.5 bg-muted rounded-sm" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {(task.comments > 0 || task.attachments > 0) && (
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            {task.comments > 0 && <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{task.comments}</span>}
                            {task.attachments > 0 && <span className="flex items-center gap-1"><Paperclip className="w-3 h-3" />{task.attachments}</span>}
                          </div>
                        )}
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-primary/10 text-primary text-[10px]">{task.assignee}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="w-80 flex shrink-0">
            <Button variant="outline" className="w-full h-12 border-dashed bg-transparent hover:bg-muted/50 text-muted-foreground">
              <Plus className="w-4 h-4 mr-2" /> Add Column
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
