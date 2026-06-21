"use client";

import React, { useState } from "react";
import { 
  Users, UserPlus, UserMinus, TrendingUp, Building2, Briefcase,
  Clock, CalendarOff, Activity, Target, Laptop, Download, Bell, Target as TargetIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, BarChart, Bar, Cell } from "recharts";
import { motion } from "framer-motion";

const headcountData = [
  { month: "Jan", count: 120 },
  { month: "Feb", count: 125 },
  { month: "Mar", count: 135 },
  { month: "Apr", count: 142 },
  { month: "May", count: 148 },
  { month: "Jun", count: 156 },
  { month: "Jul", count: 165 },
];

const departmentData = [
  { name: "Engineering", count: 65, color: "#f43f5e" },
  { name: "Sales", count: 42, color: "#3b82f6" },
  { name: "Marketing", count: 28, color: "#10b981" },
  { name: "HR", count: 12, color: "#8b5cf6" },
  { name: "Operations", count: 18, color: "#f59e0b" },
];

const recentHires = [
  { id: 1, name: "Sarah Jenkins", role: "Senior Frontend Engineer", department: "Engineering", date: "Today", initial: "SJ" },
  { id: 2, name: "Michael Chang", role: "Product Manager", department: "Product", date: "Yesterday", initial: "MC" },
  { id: 3, name: "Emma Wilson", role: "UX Designer", department: "Design", date: "3 days ago", initial: "EW" },
  { id: 4, name: "David Foster", role: "Account Executive", department: "Sales", date: "Last week", initial: "DF" },
];

const upcomingLeaves = [
  { id: 1, name: "Alex Kumar", type: "Annual Leave", dates: "Oct 12 - Oct 15", initial: "AK" },
  { id: 2, name: "Jessica Smith", type: "Sick Leave", dates: "Oct 10 (Today)", initial: "JS" },
  { id: 3, name: "Robert Taylor", type: "Paternity Leave", dates: "Oct 18 - Nov 18", initial: "RT" },
];

export default function HRDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your organization's workforce and metrics.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export Report</Button>
          <Button><UserPlus className="w-4 h-4 mr-2" /> Add Employee</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Headcount</CardTitle>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">165</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
              <TrendingUp className="w-3 h-3 mr-1" /> +12% from last quarter
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Roles</CardTitle>
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Briefcase className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">
              8 currently in final interview stage
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Turnover Rate</CardTitle>
            <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
              <UserMinus className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.2%</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
              <TrendingUp className="w-3 h-3 mr-1 rotate-180" /> -1.1% from last year
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Tenure</CardTitle>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Clock className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3.8 <span className="text-lg text-muted-foreground font-normal">yrs</span></div>
            <p className="text-xs text-muted-foreground mt-1">
              Industry average: 2.5 yrs
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle>Headcount Growth</CardTitle>
            <CardDescription>Total active employees over the past 7 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={headcountData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.2} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle>Department Breakdown</CardTitle>
            <CardDescription>Employee distribution by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" hide />
                  <RechartsTooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))' }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 space-y-3">
              {departmentData.map((dept, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                    <span className="font-medium text-foreground/80">{dept.name}</span>
                  </div>
                  <span className="font-bold">{dept.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Hires</CardTitle>
              <CardDescription>New employees joined recently</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentHires.map((hire) => (
                <div key={hire.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">{hire.initial}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{hire.name}</p>
                      <p className="text-xs text-muted-foreground">{hire.role} • {hire.department}</p>
                    </div>
                  </div>
                  <div className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground font-medium">
                    {hire.date}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Leaves</CardTitle>
              <CardDescription>Approved time off in the next 14 days</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">Leave Calendar</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {upcomingLeaves.map((leave) => (
                <div key={leave.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-muted text-muted-foreground">{leave.initial}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{leave.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <CalendarOff className="w-3 h-3 mr-1" /> {leave.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-medium px-2 py-1 bg-amber-500/10 text-amber-600 rounded-md">
                    {leave.dates}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
