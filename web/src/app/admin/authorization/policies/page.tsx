"use client";

import React, { useState } from "react";
import { 
  FileText, Plus, Search, Filter, MoreHorizontal, Save, 
  Trash2, Copy, Play, Activity, ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockPolicies = [
  { id: "POL-001", name: "HR Department Isolation", effect: "ALLOW", target: "Resource:EmployeeProfile", conditions: "User.Department == Target.Department", status: "Active" },
  { id: "POL-002", name: "High-Risk Finance Approvals", effect: "DENY", target: "Action:ApproveInvoice", conditions: "Invoice.Amount > 10000 AND User.RiskScore > 50", status: "Active" },
  { id: "POL-003", name: "Manager Direct Report Access", effect: "ALLOW", target: "Resource:PerformanceReview", conditions: "Target.ManagerID == User.ID", status: "Active" },
  { id: "POL-004", name: "Off-hours Production DB Block", effect: "DENY", target: "Resource:Database", conditions: "Env == 'Production' AND Time.Hour < 9 OR Time.Hour > 18", status: "Draft" },
];

export default function ABACPolicyBuilderPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);

  // Mock builder state
  const [conditions, setConditions] = useState([
    { id: 1, attribute: "User.Department", operator: "EQUALS", value: "Target.Department" }
  ]);

  const addCondition = () => {
    setConditions([...conditions, { id: Date.now(), attribute: "", operator: "EQUALS", value: "" }]);
  };

  const removeCondition = (id: number) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <FileText className="w-6 h-6 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">ABAC Policy Builder</h1>
          </div>
          <p className="text-muted-foreground text-sm">Define dynamic Attribute-Based Access Control (ABAC) rules based on user, resource, and environment contexts.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline"><Activity className="w-4 h-4 mr-2" /> View Evaluation Logs</Button>
          <Button onClick={() => setIsBuilding(!isBuilding)}>
            {isBuilding ? "Cancel Builder" : <><Plus className="w-4 h-4 mr-2" /> Create Policy</>}
          </Button>
        </div>
      </div>

      {isBuilding ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-top-4 fade-in duration-300">
          
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-base">Policy Definition</CardTitle>
                <CardDescription>Define the core identity and effect of this policy.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Policy Name</label>
                  <Input placeholder="e.g. Prevent off-hours access for contractors" />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Effect</label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="ALLOW">ALLOW</option>
                      <option value="DENY">DENY</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Target Resource / Action</label>
                    <Input placeholder="e.g. Action:ViewPayroll" />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Conditions (IF)</label>
                    <Button variant="outline" size="sm" onClick={addCondition}><Plus className="w-3.5 h-3.5 mr-1" /> Add Rule</Button>
                  </div>
                  
                  <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border/50">
                    {conditions.map((cond, index) => (
                      <div key={cond.id} className="flex items-center gap-3">
                        {index > 0 && <span className="text-xs font-bold text-muted-foreground w-10 text-center">AND</span>}
                        {index === 0 && <span className="w-10"></span>}
                        <Input className="flex-1 bg-background" placeholder="Attribute (e.g. User.Department)" defaultValue={cond.attribute} />
                        <select className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <option>EQUALS (==)</option>
                          <option>NOT EQUALS (!=)</option>
                          <option>GREATER THAN (&gt;)</option>
                          <option>LESS THAN (&lt;)</option>
                          <option>INCLUDES</option>
                        </select>
                        <Input className="flex-1 bg-background" placeholder="Value (e.g. 'HR')" defaultValue={cond.value} />
                        <Button variant="ghost" size="icon" className="text-rose-500 shrink-0" onClick={() => removeCondition(cond.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {conditions.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No conditions defined. This policy will apply universally to the target.</p>}
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border/50 shadow-sm bg-muted/10">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-base flex items-center gap-2"><Play className="w-4 h-4" /> Live Evaluation Test</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-xs text-muted-foreground mb-4">Test this policy against mock context before saving.</p>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Mock User Context JSON</label>
                  <textarea className="w-full h-32 rounded-md border border-input bg-card font-mono text-xs p-3 text-muted-foreground" defaultValue={`{\n  "User": {\n    "Department": "Engineering",\n    "Role": "Developer"\n  }\n}`} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Mock Resource Context JSON</label>
                  <textarea className="w-full h-32 rounded-md border border-input bg-card font-mono text-xs p-3 text-muted-foreground" defaultValue={`{\n  "Target": {\n    "Department": "Engineering"\n  }\n}`} />
                </div>
                <Button className="w-full" variant="secondary">Run Test Evaluation</Button>
                
                <div className="mt-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-medium flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Policy Evaluates to: ALLOW
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setIsBuilding(false)}>Cancel</Button>
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"><Save className="w-4 h-4 mr-2"/> Save Policy</Button>
            </div>
          </div>

        </div>
      ) : (
        <Card className="border-border/50 shadow-sm animate-in fade-in duration-300">
          <CardHeader className="pb-4 border-b border-border/50">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search policies..." className="pl-9 h-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-9"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Policy Name</TableHead>
                  <TableHead>Effect</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Condition Logic</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPolicies.map((policy) => (
                  <TableRow key={policy.id} className="group hover:bg-muted/20">
                    <TableCell>
                      <div className="font-semibold text-sm">{policy.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{policy.id}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={policy.effect === "ALLOW" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-rose-500/10 text-rose-600 border-rose-500/20"}>
                        {policy.effect}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{policy.target}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-[11px] font-mono text-muted-foreground">{policy.conditions}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={policy.status === "Active" ? "border-emerald-500/30 text-emerald-600" : "bg-muted text-muted-foreground"}>
                        {policy.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
