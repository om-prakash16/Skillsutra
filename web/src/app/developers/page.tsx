"use client";

import React, { useState } from "react";
import { Terminal, Key, Webhook, BookOpen, Code, Copy, CheckCircle2, Plus } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockKeys = [
  { name: "Production ATS Sync", key: "sk_live_8f92j...4k9m", scopes: ["read:candidates", "write:jobs"], lastUsed: "2 mins ago" },
  { name: "Development Sandbox", key: "sk_test_1m2n3...9k8j", scopes: ["read:candidates"], lastUsed: "14 days ago" }
];

export default function DeveloperPortal() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-slate-950 text-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Terminal className="w-8 h-8 text-indigo-500" /> Developer Portal
          </h1>
          <p className="text-slate-400 mt-1">Manage API Keys, Webhooks, and integrate with SkillSutra.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800"><BookOpen className="w-4 h-4 mr-2" /> API Reference</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Keys and Webhooks */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="border-b border-slate-800 pb-4 flex flex-row justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <Key className="w-5 h-5 text-indigo-400" /> API Keys
              </h2>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white"><Plus className="w-4 h-4 mr-2"/> Generate New Key</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-800">
                {mockKeys.map((k, idx) => (
                  <div key={idx} className="p-6 hover:bg-slate-800/50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-white text-lg">{k.name}</h3>
                        <p className="text-sm text-slate-400 mt-1">Last used: {k.lastUsed}</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-slate-700 text-red-400 hover:bg-red-400/10 hover:text-red-300">Revoke</Button>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <code className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-md font-mono text-emerald-400 flex-1">
                        {k.key}
                      </code>
                      <Button variant="outline" size="icon" className="border-slate-700 bg-slate-950 hover:bg-slate-800" onClick={handleCopy}>
                        {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      {k.scopes.map(s => (
                        <span key={s} className="text-xs font-mono bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="border-b border-slate-800 pb-4 flex flex-row justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <Webhook className="w-5 h-5 text-pink-400" /> Webhook Endpoints
              </h2>
              <Button size="sm" className="bg-pink-600 hover:bg-pink-700 text-white"><Plus className="w-4 h-4 mr-2"/> Add Endpoint</Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg">
                <div>
                  <h3 className="font-bold text-white text-sm mb-1">https://api.yourcompany.com/webhooks/skillsutra</h3>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-1 rounded">job.applied</span>
                    <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-1 rounded">candidate.hired</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Active
                  </span>
                  <p className="text-xs text-slate-500">100% Delivery Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Col: Quickstart */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 border-indigo-500/30">
            <CardContent className="p-6">
              <h3 className="font-bold text-white flex items-center gap-2 text-lg mb-4">
                <Code className="w-5 h-5" /> Quickstart Guide
              </h3>
              <p className="text-sm text-indigo-200 mb-4">
                Integrate the SkillSutra AI matching engine directly into your own ATS in 3 lines of code.
              </p>
              
              <div className="bg-slate-950 rounded-md p-4 border border-slate-800 font-mono text-sm overflow-x-auto">
                <span className="text-pink-400">curl</span> -X GET \<br/>
                <span className="text-slate-300 ml-4">https://api.skillsutra.com/v1/external/candidates \</span><br/>
                <span className="text-slate-300 ml-4">-H <span className="text-emerald-400">"Authorization: Bearer sk_live_..."</span></span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
