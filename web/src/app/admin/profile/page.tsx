"use client";

import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
    ShieldAlert, 
    Terminal, 
    Radar, 
    Key, 
    Fingerprint, 
    Activity, 
    UserCheck,
    Mail,
    Smartphone,
    Globe,
    Cpu,
    Lock,
    EyeOff
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminProfile() {
    const { user } = useAuth();
    
    // Fallback data if user state is empty during hydration bounce
    const adminEmail = user?.email || "sysadmin@nexus.core";
    const adminWallet = user?.wallet_address || "0x9F3E8c...4D21";
    const adminName = user?.name || "System Administrator";

    return (
        <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
            {/* Hero Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-indigo-500 rounded-full animate-pulse" />
                        <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/5 px-4 font-black tracking-widest text-[9px] uppercase">
                            Clearance Level: OMEGA
                        </Badge>
                        <Badge variant="outline" className="border-rose-500/30 text-rose-500 bg-rose-500/5 px-4 font-black tracking-widest text-[9px] uppercase">
                            <ShieldAlert className="w-3 h-3 mr-1 inline-block mb-0.5" />
                            GOD MODE ACTIVE
                        </Badge>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black font-heading tracking-tighter text-white uppercase italic flex items-center gap-6">
                        Operational <span className="text-indigo-500">Nexus</span> 
                        <Cpu className="w-12 h-12 text-indigo-500 animate-pulse" />
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl font-medium">
                        Administrative Identity Core. Managing system-wide encrypted protocols, heuristic boundaries, and global authentication keys.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button size="lg" className="h-14 px-8 bg-black border border-white/10 text-white hover:bg-white/10 font-black tracking-tighter uppercase transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-white/5">
                        <Lock className="w-4 h-4 mr-3" /> Force Remote Logout
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Identity Matrix */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-xl lg:col-span-1 border-t-indigo-500/20 border-t-2 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
                    <CardHeader className="border-b border-white/5 pb-6">
                         <CardTitle className="text-xl flex items-center gap-3">
                            <Fingerprint className="w-6 h-6 text-indigo-500" /> Super User Identity
                        </CardTitle>
                        <CardDescription className="text-[10px] uppercase font-black tracking-widest text-white/30">Immutable Ledger Footprint</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="flex flex-col items-center py-6 text-center space-y-4">
                            <div className="w-24 h-24 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center relative overflow-hidden group hover:border-indigo-500/60 transition-colors">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                                <UserCheck className="w-10 h-10 text-indigo-400 group-hover:scale-110 transition-transform" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold tracking-tight text-white">{adminName}</h3>
                                <p className="text-xs text-indigo-400 font-mono mt-1">{adminWallet}</p>
                            </div>
                        </div>

                        <div className="space-y-4 border-t border-white/5 pt-6">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-white/40" />
                                    <span className="text-xs font-medium text-white/60">Primary Auth</span>
                                </div>
                                <span className="text-xs font-mono text-white/80">{adminEmail}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Smartphone className="w-4 h-4 text-white/40" />
                                    <span className="text-xs font-medium text-white/60">2FA Device</span>
                                </div>
                                <Badge variant="outline" className="text-emerald-400 border-emerald-400/20 bg-emerald-400/10 text-[9px]">ACTIVE</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Access Control Matrix */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-xl lg:col-span-2 border-t-rose-500/20 border-t-2 relative overflow-hidden shadow-2xl">
                    <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />
                    <CardHeader className="border-b border-white/5 pb-6">
                         <CardTitle className="text-xl flex items-center gap-3">
                            <Key className="w-6 h-6 text-rose-500" /> Access Control Matrix
                        </CardTitle>
                        <CardDescription className="text-[10px] uppercase font-black tracking-widest text-white/30">API Keys & System Authentication Overrides</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-4">Master Gateway Keys</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 group hover:border-white/10 transition-colors">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-white uppercase flex items-center gap-2">
                                            Production Database <Badge className="bg-rose-500/20 text-rose-400 text-[8px]">WRITE PERM</Badge>
                                        </p>
                                        <p className="text-[10px] text-white/40 font-mono tracking-widest">sk_prod_59fA...9bxQ <EyeOff className="w-3 h-3 inline ml-1 opacity-50" /></p>
                                    </div>
                                    <Button variant="outline" size="sm" className="bg-transparent border-white/10 hover:bg-white/5 text-xs">Rotate Key</Button>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 group hover:border-white/10 transition-colors">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-white uppercase flex items-center gap-2">
                                            Heuristic AI Engine <Badge className="bg-indigo-500/20 text-indigo-400 text-[8px]">READ/WRITE</Badge>
                                        </p>
                                        <p className="text-[10px] text-white/40 font-mono tracking-widest">sk_ai_92zK...1aPd <EyeOff className="w-3 h-3 inline ml-1 opacity-50" /></p>
                                    </div>
                                    <Button variant="outline" size="sm" className="bg-transparent border-white/10 hover:bg-white/5 text-xs">Rotate Key</Button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-4 flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4 text-emerald-500" /> Security Override Directives
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-black/20 border border-white/5">
                                    <Switch defaultChecked />
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold">Strict IP Whitelisting</p>
                                        <p className="text-[10px] text-muted-foreground leading-relaxed">Locks admin panel access exclusively to globally recognized corporate IPs.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-black/20 border border-white/5">
                                    <Switch defaultChecked />
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold">Zero-Trust Telemetry</p>
                                        <p className="text-[10px] text-muted-foreground leading-relaxed">Mandates active biometric or hardware 2FA re-auth for database writes.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Session Logs Layout */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl relative overflow-hidden shadow-2xl mt-8 border-t-emerald-500/20 border-t-2">
                <CardHeader className="border-b border-white/5 pb-6">
                    <CardTitle className="text-xl flex items-center gap-3">
                    <Globe className="w-6 h-6 text-emerald-500" /> Temporal Session Genesis
                    </CardTitle>
                    <CardDescription className="text-[10px] uppercase font-black tracking-widest text-white/30">Active Network Connections</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-[9px] text-white/40 uppercase tracking-widest border-b border-white/5 bg-black/20">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Device / Origin</th>
                                    <th className="px-6 py-4 font-bold">IP Address</th>
                                    <th className="px-6 py-4 font-bold">Timestamp Matrix</th>
                                    <th className="px-6 py-4 font-bold text-right">Clearance Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <tr className="bg-emerald-500/5">
                                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                        <Terminal className="w-4 h-4 text-emerald-400" />
                                        MacBook Pro (M3) — Central Node
                                    </td>
                                    <td className="px-6 py-4 font-mono text-emerald-400/80 text-xs text-emerald-100">192.168.1.1</td>
                                    <td className="px-6 py-4 text-white/50 text-xs">Current Active Session</td>
                                    <td className="px-6 py-4 text-right">
                                        <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20 text-[9px]">AUTHORIZED</Badge>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 font-medium text-white/70 flex items-center gap-3">
                                        <Smartphone className="w-4 h-4 text-white/30" />
                                        iOS Mobile — Cellular Gateway
                                    </td>
                                    <td className="px-6 py-4 font-mono text-white/40 text-xs">17.221.X.X</td>
                                    <td className="px-6 py-4 text-white/40 text-xs">Yesterday, 14:22:01 UTC</td>
                                    <td className="px-6 py-4 text-right">
                                        <Badge variant="outline" className="bg-white/5 text-white/40 border-white/10 text-[9px]">TERMINATED</Badge>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
