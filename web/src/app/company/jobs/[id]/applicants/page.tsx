"use client"
import { useState } from "react"

import { useQuery, useMutation } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { api } from "@/lib/api/api-client"
import { useAuth } from "@/context/auth-context"
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
    Loader2, 
    Users, 
    BrainCircuit, 
    ShieldCheck, 
    Zap, 
    ArrowRight,
    Search,
    UserCircle,
    CheckCircle2,
    XCircle,
    Cpu,
    Activity,
    Bot,
    Edit3,
    Save
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function PersonnelResonanceArchive() {
    const { id } = useParams() // job_id
    const { user } = useAuth()
    const router = useRouter()
    
    // Copilot State
    const [selectedApp, setSelectedApp] = useState<any>(null)
    const [isCopilotOpen, setIsCopilotOpen] = useState(false)
    const [isPremiumGateOpen, setIsPremiumGateOpen] = useState(false)
    const [interviewQuestions, setInterviewQuestions] = useState<any[]>([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // 1. Fetch Company Info (to get companyId)
    const { data: company } = useQuery({
        queryKey: ["companyProfile"],
        queryFn: () => api.company.get(),
    })

    // 2. Fetch Job Details
    const { data: job, isLoading: jobLoading } = useQuery({
        queryKey: ["jobDetail", id],
        queryFn: () => api.jobs.details(id as string),
        enabled: !!id
    })

    // 3. Fetch Applicants for this Job
    const { data: applicants, isLoading: appsLoading, refetch } = useQuery({
        queryKey: ["jobApplicants", id, company?.id],
        queryFn: () => api.applications.company(company?.id as string, id as string),
        enabled: !!company?.id && !!id
    })

    // 4. Update Status Mutation
    const statusMutation = useMutation({
        mutationFn: ({ appId, status }: { appId: string, status: string }) => 
            api.applications.updateStatus(appId, status),
        onSuccess: () => {
            toast.success("Personnel state updated successfully.")
            refetch()
        },
        onError: (err: any) => {
            toast.error(`State update failed: ${err.message}`)
        }
    })

    // 5. Fetch Features
    const { data: features } = useQuery({
        queryKey: ["publicFeatures"],
        queryFn: () => api.admin.getPublicFeatures(),
    })
    
    const isCopilotEnabled = features?.find((f: any) => f.feature_name === 'ai_interviews')?.is_enabled ?? true;

    // Copilot Handlers
    const handleOpenCopilot = async (app: any) => {
        // Mock Premium Check - Require specific company tier or credits
        if (company?.subscription_tier === 'free' || !company?.subscription_tier) {
            setIsPremiumGateOpen(true);
            return;
        }
        setSelectedApp(app)
        setIsCopilotOpen(true)
        setInterviewQuestions([])
        try {
            const data = await api.interview.get(app.user_id, id as string)
            if (data && data.length > 0) {
                setInterviewQuestions(data)
            }
        } catch (e) {
            console.error("Failed to fetch existing questions")
        }
    }

    const handleGenerate = async () => {
        if (!selectedApp) return;
        setIsGenerating(true);
        try {
            const generated = await api.interview.generate(selectedApp.user_id, id as string, 5)
            setInterviewQuestions(generated)
            toast.success("AI Synthesis complete.")
        } catch (e: any) {
            toast.error(e.message || "Synthesis failed")
        } finally {
            setIsGenerating(false)
        }
    }

    const handleSaveQuestions = async () => {
        if (!selectedApp) return;
        setIsSaving(true)
        try {
            await api.interview.set(selectedApp.user_id, id as string, interviewQuestions)
            toast.success("Interview logic committed to memory.")
            setIsCopilotOpen(false)
        } catch (e: any) {
            toast.error("Failed to commit questions")
        } finally {
            setIsSaving(false)
        }
    }

    const handleQuestionChange = (index: number, text: string) => {
        const newQs = [...interviewQuestions];
        newQs[index].question = text;
        setInterviewQuestions(newQs);
    }

    const calculateFinalResonance = (matchScore: number, assessmentScore: number | null) => {
        if (assessmentScore === null) return matchScore * 0.4
        return (matchScore * 0.4) + (assessmentScore * 0.6)
    }

    if (jobLoading || appsLoading) {
        return (
            <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-6">
                <Loader2 className="h-12 w-12 animate-spin text-primary/40" />
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-muted-foreground">Synthesizing Archive Stream...</p>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in duration-1000">
            {/* Archive Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/50 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-4 font-black tracking-widest text-[9px] uppercase">
                            Mission Archive: Live
                        </Badge>
                        <span className="text-muted-foreground/50 text-[10px] font-black uppercase tracking-widest italic">{job?.title}</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black font-heading tracking-tighter uppercase italic text-foreground leading-none">
                        Personnel <span className="text-primary text-opacity-80">Resonance</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl font-medium italic">
                        The ultimate truth table. Comparing initial AI matching signals against real-time skill challenge responses.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="h-14 px-8 bg-muted/50 border-border hover:bg-white/[0.08] hover:border-primary/40 font-black tracking-widest uppercase text-[10px] rounded-2xl gap-3">
                        <Search className="w-4 h-4 text-primary" /> Multi-Scan Mode
                    </Button>
                </div>
            </div>

            {/* Application Matrix */}
            <Card className="bg-background border-border rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <CardHeader className="p-10 border-b border-border/50">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-black italic tracking-tight flex items-center gap-3">
                                <Users className="w-6 h-6 text-primary" /> Active Cohort
                            </CardTitle>
                            <CardDescription className="text-xs uppercase font-black tracking-widest text-muted-foreground italic">Targeting strategic position: {job?.title}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {!applicants || applicants.length === 0 ? (
                        <div className="py-24 text-center">
                            <Users className="w-16 h-16 text-white/5 mx-auto mb-4" />
                            <p className="text-muted-foreground/50 font-black italic text-lg tracking-tight uppercase">No personnel detected in the resonance pipeline.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-white/[0.01]">
                                <TableRow className="border-border/50 h-16">
                                    <TableHead className="pl-10 font-black uppercase text-[10px] tracking-widest text-muted-foreground">Candidate Detail</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground text-center">AI Sync</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground text-center">Live Quiz</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground text-center">Final Resonance</TableHead>
                                    <TableHead className="pr-10 font-black uppercase text-[10px] tracking-widest text-muted-foreground text-right">Synthesis Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applicants.map((app: any) => {
                                    const finalRes = calculateFinalResonance(app.ai_match_score || 0, app.assessment_score || null)
                                    const isShortlisted = app.status === 'shortlisted'
                                    
                                    return (
                                        <TableRow key={app.id} className="border-border/50 group hover:bg-muted/30 transition-colors h-24">
                                            <TableCell className="pl-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-muted/50 border border-border flex items-center justify-center text-primary/40 font-black group-hover:scale-110 transition-transform">
                                                        <UserCircle className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-lg text-foreground group-hover:text-primary transition-colors leading-none mb-1">{app.users?.full_name}</p>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                            <p className="text-[10px] font-mono font-bold text-muted-foreground lowercase tracking-tighter">
                                                                {app.users?.wallet_address?.slice(0, 6)}...{app.users?.wallet_address?.slice(-4)}
                                                            </p>
                                                            {app.users?.user_identities?.id_status === 'verified' && (
                                                                <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                                                                    <ShieldCheck className="w-2.5 h-2.5 text-primary" />
                                                                    <span className="text-[8px] font-black uppercase tracking-widest text-primary">Verified</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="inline-flex flex-col items-center">
                                                    <span className="text-2xl font-black text-foreground/80 group-hover:text-foreground transition-colors">{app.ai_match_score || 0}%</span>
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50 italic">Profile Logic</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className={cn(
                                                    "inline-flex flex-col items-center",
                                                    app.assessment_score === null ? "opacity-20 flex-col items-center gap-1" : ""
                                                )}>
                                                    {app.assessment_score !== null ? (
                                                        <>
                                                            <span className="text-2xl font-black text-emerald-500">{app.assessment_score}%</span>
                                                            <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500/30 italic">Live Proof</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Cpu className="w-5 h-5 animate-pulse" />
                                                            <span className="text-[8px] font-black uppercase tracking-widest italic">Syncing...</span>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="inline-flex flex-col items-center bg-muted/50 px-6 py-3 rounded-2xl border border-border/50 group-hover:border-primary/20 transition-all">
                                                    <span className={cn(
                                                        "text-3xl font-black tracking-tighter leading-none mb-0.5",
                                                        finalRes >= 80 ? "text-primary" : "text-foreground"
                                                    )}>
                                                        {Math.round(finalRes)}%
                                                    </span>
                                                    <div className="flex items-center gap-1.5 pt-1 uppercase font-black text-[8px] tracking-[0.2em] text-muted-foreground">
                                                        <Activity className="w-2.5 h-2.5" /> Total Resonance
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="pr-10 text-right">
                                                <div className="flex justify-end gap-3 opacity-30 group-hover:opacity-100 transition-opacity">
                                                    <Button 
                                                        onClick={() => statusMutation.mutate({ appId: app.id, status: 'shortlisted' })}
                                                        disabled={isShortlisted || statusMutation.isPending}
                                                        variant="ghost" 
                                                        size="icon" 
                                                        title="Shortlist / Synthesize"
                                                        className={cn(
                                                            "h-12 w-12 rounded-2xl bg-muted/50 border border-border hover:bg-emerald-500/10 hover:border-emerald-500/30 group/sh",
                                                            isShortlisted ? "bg-emerald-500/20 border-emerald-500 opacity-100" : ""
                                                        )}
                                                    >
                                                        <CheckCircle2 className={cn("w-5 h-5", isShortlisted ? "text-emerald-500" : "text-muted-foreground group-hover/sh:text-emerald-500")} />
                                                    </Button>
                                                    <Button 
                                                        onClick={() => statusMutation.mutate({ appId: app.id, status: 'rejected' })}
                                                        disabled={statusMutation.isPending}
                                                        variant="ghost" 
                                                        size="icon" 
                                                        title="Archive / De-Sync"
                                                        className="h-12 w-12 rounded-2xl bg-muted/50 border border-border hover:bg-rose-500/10 hover:border-rose-500/30 group/de"
                                                    >
                                                        <XCircle className="w-5 h-5 text-muted-foreground group-hover/de:text-rose-500" />
                                                    </Button>
                                                    {isCopilotEnabled && (
                                                        <Button 
                                                            onClick={() => handleOpenCopilot(app)}
                                                            variant="ghost" 
                                                            size="icon" 
                                                            title="AI Copilot"
                                                            className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 group/ai"
                                                        >
                                                            <Bot className="w-5 h-5 text-blue-500" />
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" size="icon" asChild className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/20">
                                                        <Link href={`/company/talent`}>
                                                            <ArrowRight className="w-5 h-5 text-primary" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Neural Summary Footer */}
            <div className="flex flex-col items-center gap-10 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 py-10">
                <div className="h-px w-96 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="flex gap-12 items-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                    <span className="flex items-center gap-3"><Zap className="w-4 h-4 text-primary" /> Multi-Tenant Resonance Analysis</span>
                    <span className="flex items-center gap-3"><ShieldCheck className="w-4 h-4 text-primary" /> infrastructure ID Verification v2.4</span>
                    <span className="flex items-center gap-3"><BrainCircuit className="w-4 h-4 text-primary" /> Weighted Synthesis Logic</span>
                </div>
                <p className="text-xs italic max-w-2xl text-center opacity-60">
                    "The Personnel Resonance Archive provides an uncompromising view of global talent. By weighting live assessments over profile claims, we've reduced hiring fraud by 98% across the infrastructure nexus."
                </p>
            </div>

            {/* AI Copilot Modal */}
            <Dialog open={isCopilotOpen} onOpenChange={setIsCopilotOpen}>
                <DialogContent className="max-w-3xl bg-background border-border shadow-2xl rounded-[2rem] overflow-hidden p-0 gap-0">
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-8 border-b border-border/50">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black flex items-center gap-3">
                                <Bot className="w-6 h-6 text-blue-500" /> AI Interview Synthesis
                            </DialogTitle>
                            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">
                                Target: {selectedApp?.users?.full_name}
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <div className="p-8 space-y-6 bg-white/[0.01]">
                        {interviewQuestions.length === 0 ? (
                            <div className="text-center py-10 space-y-4">
                                <BrainCircuit className="w-16 h-16 text-muted-foreground/30 mx-auto" />
                                <p className="text-muted-foreground italic text-sm max-w-md mx-auto">
                                    Click below to prompt the AI to read {selectedApp?.users?.full_name}'s resume and generate 5 highly technical interview questions specifically targeted at their claimed skills and your job requirements.
                                </p>
                            </div>
                        ) : (
                            <ScrollArea className="h-[40vh] pr-4">
                                <div className="space-y-6">
                                    {interviewQuestions.map((q, idx) => (
                                        <div key={idx} className="space-y-2 bg-muted/30 p-4 rounded-xl border border-border/50 relative group">
                                            <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-100 transition-opacity">
                                                <Edit3 className="w-4 h-4 text-primary" />
                                            </div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                Question {idx + 1}
                                            </label>
                                            <Textarea 
                                                value={q.question || q} 
                                                onChange={(e) => handleQuestionChange(idx, e.target.value)}
                                                className="bg-background border-border resize-none text-sm font-medium h-20"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                        <div className="flex justify-between items-center pt-4 border-t border-border/50">
                            <Button 
                                variant="outline" 
                                onClick={handleGenerate} 
                                disabled={isGenerating}
                                className="bg-blue-500/10 text-blue-500 border-blue-500/30 hover:bg-blue-500/20 font-black tracking-widest uppercase text-[10px] gap-2"
                            >
                                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                                {interviewQuestions.length > 0 ? "Regenerate" : "Synthesize Questions"}
                            </Button>
                            {interviewQuestions.length > 0 && (
                                <Button 
                                    onClick={handleSaveQuestions}
                                    disabled={isSaving}
                                    className="gap-2 font-black tracking-widest uppercase text-[10px]"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Commit Protocol
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Premium Gate Modal */}
            <Dialog open={isPremiumGateOpen} onOpenChange={setIsPremiumGateOpen}>
                <DialogContent className="max-w-md bg-background border-border shadow-2xl rounded-3xl p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                        <Zap className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black italic mb-2">Upgrade Required</h3>
                    <p className="text-muted-foreground text-sm mb-8">
                        The AI Interview Synthesis engine is a premium feature. Upgrade your corporate tier to access hyper-personalized candidate interviews.
                    </p>
                    <div className="flex gap-4 w-full">
                        <Button variant="outline" className="flex-1" onClick={() => setIsPremiumGateOpen(false)}>Cancel</Button>
                        <Button className="flex-1 gap-2" asChild>
                            <Link href="/pricing"><Zap className="w-4 h-4" /> View Plans</Link>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
