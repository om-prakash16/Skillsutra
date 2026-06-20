"use client";

import React, { useState } from "react";
import { MessageSquare, ArrowBigUp, ArrowBigDown, Share2, TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const mockPosts = [
  {
    id: "p1",
    author: "Alice Johnson",
    role: "Frontend Lead",
    title: "Thoughts on React 19 Compiler?",
    content: "Is anyone using it in production yet? I'm seeing some weird edge cases when combining it with complex Zustand stores. Would love to hear your experiences.",
    upvotes: 42,
    comments: 15,
    time: "2 hours ago"
  },
  {
    id: "p2",
    author: "David Chen",
    role: "Engineering Manager",
    title: "AMA: Hiring Manager at Stripe - Ask me about System Design Interviews",
    content: "Hi everyone! I've conducted over 200 system design interviews. I'll be answering questions here for the next 2 hours. Drop your questions below!",
    upvotes: 128,
    comments: 45,
    time: "4 hours ago"
  }
];

export default function ForumDiscussion({ params }: { params: { id: string } }) {
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set());

  const toggleUpvote = (id: string) => {
    const newSet = new Set(upvoted);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setUpvoted(newSet);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      
      {/* Main Feed */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">React Developers</h1>
          <p className="text-muted-foreground mt-1">12.4k Members • Top 1% Active Community</p>
        </div>

        {/* Create Post Input */}
        <div className="bg-card border rounded-xl p-4 mb-8 flex gap-4 items-center">
          <Avatar>
            <AvatarFallback>YOU</AvatarFallback>
          </Avatar>
          <input 
            type="text" 
            placeholder="Create a new discussion..." 
            className="flex-1 bg-muted/50 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button className="bg-indigo-600 hover:bg-indigo-700">Post</Button>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {mockPosts.map(post => (
            <div key={post.id} className="bg-card border rounded-xl p-4 hover:shadow-sm transition-shadow flex gap-4">
              
              {/* Vote Column */}
              <div className="flex flex-col items-center gap-1">
                <button onClick={() => toggleUpvote(post.id)} className={`hover:bg-muted p-1 rounded transition-colors ${upvoted.has(post.id) ? 'text-indigo-600' : 'text-muted-foreground'}`}>
                  <ArrowBigUp className={`w-6 h-6 ${upvoted.has(post.id) ? 'fill-indigo-600' : ''}`} />
                </button>
                <span className={`font-bold text-sm ${upvoted.has(post.id) ? 'text-indigo-600' : ''}`}>
                  {post.upvotes + (upvoted.has(post.id) ? 1 : 0)}
                </span>
                <button className="text-muted-foreground hover:bg-muted p-1 rounded transition-colors">
                  <ArrowBigDown className="w-6 h-6" />
                </button>
              </div>

              {/* Content Column */}
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <span className="font-semibold text-foreground">{post.author}</span>
                  <span className="bg-muted px-1.5 py-0.5 rounded">{post.role}</span>
                  <span>• {post.time}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{post.content}</p>
                
                <div className="flex gap-4">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 px-2">
                    <MessageSquare className="w-4 h-4 mr-2" /> {post.comments} Comments
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 px-2">
                    <Share2 className="w-4 h-4 mr-2" /> Share
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block w-80 border-l bg-muted/10 p-6 overflow-y-auto">
        <div className="space-y-8">
          
          {/* About */}
          <div>
            <h3 className="font-bold mb-3 uppercase text-xs tracking-wider text-muted-foreground">About Community</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The premier place for frontend engineers to discuss React architecture, state management, and performance optimization.
            </p>
            <div className="flex gap-2">
              <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">Joined</Button>
            </div>
          </div>

          {/* Trending Topics */}
          <div>
            <h3 className="font-bold mb-3 uppercase text-xs tracking-wider text-muted-foreground">Trending Topics</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium hover:underline cursor-pointer">React 19 Server Actions</p>
                  <p className="text-xs text-muted-foreground">1.2k posts</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium hover:underline cursor-pointer">Zustand vs Redux Toolkit</p>
                  <p className="text-xs text-muted-foreground">845 posts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <h3 className="font-bold mb-3 uppercase text-xs tracking-wider text-muted-foreground">Upcoming Events</h3>
            <div className="bg-card border rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CalendarIcon className="w-4 h-4 text-blue-500" />
                Live Architecture Review
              </div>
              <p className="text-xs text-muted-foreground">Tomorrow, 2:00 PM PST</p>
              <Button variant="outline" size="sm" className="w-full mt-2 h-7 text-xs">Set Reminder</Button>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
