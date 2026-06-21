"use client";

import React, { useState } from "react";
import { 
  Webhook, Key, Search, Plus, Code2, Copy, AlertCircle, ShieldAlert,
  Activity, ArrowUpRight, MoreHorizontal, Settings, FileJson, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockApiKeys = [
  { id: "key_prod_8f92j...", name: "Production ERP Integration", created: "Oct 15, 2026", expires: "Never", lastUsed: "2 mins ago", status: "Active" },
  { id: "key_test_2b49k...", name: "Local Development Sandbox", created: "Oct 18, 2026", expires: "Oct 25, 2026", lastUsed: "5 hours ago", status: "Active" },
  { id: "key_prod_1a88z...", name: "Legacy Reporting Tool", created: "Jan 12, 2024", expires: "Dec 31, 2025", lastUsed: "Dec 31, 2025", status: "Expired" },
];

const mockWebhooks = [
  { id: "wh_endpoint_1", url: "https://api.acme.com/webhooks/talent", events: ["candidate.applied", "candidate.hired"], status: "Active", successRate: "99.9%" },
  { id: "wh_endpoint_2", url: "https://api.partner.com/sync", events: ["invoice.paid"], status: "Failing", successRate: "45.2%" },
  { id: "wh_endpoint_3", url: "https://internal-tools.corp.net/hook", events: ["user.created", "user.deleted"], status: "Disabled", successRate: "N/A" },
];

export default function ApiManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API & Webhooks</h1>
          <p className="text-muted-foreground mt-1">Manage API keys, Personal Access Tokens, and event-driven webhooks.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><FileJson className="w-4 h-4 mr-2" /> API Docs</Button>
          <Button><Plus className="w-4 h-4 mr-2" /> Create Secret</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" /> API Requests (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.2M</div>
            <p className="text-xs text-muted-foreground mt-1">Total volume across 8 keys</p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm bg-card border-l-4 border-l-rose-500 hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" /> Webhook Failures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-500">142</div>
            <p className="text-xs text-muted-foreground mt-1">Failing deliveries in queue</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-blue-500" /> Rate Limit Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12%</div>
            <p className="text-xs text-muted-foreground mt-1">Highest consumer: Production ERP</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="keys" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-muted/50 border border-border/50 p-1">
            <TabsTrigger value="keys" className="rounded-md px-4"><Key className="w-4 h-4 mr-2" /> API Keys</TabsTrigger>
            <TabsTrigger value="webhooks" className="rounded-md px-4"><Webhook className="w-4 h-4 mr-2" /> Webhooks</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9 h-9 bg-muted/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <TabsContent value="keys" className="mt-0">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Key Name</TableHead>
                    <TableHead>Secret Prefix</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockApiKeys.map((key, i) => (
                    <TableRow key={i} className="group hover:bg-muted/20">
                      <TableCell className="font-medium">{key.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded border border-border/50 font-mono text-muted-foreground">{key.id}</code>
                          <Button variant="ghost" size="icon" className="h-6 w-6"><Copy className="w-3 h-3 text-muted-foreground" /></Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{key.created}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{key.lastUsed}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{key.expires}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          key.status === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                          "bg-rose-500/10 text-rose-600 border-rose-500/20"
                        }>
                          {key.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-rose-500"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="mt-0">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Endpoint URL</TableHead>
                    <TableHead>Subscribed Events</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockWebhooks.map((hook, i) => (
                    <TableRow key={i} className="group hover:bg-muted/20 cursor-pointer">
                      <TableCell>
                        <div className="font-mono text-sm">{hook.url}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {hook.events.map((e, idx) => (
                            <Badge key={idx} variant="secondary" className="font-mono text-[10px] font-normal">{e}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-mono text-sm ${hook.successRate === "100%" || hook.successRate === "99.9%" ? "text-emerald-500" : hook.successRate === "N/A" ? "text-muted-foreground" : "text-rose-500"}`}>
                          {hook.successRate}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          hook.status === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                          hook.status === "Failing" ? "bg-rose-500/10 text-rose-600 border-rose-500/20" :
                          "bg-muted text-muted-foreground border-border"
                        }>
                          {hook.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><Settings className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
