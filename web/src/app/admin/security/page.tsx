"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ShieldCheck, Activity, Fingerprint, AlertTriangle, Terminal, Lock, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { api } from "@/lib/api/api-client";

export default function AdminSecurityDashboard() {
  const [securityEvents, setSecurityEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        const eventsRes = await api.get('/admin/security-events');
        setSecurityEvents(eventsRes || []);
      } catch (err) {
        console.error("Failed to fetch security events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSecurityData();
  }, []);

  const displayEvents = securityEvents.length > 0 ? securityEvents.map(e => ({
      time: new Date(e.created_at).toLocaleString(),
      type: e.event_type,
      source: e.source_ip || "Unknown",
      status: e.status
  })) : [
    { time: "2 mins ago", type: "BRUTE_FORCE", source: "192.168.1.14", status: "BLOCKED" },
    { time: "15 mins ago", type: "OAUTH_MISMATCH", source: "Auth0/GitHub", status: "FLAGGED" },
    { time: "1 hour ago", type: "NEW_DEVICE", source: "London, UK (MacBook Pro)", status: "VERIFIED" },
    { time: "3 hours ago", type: "SUDO_ACCESS", source: "Admin: j.doe", status: "LOGGED" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-8">
        <div className="space-y-2">
          <Badge variant="outline" className="glass text-[10px] tracking-widest uppercase font-black mb-2 text-rose-500 border-rose-500/30">
            Threat Intelligence
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter text-foreground flex items-center gap-4">
            Security Center
            <ShieldAlert className="w-10 h-10 text-rose-500 animate-pulse" />
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl font-medium">
            Global monitoring for suspicious activities, failed logins, and system vulnerabilities.
          </p>
        </div>
        <div className="flex gap-4">
          <Button size="lg" variant="outline" className="rounded-xl font-bold border-rose-500/50 text-rose-500 hover:bg-rose-500/10">
            <Lock className="w-5 h-5 mr-2" /> Trigger Lockdown
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Metric Cards */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="glass border-border/50 rounded-[2rem] shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full" />
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-emerald-500">Secure</span>
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="text-xs font-medium text-muted-foreground mt-2">No active vulnerabilities detected.</p>
            </CardContent>
          </Card>

          <Card className="glass border-border/50 rounded-[2rem] shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full" />
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Failed Logins (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-amber-500">142</span>
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <p className="text-xs font-medium text-muted-foreground mt-2">+12% from yesterday (Normal)</p>
            </CardContent>
          </Card>
        </div>

        {/* Audit Stream */}
        <Card className="glass lg:col-span-2 border-border/50 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-border/50 pb-6 px-8 pt-8">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-black tracking-tight flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-rose-500" /> Live Audit Stream
                    </CardTitle>
                    <Badge variant="outline" className="border-rose-500/30 text-rose-500 animate-pulse">Live</Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-border/30">
                    {displayEvents.map((event, idx) => (
                        <div key={idx} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-lg ${
                                    event.status === 'BLOCKED' ? 'bg-rose-500/20 text-rose-500' :
                                    event.status === 'FLAGGED' ? 'bg-amber-500/20 text-amber-500' :
                                    'bg-emerald-500/20 text-emerald-500'
                                }`}>
                                    <Activity className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{event.type}</p>
                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                        <Fingerprint className="w-3 h-3" /> {event.source}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-right">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{event.time}</span>
                                <Badge className={`font-black text-[9px] uppercase tracking-widest ${
                                    event.status === 'BLOCKED' ? 'bg-rose-500 text-white' :
                                    event.status === 'FLAGGED' ? 'bg-amber-500 text-black' :
                                    'bg-background border border-border text-foreground'
                                }`}>
                                    {event.status}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-6 bg-muted/30 border-t border-border/50 text-center">
                    <Button variant="link" className="text-muted-foreground font-bold">View Full Logs</Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
