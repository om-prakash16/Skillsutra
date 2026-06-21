"use client";

import React from "react";
import { 
  Terminal, Code2, Copy, FileJson, Play, Download,
  ExternalLink, Github, ArrowRight, ShieldCheck, Database, Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function DeveloperPortalPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header section designed to look technical and clean */}
      <div className="border-b border-border/50 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Terminal className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight font-mono">Developer Portal</h1>
          </div>
          <p className="text-muted-foreground">Build, test, and deploy OAuth apps and custom integrations on our API.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Github className="w-4 h-4 mr-2" /> GitHub Repo</Button>
          <Button><Plus className="w-4 h-4 mr-2" /> New OAuth App</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Quick Start Guide */}
          <Card className="border-border/50 shadow-sm bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Quick Start Guide</CardTitle>
              <CardDescription>Get up and running with the API in minutes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">1</div>
                  <h3 className="font-semibold text-sm">Install the official SDK</h3>
                </div>
                <div className="relative ml-9">
                  <pre className="bg-black text-emerald-400 p-3 rounded-md text-xs font-mono overflow-x-auto">
                    <code>npm install @enterprise-os/sdk</code>
                  </pre>
                  <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-6 w-6 text-emerald-400/50 hover:text-emerald-400"><Copy className="w-3 h-3" /></Button>
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">2</div>
                  <h3 className="font-semibold text-sm">Initialize the client</h3>
                </div>
                <div className="relative ml-9">
                  <pre className="bg-black text-gray-300 p-3 rounded-md text-xs font-mono overflow-x-auto">
                    <code className="text-purple-400">import</code> {'{'} Client {'}'} <code className="text-purple-400">from</code> <code className="text-amber-300">'@enterprise-os/sdk'</code>;{'\n\n'}
                    <code className="text-purple-400">const</code> client = <code className="text-purple-400">new</code> Client({'{'}{'\n'}
                    {'  '}apiKey: process.env.ENTERPRISE_API_KEY,{'\n'}
                    {'}'});
                  </pre>
                  <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-6 w-6 text-gray-400 hover:text-white"><Copy className="w-3 h-3" /></Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-primary hover:text-primary/80">View Full Documentation <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </CardFooter>
          </Card>

          {/* Interactive API Explorer */}
          <Card className="border-border/50 shadow-sm bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg flex items-center gap-2"><Play className="w-4 h-4" /> API Explorer</CardTitle>
                <CardDescription>Test endpoints directly from the browser.</CardDescription>
              </div>
              <Badge variant="outline" className="font-mono bg-blue-500/10 text-blue-500 border-blue-500/20">v2.0.4</Badge>
            </CardHeader>
            <CardContent>
              <div className="border border-border/50 rounded-lg overflow-hidden flex flex-col h-64">
                <div className="bg-muted/50 p-2 border-b border-border/50 flex gap-2">
                  <select className="bg-background border border-border/50 rounded text-xs px-2 py-1 font-mono outline-none">
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                    <option>DELETE</option>
                  </select>
                  <Input defaultValue="https://api.enterprise.com/v2/users/me" className="h-7 text-xs font-mono flex-1 bg-background" />
                  <Button size="sm" className="h-7 px-4 text-xs">Send Request</Button>
                </div>
                <div className="flex-1 bg-black p-4 text-xs font-mono overflow-auto">
                  <div className="text-emerald-400 mb-2">{"// 200 OK - 42ms"}</div>
                  <pre className="text-gray-300">
{`{
  "id": "usr_9421x...",
  "object": "user",
  "email": "developer@acme.com",
  "role": "admin",
  "permissions": [
    "api:read",
    "api:write"
  ],
  "created_at": 1729241400
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm bg-card">
            <CardHeader>
              <CardTitle className="text-base">Your OAuth Apps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border border-border/50 rounded-lg hover:border-primary/40 cursor-pointer transition-colors group">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">Acme Analytics Sync</h4>
                  <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600">Active</Badge>
                </div>
                <p className="text-xs text-muted-foreground font-mono mb-2">Client ID: client_8a4b...</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Key className="w-3 h-3" /> 2 active tokens
                </div>
              </div>
              <Button variant="outline" className="w-full border-dashed"><Plus className="w-4 h-4 mr-2" /> Register New App</Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm bg-card">
            <CardHeader>
              <CardTitle className="text-base">SDK Downloads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start font-mono text-xs text-muted-foreground hover:text-foreground">
                <Download className="w-3.5 h-3.5 mr-3" /> @enterprise-os/node (v2.1.0)
              </Button>
              <Button variant="ghost" className="w-full justify-start font-mono text-xs text-muted-foreground hover:text-foreground">
                <Download className="w-3.5 h-3.5 mr-3" /> enterprise-os-python (v2.1.0)
              </Button>
              <Button variant="ghost" className="w-full justify-start font-mono text-xs text-muted-foreground hover:text-foreground">
                <Download className="w-3.5 h-3.5 mr-3" /> enterprise-os-go (v2.0.4)
              </Button>
              <div className="pt-2 mt-2 border-t border-border/50">
                <Button variant="link" className="w-full text-xs text-primary"><ExternalLink className="w-3 h-3 mr-2" /> View OpenAPI Spec</Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

// Plus icon fallback
function Plus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
