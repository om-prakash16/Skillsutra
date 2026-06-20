"use client";

import React from "react";
import { LineChart, BarChart2, Activity, HardDrive, Cpu, Network, History, DatabaseBackup, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockDeployments = [
  { version: "v1.5.0", commit: "a8f9c21", author: "johndoe", status: "SUCCESS", time: "2 hours ago" },
  { version: "v1.4.9", commit: "b7e8d10", author: "sarah_eng", status: "ROLLED_BACK", time: "1 day ago" },
  { version: "v1.4.8", commit: "c6d7e09", author: "johndoe", status: "SUCCESS", time: "3 days ago" },
];

const mockBackups = [
  { type: "PostgreSQL", size: "45.2 GB", status: "COMPLETED", time: "4 hours ago", storage: "gs://skillsutra-backups/db" },
  { type: "S3 Documents", size: "1.2 TB", status: "IN_PROGRESS", time: "Running", storage: "gs://skillsutra-backups/s3" },
];

export default function TelemetryDashboard() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <LineChart className="w-8 h-8 text-indigo-600" /> Infrastructure Telemetry
          </h1>
          <p className="text-muted-foreground mt-1">Real-time metrics, deployments, and backup verification.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white">Last 24 Hours</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700"><ArrowUpRight className="w-4 h-4 mr-2" /> Export PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Core Metrics Cards */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Cpu className="w-6 h-6" /></div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">API CPU Load</p>
                <h3 className="text-2xl font-bold">42.5%</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><HardDrive className="w-6 h-6" /></div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Redis Memory</p>
                <h3 className="text-2xl font-bold">14.2 GB</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><Activity className="w-6 h-6" /></div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">p99 Latency</p>
                <h3 className="text-2xl font-bold">105 ms</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><Network className="w-6 h-6" /></div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">B2B API Usage</p>
                <h3 className="text-2xl font-bold">1.2M <span className="text-sm font-normal text-muted-foreground">req/hr</span></h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Deployments History */}
        <Card>
          <CardHeader className="border-b pb-4">
            <h3 className="font-bold flex items-center gap-2"><History className="w-5 h-5 text-indigo-600" /> Release History</h3>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {mockDeployments.map((dep, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{dep.version}</span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">{dep.commit}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Deployed by @{dep.author} • {dep.time}</p>
                  </div>
                  <span className={`text-sm font-bold ${dep.status === 'SUCCESS' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {dep.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Backup Status */}
        <Card>
          <CardHeader className="border-b pb-4">
            <h3 className="font-bold flex items-center gap-2"><DatabaseBackup className="w-5 h-5 text-indigo-600" /> Disaster Recovery & Backups</h3>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {mockBackups.map((backup, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{backup.type}</span>
                      <span className="text-xs text-muted-foreground">{backup.size}</span>
                    </div>
                    <p className="text-sm text-indigo-600 font-medium mt-1">{backup.storage}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{backup.time}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${backup.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700 animate-pulse'}`}>
                    {backup.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-50 border-t">
              <Button variant="outline" className="w-full text-sm">Verify Integrity Check</Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
