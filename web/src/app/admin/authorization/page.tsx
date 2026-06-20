"use client";

import React from "react";
import { 
  ShieldCheck, ShieldAlert, Key, Building2, SplitSquareHorizontal, 
  GitMerge, Clock, FileText, CheckCircle2, XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const mockDeniedAccess = [
  { time: '08:00', events: 12 },
  { time: '10:00', events: 45 },
  { time: '12:00', events: 28 },
  { time: '14:00', events: 80 },
  { time: '16:00', events: 105 },
  { time: '18:00', events: 65 },
  { time: '20:00', events: 20 },
];

const mockRoleDistribution = [
  { name: 'Employees', value: 65, color: '#6366f1' },
  { name: 'Managers', value: 20, color: '#8b5cf6' },
  { name: 'Tenant Admins', value: 10, color: '#10b981' },
  { name: 'Platform Admins', value: 5, color: '#f59e0b' },
];

export default function AuthorizationDashboardPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-rose-500/10 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-rose-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Authorization Engine</h1>
          </div>
          <p className="text-muted-foreground text-sm">Centralized control plane for RBAC, ABAC, delegation, and massive-scale permission matrices.</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <MetricCard title="Platform Roles" value="12" icon={ShieldCheck} color="amber" />
        <MetricCard title="Tenant Roles" value="45" icon={Building2} color="indigo" />
        <MetricCard title="Workspace Roles" value="120" icon={SplitSquareHorizontal} color="blue" />
        <MetricCard title="ABAC Policies" value="84" icon={FileText} color="emerald" />
        <MetricCard title="Temp. Access" value="24" icon={Clock} color="rose" />
        <MetricCard title="Delegations" value="156" icon={GitMerge} color="indigo" />
        <MetricCard title="Pending Approvals" value="42" icon={CheckCircle2} color="amber" />
        <MetricCard title="Denied Requests" value="1,402" icon={XCircle} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Area Chart */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm h-full flex flex-col">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2">Denied Access Events (24 Hours)</CardTitle>
              <CardDescription>Tracks 403 Forbidden spikes, which may indicate misconfigured ABAC policies or active probes.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockDeniedAccess} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDenied" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="time" stroke="#ffffff40" tick={{fill: '#ffffff60', fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#ffffff40" tick={{fill: '#ffffff60', fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="events" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorDenied)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Role Distribution */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border/50 shadow-sm h-full">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2">Global Role Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-[300px] flex flex-col justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockRoleDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockRoleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 text-xs mt-4">
                {mockRoleDistribution.map(role => (
                  <div key={role.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }} />
                    <span className="text-muted-foreground">{role.name} ({role.value}%)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
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
        <CardTitle className="text-[10px] text-muted-foreground font-medium flex items-center justify-between uppercase tracking-wider">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="text-2xl font-bold">{value}</div>
        <div className={`p-1.5 rounded-lg border ${colorClasses[color]}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </CardContent>
    </Card>
  );
}
