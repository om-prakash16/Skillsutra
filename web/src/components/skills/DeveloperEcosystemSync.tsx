"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { API_BASE_URL } from "@/lib/api/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Github, Code2, TerminalSquare, Database, Server, Cpu, Palette, PenTool, Image, Box, Shapes, Youtube, Video, FileText, Mail, Globe } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";

const CATEGORIES = [
  {
    name: "Developers",
    platforms: [
      { id: "github", name: "GitHub", icon: Github, color: "text-zinc-900" },
      { id: "leetcode", name: "LeetCode", icon: Code2, color: "text-yellow-600" },
      { id: "codeforces", name: "Codeforces", icon: TerminalSquare, color: "text-blue-600" },
      { id: "codechef", name: "CodeChef", icon: Server, color: "text-amber-700" },
      { id: "hackerrank", name: "HackerRank", icon: Database, color: "text-green-600" },
      { id: "hackerearth", name: "HackerEarth", icon: Cpu, color: "text-indigo-500" },
      { id: "stackoverflow", name: "Stack Overflow", icon: Database, color: "text-orange-600" }
    ]
  },
  {
    name: "Designers",
    platforms: [
      { id: "behance", name: "Behance", icon: Palette, color: "text-blue-600", placeholder: "Behance ID (Username)" },
      { id: "dribbble", name: "Dribbble", icon: PenTool, color: "text-pink-500", placeholder: "Dribbble ID" },
      { id: "adobe_portfolio", name: "Adobe Portfolio", icon: Image, color: "text-red-600", placeholder: "Full Portfolio URL" },
    ]
  },
  {
    name: "3D Artists",
    platforms: [
      { id: "artstation", name: "ArtStation", icon: Box, color: "text-blue-400", placeholder: "ArtStation ID" },
      { id: "sketchfab", name: "Sketchfab", icon: Shapes, color: "text-blue-500", placeholder: "Sketchfab ID" },
    ]
  },
  {
    name: "Video & Motion",
    platforms: [
      { id: "youtube", name: "YouTube", icon: Youtube, color: "text-red-600", placeholder: "Channel ID or Username" },
      { id: "vimeo", name: "Vimeo", icon: Video, color: "text-blue-400", placeholder: "Vimeo ID" },
    ]
  },
  {
    name: "Writers & Content",
    platforms: [
      { id: "medium", name: "Medium", icon: FileText, color: "text-zinc-900", placeholder: "Medium @Username" },
      { id: "substack", name: "Substack", icon: Mail, color: "text-orange-500", placeholder: "Substack Handle" },
      { id: "personal_website", name: "Personal Website", icon: Globe, color: "text-green-600", placeholder: "Full Website URL" },
    ]
  }
];

export function DeveloperEcosystemSync() {
  const { user, signInWithGitHub } = useAuth();
  const [usernames, setUsernames] = useState<Record<string, string>>({
    github: user?.username || "" 
  });
  const [syncing, setSyncing] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, any>>({
    ...(user?.dynamic_profile_data?.integrations || {}),
    ...(user?.dynamic_profile_data?.github ? { github: user.dynamic_profile_data.github } : {})
  });

  const handleSync = async (platformId: string) => {
    const handle = usernames[platformId];
    if (!handle) {
      toast.error(`Please enter a username for ${platformId}`);
      return;
    }

    setSyncing(prev => ({ ...prev, [platformId]: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/integrations/sync/${platformId}?username=${encodeURIComponent(handle)}`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (!res.ok) throw new Error("Failed to sync platform");
      const json = await res.json();
      
      setResults(prev => ({ ...prev, [platformId]: json.data }));
      toast.success(`${platformId} profile synced successfully!`);
    } catch (err: any) {
      toast.error(err.message || `Failed to sync ${platformId}`);
    } finally {
      setSyncing(prev => ({ ...prev, [platformId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-2">Professional Presence Sync</h2>
        <p className="text-sm text-muted-foreground">
          Sync your public profile signals across major platforms to instantly validate your skills. Use IDs/Usernames for supported platforms, or full URLs for custom sites.
        </p>
      </div>

      <div className="space-y-8">
        {CATEGORIES.map((category) => (
          <div key={category.name} className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">{category.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.platforms.map((platform) => (
                <Card key={platform.id} className="bg-card border-border overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <platform.icon className={`w-24 h-24 ${platform.color}`} />
                  </div>
                  <CardHeader className="pb-3 relative z-10">
                    <CardTitle className="text-base flex items-center gap-2">
                      <platform.icon className={`w-5 h-5 ${platform.color}`} />
                      {platform.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 space-y-4">
              {!results[platform.id] ? (
                platform.id === "github" ? (
                  <Button 
                    size="sm" 
                    className="h-10 w-full font-bold uppercase tracking-widest text-[10px] bg-[#24292e] hover:bg-[#24292e]/90 text-white"
                    onClick={() => signInWithGitHub(user?.role, "link")}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Securely Link GitHub
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Input 
                      placeholder={(platform as any).placeholder || `Enter ${platform.name} ID`} 
                      className="h-9 bg-background border-input text-xs"
                      value={usernames[platform.id] || ""}
                      onChange={(e) => setUsernames(prev => ({ ...prev, [platform.id]: e.target.value }))}
                    />
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="h-9 font-bold"
                      onClick={() => handleSync(platform.id)}
                      disabled={syncing[platform.id]}
                    >
                      {syncing[platform.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sync"}
                    </Button>
                  </div>
                )
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">Synced: @{results[platform.id].username || results[platform.id].username_or_url}</Badge>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => {
                        const newResults = {...results};
                        delete newResults[platform.id];
                        setResults(newResults);
                    }}>Resync</Button>
                  </div>
                  
                  {/* Render Platform Specific Stats */}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {Object.entries(results[platform.id])
                      .filter(([k]) => !['platform', 'username', 'username_or_url', 'status', 'link', 'badges', 'certifications', 'top_tags', 'analysis'].includes(k))
                      .map(([key, val]) => {
                          if (typeof val === 'object') return null;
                          return (
                            <div key={key} className="bg-muted p-2 rounded-md border border-border truncate">
                                <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">{key.replace('_', ' ')}</p>
                                <p className="text-sm font-bold text-foreground">{String(val)}</p>
                            </div>
                          )
                      })}
                  </div>

                  {/* Custom Renderers for Complex Data */}
                  {platform.id === "github" && results.github.primary_languages && (
                      <div className="mt-2 space-y-2">
                        <div className="flex flex-wrap gap-1">
                            {results.github.primary_languages.map((lang: string) => (
                                <Badge key={lang} variant="outline" className="text-[10px] bg-muted">{lang}</Badge>
                            ))}
                        </div>
                        {results.github.metrics && (
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-muted p-2 rounded-md border border-border truncate">
                                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">CODE QUALITY</p>
                                    <p className="text-sm font-bold text-green-500">{results.github.metrics.code_quality_index}/100</p>
                                </div>
                                <div className="bg-muted p-2 rounded-md border border-border truncate">
                                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">COMPLEXITY</p>
                                    <p className="text-sm font-bold text-amber-500">{results.github.metrics.architectural_complexity_handling}/100</p>
                                </div>
                            </div>
                        )}
                        {results.github.ai_insights && (
                            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-xs text-indigo-300">
                                🤖 {results.github.ai_insights.insight}
                            </div>
                        )}
                      </div>
                  )}

                  {platform.id === "leetcode" && results.leetcode.solved && (
                      <div className="mt-2 grid grid-cols-3 gap-2">
                          {Object.entries(results.leetcode.solved).map(([diff, count]) => (
                              <div key={diff} className="bg-muted p-2 rounded-md border border-border flex flex-col items-center">
                                  <p className={`text-[9px] uppercase font-black tracking-widest ${diff === 'Easy' ? 'text-green-500' : diff === 'Medium' ? 'text-amber-500' : 'text-red-500'}`}>{diff}</p>
                                  <p className="text-sm font-bold text-foreground">{String(count)}</p>
                              </div>
                          ))}
                      </div>
                  )}
                  
                  {platform.id === "stackoverflow" && results.stackoverflow.badges && (
                      <div className="mt-2 grid grid-cols-3 gap-2">
                          <div className="bg-muted p-2 rounded-md border border-border flex flex-col items-center">
                              <p className="text-[9px] text-amber-500 uppercase font-black tracking-widest">GOLD</p>
                              <p className="text-sm font-bold text-amber-600">{results.stackoverflow.badges.gold}</p>
                          </div>
                          <div className="bg-muted p-2 rounded-md border border-border flex flex-col items-center">
                              <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">SILVER</p>
                              <p className="text-sm font-bold text-zinc-500">{results.stackoverflow.badges.silver}</p>
                          </div>
                          <div className="bg-muted p-2 rounded-md border border-border flex flex-col items-center">
                              <p className="text-[9px] text-amber-700 uppercase font-black tracking-widest">BRONZE</p>
                              <p className="text-sm font-bold text-amber-700">{results.stackoverflow.badges.bronze}</p>
                          </div>
                      </div>
                  )}

                  {results[platform.id].status && (
                      <div className="mt-2 p-2 bg-green-500/10 border border-green-500/20 rounded-md">
                          <p className="text-xs font-bold text-green-600 flex items-center gap-2">✓ {results[platform.id].status}</p>
                      </div>
                  )}

                  {/* Render Badges if present */}
                  {results[platform.id].badges && Array.isArray(results[platform.id].badges) && (
                      <div className="flex flex-wrap gap-1 mt-2">
                          {results[platform.id].badges.map((b: string) => (
                              <Badge key={b} variant="secondary" className="text-[9px] px-1.5 py-0 bg-secondary text-secondary-foreground">{b}</Badge>
                          ))}
                      </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        </div>
        </div>
      ))}
      </div>
    </div>
  );
}
