"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Users, ShieldAlert, ShieldCheck, UserCheck, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api } from "@/lib/api/api-client";
import { motion, AnimatePresence } from "framer-motion";

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingWallet, setUpdatingWallet] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.admin.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load user matrix.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = async (wallet: string, role: string) => {
    setUpdatingWallet(wallet);
    try {
      await api.admin.updateUser(wallet, { role });
      toast.success(`Identity clearance upgraded to ${role}.`);
      await fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update identity clearance.");
    } finally {
      setUpdatingWallet(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col justify-between items-start gap-4">
        <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight flex items-center gap-4 text-white">
          <Users className="w-10 h-10 text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]" /> 
          Entity Observation
        </h1>
        <p className="text-muted-foreground text-lg">
          Monitor active platform identities. Escalate execution privileges for candidates, recruiters, and internal staff.
        </p>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group border-t-rose-500/30 border-t-2">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 blur-[120px] rounded-full pointer-events-none" />
        <CardHeader className="relative z-10 border-b border-white/10 flex flex-row items-center justify-between pb-6">
            <div>
                <CardTitle className="text-xl flex items-center gap-2"><Activity className="w-5 h-5 text-rose-500" /> Authorized Identities</CardTitle>
                <CardDescription>All network participants and their clearance levels.</CardDescription>
            </div>
            <Badge variant="outline" className="bg-white/5 border-white/10 font-mono tracking-wider text-rose-500">
                {users.length} CONNECTED
            </Badge>
        </CardHeader>
        <CardContent className="p-0 relative z-10">
          <Table>
            <TableHeader className="bg-black/20">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-12 px-6">Wallet Identity</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-12">Clearance Level</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-12 text-center">AI Resonance</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-white/40 h-12 px-6">Terminal Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center p-16">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-rose-500/50" />
                  </TableCell>
                </TableRow>
              ) : users.map((user, index) => (
                <motion.tr 
                    key={user.id || user.wallet_address} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-white/5 hover:bg-white/[0.02]"
                >
                  <TableCell className="font-medium font-mono text-xs px-6 py-4 text-white/80 tracking-wider">
                      {user.wallet_address.substring(0,6)}...{user.wallet_address.substring(user.wallet_address.length - 4)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                        variant="outline" 
                        className={`text-[10px] uppercase font-black tracking-widest border-white/10 shadow-inner px-3 py-1 ${
                            user.role === 'SUPER_ADMIN' || user.role === 'admin' ? 'border-amber-500/30 text-amber-500 bg-amber-500/10' : 
                            user.role === 'COMPANY' || user.role === 'recruiter' ? 'border-primary/30 text-primary bg-primary/10' :
                            'text-white/50 bg-black/40'
                        }`}
                    >
                        {user.role || 'USER'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-black italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                        {user.current_reputation || user.skill_score || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right px-6 space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-[10px] font-black tracking-widest uppercase bg-primary/10 text-primary hover:bg-primary hover:text-black border border-primary/20 transition-all shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                      onClick={() => handleUpdateRole(user.wallet_address, 'COMPANY')}
                      disabled={updatingWallet === user.wallet_address || user.role === 'COMPANY' || user.role === 'SUPER_ADMIN'}
                    >
                      {updatingWallet === user.wallet_address ? <Loader2 className="w-3 h-3 animate-spin mx-2" /> : <><ShieldCheck className="w-3 h-3 mr-2" /> Promote Recruiter</>}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-white/30 hover:text-white hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 transition-all"
                      title="Terminate Access"
                    >
                      <ShieldAlert className="w-4 h-4" />
                    </Button>
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
