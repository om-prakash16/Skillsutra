"use client";

import React from "react";
import { 
  FileText, Database, Image as ImageIcon, LayoutTemplate, 
  Search, Link as LinkIcon, BarChart3, TrendingUp, Globe
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const mockPublishingTrend = [
  { day: 'Mon', pages: 12, entries: 45 },
  { day: 'Tue', pages: 19, entries: 52 },
  { day: 'Wed', pages: 15, entries: 48 },
  { day: 'Thu', pages: 28, entries: 70 },
  { day: 'Fri', pages: 22, entries: 65 },
  { day: 'Sat', pages: 5, entries: 12 },
  { day: 'Sun', pages: 8, entries: 20 },
];

const mockTraffic = [
  { month: 'Jan', visitors: 120000 },
  { month: 'Feb', visitors: 135000 },
  { month: 'Mar', visitors: 180000 },
  { month: 'Apr', visitors: 195000 },
  { month: 'May', visitors: 250000 },
  { month: 'Jun', visitors: 310000 },
];

export default function CMSDashboardPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Globe className="w-6 h-6 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Experience Cloud</h1>
          </div>
          <p className="text-muted-foreground text-sm">Centralized headless CMS, dynamic collections, and visual page building.</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <MetricCard title="Total Pages" value="1,248" icon={FileText} color="blue" />
        <MetricCard title="Collections" value="24" icon={Database} color="emerald" />
        <MetricCard title="Entries" value="14.2k" icon={FileText} color="indigo" />
        <MetricCard title="Media Files" value="8,402" icon={ImageIcon} color="amber" />
        <MetricCard title="Templates" value="45" icon={LayoutTemplate} color="rose" />
        <MetricCard title="Active Domains" value="12" icon={Globe} color="blue" />
        <MetricCard title="Broken Links" value="3" icon={LinkIcon} color="rose" />
        <MetricCard title="Avg SEO Score" value="94" icon={Search} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Chart: Publishing Velocity */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4 border-b border-border/50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Publishing Velocity</CardTitle>
              <CardDescription>Pages vs Content Entries published this week.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockPublishingTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="day" stroke="#ffffff40" tick={{fill: '#ffffff60', fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#ffffff40" tick={{fill: '#ffffff60', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  cursor={{fill: '#ffffff05'}}
                />
                <Bar dataKey="entries" name="Entries" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="pages" name="Pages" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Right Chart: Content Delivery Traffic */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4 border-b border-border/50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Content Delivery Traffic</CardTitle>
              <CardDescription>Global unique visitors across all tracked domains.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTraffic} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff40" tick={{fill: '#ffffff60', fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#ffffff40" tick={{fill: '#ffffff60', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(val) => `\${val / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  formatter={(value: number) => [value.toLocaleString(), "Visitors"]}
                />
                <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6, strokeWidth: 0}} />
              </LineChart>
            </ResponsiveContainer>
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
