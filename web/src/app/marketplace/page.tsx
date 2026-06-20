"use client";

import React, { useState } from "react";
import { Store, Search, Filter, CheckCircle2, Download, ShieldCheck, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockApps = [
  { id: 1, name: "Zoom Meetings", category: "Video Interviews", developer: "Zoom Video Communications", rating: 4.8, installs: "125k+", icon: "📸", installed: true },
  { id: 2, name: "Greenhouse ATS Sync", category: "HR Tools", developer: "SkillSutra Partners", rating: 4.9, installs: "12k+", icon: "🌱", installed: false },
  { id: 3, name: "HackerRank Assessments", category: "Assessments", developer: "HackerRank", rating: 4.7, installs: "45k+", icon: "💻", installed: false },
  { id: 4, name: "Slack Notifications", category: "Productivity", developer: "Slack Technologies", rating: 4.9, installs: "200k+", icon: "💬", installed: true },
  { id: 5, name: "Checkr Background Sync", category: "Verification", developer: "Checkr Inc.", rating: 4.6, installs: "8k+", icon: "🔍", installed: false },
  { id: 6, name: "Calendly Scheduler", category: "Productivity", developer: "Calendly LLC", rating: 4.8, installs: "150k+", icon: "📅", installed: false }
];

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApps = mockApps.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-slate-50 min-h-screen">
      
      {/* Hero Header */}
      <div className="bg-indigo-900 rounded-xl p-8 text-white mb-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2 mb-4">
            <Store className="w-10 h-10 text-indigo-400" /> Integration Marketplace
          </h1>
          <p className="text-indigo-200 text-lg mb-6">
            Extend your SkillSutra workspace. Connect your favorite ATS, video interviewing, and assessment tools with one click.
          </p>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search for apps, tools, or developers..." 
              className="w-full pl-10 pr-4 py-3 rounded-lg text-slate-900 border-0 focus:ring-2 focus:ring-indigo-500 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {/* Decorative Background */}
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-indigo-800 to-transparent opacity-50 skew-x-12 transform translate-x-1/4"></div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0 space-y-6">
          <div>
            <h3 className="font-bold mb-3 flex items-center gap-2"><Filter className="w-4 h-4" /> Categories</h3>
            <div className="space-y-2">
              {["All Apps", "Assessments", "HR Tools", "Video Interviews", "Productivity", "Verification"].map(cat => (
                <div key={cat} className="flex items-center gap-2">
                  <input type="checkbox" id={cat} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <label htmlFor={cat} className="text-sm text-slate-700 cursor-pointer">{cat}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-6 border-t">
            <h3 className="font-bold mb-3 text-slate-900">For Developers</h3>
            <Button variant="outline" className="w-full justify-start text-indigo-600 border-indigo-200 hover:bg-indigo-50">
              Build an Integration
            </Button>
          </div>
        </div>

        {/* App Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredApps.map(app => (
            <Card key={app.id} className="hover:shadow-md transition-shadow border-slate-200">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-2xl shadow-inner">
                    {app.icon}
                  </div>
                  {app.installed ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Installed
                    </span>
                  ) : null}
                </div>
                
                <h3 className="text-lg font-bold text-slate-900">{app.name}</h3>
                <p className="text-sm text-slate-500 mb-2">{app.category}</p>
                
                <div className="flex items-center gap-1 text-xs text-slate-600 mb-4">
                  <ShieldCheck className="w-3 h-3 text-blue-500" /> By {app.developer}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-6">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {app.rating}</span>
                  <span className="flex items-center gap-1"><Download className="w-3 h-3" /> {app.installs}</span>
                </div>

                <div className="mt-auto">
                  {app.installed ? (
                    <Button variant="outline" className="w-full">Manage Settings</Button>
                  ) : (
                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">Install App</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
