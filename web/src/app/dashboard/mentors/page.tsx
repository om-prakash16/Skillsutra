"use client";

import React from "react";
import { Star, Video, MessageSquare, Clock, ShieldCheck, Search, Filter } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockMentors = [
  {
    id: "m1",
    name: "Dr. Elena Rostova",
    role: "Principal AI Engineer at Google DeepMind",
    rating: 4.98,
    reviews: 142,
    rate: "$250/hr",
    tags: ["Machine Learning", "System Design", "Career Advice"],
    available: "Available Tomorrow",
    verified: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena"
  },
  {
    id: "m2",
    name: "Marcus Chen",
    role: "Staff Software Engineer at Stripe",
    rating: 4.95,
    reviews: 89,
    rate: "$180/hr",
    tags: ["React", "FastAPI", "Startup Architecture"],
    available: "Available Today",
    verified: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
  },
  {
    id: "m3",
    name: "Sarah Jenkins",
    role: "Engineering Manager at Netflix",
    rating: 5.0,
    reviews: 210,
    rate: "$300/hr",
    tags: ["Leadership", "Interview Prep", "System Design"],
    available: "Available Next Week",
    verified: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  }
];

export default function MentorshipMarketplace() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mentorship Hub</h1>
          <p className="text-muted-foreground mt-1">1-on-1 guidance from top 1% engineers.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">Become a Mentor</Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search by skill, company, or name... e.g., 'System Design at Google'" 
          className="w-full pl-10 pr-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {["All Mentors", "Interview Prep", "System Design", "Career Growth", "Frontend", "Backend", "AI/ML"].map(cat => (
          <Badge key={cat} variant={cat === "All Mentors" ? "default" : "outline"} className={cat === "All Mentors" ? "bg-slate-900" : "bg-white text-slate-600 cursor-pointer hover:bg-slate-100 px-4 py-2 text-sm"}>
            {cat}
          </Badge>
        ))}
      </div>

      {/* Mentor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMentors.map(mentor => (
          <Card key={mentor.id} className="hover:shadow-lg transition-all border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <img src={mentor.avatar} alt={mentor.name} className="w-16 h-16 rounded-full border bg-slate-100" />
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-1">
                    {mentor.name}
                    {mentor.verified && <ShieldCheck className="w-4 h-4 text-indigo-500" />}
                  </h3>
                  <p className="text-sm text-indigo-600 font-medium line-clamp-1">{mentor.role}</p>
                  <div className="flex items-center gap-1 mt-1 text-sm font-medium text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" /> {mentor.rating} <span className="text-muted-foreground text-xs">({mentor.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {mentor.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-600">{tag}</Badge>
                ))}
              </div>

              <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {mentor.available}
                </span>
                <span className="font-bold text-lg">{mentor.rate}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="w-full"><MessageSquare className="w-4 h-4 mr-2" /> Message</Button>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700"><Video className="w-4 h-4 mr-2" /> Book</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
