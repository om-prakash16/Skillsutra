"use client";

import React from "react";
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, Users, 
  ShoppingCart, AlertTriangle, FileSignature, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function ERPDashboardPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time overview of financial health, operations, and risks.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><FileSignature className="w-4 h-4 mr-2" /> Generate Report</Button>
          <Button><BarChart3 className="w-4 h-4 mr-2" /> Custom Widget</Button>
        </div>
      </div>

      {/* Top level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" /> Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$1.24M</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-emerald-500 font-medium">
              <TrendingUp className="w-3 h-3 mr-1" /> +12% from last quarter
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-500" /> Operating Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$842.5K</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-rose-500 font-medium">
              <TrendingUp className="w-3 h-3 mr-1" /> +4% from last quarter
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" /> Headcount Cost (HRMS)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$420.0K</div>
            <p className="text-xs text-muted-foreground mt-1">42 Active Employees</p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-amber-500" /> Active Purchase Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">$124.5K Total Value</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Overview */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Cash Flow Forecast</CardTitle>
              <CardDescription>Projected cash position over the next 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end gap-2 pb-6 px-2 relative">
                {/* Horizontal Guidelines */}
                <div className="absolute w-full border-b border-border/50 bottom-6 left-0" />
                <div className="absolute w-full border-b border-border/50 bottom-32 left-0" />
                <div className="absolute w-full border-b border-border/50 top-6 left-0" />
                
                {/* Mock Chart Bars */}
                {[
                  { month: "Jul", in: 180, out: 120 },
                  { month: "Aug", in: 220, out: 140 },
                  { month: "Sep", in: 190, out: 150 },
                  { month: "Oct", in: 240, out: 160 },
                  { month: "Nov", in: 280, out: 170 },
                  { month: "Dec", in: 320, out: 180 },
                ].map((data, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full z-10 group cursor-pointer">
                    <div className="w-full max-w-[40px] flex items-end gap-1 mb-2 h-full">
                      <div 
                        className="w-1/2 bg-emerald-500/80 rounded-t-sm group-hover:bg-emerald-500 transition-colors"
                        style={{ height: `${(data.in / 350) * 100}%` }}
                      />
                      <div 
                        className="w-1/2 bg-rose-500/80 rounded-t-sm group-hover:bg-rose-500 transition-colors"
                        style={{ height: `${(data.out / 350) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground mt-2">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-6 mt-4 border-t border-border/50 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-3 h-3 bg-emerald-500 rounded-sm" /> Cash In
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-3 h-3 bg-rose-500 rounded-sm" /> Cash Out
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts & Risks */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm border-l-4 border-l-rose-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" /> Operational Risks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2">
                <div className="p-3 bg-rose-500/10 rounded-lg border border-rose-500/20">
                  <h4 className="text-sm font-semibold text-rose-600 mb-1">Low Inventory Alert</h4>
                  <p className="text-xs text-rose-600/80">MacBook Pro M3 (SKU-102) is below minimum threshold (2 remaining).</p>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <h4 className="text-sm font-semibold text-amber-600 mb-1">Contract Expiring</h4>
                  <p className="text-xs text-amber-600/80">AWS Enterprise Agreement expires in 45 days.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Department Budgets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">Engineering</span>
                  <span className="text-muted-foreground">85% ($850K / $1M)</span>
                </div>
                <Progress value={85} className="h-2" indicatorClassName="bg-amber-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">Marketing</span>
                  <span className="text-muted-foreground">45% ($180K / $400K)</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">Sales</span>
                  <span className="text-muted-foreground">92% ($552K / $600K)</span>
                </div>
                <Progress value={92} className="h-2" indicatorClassName="bg-rose-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">HR & Admin</span>
                  <span className="text-muted-foreground">60% ($120K / $200K)</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
