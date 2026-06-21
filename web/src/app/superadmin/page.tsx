"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, Building2, Briefcase, Zap, Activity, ShieldCheck, 
  Globe, Database, ShieldAlert, Terminal, Search, LayoutDashboard,
  Server, HardDrive, Bell, Star, Clock, FileText, ChevronRight,
  Settings, PlayCircle, MoreHorizontal, UserPlus, Send, Box,
  CreditCard, Lock, Fingerprint, RefreshCw, Command, Cpu
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("platform");
  const [cmdOpen, setCmdOpen] = useState(false);

  // Command Palette listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const QUICK_ACTIONS = [
    { label: "Create Tenant", icon: Building2 },
    { label: "Create Admin", icon: ShieldCheck },
    { label: "Create User", icon: UserPlus },
    { label: "Publish Announcement", icon: Send },
  ];

  const ACTIVITY_FEED = [
    { id: 1, type: "system", msg: "Backup completed successfully", time: "2 mins ago", icon: Database, color: "text-emerald-500" },
    { id: 2, type: "user", msg: "New user registered (jane@acme.com)", time: "15 mins ago", icon: Users, color: "text-blue-500" },
    { id: 3, type: "security", msg: "Multiple failed logins from 192.168.1.44", time: "1 hour ago", icon: ShieldAlert, color: "text-rose-500" },
    { id: 4, type: "billing", msg: "Subscription upgraded to Enterprise (Tenant #42)", time: "2 hours ago", icon: CreditCard, color: "text-purple-500" },
    { id: 5, type: "ai", msg: "AI model routing timeout (fallback triggered)", time: "4 hours ago", icon: Cpu, color: "text-amber-500" },
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 relative">
      
      {/* Command Palette Overlay */}
      <AnimatePresence>
        {cmdOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setCmdOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center px-4 border-b border-border/50">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Input placeholder="Search users, companies, jobs, settings..." className="flex-1 border-0 bg-transparent focus-visible:ring-0 h-14 text-lg" autoFocus />
                <Badge variant="outline" className="font-mono text-[10px]">ESC</Badge>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Links</div>
                {["Manage Users", "View Analytics", "Security Center", "Billing Details"].map(item => (
                  <button key={item} className="w-full text-left px-3 py-3 rounded-lg hover:bg-muted/50 flex items-center justify-between group">
                    <span className="text-sm font-medium">{item}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-border/50 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            Global command center for platform infrastructure, tenants, and security. 
            <kbd className="hidden md:inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-[10px] font-mono border border-border/50">
              <Command className="w-3 h-3" /> K
            </kbd>
            to search anywhere.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action, idx) => (
            <Button key={idx} variant="outline" size="sm" className="h-9">
              <action.icon className="w-4 h-4 mr-2" /> {action.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Main Workspace (Left 3 cols) */}
        <div className="xl:col-span-3 space-y-6">
          
          <Tabs defaultValue="platform" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto pb-2 scrollbar-none">
              <TabsList className="bg-muted/30 border border-border/50 inline-flex w-max min-w-full justify-start p-1 h-12">
                <TabsTrigger value="platform" className="rounded-md px-4 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"><Globe className="w-4 h-4 mr-2" /> Platform</TabsTrigger>
                <TabsTrigger value="users" className="rounded-md px-4"><Users className="w-4 h-4 mr-2" /> Users</TabsTrigger>
                <TabsTrigger value="companies" className="rounded-md px-4"><Building2 className="w-4 h-4 mr-2" /> Companies</TabsTrigger>
                <TabsTrigger value="jobs" className="rounded-md px-4"><Briefcase className="w-4 h-4 mr-2" /> Jobs</TabsTrigger>
                <TabsTrigger value="ai" className="rounded-md px-4"><Cpu className="w-4 h-4 mr-2" /> AI</TabsTrigger>
                <TabsTrigger value="storage" className="rounded-md px-4"><HardDrive className="w-4 h-4 mr-2" /> Storage</TabsTrigger>
                <TabsTrigger value="api" className="rounded-md px-4"><Terminal className="w-4 h-4 mr-2" /> API</TabsTrigger>
                <TabsTrigger value="revenue" className="rounded-md px-4"><CreditCard className="w-4 h-4 mr-2" /> Revenue</TabsTrigger>
                <TabsTrigger value="security" className="rounded-md px-4"><ShieldAlert className="w-4 h-4 mr-2" /> Security</TabsTrigger>
                <TabsTrigger value="system" className="rounded-md px-4"><Server className="w-4 h-4 mr-2" /> System</TabsTrigger>
              </TabsList>
            </div>

            {/* PLATFORM TAB */}
            <TabsContent value="platform" className="mt-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard title="Total Tenants" value="1,420" icon={Building2} trend="+12" trendDir="up" />
                <MetricCard title="Active Tenants" value="1,205" icon={Activity} />
                <MetricCard title="Suspended Tenants" value="14" icon={Lock} color="rose" />
                <MetricCard title="Trial Tenants" value="156" icon={Clock} color="amber" />
                <MetricCard title="Enterprise Tenants" value="45" icon={Star} color="indigo" />
                <MetricCard title="Platform Uptime" value="99.99%" icon={ShieldCheck} color="emerald" />
              </div>
            </TabsContent>

            {/* USERS TAB */}
            <TabsContent value="users" className="mt-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard title="Total Users" value="1.4M" icon={Users} trend="+5k" trendDir="up" />
                <MetricCard title="Active Users" value="842K" icon={Activity} />
                <MetricCard title="Online Users" value="42,105" icon={Globe} color="emerald" />
                <MetricCard title="New Users Today" value="1,204" icon={UserPlus} />
                <MetricCard title="Verified Users" value="1.2M" icon={ShieldCheck} color="blue" />
                <MetricCard title="Pending Verification" value="14,201" icon={Clock} color="amber" />
              </div>
            </TabsContent>

            {/* REVENUE TAB */}
            <TabsContent value="revenue" className="mt-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard title="Monthly Recurring (MRR)" value="$4.2M" icon={CreditCard} trend="+$120k" trendDir="up" color="emerald" />
                <MetricCard title="Annual Recurring (ARR)" value="$50.4M" icon={Building2} color="emerald" />
                <MetricCard title="New Subscriptions" value="142" icon={UserPlus} />
                <MetricCard title="Active Plans" value="1,420" icon={Box} />
                <MetricCard title="Trial Conversions" value="42%" icon={Activity} color="indigo" />
                <MetricCard title="Churn Rate" value="1.2%" icon={ShieldAlert} color="rose" />
              </div>
            </TabsContent>

            {/* SYSTEM TAB */}
            <TabsContent value="system" className="mt-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard title="Global CPU Usage" value="42%" icon={Cpu} color="emerald" />
                <MetricCard title="RAM Allocation" value="84%" icon={Database} color="amber" />
                <MetricCard title="PostgreSQL IOPS" value="12.4k" icon={Database} color="blue" />
                <MetricCard title="Redis Cache Hit Rate" value="96.2%" icon={Zap} color="emerald" />
                <MetricCard title="Celery Workers" value="48/48" icon={Activity} />
                <MetricCard title="Background Queue" value="1,204" icon={Clock} />
              </div>
            </TabsContent>

            {/* Fallback for other tabs to show they are wired up */}
            {["companies", "jobs", "ai", "storage", "api", "security"].map(tab => (
              <TabsContent key={tab} value={tab} className="mt-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border/50 rounded-2xl bg-muted/10">
                  <Box className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium capitalize">{tab} Metrics Dashboard</h3>
                  <p className="text-sm text-muted-foreground mt-1">Detailed widgets for {tab} will render here based on your layout settings.</p>
                </div>
              </TabsContent>
            ))}

          </Tabs>

        </div>

        {/* Sidebar (Right Col) */}
        <div className="space-y-6">
          
          <Card className="border-border/50 shadow-sm bg-card flex flex-col h-[500px]">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> Live Activity</span>
                <Badge variant="outline" className="font-mono text-[10px]"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" /> LIVE</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto">
              <div className="divide-y divide-border/50">
                {ACTIVITY_FEED.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-muted/30 transition-colors flex gap-4">
                    <div className={`mt-0.5 ${item.color}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{item.msg}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-3 border-t border-border/50">
              <Button variant="ghost" className="w-full text-xs" size="sm">View All Activity <ChevronRight className="w-3 h-3 ml-1" /></Button>
            </div>
          </Card>

          <Card className="border-border/50 shadow-sm bg-card">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2"><Bell className="w-4 h-4 text-amber-500" /> Notifications</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">New Enterprise Customer</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Acme Corp signed up for the 5k seat tier.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">High CPU Alert</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Worker node 04 exceeding 90% utilization.</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

// Reusable Metric Card Component
function MetricCard({ title, value, icon: Icon, trend, trendDir, color = "primary" }: any) {
  const colorClasses: Record<string, string> = {
    primary: "text-primary bg-primary/10 border-primary/20",
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    rose: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    indigo: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  };

  return (
    <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg border ${colorClasses[color]}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            {title}
          </span>
          {trend && (
            <span className={`text-xs font-mono ${trendDir === "up" ? "text-emerald-500" : "text-rose-500"}`}>
              {trend}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
