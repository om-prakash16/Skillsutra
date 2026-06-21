"use client";

import React, { useState } from "react";
import { 
  GraduationCap, Plus, Search, Filter, Layers, Zap, Brain, ShieldCheck, 
  Target, BarChart3, ChevronRight, FileCode2, Edit2, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, 
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const mockSkills = [
  { id: "SKL-001", name: "React / Next.js", category: "Technical - Frontend", level: "Advanced", assessors: 4, usedInReqs: 12, status: "Active" },
  { id: "SKL-002", name: "System Design", category: "Technical - Architecture", level: "Expert", assessors: 2, usedInReqs: 8, status: "Active" },
  { id: "SKL-003", name: "B2B Enterprise Sales", category: "Domain - Sales", level: "Advanced", assessors: 5, usedInReqs: 15, status: "Active" },
  { id: "SKL-004", name: "Conflict Resolution", category: "Soft Skill - Leadership", level: "Intermediate", assessors: 8, usedInReqs: 42, status: "Active" },
  { id: "SKL-005", name: "Figma UI/UX", category: "Technical - Design", level: "Advanced", assessors: 3, usedInReqs: 5, status: "Draft" },
  { id: "SKL-006", name: "Go (Golang)", category: "Technical - Backend", level: "Intermediate", assessors: 1, usedInReqs: 2, status: "Active" },
];

export default function SkillsLibraryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSkills = mockSkills.filter(skill => 
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    skill.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills Library</h1>
          <p className="text-muted-foreground mt-1">Standardize required skills and mapping across all ATS requisitions.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Layers className="w-4 h-4 mr-2" /> Taxonomy Settings</Button>
          <Button><Plus className="w-4 h-4 mr-2" /> Add Skill</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm bg-card cursor-pointer hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-blue-500" /> Technical Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card cursor-pointer hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Brain className="w-4 h-4 text-emerald-500" /> Soft Skills & Behavioral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card cursor-pointer hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-500" /> Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card cursor-pointer hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" /> Mapped to Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">210</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search skills or categories..."
              className="pl-9 bg-muted/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Skill Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Expected Proficiency</TableHead>
                <TableHead>Qualified Assessors</TableHead>
                <TableHead>Used in Reqs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSkills.map((skill) => (
                <TableRow key={skill.id} className="group hover:bg-muted/20">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        {skill.category.includes("Technical") ? <FileCode2 className="w-4 h-4" /> : 
                         skill.category.includes("Soft") ? <Brain className="w-4 h-4" /> : 
                         <Zap className="w-4 h-4" />}
                      </div>
                      <span className="font-medium text-sm group-hover:text-primary transition-colors cursor-pointer">{skill.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal bg-muted text-muted-foreground">{skill.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 w-24">
                      <span className="text-xs font-medium">{skill.level}</span>
                      <Progress 
                        value={skill.level === "Expert" ? 100 : skill.level === "Advanced" ? 75 : 50} 
                        className="h-1.5"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {skill.assessors} Interviewers
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {skill.usedInReqs} Jobs
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      skill.status === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                      "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }>
                      {skill.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSkills.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No skills found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
