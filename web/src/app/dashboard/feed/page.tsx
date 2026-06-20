"use client";

import React, { useState } from "react";
import { MessageSquare, ThumbsUp, Share2, MoreHorizontal, Briefcase, Award, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mocking the ActivityEvent models from the backend
const mockFeed = [
  {
    id: "post1",
    actor: { name: "Alice Johnson", role: "Frontend Engineer", initials: "AJ" },
    action: "achieved a new",
    target: { type: "PROOF_SCORE", title: "Global Proof Score of 912" },
    content: "Just finished the advanced React and System Design assessments! Thrilled to have my skills cryptographically verified. Open to new roles!",
    timestamp: "2 hours ago",
    likes: 124,
    comments: 18,
    type: "MILESTONE"
  },
  {
    id: "post2",
    actor: { name: "Stripe", role: "Fintech Company", initials: "ST" },
    action: "posted a new",
    target: { type: "JOB", title: "Senior Backend Developer" },
    content: "We are expanding our payments infrastructure team! Looking for engineers with a verified Proof Score of 800+ in Systems Design. Apply instantly with your SkillSutra profile.",
    timestamp: "5 hours ago",
    likes: 342,
    comments: 45,
    type: "JOB"
  },
  {
    id: "post3",
    actor: { name: "David Chen", role: "Technical Recruiter @ Netflix", initials: "DC" },
    action: "is looking for",
    target: { type: "TALENT", title: "Staff Data Engineers" },
    content: "My pipeline is open! If you have strong spark/hadoop experience and want to work on massive scale ML infrastructure, let's connect. I'll be reviewing Proof Portfolios all week.",
    timestamp: "1 day ago",
    likes: 89,
    comments: 12,
    type: "NETWORKING"
  }
];

export default function SocialFeed() {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "MILESTONE": return <Award className="w-4 h-4 text-purple-500" />;
      case "JOB": return <Briefcase className="w-4 h-4 text-blue-500" />;
      case "NETWORKING": return <Users className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Feed</h1>
          <p className="text-muted-foreground mt-1">Discover opportunities, network, and track milestones.</p>
        </div>
      </div>

      {/* New Post Input */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Avatar>
              <AvatarFallback>YOU</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <textarea 
                className="w-full bg-muted/50 rounded-lg border-0 resize-none p-3 focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Share an update, post a job, or ask for an introduction..."
                rows={3}
              />
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><Briefcase className="w-4 h-4 mr-2"/> Link Job</Button>
                  <Button variant="outline" size="sm"><Award className="w-4 h-4 mr-2"/> Share Score</Button>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700">Post</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feed Stream */}
      <div className="space-y-6">
        {mockFeed.map(post => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-indigo-100 text-indigo-700">{post.actor.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold">{post.actor.name}</span>
                      <span className="text-muted-foreground text-sm">{post.action}</span>
                      <span className="font-semibold text-sm">{post.target.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{post.actor.role} • {post.timestamp}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{post.content}</p>
              
              {post.type === "JOB" && (
                <div className="mt-4 p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-900/10 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md text-blue-600">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Senior Backend Developer</h4>
                      <p className="text-xs text-muted-foreground">Stripe • Remote • $180k - $220k</p>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary">Apply Instantly</Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-3 flex justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`flex-1 ${likedPosts.has(post.id) ? 'text-indigo-600 font-semibold' : 'text-muted-foreground'}`}
                onClick={() => toggleLike(post.id)}
              >
                <ThumbsUp className={`w-4 h-4 mr-2 ${likedPosts.has(post.id) ? 'fill-indigo-600' : ''}`} />
                {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground">
                <MessageSquare className="w-4 h-4 mr-2" />
                {post.comments}
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
