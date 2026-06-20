"use client";

import React from "react";
import { LineChart, BarChart2, DollarSign, Users, Target, Activity, ArrowUpRight, ArrowDownRight, Layers } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function ExecutiveDashboard() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-slate-50 min-h-screen">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform-wide metrics, revenue, and funnel intelligence.</p>
        </div>
        <div className="flex gap-2 bg-white border p-1 rounded-lg shadow-sm">
          <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-slate-100">Last 30 Days</button>
          <button className="px-3 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-slate-50">Q3 2026</button>
          <button className="px-3 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-slate-50">YTD</button>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MRR */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Monthly Recurring Revenue</p>
                <h3 className="text-3xl font-bold">$142.5k</h3>
              </div>
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 flex items-center font-medium"><ArrowUpRight className="w-4 h-4 mr-1" /> +12.5%</span>
              <span className="text-muted-foreground ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Verified Users</p>
                <h3 className="text-3xl font-bold">1.25M</h3>
              </div>
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 flex items-center font-medium"><ArrowUpRight className="w-4 h-4 mr-1" /> +5.2%</span>
              <span className="text-muted-foreground ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Companies */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Enterprise Companies</p>
                <h3 className="text-3xl font-bold">4,500</h3>
              </div>
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Target className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 flex items-center font-medium"><ArrowUpRight className="w-4 h-4 mr-1" /> +8.1%</span>
              <span className="text-muted-foreground ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Churn Rate */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Platform Churn Rate</p>
                <h3 className="text-3xl font-bold">1.2%</h3>
              </div>
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 flex items-center font-medium"><ArrowDownRight className="w-4 h-4 mr-1" /> -0.3%</span>
              <span className="text-muted-foreground ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Revenue Chart (CSS Mockup) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="font-bold flex items-center gap-2">
              <LineChart className="w-5 h-5 text-indigo-500" /> Revenue Growth (Last 6 Months)
            </h3>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2 pt-4">
              {[95, 105, 115, 122, 130, 142].map((val, i) => (
                <div key={i} className="w-full flex flex-col items-center gap-2 group">
                  <div className="relative w-full bg-indigo-100 rounded-t-sm group-hover:bg-indigo-200 transition-colors flex items-end justify-center pb-2" style={{ height: `${(val / 150) * 100}%` }}>
                    <div className="w-full bg-indigo-500 rounded-t-sm" style={{ height: '100%', opacity: 0.8 }}></div>
                    <span className="absolute -top-6 text-xs font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">${val}k</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Month {i+1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Global Hiring Funnel */}
        <Card>
          <CardHeader>
            <h3 className="font-bold flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-500" /> Global Hiring Funnel
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Job Views</span>
                  <span className="text-muted-foreground">500,000</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-800 w-full"></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Applications</span>
                  <span className="text-muted-foreground">150,000</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 w-[30%]"></div>
                </div>
                <p className="text-xs text-red-500 text-right">-70% dropoff</p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Interviews</span>
                  <span className="text-muted-foreground">8,000</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[5%]"></div>
                </div>
                <p className="text-xs text-red-500 text-right">-94% dropoff</p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Hires</span>
                  <span className="text-muted-foreground">2,000</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[1.5%]"></div>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
