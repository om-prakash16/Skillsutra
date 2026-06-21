"use client";

import React, { useState } from "react";
import { 
  HelpCircle, Plus, Search, Filter, FolderOpen, Code, Brain, Target, 
  AlignLeft, PlayCircle, Star, Edit2, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockQuestions = [
  { 
    id: "QB-001", 
    question: "Describe a time when you had to deal with a difficult team member.", 
    category: "Behavioral", 
    type: "Text",
    tags: ["Leadership", "Conflict Resolution", "Communication"],
    level: "All Levels",
    usage: 145,
    rating: 4.8
  },
  { 
    id: "QB-002", 
    question: "Design a URL shortener system like Bitly. Focus on database schema and scaling.", 
    category: "System Design", 
    type: "Whiteboard / Code",
    tags: ["Architecture", "Backend", "Scaling"],
    level: "Senior",
    usage: 82,
    rating: 4.9
  },
  { 
    id: "QB-003", 
    question: "What is your approach to giving constructive feedback to a direct report?", 
    category: "Management", 
    type: "Text",
    tags: ["Management", "Feedback", "Leadership"],
    level: "Manager",
    usage: 45,
    rating: 4.5
  },
  { 
    id: "QB-004", 
    question: "Implement a rate limiter using Redis in your preferred language.", 
    category: "Technical", 
    type: "Code Challenge",
    tags: ["Algorithms", "Redis", "Backend"],
    level: "Intermediate",
    usage: 67,
    rating: 4.7
  },
  { 
    id: "QB-005", 
    question: "Tell me about a project that failed. What did you learn?", 
    category: "Cultural", 
    type: "Video Answer",
    tags: ["Growth Mindset", "Accountability"],
    level: "All Levels",
    usage: 210,
    rating: 4.6
  }
];

export default function QuestionBankPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredQuestions = mockQuestions.filter(q => 
    q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Question Bank</h1>
          <p className="text-muted-foreground mt-1">Standardize interviews with reusable questions, rubrics, and kits.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><FolderOpen className="w-4 h-4 mr-2" /> Interview Kits</Button>
          <Button><Plus className="w-4 h-4 mr-2" /> Create Question</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm bg-card cursor-pointer hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-500" /> Behavioral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card cursor-pointer hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-500" /> Technical & Coding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card cursor-pointer hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-500" /> Cultural Fit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card cursor-pointer hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-amber-500" /> Active Kits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-muted/50 border border-border/50 p-1 mb-4">
          <TabsTrigger value="all" className="rounded-md">All Questions</TabsTrigger>
          <TabsTrigger value="rubrics" className="rounded-md">Evaluation Rubrics</TabsTrigger>
          <TabsTrigger value="kits" className="rounded-md">Interview Kits</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50 mb-4">
              <div className="relative w-full md:w-96 mb-4 md:mb-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions or tags..."
                  className="pl-9 bg-muted/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="mb-4 md:mb-0"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredQuestions.map((q) => (
                <div key={q.id} className="p-4 border border-border/50 rounded-lg hover:border-primary/40 transition-colors bg-card group relative">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-muted text-muted-foreground font-normal">{q.category}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          {q.type === "Text" ? <AlignLeft className="w-3 h-3" /> : 
                           q.type === "Video Answer" ? <PlayCircle className="w-3 h-3" /> : 
                           <Code className="w-3 h-3" />}
                          {q.type}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 border-l border-border pl-2">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {q.rating}
                        </span>
                      </div>
                      
                      <h3 className="text-base font-medium text-foreground">{q.question}</h3>
                      
                      <div className="flex flex-wrap gap-2 pt-1">
                        {q.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs font-normal border-border bg-background">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">{q.level}</Badge>
                      <span className="text-xs text-muted-foreground">Used {q.usage} times</span>
                      
                      <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 className="w-4 h-4 text-muted-foreground" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredQuestions.length === 0 && (
                <div className="h-32 flex items-center justify-center text-muted-foreground border border-dashed border-border/50 rounded-lg">
                  No questions found matching your search.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
