"use client"

import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/context/auth-context"
import { api } from "@/lib/api/api-client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
    Loader2, 
    ExternalLink, 
    Trash2, 
    Edit2, 
    Briefcase, 
    Zap, 
    Sparkles, 
    BrainCircuit,
    Plus,
    Activity,
    Wifi
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function JobCommandCenter() {
    const { user } = useAuth()
    
    // 1. Fetch Company Info
    const { data: company, isLoading: companyLoading } = useQuery({
        queryKey: ["companyProfile"],
        queryFn: () => api.company.get(),
    })

    // 2. Fetch Jobs Meta-Stream
    const { data: jobs, isLoading: jobsLoading, refetch } = useQuery({
        queryKey: ["companyJobsMetrics", company?.id],
        queryFn: () => api.jobs.listCompanyJobs(company?.id as string),
        enabled: !!company?.id
    })

    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    const handleDelete = async (jobId: string) => {
        if (!confirm("Are you sure you want to terminate this job mission? Status will be permanently revoked.")) return
        
        setIsDeleting(jobId)
        try {
            // Using admin delete if available or standard
            await api.admin.deleteJob(jobId)
            toast.success("Job Mission Terminated.")
            refetch()
        } catch (error: any) {
            toast.error(`Termination failed: ${error.message}`)
        } finally {
            setIsDeleting(null)
        }
    }

    const getStatusLabel = (isActive: boolean) => {
        return isActive ? "Pulsing" : "Synthesized"
    }

    if (companyLoading || jobsLoading) {
        return (
            <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20">Syncing Command Center Stream...</p>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in duration-1000">
            {/* Command Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full animate-pulse" />
                        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-4 font-black tracking-widest text-[9px] uppercase">
                            Operational Nexus: Live
                        </Badge>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black font-heading tracking-tighter uppercase italic text-white">
                        Job <span className="text-primary">Command</span> Center
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl font-medium italic">
                        Strategic oversight of active hiring missions. Real-time telemetry on candidate resonance and discovery precision.
                    </p>
                </div>
                <Link href="/company/post-job">
                    <Button size="lg" className="h-16 px-8 bg-white text-black hover:bg-neutral-200 font-black tracking-tighter uppercase gap-3 shadow-xl shadow-white/5">
                        <Plus className="w-5 h-5" /> Launch New Mission
                    </Button>
                </Link>
            </div>

            {/* Missions List */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <CardHeader className="p-8 border-b border-white/5">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-black italic flex items-center gap-3 tracking-tight">
                                <Activity className="w-6 h-6 text-primary" /> Active Missions
                            </CardTitle>
                            <CardDescription className="text-xs uppercase font-black tracking-widest text-white/30">Personnel synchronization across the network</CardDescription>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Signal Strength: 98%</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {!jobs || jobs.length === 0 ? (
                        <div className="text-center py-20">
                            <Briefcase className="w-12 h-12 text-white/5 mx-auto mb-4" />
                            <p className="text-white/20 font-black italic text-lg tracking-tight uppercase">No active missions detected. Initiate first launch to begin.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-white/[0.02]">
                                <TableRow className="border-white/5 hover:bg-transparent px-8">
                                    <TableHead className="font-black uppercase tracking-widest text-[9px] text-white/40 h-14 pl-8">Mission Designation</TableHead>
                                    <TableHead className="font-black uppercase tracking-widest text-[9px] text-white/40 h-14">Current Pulse</TableHead>
                                    <TableHead className="font-black uppercase tracking-widest text-[9px] text-white/40 h-14 text-center">Applicants</TableHead>
                                    <TableHead className="font-black uppercase tracking-widest text-[9px] text-white/40 h-14 text-center">AI Discoveries</TableHead>
                                    <TableHead className="font-black uppercase tracking-widest text-[9px] text-white/40 h-14 text-right pr-8">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {jobs.map((job: any) => (
                                    <TableRow key={job.id} className="border-white/5 hover:bg-white/[0.02] group transition-colors px-8 h-20">
                                        <TableCell className="pl-8 font-black text-lg text-white group-hover:text-primary transition-colors">
                                            {job.title}
                                            <div className="flex gap-2 mt-1.5">
                                                <Badge variant="outline" className="text-[8px] font-black uppercase text-white/30 border-white/10 bg-white/5">{job.job_type || 'Full-time'}</Badge>
                                                {job.has_assessment && (
                                                    <Badge variant="outline" className="text-[8px] font-black uppercase text-indigo-400 border-indigo-400/20 bg-indigo-400/5">Assessment Ready</Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    job.is_active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-neutral-500"
                                                )} />
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest",
                                                    job.is_active ? "text-emerald-500" : "text-neutral-500"
                                                )}>
                                                    {getStatusLabel(job.is_active)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Link href={`/company/jobs/${job.id}/applicants`}>
                                                <div className="inline-flex flex-col items-center gap-1 group/apps cursor-pointer">
                                                    <span className="text-2xl font-black text-white group-hover/apps:text-primary transition-colors">{job.applicant_count || 0}</span>
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-white/20 group-hover/apps:text-primary/40 transition-colors">Total Personnel</span>
                                                </div>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Link href={`/company/jobs/${job.id}/discovery`}>
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer group/disc">
                                                    <BrainCircuit className="w-3.5 h-3.5 text-primary group-hover/disc:scale-110 transition-transform" />
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{job.discovery_match_count || 0} Ranked</span>
                                                </div>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <div className="flex justify-end gap-3 opacity-30 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" asChild title="Global Preview" className="h-10 w-10 bg-white/5 hover:bg-white/10 border border-white/10">
                                                    <Link href={`/jobs/${job.id}`}>
                                                        <ExternalLink className="w-4 h-4 text-white" />
                                                    </Link>
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handleDelete(job.id)}
                                                    disabled={isDeleting === job.id}
                                                    className="h-10 w-10 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 group/kill"
                                                    title="Terminate Mission"
                                                >
                                                    {isDeleting === job.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 text-rose-500 group-hover/kill:scale-110" />}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Vision Quote Footer */}
            <div className="flex flex-col items-center gap-6 pt-10 text-center opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                <div className="h-px w-64 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Matching Engine v2.4a</p>
                    <p className="text-xs italic max-w-lg">
                        "The goal of the Command Center is not just to track applicants, but to synchronize global talent before they even apply."
                    </p>
                </div>
                <div className="flex gap-8 items-center text-[10px] font-black uppercase tracking-widest text-white/30">
                    <span className="flex items-center gap-2"><Zap className="w-3 h-3 text-primary" /> Solana-Secured</span>
                    <span className="flex items-center gap-2"><BrainCircuit className="w-3 h-3 text-primary" /> Gemini-Driven</span>
                    <span className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-primary" /> Talent Synthesis Live</span>
                </div>
            </div>
        </div>
    )
}
