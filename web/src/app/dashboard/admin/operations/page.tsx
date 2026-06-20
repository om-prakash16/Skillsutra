"use client";

import React, { useState } from "react";
import { Server, Activity, Database, Webhook, ToggleLeft, ToggleRight, AlertTriangle, CheckCircle2, Cloud } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockFlags = [
  { key: "new-ai-matching-v2", description: "Use Gemini 1.5 Pro for matching", enabled: true, rollout: 100 },
  { key: "stripe-billing-v3", description: "Migrate to new Stripe subscriptions", enabled: false, rollout: 0 },
  { key: "beta-community-forums", description: "Enable Reddit style forums", enabled: true, rollout: 25 },
];

export default function OperationsCenter() {
  const [flags, setFlags] = useState(mockFlags);

  const toggleFlag = (index: number) => {
    const newFlags = [...flags];
    newFlags[index].enabled = !newFlags[index].enabled;
    setFlags(newFlags);
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-slate-950 text-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Server className="w-8 h-8 text-emerald-500" /> Platform Operations
          </h1>
          <p className="text-slate-400 mt-1">SUPER_ADMIN infrastructure management and observability.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">Export Logs</Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Refresh Telemetry</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* System Health */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b border-slate-800 pb-2">
            <Activity className="w-5 h-5 text-emerald-500" /> System Health
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <Cloud className="w-6 h-6 text-blue-500" />
                  <span className="text-xs font-bold px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Healthy</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">Cloud Run API</h3>
                <p className="text-slate-400 text-sm">Latency: 42ms (p99: 120ms)</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <Database className="w-6 h-6 text-purple-500" />
                  <span className="text-xs font-bold px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Healthy</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">PostgreSQL</h3>
                <p className="text-slate-400 text-sm">Connections: 45 / 100</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <Server className="w-6 h-6 text-red-500" />
                  <span className="text-xs font-bold px-2 py-1 bg-amber-500/10 text-amber-500 rounded-full flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Warning</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">Redis Cache</h3>
                <p className="text-slate-400 text-sm">Memory: 89% (Scaling)</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="border-b border-slate-800 pb-4">
              <h3 className="font-bold text-white flex items-center gap-2"><Webhook className="w-5 h-5 text-indigo-400" /> Webhook Deliveries (Last 24h)</h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-800">
                <div className="p-4 flex justify-between items-center hover:bg-slate-800/50">
                  <div>
                    <p className="font-medium text-white">candidate.applied</p>
                    <p className="text-sm text-slate-400">https://api.greenhouse.io/v1/applications</p>
                  </div>
                  <span className="text-emerald-500 font-mono text-sm">200 OK</span>
                </div>
                <div className="p-4 flex justify-between items-center hover:bg-slate-800/50">
                  <div>
                    <p className="font-medium text-white">job.published</p>
                    <p className="text-sm text-slate-400">https://hooks.slack.com/services/T0000/B0000/XXX</p>
                  </div>
                  <span className="text-red-500 font-mono text-sm">500 ERR (Retrying 2/5)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Flags Sidebar */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b border-slate-800 pb-2">
            <ToggleRight className="w-5 h-5 text-indigo-500" /> Feature Flags
          </h2>

          <div className="space-y-4">
            {flags.map((flag, idx) => (
              <Card key={flag.key} className="bg-slate-900 border-slate-800">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-white font-mono text-sm">{flag.key}</h3>
                      <p className="text-xs text-slate-400 mt-1">{flag.description}</p>
                    </div>
                    <button onClick={() => toggleFlag(idx)}>
                      {flag.enabled ? (
                        <ToggleRight className="w-8 h-8 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-600" />
                      )}
                    </button>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1 text-slate-400">
                      <span>Rollout</span>
                      <span>{flag.rollout}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${flag.rollout}%` }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
