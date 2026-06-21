"use client";

import React from "react";
import { 
  Users, UserCheck, UserMinus, ShieldAlert, MonitorSmartphone, 
  Globe, Key, Lock, Fingerprint, MapPin, Activity, ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const mockRegistrations = [
  { date: 'Mon', users: 1200 },
  { date: 'Tue', users: 1900 },
  { date: 'Wed', users: 1500 },
  { date: 'Thu', users: 2200 },
  { date: 'Fri', users: 2800 },
  { date: 'Sat', users: 3400 },
  { date: 'Sun', users: 4100 },
];

const mockMFA = [
  { name: 'Authenticator App', value: 65 },
  { name: 'SMS / Text', value: 20 },
  { name: 'Hardware Key', value: 10 },
  { name: 'Email Auth', value: 5 },
];

export default function IdentityDashboardPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Fingerprint className="w-6 h-6 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Identity & Access Dashboard</h1>
          </div>
          <p className="text-muted-foreground text-sm">Global overview of authentication, sessions, devices, and MFA adoption across all tenants.</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard title="Total Users" value="1.4M" icon={Users} color="indigo" />
        <MetricCard title="Active (30d)" value="842K" icon={Activity} color="emerald" />
        <MetricCard title="Online Now" value="42,105" icon={Globe} color="blue" />
        <MetricCard title="Verified" value="1.2M" icon={UserCheck} color="emerald" />
        <MetricCard title="Blocked" value="1,402" icon={UserMinus} color="rose" />
        <MetricCard title="MFA Enabled" value="84%" icon={Lock} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Area Chart */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm h-full flex flex-col">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2">Daily Registrations (7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockRegistrations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="date" stroke="#ffffff40" tick={{fill: '#ffffff60', fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#ffffff40" tick={{fill: '#ffffff60', fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: MFA & Auth Stats */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2">MFA Adoption Methods</CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockMFA} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={120} stroke="#ffffff60" tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Bottom Row: Geographic & Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4 border-b border-border/50">
            <CardTitle className="text-base flex items-center gap-2"><MapPin className="w-4 h-4" /> Top Active Regions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50 text-sm">
              <div className="flex justify-between p-4 hover:bg-muted/20"><span>United States</span><span className="font-mono">420K</span></div>
              <div className="flex justify-between p-4 hover:bg-muted/20"><span>India</span><span className="font-mono">310K</span></div>
              <div className="flex justify-between p-4 hover:bg-muted/20"><span>United Kingdom</span><span className="font-mono">142K</span></div>
              <div className="flex justify-between p-4 hover:bg-muted/20"><span>Germany</span><span className="font-mono">84K</span></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4 border-b border-border/50">
            <CardTitle className="text-base flex items-center gap-2"><MonitorSmartphone className="w-4 h-4" /> Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50 text-sm">
              <div className="flex items-center justify-between p-4 hover:bg-muted/20">
                <span className="flex items-center gap-2"><MonitorSmartphone className="w-4 h-4 text-indigo-500" /> Desktop / Web</span>
                <span className="font-mono">68%</span>
              </div>
              <div className="flex items-center justify-between p-4 hover:bg-muted/20">
                <span className="flex items-center gap-2"><MonitorSmartphone className="w-4 h-4 text-emerald-500" /> Mobile / iOS App</span>
                <span className="font-mono">22%</span>
              </div>
              <div className="flex items-center justify-between p-4 hover:bg-muted/20">
                <span className="flex items-center gap-2"><MonitorSmartphone className="w-4 h-4 text-blue-500" /> Mobile / Android App</span>
                <span className="font-mono">8%</span>
              </div>
              <div className="flex items-center justify-between p-4 hover:bg-muted/20">
                <span className="flex items-center gap-2"><MonitorSmartphone className="w-4 h-4 text-muted-foreground" /> Unknown / API</span>
                <span className="font-mono">2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color = "indigo" }: any) {
  const colorClasses: Record<string, string> = {
    indigo: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    rose: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  };

  return (
    <Card className="border-border/50 shadow-sm bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs text-muted-foreground font-medium flex items-center justify-between">
          {title}
          <div className={`p-1.5 rounded-lg border ${colorClasses[color]}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
