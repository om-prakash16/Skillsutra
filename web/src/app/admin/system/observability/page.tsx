"use client";

import React, { useState } from "react";
import { 
  Activity, Server, Database, Clock, RefreshCw, AlertTriangle, 
  Terminal, ShieldAlert, Cpu, HardDrive, Network
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ObservabilityDashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Activity className="w-8 h-8 text-emerald-500" />
            <h1 className="text-3xl font-bold tracking-tight">Platform Observability</h1>
          </div>
          <p className="text-muted-foreground text-sm">Real-time OpenTelemetry metrics, Celery queues, and infrastructure health.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="font-mono bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" /> Live
          </Badge>
          <Button variant="outline" size="icon" onClick={triggerRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center justify-between">
              <span className="flex items-center gap-2"><GlobeIcon className="w-4 h-4 text-blue-500" /> API Requests (24h)</span>
              <span className="text-xs font-mono text-emerald-500">+12%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">14.2M</div>
            <p className="text-xs text-muted-foreground mt-1">~164 RPS</p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center justify-between">
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-purple-500" /> P99 Latency</span>
              <span className="text-xs font-mono text-emerald-500">-14ms</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">142ms</div>
            <p className="text-xs text-muted-foreground mt-1">Global average response time</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center justify-between">
              <span className="flex items-center gap-2"><Server className="w-4 h-4 text-amber-500" /> Celery Tasks</span>
              <span className="text-xs font-mono text-rose-500">+42</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">12,402</div>
            <p className="text-xs text-muted-foreground mt-1">Tasks queued in Redis</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card border-l-4 border-l-rose-500 hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center justify-between">
              <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-rose-500" /> Error Rate (5xx)</span>
              <span className="text-xs font-mono text-rose-500">+0.01%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-500">0.04%</div>
            <p className="text-xs text-muted-foreground mt-1">42 instances in last 1 hour</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Infrastructure Health */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2"><HardDrive className="w-4 h-4" /> Infrastructure Nodes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium flex items-center gap-2"><Server className="w-3 h-3 text-emerald-500" /> FastAPI Web Servers</span>
                  <span className="text-muted-foreground font-mono text-xs">8 / 8 Healthy</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden flex">
                  <div className="bg-emerald-500 h-full" style={{ width: "100%" }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>CPU: 42%</span>
                  <span>RAM: 6.4GB / 16GB</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="flex justify-between text-sm">
                  <span className="font-medium flex items-center gap-2"><Cpu className="w-3 h-3 text-amber-500" /> Celery Workers</span>
                  <span className="text-muted-foreground font-mono text-xs">12 / 12 Healthy</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden flex">
                  <div className="bg-amber-500 h-full" style={{ width: "100%" }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>CPU: 88%</span>
                  <span>RAM: 24.1GB / 32GB</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="flex justify-between text-sm">
                  <span className="font-medium flex items-center gap-2"><Database className="w-3 h-3 text-blue-500" /> PostgreSQL Primary</span>
                  <span className="text-muted-foreground font-mono text-xs">1 / 1 Healthy</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden flex">
                  <div className="bg-blue-500 h-full" style={{ width: "100%" }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Connections: 842</span>
                  <span>IOPS: 12.4k</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="flex justify-between text-sm">
                  <span className="font-medium flex items-center gap-2"><Network className="w-3 h-3 text-rose-500" /> Redis Cache Cluster</span>
                  <span className="text-muted-foreground font-mono text-xs">3 / 3 Healthy</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden flex">
                  <div className="bg-rose-500 h-full" style={{ width: "100%" }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Hit Rate: 94.2%</span>
                  <span>Mem: 4.2GB / 8GB</span>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Logs & Traces */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm h-full flex flex-col">
            <CardHeader className="pb-4 border-b border-border/50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base flex items-center gap-2"><Terminal className="w-4 h-4" /> Live Tail (OpenTelemetry Traces)</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline" className="font-mono text-[10px] cursor-pointer hover:bg-muted">ERROR</Badge>
                  <Badge variant="outline" className="font-mono text-[10px] cursor-pointer hover:bg-muted">WARN</Badge>
                  <Badge variant="secondary" className="font-mono text-[10px] bg-primary/10 text-primary cursor-pointer">ALL</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 bg-[#0a0a0a] text-gray-300 font-mono text-[11px] overflow-hidden rounded-b-xl relative">
              <div className="absolute inset-0 overflow-auto p-4 space-y-2">
                
                <div className="flex gap-4 group hover:bg-white/5 p-1 rounded">
                  <span className="text-muted-foreground shrink-0">16:42:01.124</span>
                  <span className="text-emerald-400 shrink-0 w-12">[INFO]</span>
                  <span className="text-blue-400 shrink-0 w-24">api.users</span>
                  <span className="text-gray-400 shrink-0">trace_id=8f92a1</span>
                  <span className="break-all">GET /api/v1/users/me completed in 42ms (Cache Hit)</span>
                </div>
                
                <div className="flex gap-4 group hover:bg-white/5 p-1 rounded">
                  <span className="text-muted-foreground shrink-0">16:42:01.442</span>
                  <span className="text-amber-400 shrink-0 w-12">[WARN]</span>
                  <span className="text-purple-400 shrink-0 w-24">celery.worker</span>
                  <span className="text-gray-400 shrink-0">trace_id=2b49c2</span>
                  <span className="break-all">Task generate_pdf_report(id=9x8) retrying in 5s... Rate limit exceeded from downstream API.</span>
                </div>

                <div className="flex gap-4 group hover:bg-white/5 p-1 rounded">
                  <span className="text-muted-foreground shrink-0">16:42:02.012</span>
                  <span className="text-emerald-400 shrink-0 w-12">[INFO]</span>
                  <span className="text-blue-400 shrink-0 w-24">api.webhooks</span>
                  <span className="text-gray-400 shrink-0">trace_id=1a88z5</span>
                  <span className="break-all">POST /api/v1/webhooks/stripe incoming payload verified. Status 200 OK.</span>
                </div>

                <div className="flex gap-4 group hover:bg-white/5 p-1 rounded bg-rose-500/10 border border-rose-500/20">
                  <span className="text-rose-300 shrink-0">16:42:02.551</span>
                  <span className="text-rose-500 font-bold shrink-0 w-12">[ERR]</span>
                  <span className="text-blue-400 shrink-0 w-24">db.postgres</span>
                  <span className="text-gray-400 shrink-0">trace_id=4c77y9</span>
                  <span className="break-all text-rose-200">sqlalchemy.exc.IntegrityError: (psycopg2.errors.UniqueViolation) duplicate key value violates unique constraint "ix_users_email"</span>
                </div>

                <div className="flex gap-4 group hover:bg-white/5 p-1 rounded">
                  <span className="text-muted-foreground shrink-0">16:42:03.111</span>
                  <span className="text-emerald-400 shrink-0 w-12">[INFO]</span>
                  <span className="text-purple-400 shrink-0 w-24">celery.worker</span>
                  <span className="text-gray-400 shrink-0">trace_id=9d11x4</span>
                  <span className="break-all">Task sync_ats_candidates(tenant_id=42) completed successfully in 14.2s. Inserted 142 records.</span>
                </div>

                <div className="flex gap-4 group hover:bg-white/5 p-1 rounded">
                  <span className="text-muted-foreground shrink-0">16:42:03.420</span>
                  <span className="text-emerald-400 shrink-0 w-12">[INFO]</span>
                  <span className="text-blue-400 shrink-0 w-24">api.search</span>
                  <span className="text-gray-400 shrink-0">trace_id=5e22w1</span>
                  <span className="break-all">GET /api/v1/search?q=engineer completed in 89ms (ElasticSearch Hit)</span>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

// Globe icon fallback
function GlobeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  )
}
