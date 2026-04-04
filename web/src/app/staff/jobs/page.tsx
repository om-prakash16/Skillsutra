"use client"

import { useState } from "react"
import { Search, Flag, CheckCircle2, XCircle, Building2, MapPin, Clock } from "lucide-react"

type JobStatus = "active" | "flagged" | "closed" | "draft"

interface MockJob {
    id: string
    title: string
    company: string
    company_verified: boolean
    location_type: string
    salary: string
    skills: string[]
    status: JobStatus
    posted: string
    report_count: number
}

const mockJobs: MockJob[] = [
    { id: "j1", title: "Senior Solana Developer",       company: "ChainVault Labs",  company_verified: true,  location_type: "Remote",  salary: "₹40-60 LPA",   skills: ["Rust","Solana","Anchor"],     status: "active",  posted: "2h ago",  report_count: 0 },
    { id: "j2", title: "Get Paid $999/Day EASY!",        company: "EasyMoney Inc",   company_verified: false, location_type: "Remote",  salary: "₹999/day",     skills: [],                             status: "flagged", posted: "4h ago",  report_count: 3 },
    { id: "j3", title: "React Frontend Engineer",        company: "Acme Corp",       company_verified: true,  location_type: "Onsite",  salary: "₹25-35 LPA",   skills: ["React","TypeScript","Next.js"],status: "active",  posted: "1d ago",  report_count: 0 },
    { id: "j4", title: "Work From Home — No Skills!!",   company: "QuickHire",       company_verified: false, location_type: "Remote",  salary: "₹50K/month",   skills: [],                             status: "flagged", posted: "6h ago",  report_count: 5 },
    { id: "j5", title: "ML Engineer — NLP Focus",       company: "DataNova AI",     company_verified: true,  location_type: "Hybrid",  salary: "₹30-50 LPA",   skills: ["Python","PyTorch","ML"],      status: "active",  posted: "3d ago",  report_count: 0 },
]

const statusStyles: Record<JobStatus, string> = {
    active:  "text-green-400 bg-green-500/10 border-green-500/30",
    flagged: "text-red-400 bg-red-500/10 border-red-500/30",
    closed:  "text-slate-400 bg-slate-500/10 border-slate-500/30",
    draft:   "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
}

export default function StaffJobsPage() {
    const [search, setSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState<string>("all")
    const [jobs, setJobs] = useState(mockJobs)

    const filtered = jobs.filter(j =>
        (filterStatus === "all" || j.status === filterStatus) &&
        (j.title.toLowerCase().includes(search.toLowerCase()) ||
         j.company.toLowerCase().includes(search.toLowerCase()))
    )

    const handleAction = (id: string, action: "approve" | "flag" | "remove") => {
        const statusMap = { approve: "active" as JobStatus, flag: "flagged" as JobStatus, remove: "closed" as JobStatus }
        setJobs(prev => prev.map(j => j.id === id ? { ...j, status: statusMap[action] } : j))
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Job Moderation</h1>
                <p className="text-slate-400 text-sm mt-1">Review, approve, or flag job postings across the platform.</p>
            </div>

            {/* Controls */}
            <div className="flex gap-3 flex-wrap">
                <div className="relative flex-1 min-w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search jobs or companies..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    {["all","active","flagged","closed"].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize border ${filterStatus === s ? "bg-violet-600/20 text-violet-300 border-violet-600/30" : "bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-100"}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Job Cards */}
            <div className="space-y-3">
                {filtered.map(job => (
                    <div key={job.id} className="rounded-xl border border-slate-800 bg-slate-900 p-5 hover:border-slate-700 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-semibold text-white">{job.title}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${statusStyles[job.status]}`}>
                                        {job.status}
                                    </span>
                                    {job.report_count > 0 && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
                                            {job.report_count} reports
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-400 flex-wrap">
                                    <span className="flex items-center gap-1">
                                        <Building2 className="w-3 h-3" />
                                        {job.company}
                                        {job.company_verified
                                            ? <CheckCircle2 className="w-3 h-3 text-green-400 ml-1" />
                                            : <XCircle className="w-3 h-3 text-red-400 ml-1" />
                                        }
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {job.location_type}
                                    </span>
                                    <span>{job.salary}</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {job.posted}
                                    </span>
                                </div>
                                {job.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {job.skills.map(s => (
                                            <span key={s} className="text-xs px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {job.skills.length === 0 && (
                                    <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                                        <Flag className="w-3 h-3" /> No skills listed — potential spam indicator
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2 shrink-0">
                                <button
                                    onClick={() => handleAction(job.id, "approve")}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-all"
                                >
                                    <CheckCircle2 className="w-3 h-3" /> Approve
                                </button>
                                <button
                                    onClick={() => handleAction(job.id, "flag")}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 transition-all"
                                >
                                    <Flag className="w-3 h-3" /> Flag
                                </button>
                                <button
                                    onClick={() => handleAction(job.id, "remove")}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all"
                                >
                                    <XCircle className="w-3 h-3" /> Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
