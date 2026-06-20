"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { 
  ShieldCheck, Lock, CheckCircle2, ChevronRight, ChevronDown, 
  Save, Copy, FileText, CheckSquare, Square
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const MODULES = [
  { id: "platform", label: "Platform Core", count: 12 },
  { id: "identity", label: "Identity & Access", count: 24 },
  { id: "billing", label: "Billing & Subscriptions", count: 8 },
  { id: "ats", label: "ATS & Recruitment", count: 32 },
  { id: "hrms", label: "HRMS Core", count: 45 },
  { id: "crm", label: "CRM & Sales", count: 18 },
  { id: "projects", label: "Enterprise Projects", count: 22 },
  { id: "lms", label: "Learning (LMS)", count: 14 },
];

const ACTIONS = ["Create", "Read", "Update", "Delete", "Approve", "Export", "Import", "Configure"];

export default function RoleEditorPage() {
  const params = useParams();
  const roleId = params?.id || "R-102";
  
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    "identity": true,
    "ats": true
  });

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border/50 pb-6 sticky top-0 bg-background/95 backdrop-blur z-10 pt-2">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold tracking-tight">Tenant Admin</h1>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Tenant Tier</Badge>
              <Badge variant="outline" className="bg-muted text-muted-foreground"><Lock className="w-3 h-3 mr-1"/> System Role</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
              <span className="font-mono text-[11px] bg-muted px-2 py-0.5 rounded-md">{roleId}</span>
              <span>Full control over a specific tenant organization.</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline"><Copy className="w-4 h-4 mr-2" /> Clone Role</Button>
          <Button className="bg-primary text-primary-foreground"><Save className="w-4 h-4 mr-2" /> Save Matrix</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar: Role Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="text-base">Role Configuration</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium">Role Name</label>
                <Input defaultValue="Tenant Admin" disabled />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Description</label>
                <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" defaultValue="Full control over a specific tenant organization." disabled />
              </div>
              <div className="pt-4 border-t border-border/50">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Assigned Users</span>
                  <span className="font-medium">1,420</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Active Policies</span>
                  <span className="font-medium text-emerald-500">28 ABAC Rules</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm bg-blue-500/5 border-blue-500/20">
            <CardContent className="p-4 flex gap-3">
              <FileText className="w-5 h-5 text-blue-500 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-blue-600 mb-1">Matrix Inheritence</p>
                <p className="text-blue-600/80 text-xs">As a Tenant Tier role, this matrix automatically inherits base read permissions from the "Employee" template.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Area: The Matrix */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-border/50">
            <div className="text-sm font-medium">Permission Matrix Editor</div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><CheckSquare className="w-3.5 h-3.5 text-primary" /> Allowed</div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Square className="w-3.5 h-3.5" /> Denied</div>
            </div>
          </div>

          <div className="border border-border/50 rounded-xl bg-card overflow-hidden shadow-sm">
            {/* Header Row */}
            <div className="grid grid-cols-[250px_1fr] bg-muted/50 border-b border-border/50 sticky top-0 z-10">
              <div className="p-3 font-medium text-xs text-muted-foreground flex items-center">Module / Resource</div>
              <div className="grid grid-cols-8 divide-x divide-border/20">
                {ACTIONS.map(act => (
                  <div key={act} className="p-3 text-[10px] uppercase font-bold text-muted-foreground text-center flex flex-col items-center gap-2">
                    {act}
                    <Checkbox className="w-3 h-3" />
                  </div>
                ))}
              </div>
            </div>

            {/* Matrix Body */}
            <div className="divide-y divide-border/50">
              {MODULES.map(mod => (
                <div key={mod.id} className="group">
                  {/* Module Header */}
                  <div 
                    className="grid grid-cols-[250px_1fr] hover:bg-muted/10 transition-colors cursor-pointer"
                    onClick={() => toggleModule(mod.id)}
                  >
                    <div className="p-3 flex items-center gap-2 border-r border-border/20 bg-muted/5">
                      {expandedModules[mod.id] ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                      <span className="font-semibold text-sm">{mod.label}</span>
                      <Badge variant="outline" className="ml-auto text-[9px] h-4 px-1">{mod.count}</Badge>
                    </div>
                    <div className="grid grid-cols-8 divide-x divide-border/20">
                      {ACTIONS.map(act => (
                        <div key={act} className="p-3 flex items-center justify-center bg-muted/5" onClick={(e) => e.stopPropagation()}>
                          <Checkbox checked={expandedModules[mod.id] && act !== "Delete"} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sub-Resources (Expanded) */}
                  {expandedModules[mod.id] && (
                    <div className="bg-background animate-in slide-in-from-top-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="grid grid-cols-[250px_1fr] border-t border-border/20 hover:bg-muted/5 transition-colors">
                          <div className="p-3 pl-8 flex items-center gap-2 border-r border-border/20">
                            <span className="text-xs text-muted-foreground">{mod.label} Sub-Resource {i}</span>
                          </div>
                          <div className="grid grid-cols-8 divide-x divide-border/20">
                            {ACTIONS.map(act => (
                              <div key={act} className="p-2.5 flex items-center justify-center">
                                <Checkbox className="w-3.5 h-3.5 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500" checked={act !== "Delete" && act !== "Export"} />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
