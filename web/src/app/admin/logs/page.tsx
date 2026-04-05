"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Activity, Terminal, ShieldAlert, GitCommit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api } from "@/lib/api/api-client";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export default function ActivityLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
    
    // Polling simulation for Real-Time Event Stream
    const interval = setInterval(() => {
        fetchLogs(true);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async (silent = false) => {
    if(!silent) setIsLoading(true);
    try {
      const data = await api.activity.logs("limit=100");
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      if(!silent) toast.error("Failed to load audit stream.");
    } finally {
      setIsLoading(false);
    }
  };

  const getActionColor = (actionType: string) => {
      if(actionType.includes("delete") || actionType.includes("fail") || actionType.includes("block")) return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      if(actionType.includes("create") || actionType.includes("success") || actionType.includes("mint")) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      if(actionType.includes("update") || actionType.includes("modify")) return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      return "text-white/70 bg-white/5 border-white/10";
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col justify-between items-start gap-4">
        <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight flex items-center gap-4 text-white">
          <Activity className="w-10 h-10 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" /> 
          Terminal Audit Stream
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl">
          Real-time chronological ledger of all platform administrative, AI, and verification events.
        </p>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group border-t-emerald-500/30 border-t-2">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
        <CardHeader className="relative z-10 border-b border-white/10 flex flex-row items-center justify-between pb-6 bg-black/20">
            <div>
                <CardTitle className="text-xl flex items-center gap-2"><Terminal className="w-5 h-5 text-emerald-500" /> Event Stream</CardTitle>
                <CardDescription>Live monitoring of structural mutations and access overrides.</CardDescription>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Connect</span>
            </div>
        </CardHeader>
        <CardContent className="p-0 relative z-10 h-[600px] overflow-y-auto custom-scrollbar bg-black/40">
          <Table>
            <TableHeader className="sticky top-0 bg-[#030712]/90 backdrop-blur-md z-20">
              <TableRow className="border-b border-white/10 hover:bg-transparent">
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-12 px-6 w-32">Timestamp</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-12">Action Protocol</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-12">Entity Vector</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-white/40 h-12 px-6">Origin Identity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
              {isLoading && logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center p-24">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500/50" />
                      <p className="text-emerald-500/50 uppercase tracking-widest text-xs mt-4 font-black font-mono">Syncing Audit Protocol...</p>
                  </TableCell>
                </TableRow>
              ) : logs.map((log, index) => (
                <motion.tr 
                    key={log.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-white/5 hover:bg-white/[0.04] transition-colors"
                >
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs text-white/50 font-mono tracking-wider">
                          {log.created_at ? formatDistanceToNow(new Date(log.created_at), { addSuffix: true }) : 'N/A'}
                      </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 ${getActionColor(log.action_type || '')}`}>
                        <GitCommit className="w-3 h-3 mr-1 inline-block opacity-70" />
                        {log.action_type?.replace(/_/g, ' ') || 'UNKNOWN_EVENT'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                      <div className="flex flex-col">
                          <span className="text-xs font-bold text-white/80 uppercase tracking-wider">{log.entity_type || 'SYSTEM'}</span>
                          <span className="text-[10px] text-white/40 font-mono mt-1">{log.entity_id || 'N/A'}</span>
                      </div>
                  </TableCell>
                  <TableCell className="text-right px-6">
                      <code className="text-xs bg-black/60 border border-white/5 px-2 py-1 rounded text-white/50 font-mono">
                          {log.user_id ? `${log.user_id.substring(0,8)}...` : 'SYSTEM_DAEMON'}
                      </code>
                  </TableCell>
                </motion.tr>
              ))}
              {logs.length === 0 && !isLoading && (
                  <TableRow>
                      <TableCell colSpan={4} className="text-center p-24 text-white/30 tracking-widest uppercase font-black text-xs">
                          <ShieldAlert className="w-8 h-8 mx-auto opacity-50 mb-4" />
                          No Audit Events Recorded
                      </TableCell>
                  </TableRow>
              )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
