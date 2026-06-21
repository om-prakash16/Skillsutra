"use client";

import React from "react";
import { Laptop, Monitor, Smartphone, Key, Plus, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const mockAssets = [
  { id: "AST-LPT-001", type: "Laptop", model: "MacBook Pro 16\" M3 Max", assignee: "Sarah Jenkins", condition: "Excellent", status: "Assigned", date: "Jan 12, 2026" },
  { id: "AST-LPT-002", type: "Laptop", model: "ThinkPad X1 Carbon", assignee: "David Foster", condition: "Good", status: "Assigned", date: "Mar 05, 2025" },
  { id: "AST-MON-001", type: "Monitor", model: "Dell UltraSharp 27\"", assignee: "Emma Wilson", condition: "Excellent", status: "Assigned", date: "Feb 10, 2026" },
  { id: "AST-PHN-001", type: "Phone", model: "iPhone 15 Pro", assignee: "Unassigned", condition: "New", status: "Available", date: "Oct 15, 2026" },
  { id: "AST-LPT-003", type: "Laptop", model: "MacBook Air M2", assignee: "Unassigned", condition: "Poor", status: "Repairing", date: "Nov 20, 2024" },
];

export default function AssetsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">IT & Asset Management</h1>
          <p className="text-muted-foreground mt-1">Track hardware, software licenses, and physical access cards.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><FileText className="w-4 h-4 mr-2" /> Audit Report</Button>
          <Button><Plus className="w-4 h-4 mr-2" /> Provision Asset</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">452</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500">380</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Available Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">65</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">In Repair / End of Life</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-500">7</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Asset Inventory</CardTitle>
          <CardDescription>Manage all physical devices and assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Asset Tag</TableHead>
                <TableHead>Type & Model</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                    {asset.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                        {asset.type === "Laptop" ? <Laptop className="w-4 h-4" /> : 
                         asset.type === "Monitor" ? <Monitor className="w-4 h-4" /> :
                         <Smartphone className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{asset.model}</div>
                        <div className="text-xs text-muted-foreground">{asset.type}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {asset.assignee !== "Unassigned" ? asset.assignee : <span className="text-muted-foreground italic">Unassigned</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      {asset.condition === "Excellent" ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> : 
                       asset.condition === "Poor" ? <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> :
                       <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
                      {asset.condition}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      asset.status === "Assigned" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                      asset.status === "Available" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                      "bg-rose-500/10 text-rose-600 border-rose-500/20"
                    }>
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Manage</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
