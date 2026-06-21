"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Key, Lock, Eye, EyeOff, Plus, Search, ShieldCheck, Copy, CheckCircle2, MoreVertical, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Dummy data
const MOCK_SECRETS = [
    { id: 1, name: "STRIPE_SECRET_KEY", category: "PAYMENT", env: "PRODUCTION", updated: "2 days ago", active: true },
    { id: 2, name: "STRIPE_WEBHOOK_SECRET", category: "PAYMENT", env: "PRODUCTION", updated: "2 days ago", active: true },
    { id: 3, name: "OPENAI_API_KEY", category: "AI", env: "PRODUCTION", updated: "5 hours ago", active: true },
    { id: 4, name: "SENDGRID_API_KEY", category: "EMAIL", env: "PRODUCTION", updated: "1 month ago", active: true },
    { id: 5, name: "GOOGLE_OAUTH_SECRET", category: "AUTH", env: "PRODUCTION", updated: "3 months ago", active: true },
]

export default function SecretsVaultPage() {
    const [search, setSearch] = useState("")
    const [copied, setCopied] = useState<number | null>(null)

    const handleCopy = (id: number) => {
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl bg-primary/20 text-primary border border-primary/30">
                            <Lock className="w-5 h-5" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">Secrets Vault</h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl text-sm">
                        Enterprise-grade secure storage for API keys, Webhooks, and sensitive credentials. All values are encrypted at rest using AES-256 and only decrypted in memory upon strict authorization.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 bg-muted/50 border-border/50 text-xs font-bold gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        Audit Logs
                    </Button>
                    <Button className="h-10 text-xs font-bold gap-2 shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                        <Plus className="w-4 h-4" />
                        New Secret
                    </Button>
                </div>
            </div>

            <div className="bg-muted/30 border border-border/50 rounded-2xl overflow-hidden backdrop-blur-xl">
                <div className="p-4 border-b border-border/50 flex items-center justify-between gap-4 bg-background/50">
                    <div className="relative w-full max-w-sm">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                            placeholder="Search secrets by name..." 
                            className="pl-9 h-9 bg-background/50 border-border/50 text-xs"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category:</span>
                        <select className="h-9 rounded-md border border-border/50 bg-background/50 text-xs px-2 text-foreground outline-none">
                            <option>All Categories</option>
                            <option>PAYMENT</option>
                            <option>AI</option>
                            <option>AUTH</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.05] bg-muted/20 text-[10px] uppercase tracking-widest text-muted-foreground/80">
                                <th className="px-6 py-4 font-black">Secret Name</th>
                                <th className="px-6 py-4 font-black">Category</th>
                                <th className="px-6 py-4 font-black">Environment</th>
                                <th className="px-6 py-4 font-black">Last Updated</th>
                                <th className="px-6 py-4 font-black">Status</th>
                                <th className="px-6 py-4 font-black text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {MOCK_SECRETS.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map((secret) => (
                                <motion.tr 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    key={secret.id} 
                                    className="hover:bg-muted/30 transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 rounded-md bg-background border border-border/50 text-muted-foreground">
                                                <Key className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="font-mono text-xs font-bold text-foreground/90">{secret.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest bg-muted text-muted-foreground border border-border/50">
                                            {secret.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest bg-primary/10 text-primary border border-primary/20">
                                            {secret.env}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-muted-foreground/80 font-medium">
                                        {secret.updated}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                onClick={() => handleCopy(secret.id)}
                                            >
                                                {copied === secret.id ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-400">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
