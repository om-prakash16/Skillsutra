"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, ShieldCheck, Lock, Key, AlertOctagon, 
  EyeOff, Search, FileJson, Filter, MapPin, Fingerprint, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockAlerts = [
  { id: "SEC-942", type: "Multiple Failed Logins", source: "192.168.1.42 (US-East)", user: "admin@enterprise.com", severity: "High", time: "2 mins ago", action: "IP Blocked" },
  { id: "SEC-941", type: "API Rate Limit Exceeded", source: "Auth Service / Token_9a4", user: "System", severity: "Medium", time: "15 mins ago", action: "Throttled" },
  { id: "SEC-940", type: "Unrecognized Device Login", source: "Chrome on Windows (UK)", user: "j.doe@acme.com", severity: "Low", time: "1 hour ago", action: "MFA Challenged" },
  { id: "SEC-939", type: "CSP Violation Blocked", source: "XSS Attempt (Payload Blocked)", user: "Anonymous", severity: "Medium", time: "2 hours ago", action: "Logged" },
  { id: "SEC-938", type: "Impossible Travel", source: "Login from JP and US in 5 mins", user: "m.smith@acme.com", severity: "Critical", time: "4 hours ago", action: "Session Revoked" },
];

export default function SecurityCommandCenterPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <ShieldAlert className="w-8 h-8 text-rose-500" />
            <h1 className="text-3xl font-bold tracking-tight">Security Command Center</h1>
          </div>
          <p className="text-muted-foreground text-sm">Monitor WAF events, active IP blocks, audit logs, and IAM abuse detection.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline"><FileJson className="w-4 h-4 mr-2" /> Export Audit Log</Button>
          <Button variant="destructive"><AlertOctagon className="w-4 h-4 mr-2" /> Lockdown Mode</Button>
        </div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center justify-between">
              <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-emerald-500" /> Active Blocks</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">142</div>
            <p className="text-xs text-muted-foreground mt-1">IP addresses currently blacklisted</p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center justify-between">
              <span className="flex items-center gap-2"><EyeOff className="w-4 h-4 text-purple-500" /> WAF Blocks (24h)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8,421</div>
            <p className="text-xs text-muted-foreground mt-1">Malicious payloads blocked at edge</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center justify-between">
              <span className="flex items-center gap-2"><Key className="w-4 h-4 text-blue-500" /> MFA Adoption</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">94.2%</div>
            <p className="text-xs text-muted-foreground mt-1">Across all active admin accounts</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card border-l-4 border-l-rose-500 hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center justify-between">
              <span className="flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-rose-500" /> High Severity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-500">2</div>
            <p className="text-xs text-muted-foreground mt-1">Unresolved security alerts</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Security Settings Status */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Hardening Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Content Security Policy (CSP)</p>
                  <p className="text-xs text-muted-foreground">Strict mode enabled globally.</p>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div>
                  <p className="text-sm font-medium">Data Encryption at Rest</p>
                  <p className="text-xs text-muted-foreground">AES-256 GCM on all volumes.</p>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div>
                  <p className="text-sm font-medium">API Rate Limiting</p>
                  <p className="text-xs text-muted-foreground">Redis-backed sliding window.</p>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div>
                  <p className="text-sm font-medium">Automatic Secret Rotation</p>
                  <p className="text-xs text-muted-foreground">Rotates DB credentials every 30d.</p>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div>
                  <p className="text-sm font-medium">Impossible Travel Detection</p>
                  <p className="text-xs text-muted-foreground">AI-based geo-velocity rules.</p>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Security Events */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50 mb-4">
              <div>
                <CardTitle className="text-base flex items-center gap-2"><Activity className="w-4 h-4" /> Live Threat Feed</CardTitle>
              </div>
              <div className="flex gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    className="pl-9 h-8 text-xs bg-muted/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs"><Filter className="w-3.5 h-3.5 mr-2" /> Filter</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Severity</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Target / User</TableHead>
                    <TableHead>Source Context</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Action Taken</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAlerts.map((alert, i) => (
                    <TableRow key={i} className="group hover:bg-muted/20">
                      <TableCell>
                        <Badge variant="outline" className={
                          alert.severity === "Critical" ? "bg-rose-500/10 text-rose-600 border-rose-500/20" :
                          alert.severity === "High" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                          alert.severity === "Medium" ? "bg-purple-500/10 text-purple-600 border-purple-500/20" :
                          "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        }>
                          {alert.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        {alert.type}
                        <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{alert.id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Fingerprint className="w-3 h-3 text-muted-foreground" /> {alert.user}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" /> {alert.source}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{alert.time}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="font-mono text-[10px]">{alert.action}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
