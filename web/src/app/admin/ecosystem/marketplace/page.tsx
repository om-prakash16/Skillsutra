"use client";

import React, { useState } from "react";
import { 
  Store, Search, Filter, Star, Download, ChevronRight, 
  Layers, Zap, Bot, ShieldCheck, Plus, CheckCircle2,
  Calendar, CreditCard, MessageSquare, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockApps = [
  { id: "app-1", name: "Slack Notifications", provider: "Slack Tech", icon: MessageSquare, category: "Communication", rating: 4.8, reviews: 1240, installs: "50k+", price: "Free", installed: true, verified: true },
  { id: "app-2", name: "Salesforce Connector", provider: "CRM Connect", icon: Briefcase, category: "Sales & CRM", rating: 4.5, reviews: 842, installs: "10k+", price: "$49/mo", installed: false, verified: true },
  { id: "app-3", name: "Google Calendar Sync", provider: "Google", icon: Calendar, category: "Productivity", rating: 4.9, reviews: 3420, installs: "100k+", price: "Free", installed: true, verified: true },
  { id: "app-4", name: "Stripe Billing Sync", provider: "Stripe", icon: CreditCard, category: "Finance", rating: 4.7, reviews: 512, installs: "25k+", price: "Free", installed: false, verified: true },
  { id: "app-5", name: "AI Resume Screener", provider: "OpenAI Labs", icon: Bot, category: "HR & Recruitment", rating: 4.2, reviews: 128, installs: "5k+", price: "$99/mo", installed: false, verified: false },
  { id: "app-6", name: "Zapier Automations", provider: "Zapier", icon: Zap, category: "Workflow", rating: 4.6, reviews: 2150, installs: "75k+", price: "Free to Install", installed: false, verified: true },
];

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredApps = mockApps.filter(app => 
    (activeCategory === "all" || app.category.toLowerCase().includes(activeCategory.toLowerCase())) &&
    (app.name.toLowerCase().includes(searchTerm.toLowerCase()) || app.provider.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* Hero Banner Section */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <Badge className="bg-white/20 text-white hover:bg-white/30 border-none mb-4 backdrop-blur-md">Enterprise App Store</Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Extend your platform with powerful apps.</h1>
          <p className="text-white/80 text-lg mb-6">Discover thousands of plugins, integrations, and AI agents built by our community and certified partners. Instantly install tools that fit your unique workflows.</p>
          <div className="flex gap-3">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
              <Input
                placeholder="Search apps, plugins, and providers..."
                className="pl-10 h-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-md focus-visible:ring-white/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="secondary" className="h-10 px-6 font-semibold shadow-sm">Search</Button>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute -right-20 -top-20 w-[400px] h-[400px]">
            <path fill="#ffffff" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46C87.4,-32.9,90,-16.4,88.7,-0.7C87.4,14.9,82.2,29.9,73.7,42.5C65.2,55.1,53.4,65.3,40,72.4C26.6,79.5,11.3,83.5,-3.6,89.5C-18.5,95.5,-37,103.5,-51.2,97.7C-65.4,91.9,-75.3,72.3,-82.1,53C-88.9,33.7,-92.6,14.8,-90.6,-3.3C-88.6,-21.4,-80.9,-38.7,-70,-52C-59.1,-65.3,-45,-74.6,-30.7,-81.1C-16.4,-87.6,-2,-91.3,11.5,-89.4C25,-87.5,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100) scale(1.1)" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Categories */}
        <div className="w-full md:w-64 shrink-0 space-y-6">
          <div>
            <h3 className="font-semibold mb-3 text-sm tracking-tight text-muted-foreground uppercase">Categories</h3>
            <div className="space-y-1">
              {["All", "Communication", "Sales & CRM", "Productivity", "Finance", "HR & Recruitment", "Workflow", "Developer Tools"].map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category.toLowerCase())}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeCategory === category.toLowerCase() ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3 text-sm tracking-tight text-muted-foreground uppercase">Collections</h3>
            <div className="space-y-3">
              <Card className="border-border/50 bg-muted/20 hover:border-primary/40 transition-colors cursor-pointer group shadow-none overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-colors">
                  <Bot className="w-8 h-8 text-blue-500" />
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium">AI & Automation</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">24 apps</p>
                </div>
              </Card>
              <Card className="border-border/50 bg-muted/20 hover:border-primary/40 transition-colors cursor-pointer group shadow-none overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 flex items-center justify-center group-hover:from-emerald-500/30 group-hover:to-teal-500/30 transition-colors">
                  <Layers className="w-8 h-8 text-emerald-500" />
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium">Essential Workflows</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">18 apps</p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* App Grid */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{activeCategory === "all" ? "Recommended for you" : `Apps in ${activeCategory}`}</h2>
            <Button variant="outline" size="sm" className="h-8"><Filter className="w-3.5 h-3.5 mr-2" /> Sort & Filter</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApps.map((app) => (
              <Card key={app.id} className="border-border/50 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col group cursor-pointer">
                <CardHeader className="pb-4 relative">
                  <div className="absolute right-4 top-4">
                    {app.installed ? (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 font-normal">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Installed
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="font-normal text-muted-foreground">
                        {app.price}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="w-12 h-12 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center mb-3 group-hover:bg-primary/5 transition-colors">
                    <app.icon className="w-6 h-6 text-foreground/80 group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-base line-clamp-1">{app.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs mt-1">
                    By {app.provider} 
                    {app.verified && <ShieldCheck className="w-3 h-3 text-blue-500" />}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4 flex-1">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center text-amber-500">
                      <Star className="w-3 h-3 fill-amber-500 mr-1" />
                      <span className="font-medium">{app.rating}</span>
                      <span className="text-muted-foreground ml-1">({app.reviews})</span>
                    </div>
                    <div className="flex items-center">
                      <Download className="w-3 h-3 mr-1" /> {app.installs}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    Seamlessly connect your platform data directly to {app.name} to automate your daily operational workflows.
                  </p>
                </CardContent>
                <CardFooter className="pt-0 border-t border-border/10">
                  <Button variant={app.installed ? "secondary" : "default"} className="w-full mt-4" size="sm">
                    {app.installed ? "Configure App" : "Install App"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredApps.length === 0 && (
            <div className="text-center py-12 border border-dashed border-border/50 rounded-xl bg-muted/10">
              <Store className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No apps found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">We couldn't find any apps matching your search criteria in this category.</p>
              <Button variant="outline" className="mt-4" onClick={() => {setSearchTerm(""); setActiveCategory("all");}}>Clear Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
