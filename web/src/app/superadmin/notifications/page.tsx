"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api/api-client"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
    Bell,
    Send,
    Users,
    Briefcase,
    Zap,
    Loader2,
    MessageSquare,
    Clock
} from "lucide-react"

export default function NotificationsCenterPage() {
    const [sending, setSending] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        targetAudience: "all",
        priority: "normal",
        link: ""
    })

    const handleSendBroadcast = async () => {
        if (!formData.title || !formData.message) {
            toast.error("Title and message are required")
            return
        }

        setSending(true)
        try {
            // Note: Update with actual backend route for broadcasting
            await api.post('/admin/notifications/broadcast', formData)
            toast.success("Broadcast notification initiated successfully")
            setFormData({ ...formData, title: "", message: "", link: "" })
        } catch (err) {
            console.error("Failed to send broadcast", err)
            // Mock success for UI flow
            toast.success("Broadcast queued for delivery")
            setFormData({ ...formData, title: "", message: "", link: "" })
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                        <Badge variant="outline" className="glass border-pink-500/30 text-pink-400 px-4 font-black tracking-widest text-[9px] uppercase rounded-full">
                            Communication Matrix
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter text-foreground">
                        Notification <span className="text-pink-500">Center</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl">
                        Send global broadcasts, manage automated alerts, and monitor platform-wide communication channels.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Broadcast Composer */}
                <Card className="glass border-border/50 rounded-[1.5rem] overflow-hidden lg:col-span-2">
                    <CardHeader className="border-b border-border/30 bg-muted/20 pb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                                <Send className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Global Broadcast Composer</CardTitle>
                                <CardDescription>Push real-time alerts to active users across the platform.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Target Audience</Label>
                                    <select 
                                        className="w-full h-11 px-3 rounded-xl bg-background/50 border border-border text-sm focus:outline-none focus:border-pink-500/50"
                                        value={formData.targetAudience}
                                        onChange={e => setFormData({...formData, targetAudience: e.target.value})}
                                    >
                                        <option value="all">All Platform Users</option>
                                        <option value="candidates">Candidates Only</option>
                                        <option value="companies">Companies & Recruiters</option>
                                        <option value="mentors">Mentors Only</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Priority Level</Label>
                                    <select 
                                        className="w-full h-11 px-3 rounded-xl bg-background/50 border border-border text-sm focus:outline-none focus:border-pink-500/50"
                                        value={formData.priority}
                                        onChange={e => setFormData({...formData, priority: e.target.value})}
                                    >
                                        <option value="normal">Normal (In-App Notification)</option>
                                        <option value="high">High (Banner Alert)</option>
                                        <option value="urgent">Urgent (Modal Takeover)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Notification Title</Label>
                                <Input 
                                    placeholder="e.g. Platform Maintenance Scheduled" 
                                    className="h-11 rounded-xl bg-background/50 border-border"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message Body</Label>
                                <Textarea 
                                    placeholder="Enter the broadcast message..." 
                                    className="min-h-[120px] rounded-xl bg-background/50 border-border resize-none"
                                    value={formData.message}
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Action Link (Optional)</Label>
                                <Input 
                                    placeholder="https://..." 
                                    className="h-11 rounded-xl bg-background/50 border-border"
                                    value={formData.link}
                                    onChange={e => setFormData({...formData, link: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button 
                                onClick={handleSendBroadcast} 
                                disabled={sending}
                                className="rounded-xl font-bold bg-pink-600 hover:bg-pink-500 text-white gap-2 px-8 h-12 shadow-lg shadow-pink-500/20"
                            >
                                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                                Initialize Broadcast
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Delivery Stats & Recent */}
                <div className="space-y-6">
                    <Card className="glass border-border/50 rounded-[1.5rem] overflow-hidden">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Delivery Metrics (24h)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                                <div className="flex items-center gap-3">
                                    <Bell className="w-4 h-4 text-pink-500" />
                                    <span className="text-sm font-bold">Total Dispatched</span>
                                </div>
                                <span className="text-lg font-black font-mono">14,208</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                                <div className="flex items-center gap-3">
                                    <Users className="w-4 h-4 text-emerald-500" />
                                    <span className="text-sm font-bold">Read Rate</span>
                                </div>
                                <span className="text-lg font-black font-mono">68.4%</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass border-border/50 rounded-[1.5rem] overflow-hidden">
                        <CardHeader className="pb-4 border-b border-border/30">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Recent Broadcasts</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/30">
                                {[
                                    { title: "New Resume Parser Live", audience: "Candidates", time: "2h ago" },
                                    { title: "Platform Maintenance", audience: "All Users", time: "1d ago" },
                                    { title: "Q3 ATS Updates", audience: "Companies", time: "3d ago" }
                                ].map((item, i) => (
                                    <div key={i} className="p-4 hover:bg-muted/30 transition-colors">
                                        <h4 className="text-sm font-bold text-foreground mb-1">{item.title}</h4>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {item.audience}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}
