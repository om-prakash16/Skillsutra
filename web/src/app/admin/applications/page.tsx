"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Users, Search, Filter, ArrowUpRight, CheckCircle2, XCircle, Clock, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/lib/api/api-client";
import { motion, AnimatePresence } from "framer-motion";

export default function ApplicationModeration() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getAllApplications();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load application telemetry.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
      switch (status?.toLowerCase()) {
          case 'hired': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
          case 'rejected': return <XCircle className="w-4 h-4 text-rose-500" />;
          case 'interviewing': return <Zap className="w-4 h-4 text-primary" />;
          default: return <Clock className="w-4 h-4 text-white/30" />;
      }
  }

  const filteredApps = applications.filter(a => 
      a.jobs?.title?.toLowerCase().includes(search.toLowerCase()) || 
      a.users?.wallet_address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight flex items-center gap-4 text-white">
              <Users className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.8)]" /> 
              Hiring Lifecycle Telemetry
            </h1>
            <p className="text-muted-foreground text-lg mt-3">
              Real-time monitoring of all active application protocols. Oversee hiring velocity and candidate matching resonance.
            </p>
        </div>
      </div>

      <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by job title or candidate wallet..." 
            className="h-14 bg-white/5 border-white/10 pl-14 text-lg focus-visible:ring-primary/30 rounded-2xl"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group border-t-primary/30 border-t-2">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <CardHeader className="relative z-10 border-b border-white/10 flex flex-row items-center justify-between pb-6">
            <div>
                <CardTitle className="text-xl flex items-center gap-2"><ArrowUpRight className="w-5 h-5 text-primary" /> Active Engagement Matrix</CardTitle>
                <CardDescription>Comprehensive oversight of the recruitment network.</CardDescription>
            </div>
            <Badge variant="outline" className="bg-white/5 border-white/10 font-mono tracking-wider text-primary uppercase">
                {filteredApps.length} ACTIVE_CHANNELS
            </Badge>
        </CardHeader>
        <CardContent className="p-0 relative z-10">
          <Table>
            <TableHeader className="bg-black/20">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-14 px-6">Candidate Vector</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-14">Target Listing</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-14">Match Resonance</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-14">Protocol Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center p-24">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary/50" />
                  </TableCell>
                </TableRow>
              ) : filteredApps.map((app, index) => (
                <motion.tr 
                    key={app.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-white/5 hover:bg-white/[0.02]"
                >
                  <TableCell className="px-6 py-5">
                      <div className="flex flex-col">
                          <span className="font-bold text-white tracking-tight font-mono text-xs italic">{app.users?.wallet_address.substring(0,8)}...{app.users?.wallet_address.substring(app.users?.wallet_address.length-4)}</span>
                          <span className="text-[10px] text-white/30 uppercase mt-1">Applied {new Date(app.created_at).toLocaleDateString()}</span>
                      </div>
                  </TableCell>
                  <TableCell>
                      <span className="text-xs font-black uppercase text-white/80 tracking-widest">{app.jobs?.title || 'GENERIC_JOB'}</span>
                  </TableCell>
                  <TableCell>
                      <div className="flex items-center gap-3">
                          <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden max-w-[100px]">
                              <div 
                                  className={`h-full bg-gradient-to-r ${app.ai_match_score > 70 ? 'from-emerald-400 to-emerald-600' : 'from-primary to-blue-600'}`} 
                                  style={{ width: `${app.ai_match_score || 0}%` }} 
                              />
                          </div>
                          <span className="text-xs font-black italic text-white/70">{app.ai_match_score || 0}%</span>
                      </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        {getStatusIcon(app.status)}
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                            {app.status || 'PENDING_MOD'}
                        </span>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
