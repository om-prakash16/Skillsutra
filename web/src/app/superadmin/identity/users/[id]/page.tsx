"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  User, Building2, ShieldCheck, Key, MonitorSmartphone, Cpu, 
  Code, Puzzle, Lock, ShieldAlert, Activity, FileText, Bot, 
  Settings, History, Mail, Phone, MapPin, Calendar, Clock,
  Fingerprint, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params?.id || "U-849201";
  const [activeTab, setActiveTab] = useState("overview");
  const [isImpersonating, setIsImpersonating] = useState(false);
  const router = useRouter();

  const handleImpersonate = () => {
    setIsImpersonating(true);
    // In a real app, this sets an impersonation token cookie, then redirects to /feed or user dashboard.
    setTimeout(() => {
      alert("Redirecting to User Dashboard in Impersonation Mode...");
      setIsImpersonating(false);
    }, 1500);
  };

  const TABS = [
    { id: "overview", label: "Overview", icon: User },
    { id: "personal", label: "Personal", icon: FileText },
    { id: "organizations", label: "Organizations", icon: Building2 },
    { id: "roles", label: "Roles", icon: ShieldCheck },
    { id: "permissions", label: "Permissions", icon: Key },
    { id: "sessions", label: "Sessions", icon: MonitorSmartphone },
    { id: "devices", label: "Devices", icon: Cpu },
    { id: "api-keys", label: "API Keys", icon: Code },
    { id: "oauth", label: "OAuth", icon: Puzzle },
    { id: "mfa", label: "MFA", icon: Lock },
    { id: "security", label: "Security", icon: ShieldAlert },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "ai", label: "AI Usage", icon: Bot },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "audit", label: "Audit", icon: History },
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {isImpersonating && (
        <div className="bg-rose-500 text-white p-3 rounded-lg flex items-center justify-center gap-2 font-medium shadow-lg animate-in slide-in-from-top-4">
          <AlertTriangle className="w-5 h-5" /> 
          Establishing Impersonation Session... Please wait.
        </div>
      )}

      {/* Header Profile */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border/50 pb-6">
        <div className="flex items-center gap-6">
          <Avatar className="w-20 h-20 border-2 border-border/50 shadow-sm">
            <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">JD</AvatarFallback>
            <AvatarImage src="https://i.pravatar.cc/150?u=jane" />
          </Avatar>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold tracking-tight">Jane Doe</h1>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>
              <Badge variant="outline" className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20">Verified Identity</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
              <span className="flex items-center gap-1 font-mono text-[11px] bg-muted px-2 py-0.5 rounded-md"><Fingerprint className="w-3.5 h-3.5" /> {userId}</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> jane.doe@acme.com</span>
              <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> Acme Corp (Primary)</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-indigo-600 border-indigo-500/30 hover:bg-indigo-500/10" onClick={handleImpersonate} disabled={isImpersonating}>
            <Fingerprint className="w-4 h-4 mr-2" /> Impersonate
          </Button>
          <Button variant="destructive">Suspend Account</Button>
        </div>
      </div>

      {/* 16-Tab Deep Dive */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <TabsList className="bg-muted/30 border border-border/50 inline-flex w-max min-w-full justify-start p-1 h-12">
            {TABS.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="rounded-md px-4 data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs">
                <tab.icon className="w-3.5 h-3.5 mr-2" /> {tab.label}
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
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Organizations</p>
                  <p className="text-2xl font-bold mt-1">2</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl"><Building2 className="w-5 h-5 text-blue-500" /></div>
              </CardContent>
            </Card>
            <Card className="border-border/50 shadow-sm bg-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Sessions</p>
                  <p className="text-2xl font-bold mt-1">3</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl"><MonitorSmartphone className="w-5 h-5 text-emerald-500" /></div>
              </CardContent>
            </Card>
            <Card className="border-border/50 shadow-sm bg-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Security Score</p>
                  <p className="text-2xl font-bold mt-1 text-emerald-500">98 / 100</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl"><ShieldCheck className="w-5 h-5 text-emerald-500" /></div>
              </CardContent>
            </Card>
            <Card className="border-border/50 shadow-sm bg-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Failed Logins (30d)</p>
                  <p className="text-2xl font-bold mt-1 text-muted-foreground">0</p>
                </div>
                <div className="p-3 bg-rose-500/10 rounded-xl"><ShieldAlert className="w-5 h-5 text-rose-500" /></div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-base flex items-center gap-2">Identity Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block mb-1">Primary Email</span>
                    <span className="font-medium">jane.doe@acme.com</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Phone Number</span>
                    <span className="font-medium">+1 (555) 123-4567</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Joined Date</span>
                    <span className="font-medium flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Jan 15, 2024</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Last Login</span>
                    <span className="font-medium flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 2 mins ago</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Timezone</span>
                    <span className="font-medium flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> America/New_York (EST)</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Auth Provider</span>
                    <span className="font-medium">Email / Password</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-base flex items-center justify-between">
                  Security Overview
                  <Button variant="outline" size="sm">Require Re-Auth</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-border/50 text-sm">
                <div className="flex items-center justify-between p-4">
                  <span className="flex items-center gap-2 text-muted-foreground"><Lock className="w-4 h-4 text-emerald-500" /> Multi-Factor Auth</span>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Enabled (App)</Badge>
                </div>
                <div className="flex items-center justify-between p-4">
                  <span className="flex items-center gap-2 text-muted-foreground"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Identity Verification</span>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Verified via SSO</Badge>
                </div>
                <div className="flex items-center justify-between p-4">
                  <span className="flex items-center gap-2 text-muted-foreground"><Key className="w-4 h-4" /> Password Age</span>
                  <span className="font-medium">45 Days</span>
                </div>
                <div className="flex items-center justify-between p-4">
                  <span className="flex items-center gap-2 text-muted-foreground"><MonitorSmartphone className="w-4 h-4" /> Trusted Devices</span>
                  <span className="font-medium">2 Devices</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ORGANIZATIONS TAB */}
        <TabsContent value="organizations" className="mt-6 animate-in fade-in">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="text-base">Cross-Tenant Memberships</CardTitle>
              <CardDescription>This user exists in multiple organizations. Removing them here revokes access entirely.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                <div className="p-4 flex items-center justify-between hover:bg-muted/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-500">AC</div>
                    <div>
                      <p className="font-medium text-sm flex items-center gap-2">Acme Corporation <Badge className="text-[10px] h-5 px-1 bg-primary text-primary-foreground">Primary</Badge></p>
                      <p className="text-xs text-muted-foreground mt-0.5">Role: Tenant Admin • Joined: Jan 15, 2024</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-rose-500 border-rose-500/30 hover:bg-rose-500/10">Remove Access</Button>
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-muted/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center font-bold text-emerald-500">GL</div>
                    <div>
                      <p className="font-medium text-sm">Globex Inc (Contractor)</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Role: Guest • Joined: Mar 01, 2024</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-rose-500 border-rose-500/30 hover:bg-rose-500/10">Remove Access</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SESSIONS TAB */}
        <TabsContent value="sessions" className="mt-6 animate-in fade-in">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50 flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-base">Active Sessions</CardTitle>
                <CardDescription>Manage where this user is currently logged in.</CardDescription>
              </div>
              <Button variant="destructive" size="sm">Revoke All Sessions</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                <div className="p-4 flex items-center justify-between hover:bg-muted/10">
                  <div className="flex items-center gap-4">
                    <MonitorSmartphone className="w-6 h-6 text-indigo-500" />
                    <div>
                      <p className="font-medium text-sm flex items-center gap-2">MacBook Pro (Chrome) <Badge variant="outline" className="text-[10px] h-5 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Current</Badge></p>
                      <p className="text-xs text-muted-foreground mt-0.5">New York, US • IP: 192.168.1.42 • Last active: Just now</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-muted/10">
                  <div className="flex items-center gap-4">
                    <MonitorSmartphone className="w-6 h-6 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">iPhone 14 Pro (Safari)</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Boston, US • IP: 104.28.19.4 • Last active: 2 hours ago</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Revoke</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fallback for remaining tabs */}
        {["personal", "roles", "permissions", "devices", "api-keys", "oauth", "mfa", "security", "activity", "documents", "ai", "settings", "audit"].map(tab => (
          <TabsContent key={tab} value={tab} className="mt-6 animate-in fade-in">
            <Card className="border-border/50 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center p-20 text-center">
                <Fingerprint className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium capitalize">{tab.replace('-', ' ')} Identity Matrix</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  This identity sub-module is wired. Specific components for managing this user's {tab.replace('-', ' ')} will render here dynamically.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}

      </Tabs>
    </div>
  );
}
