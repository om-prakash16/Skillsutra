"use client"

import { useState } from "react"
import { Flag, ToggleLeft, ToggleRight, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

const MOCK_FLAGS = [
    { id: "FF-01", name: "new_company_dashboard", description: "Enable the React Server Components version of the company dashboard.", enabled: true, rollout: "100%", env: "Production" },
    { id: "FF-02", name: "ai_resume_parser_v2", description: "Use Gemini Pro 1.5 instead of Claude 3 for resume parsing.", enabled: false, rollout: "0%", env: "Production" },
    { id: "FF-03", name: "stripe_crypto_checkout", description: "Allow crypto payments for premium subscriptions.", enabled: true, rollout: "25%", env: "Production" },
    { id: "FF-04", name: "advanced_rbac", description: "Enable granular RBAC roles for enterprise companies.", enabled: true, rollout: "100%", env: "Production" },
]

export default function FeatureFlagsPage() {
    const [search, setSearch] = useState("")

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-500 border border-indigo-500/30">
                            <Flag className="w-5 h-5" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">Feature Flags</h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl text-sm">
                        Toggle beta features, manage rollout percentages, and kill-switch functionality instantly across the platform without deploying code.
                    </p>
                </div>
                
                <Button className="h-10 text-xs font-bold gap-2">
                    <Plus className="w-4 h-4" />
                    Create Flag
                </Button>
            </div>

            <div className="bg-muted/30 border border-border/50 rounded-2xl overflow-hidden backdrop-blur-xl">
                <div className="p-4 border-b border-border/50 flex items-center justify-between gap-4 bg-background/50">
                    <div className="relative w-full max-w-sm">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                            placeholder="Search flags..." 
                            className="pl-9 h-9 bg-background/50 border-border/50 text-xs"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/[0.05] bg-muted/20 text-[10px] uppercase tracking-widest text-muted-foreground/80">
                            <th className="px-6 py-4 font-black">Flag Key</th>
                            <th className="px-6 py-4 font-black">Description</th>
                            <th className="px-6 py-4 font-black">Environment</th>
                            <th className="px-6 py-4 font-black">Rollout</th>
                            <th className="px-6 py-4 font-black text-right">Enabled</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                        {MOCK_FLAGS.map((flag) => (
                            <tr key={flag.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs font-bold text-indigo-400">{flag.name}</td>
                                <td className="px-6 py-4 text-xs text-muted-foreground max-w-xs truncate">{flag.description}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                                        {flag.env}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500" style={{ width: flag.rollout }} />
                                        </div>
                                        <span>{flag.rollout}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end">
                                        <Switch checked={flag.enabled} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
