"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api/api-client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
    Scale,
    FileText,
    History,
    Shield,
    UploadCloud,
    AlertCircle,
    CheckCircle2
} from "lucide-react"

export default function LegalManagementPage() {
    const [documents, setDocuments] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchDocs()
    }, [])

    const fetchDocs = async () => {
        setLoading(true)
        try {
            const res = await api.get('/admin/legal-docs')
            setDocuments(res.data || [])
        } catch (error) {
            console.error("Failed to fetch legal docs", error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpload = async () => {
        try {
            await api.post('/admin/legal-docs', {
                type: "New Document",
                version: "v1.0.0",
                requiredConsent: true
            })
            fetchDocs()
        } catch (error) {
            console.error("Failed to upload doc", error)
        }
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(148,163,184,0.8)]" />
                        <Badge variant="outline" className="glass border-slate-400/30 text-slate-400 px-4 font-black tracking-widest text-[9px] uppercase rounded-full">
                            Compliance & Legal
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter text-foreground">
                        Legal <span className="text-slate-400">Documents</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl">
                        Manage platform terms, privacy policies, user consent tracking, and legal agreements.
                    </p>
                </div>
                <Button onClick={handleUpload} className="rounded-xl font-bold bg-slate-700 hover:bg-slate-600 text-white gap-2 px-6 h-11">
                    <UploadCloud className="w-4 h-4" />
                    Upload New Version
                </Button>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass border-border/50 rounded-[1.5rem]">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Consent Rate (ToS)</p>
                                <p className="text-3xl font-black font-mono text-emerald-500">99.9%</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-border/50 rounded-[1.5rem]">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Pending Consent</p>
                                <p className="text-3xl font-black font-mono text-amber-500">1,204</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-border/50 rounded-[1.5rem]">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Documents</p>
                                <p className="text-3xl font-black font-mono text-slate-300">12</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-slate-500/10 flex items-center justify-center text-slate-400">
                                <FileText className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Documents List */}
            <Card className="glass border-border/50 rounded-[1.5rem] overflow-hidden">
                <CardHeader className="border-b border-border/30 bg-muted/20 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400">
                            <Scale className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Document Registry</CardTitle>
                            <CardDescription>Version control and status of all legal platform texts.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-border/30">
                        {loading && (
                            <div className="p-10 flex justify-center text-slate-500">
                                Loading documents...
                            </div>
                        )}
                        {!loading && documents.map((doc, i) => (
                            <motion.div 
                                key={doc.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="p-6 hover:bg-muted/30 transition-colors flex flex-col md:flex-row gap-6 md:items-center justify-between group"
                            >
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-foreground text-lg">{doc.type}</h3>
                                        <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-widest ${doc.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                                            {doc.status}
                                        </Badge>
                                        {doc.requiredConsent && (
                                            <Badge variant="outline" className="bg-rose-500/10 text-rose-400 border-rose-500/30 text-[10px] uppercase font-bold tracking-widest">
                                                Consent Required
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                                        <span>Current Version: <span className="text-foreground">{doc.version}</span></span>
                                        <span>Last Updated: {doc.lastUpdated}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <Button variant="outline" className="h-9 glass text-slate-300">
                                        <History className="w-4 h-4 mr-2" /> View History
                                    </Button>
                                    <Button variant="outline" className="h-9 glass text-slate-300">
                                        <Shield className="w-4 h-4 mr-2" /> Force Consent Dialog
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
