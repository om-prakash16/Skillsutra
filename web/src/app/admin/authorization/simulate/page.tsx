"use client";

import React, { useState } from "react";
import { 
  PlayCircle, Code, ShieldCheck, ShieldAlert, CheckCircle2, XCircle, ChevronRight, Activity, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SimulateAccessPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<"none" | "allowed" | "denied">("none");

  const runSimulation = () => {
    setIsSimulating(true);
    setResult("none");
    setTimeout(() => {
      setIsSimulating(false);
      setResult("allowed");
    }, 1500);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <PlayCircle className="w-6 h-6 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Permission Simulator</h1>
          </div>
          <p className="text-muted-foreground text-sm">Test the authorization engine by dry-running access requests through the RBAC and ABAC evaluation chain.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        
        {/* Left Side: Input Context */}
        <Card className="border-border/50 shadow-sm flex flex-col h-full">
          <CardHeader className="pb-4 border-b border-border/50 bg-muted/10">
            <CardTitle className="text-base flex items-center gap-2"><Code className="w-4 h-4" /> Simulation Inputs</CardTitle>
            <CardDescription>Define the user, resource, action, and environment context.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex-1 overflow-y-auto space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary">1. Identity Context</h3>
              <div className="grid gap-2">
                <label className="text-xs font-medium text-muted-foreground">Subject (User ID or Email)</label>
                <Input defaultValue="jane.doe@acme.com" className="font-mono text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-xs font-medium text-muted-foreground">Active Tenant</label>
                  <Input defaultValue="T-8492 (Acme Corp)" className="font-mono text-sm" />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-medium text-muted-foreground">Active Workspace</label>
                  <Input defaultValue="Engineering" className="font-mono text-sm" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <h3 className="text-sm font-semibold text-primary">2. Resource & Action</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-xs font-medium text-muted-foreground">Target Resource Type</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono">
                    <option>EmployeeProfile</option>
                    <option>Invoice</option>
                    <option>ProjectBoard</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-medium text-muted-foreground">Action</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono">
                    <option>Read</option>
                    <option>Update</option>
                    <option>Delete</option>
                    <option>Approve</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-medium text-muted-foreground">Specific Resource ID (Optional)</label>
                <Input placeholder="e.g. EMP-1049" className="font-mono text-sm" />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <h3 className="text-sm font-semibold text-primary">3. Environment Context (JSON)</h3>
              <textarea className="w-full h-32 rounded-md border border-input bg-muted/20 font-mono text-xs p-3" defaultValue={`{\n  "ipAddress": "192.168.1.100",\n  "deviceType": "Laptop",\n  "time": "2024-03-15T09:00:00Z",\n  "mfaActive": true\n}`} />
            </div>

          </CardContent>
          <div className="p-4 border-t border-border/50 bg-muted/10">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={runSimulation} disabled={isSimulating}>
              {isSimulating ? <><Activity className="w-4 h-4 mr-2 animate-spin" /> Evaluating Policies...</> : <><PlayCircle className="w-4 h-4 mr-2" /> Run Simulation</>}
            </Button>
          </div>
        </Card>

        {/* Right Side: Evaluation Output */}
        <Card className="border-border/50 shadow-sm flex flex-col h-full bg-black/5 dark:bg-black/40">
          <CardHeader className="pb-4 border-b border-border/50">
            <CardTitle className="text-base flex items-center gap-2"><Activity className="w-4 h-4" /> Evaluation Trace</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto">
            {result === "none" && !isSimulating && (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                <ShieldCheck className="w-12 h-12 mb-4 opacity-20" />
                <p>Awaiting simulation execution.</p>
                <p className="text-xs mt-2 opacity-60">Click 'Run Simulation' to trace the authorization engine's decision process.</p>
              </div>
            )}

            {isSimulating && (
              <div className="p-6 space-y-4 font-mono text-xs text-muted-foreground">
                <div className="animate-pulse">Loading Identity Context [jane.doe@acme.com]... <span className="text-emerald-500">OK</span></div>
                <div className="animate-pulse delay-75">Loading Role Hierarchy... <span className="text-emerald-500">OK (Tenant Admin)</span></div>
                <div className="animate-pulse delay-150">Checking RBAC Matrix (Resource: EmployeeProfile, Action: Read)...</div>
              </div>
            )}

            {result === "allowed" && !isSimulating && (
              <div className="p-6">
                <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl mb-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  <div>
                    <h2 className="text-xl font-bold text-emerald-600">Access Allowed</h2>
                    <p className="text-sm text-emerald-600/80">The requested action is explicitly permitted by the evaluation chain.</p>
                  </div>
                </div>

                <div className="space-y-1 font-mono text-xs">
                  <div className="p-3 border-b border-border/50 flex items-start gap-3">
                    <ChevronRight className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-foreground font-semibold">Step 1: Identity Resolution</span>
                      <p className="text-muted-foreground mt-1">Resolved 'jane.doe@acme.com' to User U-849201.</p>
                    </div>
                  </div>
                  <div className="p-3 border-b border-border/50 flex items-start gap-3">
                    <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5" />
                    <div>
                      <span className="text-emerald-500 font-semibold">Step 2: RBAC Evaluation</span>
                      <p className="text-muted-foreground mt-1">Matched Role 'Tenant Admin' (R-102). Role matrix explicitly grants 'Read' on 'EmployeeProfile'. <span className="text-emerald-500">[+ALLOW]</span></p>
                    </div>
                  </div>
                  <div className="p-3 border-b border-border/50 flex items-start gap-3">
                    <ChevronRight className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-foreground font-semibold">Step 3: ABAC Policy Evaluation</span>
                      <p className="text-muted-foreground mt-1">Checked 4 Active Policies affecting 'EmployeeProfile'.</p>
                      <div className="pl-4 mt-2 border-l border-border/50 space-y-2">
                        <p className="text-muted-foreground line-through">POL-001 (HR Isolation): Condition 'User.Department == Target.Department' evaluated to FALSE. Skipped.</p>
                        <p className="text-muted-foreground line-through">POL-003 (Direct Reports): Condition evaluated to FALSE. Skipped.</p>
                        <p className="text-muted-foreground">No explicit DENY policies matched.</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-b border-border/50 flex items-start gap-3">
                    <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5" />
                    <div>
                      <span className="text-emerald-500 font-semibold">Step 4: Final Decision Resolution</span>
                      <p className="text-muted-foreground mt-1">Explicit RBAC Allow + No ABAC Deny Overrides = <span className="font-bold text-emerald-500">GRANTED</span>.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
