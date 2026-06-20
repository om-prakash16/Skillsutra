"use client";

import React, { useState } from "react";
import { 
  Globe, Plus, Search, Filter, ExternalLink, Settings,
  Users, Layers, FileImage, LayoutTemplate, Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mockPortals = [
  { id: "prt-1", name: "Vendor Management Portal", domain: "vendors.enterprise.com", users: 1420, status: "Active", theme: "Light", pages: 12 },
  { id: "prt-2", name: "Certified Partner Hub", domain: "partners.enterprise.com", users: 840, status: "Active", theme: "Dark", pages: 8 },
  { id: "prt-3", name: "Alumni Network", domain: "alumni.enterprise.com", users: 5120, status: "Maintenance", theme: "Custom", pages: 4 },
];

export default function PartnerPortalsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partner & Customer Portals</h1>
          <p className="text-muted-foreground mt-1">Configure walled-off, white-labeled web portals for your external stakeholders.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><LayoutTemplate className="w-4 h-4 mr-2" /> Templates</Button>
          <Button><Plus className="w-4 h-4 mr-2" /> Create Portal</Button>
        </div>
      </div>

      <div className="flex justify-between items-center bg-muted/30 p-2 rounded-lg border border-border/50">
        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search portals..."
              className="pl-9 h-9 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 bg-background"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPortals.map((portal) => (
          <Card key={portal.id} className="border-border/50 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="outline" className={
                  portal.status === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                  "bg-amber-500/10 text-amber-600 border-amber-500/20"
                }>
                  {portal.status}
                </Badge>
              </div>
              <CardTitle className="text-lg">{portal.name}</CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <span className="font-mono">{portal.domain}</span>
                <Button variant="ghost" size="icon" className="h-5 w-5"><Copy className="w-3 h-3" /></Button>
              </div>
            </CardHeader>
            <CardContent className="pb-4 flex-1">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Active Users</p>
                  <p className="text-sm font-medium flex items-center gap-1"><Users className="w-3.5 h-3.5 text-muted-foreground" /> {portal.users.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Published Pages</p>
                  <p className="text-sm font-medium flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-muted-foreground" /> {portal.pages}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t border-border/10 flex gap-2">
              <Button variant="default" className="flex-1" size="sm">
                <LayoutTemplate className="w-4 h-4 mr-2" /> Open Builder
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Settings className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </Button>
            </CardFooter>
          </Card>
        ))}

        {/* Empty State / Create New Card */}
        <Card className="border-border/50 border-dashed shadow-none bg-transparent hover:bg-muted/10 transition-colors cursor-pointer flex flex-col items-center justify-center p-6 min-h-[280px]">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-1">Create New Portal</h3>
          <p className="text-sm text-center text-muted-foreground mb-4">Spin up a new white-labeled portal in minutes using our Visual Builder.</p>
          <Button variant="outline">Browse Templates</Button>
        </Card>
      </div>
    </div>
  );
}
