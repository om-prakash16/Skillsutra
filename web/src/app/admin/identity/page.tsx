"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    ShieldCheck, 
    ShieldAlert, 
    CheckCircle2, 
    XCircle, 
    Eye, 
    Loader2, 
    User,
    FileText,
    Search,
    Filter,
    ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { api } from "@/lib/api/api-client"

export default function IdentityQueuePage() {
    const [queue, setQueue] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("pending")

    useEffect(() => {
        fetchQueue()
    }, [filter])

    const fetchQueue = async () => {
        setLoading(true)
        try {
            // Placeholder: fetch from admin identity queue endpoint
            // const data = await api.admin.getIdentityQueue(filter)
            // Mock data for high-fidelity demonstration
            const mockData = [
                { id: '1', user_id: 'u-01', user_name: 'Om Prakash', id_type: 'passport', submitted_at: '2026-04-13T10:00:00Z', status: 'pending' },
                { id: '2', user_id: 'u-02', user_name: 'John Doe', id_type: 'drivers_license', submitted_at: '2026-04-13T11:30:00Z', status: 'pending' }
            ]
            setQueue(mockData)
        } catch (e) {
            toast.error("Failed to sync identity queue.")
        } finally {
            setLoading(false)
        }
    }

    const handleAction = async (userId: string, action: 'verified' | 'rejected') => {
        try {
            // await api.admin.verifyIdentity(userId, { status: action })
            toast.success(`User ${action === 'verified' ? 'Authorized' : 'Rejected'} successfully.`)
            setQueue(prev => prev.filter(q => q.user_id !== userId))
        } catch (e) {
            toast.error("Administrative protocol failure.")
        }
    }

    return (
        <div className="space-y-12 pb-20">
            {/* Admin Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-10">
                <div className="space-y-3">
                    <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-4 font-black tracking-widest text-[9px] uppercase italic">
                        Trust Governance Node
                    </Badge>
                    <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter text-foreground uppercase flex items-center gap-6">
                        Identity <span className="text-primary">Nexus</span> Queue
                        <ShieldCheck className="w-12 h-12 text-primary animate-pulse" />
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl font-medium">
                        Human-in-the-loop review for platform identities. Verify document integrity to issues the Blue Check of Trust.
                    </p>
                </div>
                <div className="flex gap-4 bg-muted/50 p-2 rounded-2xl border border-border backdrop-blur-xl">
                    {["pending", "verified", "rejected"].map((f) => (
                        <Button 
                            key={f} 
                            onClick={() => setFilter(f)}
                            variant="ghost" 
                            className={`h-12 px-6 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all ${filter === f ? 'bg-primary text-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {f} Queue
                        </Button>
                    ))}
                </div>
            </div>

            <Card className="bg-muted/50 border-border backdrop-blur-xl border-t-primary/30 border-t-2 shadow-2xl relative overflow-hidden">
                <CardHeader className="bg-background/80 border-b border-border p-8">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl italic font-black uppercase tracking-widest flex items-center gap-3">
                            <FileText className="w-6 h-6 text-primary" /> Active Verification Requests
                        </CardTitle>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                <Input placeholder="Filter by name/ID..." className="bg-muted/50 border-border pl-10 h-10 rounded-xl text-xs w-64" />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-border hover:bg-transparent uppercase font-black text-[10px] tracking-widest">
                                <TableHead className="px-8 h-14">Candidate</TableHead>
                                <TableHead className="h-14">Document Vector</TableHead>
                                <TableHead className="h-14">Submitted</TableHead>
                                <TableHead className="text-right px-8 h-14">Administrative Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-32 text-center">
                                        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                                        <p className="text-muted-foreground/50 font-black italic uppercase tracking-widest text-xs">Syncing Personnel Data...</p>
                                    </TableCell>
                                </TableRow>
                            ) : queue.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-32 text-center text-muted-foreground/30 italic font-black tracking-widest uppercase text-xs">
                                        No pending identity signals detected.
                                    </TableCell>
                                </TableRow>
                            ) : queue.map((req, idx) => (
                                <motion.tr 
                                    key={req.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                                >
                                    <TableCell className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center border border-border">
                                                <User className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground tracking-tight">{req.user_name}</p>
                                                <p className="text-[10px] text-muted-foreground/50 font-mono tracking-widest uppercase">{req.user_id}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-muted/50 border-border font-black uppercase text-[9px] px-3 py-1 italic tracking-widest">
                                            {req.id_type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground font-mono text-xs italic">
                                        {new Date(req.submitted_at).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right px-8">
                                        <div className="flex items-center justify-end gap-3">
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground/50 hover:text-primary hover:bg-primary/10 border border-border">
                                                <Eye className="w-5 h-5" />
                                            </Button>
                                            <div className="w-px h-6 bg-muted/50" />
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10 border border-rose-500/10" onClick={() => handleAction(req.user_id, 'rejected')}>
                                                <XCircle className="w-5 h-5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-emerald-500/50 hover:text-emerald-500 hover:bg-emerald-500/10 border border-emerald-500/10" onClick={() => handleAction(req.user_id, 'verified')}>
                                                <CheckCircle2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
