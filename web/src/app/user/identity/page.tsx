"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    ShieldCheck, 
    ShieldAlert, 
    Upload, 
    CheckCircle2, 
    Clock, 
    FileText, 
    AlertCircle, 
    ArrowRight,
    Loader2,
    Lock,
    Zap,
    Scale
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"
import { api } from "@/lib/api/api-client"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function IdentityNexusPage() {
    const { user } = useAuth()
    const [status, setStatus] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [selectedRepo, setSelectedRepo] = useState<string | null>(null)

    useEffect(() => {
        if (user) fetchIdentityStatus()
    }, [user])

    const fetchIdentityStatus = async () => {
        setLoading(true)
        try {
            // Ideally an api.identity.getStatus()
            const data = await api.identity.getHistory(user?.id || "")
            // For now, we simulate fetching the row from user_identities
            // In a real app, this would be a specific identity table fetch
            setStatus(data?.identity || { id_status: "not_started" })
        } catch (e) {
            console.error("Failed to sync identity status", e)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (idType: string) => {
        setSubmitting(true)
        try {
            // Placeholder: simulate upload and submission
            await new Promise(r => setTimeout(r, 2000))
            // await api.identity.submit({ id_type: idType, document_url: "sync://nexus-vault/doc-01" })
            toast.success("Intelligence transmitted. Review protocol initiated.")
            setStatus({ id_status: "pending", id_type: idType })
        } catch (e) {
            toast.error("Transmission failed. Retry protocol.")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        )
    }

    const isVerified = status?.id_status === "verified"
    const isPending = status?.id_status === "pending"
    const isRejected = status?.id_status === "rejected"

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            {/* Mission Header */}
            <div className="space-y-4">
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary tracking-widest uppercase font-black text-[10px] px-4 py-1">
                    Security Protocol 09 / Identity
                </Badge>
                <h1 className="text-5xl font-black tracking-tighter italic uppercase text-white">
                    Secure your <span className="text-primary">Nexus Identity.</span>
                </h1>
                <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                    Verify your credentials to unlock the Blue Check of Trust, higher job visibility, and on-chain verification badges.
                </p>
            </div>

            {/* Status Card */}
            <Card className={cn(
                "relative overflow-hidden border-2 transition-all duration-700",
                isVerified ? "border-emerald-500/30 bg-emerald-500/5" : 
                isPending ? "border-amber-500/30 bg-amber-500/5" : 
                isRejected ? "border-rose-500/30 bg-rose-500/5" :
                "border-white/10 bg-white/5"
            )}>
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    {isVerified ? <ShieldCheck className="w-24 h-24 text-emerald-500" /> : <Lock className="w-24 h-24" />}
                </div>
                
                <CardHeader className="relative z-10 p-10">
                    <div className="flex items-center gap-6">
                        <div className={cn(
                            "w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl",
                            isVerified ? "bg-emerald-500 shadow-emerald-500/20" : 
                            isPending ? "bg-amber-500 shadow-amber-500/20" : 
                            isRejected ? "bg-rose-500 shadow-rose-500/20" :
                            "bg-primary shadow-primary/20"
                        )}>
                            {isVerified ? <CheckCircle2 className="w-10 h-10 text-white" /> : 
                             isPending ? <Clock className="w-10 h-10 text-white animate-pulse" /> :
                             isRejected ? <ShieldAlert className="w-10 h-10 text-white" /> :
                             <ShieldCheck className="w-10 h-10 text-white" />}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Current State</p>
                            <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white">
                                {isVerified ? "Verification Complete" : 
                                 isPending ? "Review in Progress" : 
                                 isRejected ? "Action Required" :
                                 "Not Yet Verified"}
                            </h2>
                            <p className="text-muted-foreground font-medium italic">
                                {isVerified ? "Your identity is secured on the Solana Nexus." : 
                                 isPending ? "Our AI and Human auditors are analyzing your submission." : 
                                 isRejected ? `Rejection Reason: ${status.rejection_reason || "Invalid document image."}` :
                                 "Submit hardware-backed documentation to increase trust score."}
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <AnimatePresence>
                    {!isVerified && !isPending && (
                        <CardContent className="p-10 pt-0 space-y-8 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { id: 'passport', title: 'Global Passport', icon: <Scale className="w-5 h-5"/>, desc: 'International standard verification' },
                                    { id: 'drivers_license', title: "Driver's License", icon: <FileText className="w-5 h-5"/>, desc: 'Localized government identity' },
                                ]?.map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => handleSubmit(type.id)}
                                        disabled={submitting}
                                        className="group p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/40 text-left transition-all hover:scale-[1.02]"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-primary/10 transition-colors">
                                                {type.icon}
                                            </div>
                                            <Upload className="w-4 h-4 text-white/0 group-hover:text-primary transition-all" />
                                        </div>
                                        <h3 className="text-xl font-bold italic uppercase tracking-tighter text-white">{type.title}</h3>
                                        <p className="text-xs text-muted-foreground mt-1">{type.desc}</p>
                                    </button>
                                ))}
                            </div>

                            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
                                <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-white">Encryption Protocol Alpha</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        All documents are encrypted at rest and never shared with recruiters. Only the "Verified" status is visible to the public. Artifacts are purged 30 days after verification.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    )}
                </AnimatePresence>
            </Card>

            {/* Future Perks */}
            {!isVerified && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                    {[
                        { title: 'Nexus Trust', val: '+25%', icon: <Zap className="w-5 h-5"/> },
                        { title: 'Priority Match', val: 'Unlocked', icon: <ArrowRight className="w-5 h-5"/> },
                        { title: 'Premium Access', val: 'Enabled', icon: <ShieldCheck className="w-5 h-5"/> }
                    ].map(perk => (
                        <div key={perk.title} className="p-6 text-center space-y-2 border border-white/5 bg-white/[0.02] rounded-3xl italic">
                            <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-3">
                                {perk.icon}
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">{perk.title}</p>
                            <p className="text-2xl font-black text-white">{perk.val}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
