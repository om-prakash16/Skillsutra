"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { 
  Building2, Globe, CreditCard, Users, ShieldAlert, Database, 
  Activity, ToggleRight, Puzzle, History, Archive, Settings,
  MapPin, Clock, Calendar, Mail, Phone, Link as LinkIcon, Download,
  PlayCircle, Fingerprint, Power, Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";

export default function TenantProfilePage() {
  const params = useParams();
  const tenantSlug = params?.id || "acme-corp";
  const [activeTab, setActiveTab] = useState("overview");

  const TABS = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "organization", label: "Organization", icon: Building2 },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "domains", label: "Domains", icon: Globe },
    { id: "users", label: "Users", icon: Users },
    { id: "security", label: "Security", icon: ShieldAlert },
    { id: "storage", label: "Storage", icon: Database },
    { id: "feature-flags", label: "Features", icon: ToggleRight },
    { id: "integrations", label: "Integrations", icon: Puzzle },
    { id: "audit", label: "Audit Log", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border/50 pb-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-black text-indigo-500 text-3xl shadow-inner">
            AC
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold tracking-tight">Acme Corporation</h1>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>
              <Badge variant="outline" className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20">Enterprise Tier</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono mt-2">
              <span className="flex items-center gap-1"><Fingerprint className="w-3.5 h-3.5" /> T-8492</span>
              <span className="flex items-center gap-1"><LinkIcon className="w-3.5 h-3.5" /> {tenantSlug}.skillsutra.com</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> us-east-1</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline"><PlayCircle className="w-4 h-4 mr-2" /> Impersonate</Button>
          <Button variant="destructive"><Power className="w-4 h-4 mr-2" /> Suspend</Button>
        </div>
      </div>

      {/* Deep Dive Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <TabsList className="bg-muted/30 border border-border/50 inline-flex w-max min-w-full justify-start p-1 h-12">
            {TABS.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="rounded-md px-4 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="mt-6 space-y-6 animate-in fade-in">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-border/50 shadow-sm bg-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Users</p>
                  <p className="text-2xl font-bold mt-1">1,420</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl"><Users className="w-5 h-5 text-blue-500" /></div>
              </CardContent>
            </Card>
            <Card className="border-border/50 shadow-sm bg-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Storage Used</p>
                  <p className="text-2xl font-bold mt-1">420 GB <span className="text-sm font-normal text-muted-foreground">/ 1 TB</span></p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl"><Database className="w-5 h-5 text-emerald-500" /></div>
              </CardContent>
            </Card>
            <Card className="border-border/50 shadow-sm bg-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">MRR</p>
                  <p className="text-2xl font-bold mt-1">$12,400</p>
                </div>
                <div className="p-3 bg-indigo-500/10 rounded-xl"><CreditCard className="w-5 h-5 text-indigo-500" /></div>
              </CardContent>
            </Card>
            <Card className="border-border/50 shadow-sm bg-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Security Score</p>
                  <p className="text-2xl font-bold mt-1 text-emerald-500">A+</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl"><ShieldAlert className="w-5 h-5 text-emerald-500" /></div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-base flex items-center gap-2">Contact & Operations</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Primary Owner</span>
                    <p className="font-medium flex items-center gap-2 mt-1"><Users className="w-3.5 h-3.5" /> jane.doe@acme.com</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created Date</span>
                    <p className="font-medium flex items-center gap-2 mt-1"><Calendar className="w-3.5 h-3.5" /> Jan 15, 2024</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Support Email</span>
                    <p className="font-medium flex items-center gap-2 mt-1"><Mail className="w-3.5 h-3.5" /> it-support@acme.com</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone</span>
                    <p className="font-medium flex items-center gap-2 mt-1"><Phone className="w-3.5 h-3.5" /> +1 (555) 123-4567</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-base flex items-center gap-2">Subscription & Limits</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-muted-foreground">Seat Usage</span>
                    <span className="font-mono">1,420 / 2,000</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden flex">
                    <div className="bg-primary h-full" style={{ width: "71%" }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-muted-foreground">AI Token Usage (Monthly)</span>
                    <span className="font-mono">4.2M / 10M</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden flex">
                    <div className="bg-indigo-500 h-full" style={{ width: "42%" }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FEATURE FLAGS TAB */}
        <TabsContent value="feature-flags" className="mt-6 animate-in fade-in">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="text-base flex items-center justify-between">
                Module Entitlements
                <Button variant="outline" size="sm">Save Changes</Button>
              </CardTitle>
              <CardDescription>Enable or disable core platform modules for this tenant.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border/50">
              {[
                { name: "ATS & Recruitment Engine", desc: "Full access to pipelines, requisitions, and parsing.", enabled: true },
                { name: "Core HRMS", desc: "Employee lifecycle, attendance, and directory.", enabled: true },
                { name: "CRM & Sales", desc: "Pipelines, contacts, and email sequencing.", enabled: false },
                { name: "Enterprise Projects", desc: "Sprint boards, wikis, and time tracking.", enabled: true },
                { name: "LMS & Learning", desc: "Course builder and skill certificates.", enabled: false },
                { name: "AI Copilot", desc: "Neural matching and generative text throughout the app.", enabled: true },
              ].map((flag, i) => (
                <div key={i} className="flex items-center justify-between p-6 hover:bg-muted/10 transition-colors">
                  <div>
                    <h4 className="font-medium text-sm">{flag.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{flag.desc}</p>
                  </div>
                  <Switch defaultChecked={flag.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security" className="mt-6 animate-in fade-in">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="text-base flex items-center justify-between">
                Tenant Security Policies
                <Button variant="outline" size="sm">Force Policy Sync</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border/50">
              <div className="flex items-center justify-between p-6">
                <div>
                  <h4 className="font-medium text-sm flex items-center gap-2"><Key className="w-4 h-4 text-emerald-500" /> Enforce MFA Globally</h4>
                  <p className="text-xs text-muted-foreground mt-1">Require all users in this tenant to use Multi-Factor Authentication.</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              <div className="flex items-center justify-between p-6">
                <div>
                  <h4 className="font-medium text-sm">Session Timeout</h4>
                  <p className="text-xs text-muted-foreground mt-1">Force logout inactive users across all apps.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input defaultValue="1440" className="w-20 h-8 text-xs text-center" />
                  <span className="text-xs text-muted-foreground">minutes</span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-medium text-sm text-rose-500 mb-4">Danger Zone</h4>
                <div className="flex gap-4">
                  <Button variant="destructive" size="sm">Revoke All Active Sessions</Button>
                  <Button variant="outline" size="sm" className="text-rose-500 border-rose-500/50 hover:bg-rose-500/10">Wipe API Keys</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fallback for other tabs */}
        {["organization", "billing", "domains", "users", "storage", "integrations", "audit", "settings"].map(tab => (
          <TabsContent key={tab} value={tab} className="mt-6 animate-in fade-in">
            <Card className="border-border/50 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center p-20 text-center">
                <Activity className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium capitalize">{tab} Management</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  This sub-module is wired up. Specific configuration forms and data tables for {tab} will render here for this specific tenant.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}

      </Tabs>
    </div>
  );
}
