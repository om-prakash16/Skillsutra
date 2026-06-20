"use client";

import React from "react";
import { Building2, Users, Briefcase, Plus, Search, MapPin, DollarSign, Filter, ChevronRight, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockJobs = [
  {
    id: "j1",
    title: "Senior Backend Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    salary: "$180k - $220k",
    type: "Full-time",
    applicants: 142,
    verifiedMatches: 24,
    status: "Active"
  },
  {
    id: "j2",
    title: "Product Manager, AI Tools",
    department: "Product",
    location: "Remote (US)",
    salary: "$150k - $190k",
    type: "Full-time",
    applicants: 89,
    verifiedMatches: 12,
    status: "Active"
  },
  {
    id: "j3",
    title: "Developer Advocate",
    department: "Marketing",
    location: "New York, NY",
    salary: "$130k - $160k",
    type: "Contract",
    applicants: 45,
    verifiedMatches: 5,
    status: "Draft"
  }
];

export default function CompanyPortal() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="w-8 h-8 text-indigo-600" /> Company Portal
          </h1>
          <p className="text-muted-foreground mt-1">Manage job postings and applicant pipelines.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white"><Users className="w-4 h-4 mr-2" /> Team Settings</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700"><Plus className="w-4 h-4 mr-2" /> Post New Job</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar: Navigation & Quick Stats */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-2">
              <Button variant="secondary" className="w-full justify-start font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100">
                <Briefcase className="w-4 h-4 mr-2" /> Active Jobs (2)
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                <Users className="w-4 h-4 mr-2" /> Talent Pipeline
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Verification Rules
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Hiring Velocity</h3>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">Time to Fill</span>
                  <span className="text-muted-foreground">18 days</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[60%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">Offer Acceptance</span>
                  <span className="text-muted-foreground">85%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[85%]"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content: Job Listings */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search jobs..." 
                className="w-full pl-9 pr-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm"
              />
            </div>
            <Button variant="outline" className="bg-white"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
          </div>

          <div className="space-y-4">
            {mockJobs.map(job => (
              <Card key={job.id} className="hover:shadow-md transition-all border border-slate-200 group cursor-pointer">
                <CardContent className="p-6">
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                        <Badge variant={job.status === "Active" ? "default" : "secondary"} className={job.status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                          {job.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-slate-600">{job.department}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">View Pipeline <ChevronRight className="w-4 h-4 ml-1" /></Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-slate-100 mb-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</p>
                      <p className="text-sm font-medium">{job.location}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><DollarSign className="w-3 h-3" /> Salary Range</p>
                      <p className="text-sm font-medium">{job.salary}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Briefcase className="w-3 h-3" /> Type</p>
                      <p className="text-sm font-medium">{job.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-slate-900">{job.applicants}</span>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Applicants</span>
                    </div>
                    <div className="w-px h-8 bg-slate-200"></div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-indigo-600">{job.verifiedMatches}</span>
                      <span className="text-xs font-medium text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified Matches
                      </span>
                    </div>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
