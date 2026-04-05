"use client";

import { useAuth } from "@/context/auth-context";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Loader2, UserPlus, Users, Trash2, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export default function TeamManagement() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const companyId = searchParams.get("id") || "";
  
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [invite, setInvite] = useState({ wallet_address: "", role: "VIEWER" });

  useEffect(() => {
    if (companyId) fetchTeam();
  }, [companyId]);

  const fetchTeam = async () => {
    try {
      const token = localStorage.getItem("sp_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/company/team?company_id=${companyId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!invite.wallet_address) return;
    try {
      const token = localStorage.getItem("sp_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/company/invite-member`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ company_id: companyId, ...invite })
      });

      if (res.ok) {
        toast.success("Team member invited!");
        setInvite({ wallet_address: "", role: "VIEWER" });
        fetchTeam();
      } else {
        const data = await res.json();
        throw new Error(data.detail);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-black font-heading tracking-tight flex items-center gap-3 italic">
          <ShieldCheck className="w-8 h-8 text-primary" /> Multi-Tenant Team Control
        </h1>
        <p className="text-muted-foreground mt-2">Manage restricted access for your HR and interview teams.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Invite Colleague</CardTitle>
            <CardDescription>Grant access to a verified Solana wallet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              placeholder="Wallet Address (e.g. 8xJp...)" 
              value={invite.wallet_address}
              onChange={e => setInvite({...invite, wallet_address: e.target.value})}
              className="bg-transparent border-white/10"
            />
            <Select value={invite.role} onValueChange={v => setInvite({...invite, role: v})}>
                <SelectTrigger className="bg-transparent border-white/10 font-bold">
                    <SelectValue placeholder="Access Role" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-white/10">
                    <SelectItem value="HR">HR Manager</SelectItem>
                    <SelectItem value="INTERVIEWER">Verified Interviewer</SelectItem>
                    <SelectItem value="VIEWER">Guest Viewer</SelectItem>
                </SelectContent>
            </Select>
            <Button onClick={handleInvite} className="w-full bg-white text-black hover:bg-neutral-200 font-black tracking-tight h-11">
                <UserPlus className="w-4 h-4 mr-2" /> SEND INVITATION
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-xl overflow-hidden">
           <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-primary"/> Active Internal Members</CardTitle>
           </CardHeader>
           <CardContent>
             {isLoading ? (
                <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
             ) : (
                <div className="space-y-4">
                  {members.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 transition-all hover:bg-white/10">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary">
                              {member.company_role[0]}
                           </div>
                           <div className="space-y-0.5">
                              <p className="font-bold font-mono text-[10px] text-neutral-500 uppercase tracking-widest">{member.users?.wallet_address}</p>
                              <Badge variant="outline" className={`text-[10px] tracking-tight ${member.company_role === 'OWNER' ? 'bg-primary/20 text-primary border-primary/40' : 'bg-white/5 text-neutral-400'}`}>
                                {member.company_role}
                              </Badge>
                           </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-rose-500 hover:bg-rose-500/10 h-8 w-8">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                  ))}
                </div>
             )}
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
