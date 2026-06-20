"use client";

import React from "react";
import Link from "next/link";
import { Users, Lock, Unlock, Hash, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockCommunities = [
  {
    id: "react-devs",
    name: "React Developers",
    description: "Discuss the latest in React, Next.js, and frontend architecture.",
    members: "12.4k",
    isGated: false,
    tags: ["Frontend", "React"]
  },
  {
    id: "staff-eng",
    name: "Staff Engineers Circle",
    description: "Exclusive community for verified Staff+ Engineers.",
    members: "890",
    isGated: true,
    requiredScore: 850,
    tags: ["Leadership", "System Design"]
  },
  {
    id: "yc-founders",
    name: "YC Founders & Alum",
    description: "Networking, fundraising, and product discussions for startup founders.",
    members: "3.2k",
    isGated: true,
    requiredScore: 900,
    tags: ["Startups", "Product"]
  }
];

export default function CommunityHub() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communities</h1>
          <p className="text-muted-foreground mt-1">Join tech circles, participate in AMAs, and grow your network.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Find a community..." 
              className="w-full bg-background border rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <Button variant="outline" className="shrink-0"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockCommunities.map(community => (
          <Card key={community.id} className={`hover:shadow-md transition-shadow ${community.isGated ? 'bg-muted/30 border-dashed' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mb-3">
                  <Hash className="w-6 h-6" />
                </div>
                {community.isGated ? (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    <Lock className="w-3 h-3 mr-1" /> Gated (Score {community.requiredScore}+)
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Unlock className="w-3 h-3 mr-1" /> Public
                  </Badge>
                )}
              </div>
              <h3 className="font-bold text-lg">{community.name}</h3>
              <p className="text-sm text-muted-foreground leading-tight">{community.description}</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {community.members} Members
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {community.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              {community.isGated ? (
                <Button variant="secondary" className="w-full" disabled>Score Too Low to Join</Button>
              ) : (
                <Link href={`/dashboard/communities/${community.id}`} className="w-full">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Enter Community</Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
