"use client";

import React from "react";
import { Globe, Users, Building, Cpu, BrainCircuit, Activity, LineChart, TrendingUp, ShieldAlert, Zap } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CommandCenter() {
  return (
    <div className="flex-1 bg-slate-950 text-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 py-6 px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center border border-indigo-500/30">
              <Globe className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">EOS Command Center</h1>
              <p className="text-slate-400 mt-1">Super Admin global operating system dashboard.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div> Live Data Sync
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-6">
        
        {/* Global KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-md"><Users className="w-5 h-5" /></div>
                <span className="text-emerald-400 text-sm font-bold flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> 14%</span>
              </div>
              <h3 className="text-slate-400 text-sm font-medium">Digital Twins (Users)</h3>
              <p className="text-3xl font-bold mt-1">1.2M</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-md"><Building className="w-5 h-5" /></div>
                <span className="text-emerald-400 text-sm font-bold flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> 8%</span>
              </div>
              <h3 className="text-slate-400 text-sm font-medium">Active Companies</h3>
              <p className="text-3xl font-bold mt-1">12,450</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-md"><Zap className="w-5 h-5" /></div>
                <span className="text-emerald-400 text-sm font-bold flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> 22%</span>
              </div>
              <h3 className="text-slate-400 text-sm font-medium">Workflow Automations</h3>
              <p className="text-3xl font-bold mt-1">45.2k</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-pink-500/10 text-pink-400 rounded-md"><BrainCircuit className="w-5 h-5" /></div>
                <span className="text-emerald-400 text-sm font-bold flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> 105%</span>
              </div>
              <h3 className="text-slate-400 text-sm font-medium">AI Inferences (24h)</h3>
              <p className="text-3xl font-bold mt-1">8.5M</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart Area */}
          <Card className="lg:col-span-2 bg-slate-900 border-slate-800">
            <CardHeader className="border-b border-slate-800">
              <div className="flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2 text-slate-100">
                  <LineChart className="w-5 h-5 text-indigo-400" /> Platform Expansion Velocity
                </h3>
                <select className="bg-slate-950 border border-slate-800 text-sm rounded-md px-2 py-1">
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                </select>
              </div>
            </CardHeader>
            <CardContent className="p-6 flex items-center justify-center h-80">
              <div className="text-center text-slate-500">
                <Activity className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>Ecosystem Growth Chart (Chart.js / Recharts placeholder)</p>
              </div>
            </CardContent>
          </Card>

          {/* AI Risk & Fraud Radar */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="border-b border-slate-800">
              <h3 className="font-bold flex items-center gap-2 text-slate-100">
                <ShieldAlert className="w-5 h-5 text-red-400" /> AI Risk Radar
              </h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-800">
                <div className="p-4 hover:bg-slate-800/50">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-sm text-slate-200">Bot Registration Spike</p>
                    <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded">CRITICAL</span>
                  </div>
                  <p className="text-xs text-slate-400">4,200 suspicious accounts flagged in APAC region.</p>
                  <Button variant="link" className="text-indigo-400 px-0 text-xs h-auto mt-2">Trigger Auto-Ban Pipeline &rarr;</Button>
                </div>

                <div className="p-4 hover:bg-slate-800/50">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-sm text-slate-200">App Store API Abuse</p>
                    <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">WARNING</span>
                  </div>
                  <p className="text-xs text-slate-400">Partner "Acme HR" is hitting rate limits constantly.</p>
                </div>

                <div className="p-4 hover:bg-slate-800/50">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-sm text-slate-200">Database Churn Predictor</p>
                    <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">INFO</span>
                  </div>
                  <p className="text-xs text-slate-400">Enterprise churn risk calculated: 2.1% (Healthy).</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
