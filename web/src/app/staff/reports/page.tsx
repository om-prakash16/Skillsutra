"use client"

import { useState } from "react"
import { Flag, CheckCircle2, ArrowUpCircle, User, Briefcase, AlertTriangle, Clock, ChevronRight } from "lucide-react"

type ReportPriority = "low" | "normal" | "high" | "critical"
type ReportStatus   = "open" | "in_review" | "resolved" | "dismissed"
type ReportKind     = "user" | "job"

interface Report {
    id: string
    kind:     ReportKind
    type:     string
    reason:   string
    priority: ReportPriority
    status:   ReportStatus
    reporter: string
    target:   string
    age:      string
}

const mockReports: Report[] = [
    { id: "r1", kind:"user", type:"fake_profile",         reason:"Profile photo copied from LinkedIn, GitHub activity looks scripted.",   priority:"critical", status:"open",      reporter:"0xaaa...", target:"0xfake...", age:"12h" },
    { id: "r2", kind:"job",  type:"scam",                 reason:"Company asks for payment before sharing project details.",              priority:"high",     status:"in_review", reporter:"0xbbb...", target:"Job #52",   age:"3h"  },
    { id: "r3", kind:"user", type:"plagiarized_project",  reason:"Project GitHub repo looks cloned from another open source project.",   priority:"high",     status:"open",      reporter:"0xccc...", target:"0xplag...", age:"8h"  },
    { id: "r4", kind:"job",  type:"spam",                 reason:"Same job posted 12 times in 2 hours from same wallet.",                priority:"normal",   status:"open",      reporter:"0xddd...", target:"Job #88",   age:"20m" },
    { id: "r5", kind:"user", type:"suspicious_activity",  reason:"Gained 50 reputation points overnight. Activity looks automated.",    priority:"normal",   status:"resolved",  reporter:"0xeee...", target:"0xbox...",  age:"2d"  },
]

const priorityConfig: Record<ReportPriority, { label: string; class: string }> = {
    critical: { label: "Critical", class: "text-red-400 bg-red-500/10 border-red-500/30" },
    high:     { label: "High",     class: "text-orange-400 bg-orange-500/10 border-orange-500/30" },
    normal:   { label: "Normal",   class: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
    low:      { label: "Low",      class: "text-slate-400 bg-slate-500/10 border-slate-500/30" },
}

const statusConfig: Record<ReportStatus, { label: string; class: string }> = {
    open:       { label: "Open",       class: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
    in_review:  { label: "In Review",  class: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
    resolved:   { label: "Resolved",   class: "text-green-400 bg-green-500/10 border-green-500/30" },
    dismissed:  { label: "Dismissed",  class: "text-slate-400 bg-slate-500/10 border-slate-500/30" },
}

export default function StaffReportsPage() {
    const [reports, setReports] = useState(mockReports)
    const [filter, setFilter]   = useState<string>("all")
    const [expanded, setExpanded] = useState<string | null>(null)

    const filtered = reports.filter(r =>
        filter === "all" || r.status === filter || r.priority === filter || r.kind === filter
    )

    const act = (id: string, status: ReportStatus) => {
        setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Reports & Flags</h1>
                <p className="text-slate-400 text-sm mt-1">Triage and resolve reports submitted by users across the platform.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {["all", "open", "in_review", "resolved", "critical", "high", "user", "job"].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border ${filter === f ? "bg-violet-600/20 text-violet-300 border-violet-600/30" : "bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-100"}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Reports List */}
            <div className="space-y-3">
                {filtered.map(report => (
                    <div key={report.id} className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
                        <button
                            onClick={() => setExpanded(expanded === report.id ? null : report.id)}
                            className="w-full text-left p-5 hover:bg-slate-800/30 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg mt-0.5 ${report.kind === "user" ? "bg-blue-500/10" : "bg-orange-500/10"}`}>
                                        {report.kind === "user"
                                            ? <User className="w-4 h-4 text-blue-400" />
                                            : <Briefcase className="w-4 h-4 text-orange-400" />
                                        }
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-medium text-white capitalize">{report.type.replace("_", " ")}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityConfig[report.priority].class}`}>
                                                {priorityConfig[report.priority].label}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${statusConfig[report.status].class}`}>
                                                {statusConfig[report.status].label}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-400 mt-1 line-clamp-1">{report.reason}</p>
                                        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{report.age} ago</span>
                                            <span>Target: <span className="font-mono text-slate-400">{report.target}</span></span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className={`w-4 h-4 text-slate-600 shrink-0 transition-transform ${expanded === report.id ? "rotate-90" : ""}`} />
                            </div>
                        </button>

                        {expanded === report.id && (
                            <div className="border-t border-slate-800 px-5 py-4 bg-slate-800/20">
                                <p className="text-sm text-slate-300 mb-4">{report.reason}</p>
                                <div className="flex flex-wrap gap-2">
                                    <button onClick={() => act(report.id, "resolved")}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-all">
                                        <CheckCircle2 className="w-3 h-3" /> Resolve
                                    </button>
                                    <button onClick={() => act(report.id, "in_review")}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/20 transition-all">
                                        <AlertTriangle className="w-3 h-3" /> Mark In Review
                                    </button>
                                    <button onClick={() => act(report.id, "dismissed")}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-700/50 text-slate-400 border border-slate-700 hover:bg-slate-700 transition-all">
                                        Dismiss
                                    </button>
                                    <button
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all">
                                        <ArrowUpCircle className="w-3 h-3" /> Escalate to Admin
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
