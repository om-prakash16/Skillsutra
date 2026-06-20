"use client";

import React from "react";
import { MessageSquare, ThumbsUp, Flame, Plus, Users, Hash, Clock, Award } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockPosts = [
  {
    id: "p1",
    title: "How I passed the System Design round at Google (E5)",
    author: "SystemDesignJunkie",
    time: "2 hours ago",
    content: "Just wanted to share my experience. They focused heavily on scaling WebSockets for a chat application. Here is my breakdown...",
    upvotes: 342,
    comments: 89,
    tags: ["System Design", "Google", "Interview"],
    isHot: true
  },
  {
    id: "p2",
    title: "Rust vs Go for the new microservice architecture?",
    author: "BackendWizard",
    time: "5 hours ago",
    content: "My team is debating migrating our core Python monolith. I'm leaning towards Rust for safety, but Go seems to have better developer velocity...",
    upvotes: 128,
    comments: 45,
    tags: ["Rust", "Go", "Architecture"],
    isHot: false
  },
  {
    id: "p3",
    title: "Seeking teammates for the upcoming AI Hackathon!",
    author: "AI_Builder",
    time: "1 day ago",
    content: "Looking for a frontend dev (React/Next.js) to build a multimodal AI agent next weekend. I have the backend sorted out...",
    upvotes: 56,
    comments: 12,
    tags: ["Hackathon", "Collaboration", "React"],
    isHot: false
  }
];

export default function CommunityForums() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Developer Community</h1>
          <p className="text-muted-foreground mt-1">Discuss tech, share interview experiences, and find collaborators.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" /> New Discussion
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Feed */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Feed Filters */}
          <div className="flex gap-2 mb-6 border-b pb-4">
            <Button variant="ghost" className="font-bold text-indigo-600 border-b-2 border-indigo-600 rounded-none px-2"><Flame className="w-4 h-4 mr-2" /> Hot</Button>
            <Button variant="ghost" className="text-muted-foreground px-2"><Clock className="w-4 h-4 mr-2" /> New</Button>
            <Button variant="ghost" className="text-muted-foreground px-2"><Award className="w-4 h-4 mr-2" /> Top</Button>
          </div>

          {/* Posts */}
          {mockPosts.map(post => (
            <Card key={post.id} className="hover:shadow-md transition-all border border-slate-200">
              <CardContent className="p-0 flex">
                
                {/* Voting Sidebar */}
                <div className="w-16 bg-slate-50 border-r border-slate-100 flex flex-col items-center py-4 gap-2 rounded-l-xl">
                  <button className="text-slate-400 hover:text-indigo-600"><ThumbsUp className="w-5 h-5" /></button>
                  <span className="font-bold text-sm text-slate-700">{post.upvotes}</span>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 flex-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="font-medium text-slate-700">@{post.author}</span>
                    <span>•</span>
                    <span>{post.time}</span>
                    {post.isHot && <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none ml-2 text-[10px]">HOT</Badge>}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 cursor-pointer hover:text-indigo-600 transition-colors">{post.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{post.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">#{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-indigo-600 cursor-pointer">
                      <MessageSquare className="w-4 h-4" /> {post.comments} Comments
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                <Hash className="w-4 h-4" /> Trending Topics
              </h3>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {["System Design", "OpenAI API", "React 19", "Tech Layoffs", "LeetCode Tips"].map((topic, idx) => (
                <div key={idx} className="flex justify-between items-center cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-md transition-colors">
                  <span className="font-medium text-slate-700">#{topic}</span>
                  <span className="text-xs text-muted-foreground">{120 - idx*15} posts</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-indigo-50 border-indigo-100">
            <CardContent className="p-6">
              <h3 className="font-bold text-indigo-900 mb-2">Upcoming Hackathon</h3>
              <p className="text-sm text-indigo-700 mb-4">Build an AI Agent in 48 hours. $50k prize pool.</p>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Register Now</Button>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
