"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShieldCheck, UserCheck, AlertTriangle, CheckCircle2, XCircle, FileText, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const MOCK_VERIFICATIONS = [
    { id: "V-1049", user: "John Doe", type: "Identity (Government ID)", status: "Pending", risk: "Low", date: "10 mins ago" },
    { id: "V-1048", user: "Acme Corp", type: "Business Registration", status: "Flagged", risk: "High", date: "2 hours ago" },
    { id: "V-1047", user: "Jane Smith", type: "Proof Score Validation", status: "Approved", risk: "Low", date: "1 day ago" },
]

export default function VerificationCenterPage() {
    const [search, setSearch] = useState("")

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl bg-violet-500/20 text-violet-500 border border-violet-500/30">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">Verification Center</h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl text-sm">
                        Global queue for Identity (KYC), Business (KYB), and Talent Proof Score manual verifications.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
                    <h3 className="text-sm font-bold text-muted-foreground mb-2">Pending Manual Review</h3>
                    <div className="text-4xl font-black">142</div>
                </div>
                <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
                    <h3 className="text-sm font-bold text-muted-foreground mb-2">Flagged for Fraud Risk</h3>
                    <div className="text-4xl font-black text-rose-500">18</div>
                </div>
                <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
                    <h3 className="text-sm font-bold text-muted-foreground mb-2">Auto-Verified (24h)</h3>
                    <div className="text-4xl font-black text-emerald-500">1,048</div>
                </div>
            </div>

            <div className="bg-muted/30 border border-border/50 rounded-2xl overflow-hidden backdrop-blur-xl">
                <div className="p-4 border-b border-border/50 flex items-center justify-between gap-4 bg-background/50">
                    <div className="relative w-full max-w-sm">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                            placeholder="Search by Case ID or User..." 
                            className="pl-9 h-9 bg-background/50 border-border/50 text-xs"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/[0.05] bg-muted/20 text-[10px] uppercase tracking-widest text-muted-foreground/80">
                            <th className="px-6 py-4 font-black">Case ID</th>
                            <th className="px-6 py-4 font-black">Subject</th>
                            <th className="px-6 py-4 font-black">Verification Type</th>
                            <th className="px-6 py-4 font-black">Risk Level</th>
                            <th className="px-6 py-4 font-black">Status</th>
                            <th className="px-6 py-4 font-black text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                        {MOCK_VERIFICATIONS.map((v) => (
                            <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs font-bold text-foreground/80">{v.id}</td>
                                <td className="px-6 py-4 text-xs font-bold">{v.user}</td>
                                <td className="px-6 py-4 text-xs text-muted-foreground">{v.type}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                                        v.risk === 'High' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                    }`}>{v.risk}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                        v.status === 'Approved' ? 'text-emerald-500' :
                                        v.status === 'Flagged' ? 'text-rose-500' : 'text-amber-500'
                                    }`}>{v.status}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="outline" size="sm" className="h-8 text-xs font-bold bg-background/50">
                                        Review Case
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
