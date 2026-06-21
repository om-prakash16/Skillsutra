"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api/api-client"
import { motion } from "framer-motion"
import {
    Building2,
    ShieldCheck,
    Loader2,
    CheckCircle2,
    XCircle,
    Clock,
    Globe,
    Mail,
    Calendar,
    Search,
    Users
} from "lucide-react"
import { toast } from "sonner"

interface VerificationCompany {
    id: string
    company_name: string
    email: string | null
    website: string | null
    industry: string | null
    size: string | null
    approval_status: string
    domain_verified: boolean
    verification_level: number
    created_at: string
}

export default function CompanyVerificationPage() {
    const [companies, setCompanies] = useState<VerificationCompany[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<"PENDING" | "APPROVED" | "REJECTED" | "all">("PENDING")
    const [searchQuery, setSearchQuery] = useState("")
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const fetchCompanies = useCallback(async () => {
        setLoading(true)
        try {
            const data = await api.get(`/admin/companies`)
            const all = Array.isArray(data) ? data : data?.data || []
            setCompanies(filter === "all" ? all : all.filter((c: any) => c.approval_status === filter))
        } catch (err) {
            console.error("Failed to fetch companies", err)
            setCompanies([])
        } finally {
            setLoading(false)
        }
    }, [filter])

    useEffect(() => {
        fetchCompanies()
    }, [fetchCompanies])

    const handleAction = async (companyId: string, action: "approve" | "reject") => {
        setActionLoading(companyId)
        try {
            if (action === "approve") {
                await api.patch(`/admin/companies/${companyId}/approve`, {})
            } else {
                await api.patch(`/admin/companies/${companyId}/reject`, {})
            }
            toast.success(`Company ${action === "approve" ? "approved" : "rejected"} successfully`)
            fetchCompanies()
        } catch (err) {
            console.error(err)
            toast.error(`Failed to ${action} company`)
        } finally {
            setActionLoading(null)
        }
    }

    const filteredCompanies = companies.filter(c => {
        if (!searchQuery) return true
        const q = searchQuery.toLowerCase()
        return (
            c.company_name?.toLowerCase().includes(q) ||
            c.email?.toLowerCase().includes(q) ||
            c.industry?.toLowerCase().includes(q)
        )
    })

    const statusColors: Record<string, string> = {
        PENDING: "text-amber-400 border-amber-500/30 bg-amber-500/10",
        APPROVED: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
        REJECTED: "text-rose-400 border-rose-500/30 bg-rose-500/10",
    }

    const filterTabs = [
        { key: "PENDING", label: "Pending", icon: Clock },
        { key: "APPROVED", label: "Approved", icon: CheckCircle2 },
        { key: "REJECTED", label: "Rejected", icon: XCircle },
        { key: "all", label: "All", icon: Building2 },
    ] as const

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                        <Badge variant="outline" className="glass border-indigo-500/30 text-indigo-400 px-4 font-black tracking-widest text-[9px] uppercase rounded-full">
                            Corporate Verification Queue
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter text-foreground">
                        Company <span className="text-indigo-500">Verification</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl">
                        Review company registrations. Approve or reject pending corporate accounts.
                    </p>
                </div>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex gap-2">
                    {filterTabs.map(tab => (
                        <Button
                            key={tab.key}
                            variant={filter === tab.key ? "default" : "outline"}
                            size="sm"
                            className={`rounded-xl text-xs font-bold tracking-wide gap-2 h-9 px-4 transition-all ${
                                filter === tab.key
                                    ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/30"
                                    : "glass border-border hover:border-indigo-500/20"
                            }`}
                            onClick={() => setFilter(tab.key)}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </Button>
                    ))}
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search companies..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 h-9 rounded-xl bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 w-64 transition-all"
                    />
                </div>
            </div>

            {/* Company Cards */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500/40" />
                </div>
            ) : filteredCompanies.length === 0 ? (
                <Card className="glass border-border/50 rounded-[2rem]">
                    <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
                        <Building2 className="w-16 h-16 text-indigo-500/30" />
                        <p className="text-muted-foreground/60 font-bold text-sm uppercase tracking-widest">
                            {filter === "PENDING" ? "No pending company verifications" : "No companies found"}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCompanies.map((company, idx) => (
                        <motion.div
                            key={company.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Card className="glass border-border/50 rounded-[1.5rem] overflow-hidden hover:border-indigo-500/20 transition-all duration-300 group">
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-sm">
                                                {(company.company_name || "?").charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <CardTitle className="text-sm font-black">{company.company_name}</CardTitle>
                                                <CardDescription className="text-[10px] font-bold tracking-wide">
                                                    {company.industry || "—"} · {company.size || "—"}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={`text-[9px] font-black uppercase tracking-widest rounded-full px-3 ${
                                                statusColors[company.approval_status] || statusColors.PENDING
                                            }`}
                                        >
                                            {company.approval_status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3 pb-5">
                                    {company.email && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Mail className="w-3.5 h-3.5" />
                                            <span className="truncate">{company.email}</span>
                                        </div>
                                    )}
                                    {company.website && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Globe className="w-3.5 h-3.5" />
                                            <span className="truncate">{company.website}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>Registered {new Date(company.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-[8px] font-bold glass border-border rounded-full px-2">
                                            {company.domain_verified ? "Domain ✓" : "Domain ✗"}
                                        </Badge>
                                        <Badge variant="outline" className="text-[8px] font-bold glass border-border rounded-full px-2">
                                            Level {company.verification_level}
                                        </Badge>
                                    </div>

                                    {company.approval_status === "PENDING" && (
                                        <div className="flex gap-2 pt-3 border-t border-border/50">
                                            <Button
                                                size="sm"
                                                className="flex-1 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 text-[10px] font-black uppercase tracking-widest gap-1.5"
                                                onClick={() => handleAction(company.id, "approve")}
                                                disabled={actionLoading === company.id}
                                            >
                                                {actionLoading === company.id ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : (
                                                    <CheckCircle2 className="w-3 h-3" />
                                                )}
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="flex-1 h-8 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 text-[10px] font-black uppercase tracking-widest gap-1.5"
                                                onClick={() => handleAction(company.id, "reject")}
                                                disabled={actionLoading === company.id}
                                            >
                                                <XCircle className="w-3 h-3" />
                                                Reject
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
