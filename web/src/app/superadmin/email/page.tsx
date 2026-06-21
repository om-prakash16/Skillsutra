"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
    Mail,
    Send,
    RefreshCw,
    Loader2,
    Eye,
    Edit3,
    BarChart3,
    MailCheck,
    MailWarning
} from "lucide-react"

export default function EmailCenterPage() {
    const [loading, setLoading] = useState(false)

    // Mock data for UI
    const templates = [
        { id: "1", name: "Welcome Email", subject: "Welcome to SkillSutra!", type: "Onboarding", openRate: "68%" },
        { id: "2", name: "Password Reset", subject: "Reset your password", type: "Security", openRate: "92%" },
        { id: "3", name: "Job Alert", subject: "New jobs matching your profile", type: "Engagement", openRate: "45%" },
        { id: "4", name: "Application Status", subject: "Update on your application", type: "Transactional", openRate: "88%" },
        { id: "5", name: "Company Verification", subject: "Action Required: Verify Company", type: "Compliance", openRate: "75%" },
    ]

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                        <Badge variant="outline" className="glass border-indigo-500/30 text-indigo-400 px-4 font-black tracking-widest text-[9px] uppercase rounded-full">
                            Outbound Communications
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter text-foreground">
                        Email <span className="text-indigo-500">Center</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl">
                        Manage transactional email templates, monitor delivery rates, and configure SMTP settings.
                    </p>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass border-border/50 rounded-[1.5rem]">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Emails Sent (30d)</p>
                                <p className="text-3xl font-black font-mono text-foreground">142,084</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                <Send className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-border/50 rounded-[1.5rem]">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Avg Delivery Rate</p>
                                <p className="text-3xl font-black font-mono text-emerald-500">99.8%</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <MailCheck className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-border/50 rounded-[1.5rem]">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Bounce Rate</p>
                                <p className="text-3xl font-black font-mono text-rose-500">0.2%</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                                <MailWarning className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Templates List */}
            <Card className="glass border-border/50 rounded-[1.5rem] overflow-hidden">
                <CardHeader className="border-b border-border/30 bg-muted/20 pb-6 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Email Templates</CardTitle>
                            <CardDescription>Transactional and marketing email layouts.</CardDescription>
                        </div>
                    </div>
                    <Button variant="outline" className="glass border-border font-bold">
                        Create Template
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-border/30">
                        {templates.map((tpl, i) => (
                            <motion.div 
                                key={tpl.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between group"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="font-bold text-foreground">{tpl.name}</h4>
                                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest bg-muted/50 border-border">
                                            {tpl.type}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground font-mono">Subject: {tpl.subject}</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden md:block">
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Open Rate</p>
                                        <p className="font-mono font-bold text-emerald-400">{tpl.openRate}</p>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-indigo-400 hover:text-indigo-500 hover:bg-indigo-500/10">
                                            <Edit3 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
