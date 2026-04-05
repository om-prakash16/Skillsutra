"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Search, Filter, Shield, Zap, FileText, Gift, User, Download, ExternalLink, Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function ActivityHistoryPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchLogs();
  }, [user?.id]);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications/activity-history`);
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-24 px-6 space-y-12 h-screen overflow-y-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-12">
        <div className="space-y-4">
           <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 uppercase tracking-tighter font-black italic">
             AUDIT TRAIL
           </Badge>
           <h1 className="text-6xl font-black font-heading tracking-tighter italic">Activity History.</h1>
           <p className="text-muted-foreground max-w-xl italic">A transparent, granular record of all system events and on-chain interactions attributed to your identity.</p>
        </div>
        <div className="flex gap-4">
            <Button size="lg" variant="outline" className="h-16 px-8 border-white/10 font-black tracking-tight italic flex items-center gap-2">
                <Download className="w-5 h-5" /> EXPORT LOGS
            </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-neutral-500" />
                <input 
                    placeholder="Search by action type or description..." 
                    className="w-full h-14 bg-white/5 border border-white/10 pl-16 rounded-2xl text-lg focus:ring-primary/50 transition-all outline-none"
                />
            </div>
            <Button variant="outline" className="h-14 px-8 border-white/10 hover:bg-white/5 font-black text-xs uppercase tracking-widest italic flex items-center gap-2">
                <Filter className="w-4 h-4 ml-2" /> FILTER
            </Button>
      </div>

      {/* Results List */}
      <div className="space-y-6">
          {isLoading ? (
            <div className="p-24 flex justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
          ) : logs.length === 0 ? (
            <div className="p-24 text-center text-neutral-500 italic uppercase bg-white/5 rounded-3xl border border-white/10">No activities recorded yet.</div>
          ) : (
            logs.map((log) => (
              <ActivityLogItem key={log.id} log={log} />
            ))
          )}
      </div>
    </div>
  );
}

function ActivityLogItem({ log }: { log: any }) {
    const iconData = getEventIcon(log.action_type);
    
    return (
        <Card className="bg-[#050505] border-white/10 overflow-hidden relative group hover:border-white/20 transition-all duration-500">
            <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="flex items-center gap-8 w-full md:w-auto">
                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 bg-white/5 transition-colors group-hover:bg-white/10`}>
                        <iconData.icon className={`w-8 h-8 ${iconData.color}`} />
                    </div>
                    <div className="space-y-1 overflow-hidden">
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 border-white/5 px-2 py-0">
                            {log.action_type}
                        </Badge>
                        <h4 className="text-2xl font-black italic tracking-tighter leading-none">
                            {log.description || 'System operation executed.'}
                        </h4>
                        <p className="text-xs text-neutral-500 font-medium truncate max-w-md">
                            Entity: {log.entity_type || 'Platform'} • ID: {log.entity_id || 'N/A'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                    <p className="text-xs font-mono text-neutral-600 uppercase flex items-center gap-2">
                        <History className="w-4 h-4" /> {new Date(log.timestamp).toLocaleString()}
                    </p>
                    {log.tx_hash && (
                        <a 
                            href={`https://explorer.solana.com/tx/${log.tx_hash}`} 
                            target="_blank" 
                            className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 px-4 py-2 rounded-xl text-[10px] font-black italic flex items-center gap-2 transition-all"
                        >
                            <ExternalLink className="w-3 h-3" /> VIEW ON SOLANA
                        </a>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function getEventIcon(type: string) {
    switch (type) {
        case 'ai_scoring': return { icon: Zap, color: 'text-amber-500' };
        case 'nft_mint': return { icon: Gift, color: 'text-primary' };
        case 'job_apply': return { icon: FileText, color: 'text-sky-500' };
        case 'config_update': return { icon: Shield, color: 'text-rose-500' };
        default: return { icon: User, color: 'text-neutral-400' };
    }
}
