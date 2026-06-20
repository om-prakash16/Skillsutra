"use client";

import React, { useState } from "react";
import { 
  Puzzle, Search, Filter, Plus, Power, ShieldCheck, 
  Settings, Trash2, ArrowUpRight, CheckCircle2, AlertTriangle, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

const mockIntegrations = [
  { id: "INT-001", name: "Slack Workspaces", type: "OAuth 2.0", status: "Active", lastSync: "2 mins ago", errors: 0 },
  { id: "INT-002", name: "Salesforce CRM", type: "OAuth 2.0", status: "Active", lastSync: "15 mins ago", errors: 2 },
  { id: "INT-003", name: "Google Workspace", type: "Service Account", status: "Active", lastSync: "1 hour ago", errors: 0 },
  { id: "INT-004", name: "AWS S3 Storage", type: "API Key", status: "Error", lastSync: "12 hours ago", errors: 14 },
  { id: "INT-005", name: "SendGrid Email", type: "API Key", status: "Disabled", lastSync: "Never", errors: 0 },
];

export default function IntegrationsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integration Hub</h1>
          <p className="text-muted-foreground mt-1">Manage connected applications, OAuth tokens, and system sync status.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Play className="w-4 h-4 mr-2" /> Sync All Now</Button>
          <Button><Plus className="w-4 h-4 mr-2" /> New Connection</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Puzzle className="w-4 h-4 text-primary" /> Active Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">14</div>
            <p className="text-xs text-muted-foreground mt-1">Currently running</p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-emerald-500" /> API Calls (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1.2M</div>
            <p className="text-xs text-muted-foreground mt-1 text-emerald-500 font-medium">Within quota</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card border-l-4 border-l-rose-500 hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" /> Sync Errors (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-500">16</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-500" /> OAuth Scopes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">Granted permissions</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50 mb-4">
          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search integrations..."
                className="pl-9 h-9 bg-muted/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Integration Name</TableHead>
                <TableHead>Auth Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead className="text-center">Errors (24h)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockIntegrations.map((integration, i) => (
                <TableRow key={i} className="group hover:bg-muted/20">
                  <TableCell className="font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center border border-border/50">
                      <Puzzle className="w-4 h-4 text-muted-foreground" />
                    </div>
                    {integration.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{integration.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={integration.status === "Active" || integration.status === "Error"} />
                      <Badge variant="outline" className={
                        integration.status === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                        integration.status === "Error" ? "bg-rose-500/10 text-rose-600 border-rose-500/20" :
                        "bg-muted text-muted-foreground border-border"
                      }>
                        {integration.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{integration.lastSync}</TableCell>
                  <TableCell className="text-center">
                    {integration.errors > 0 ? (
                      <Badge variant="destructive" className="font-mono">{integration.errors}</Badge>
                    ) : (
                      <span className="text-muted-foreground font-mono">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><Settings className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-rose-500"><Trash2 className="w-4 h-4" /></Button>
                    </div>
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
