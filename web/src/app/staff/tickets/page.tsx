"use client"

import { useState } from "react"
import { Ticket, Clock, CheckCircle2, MessageSquare, User, Wallet, ShieldAlert, Briefcase, ChevronRight } from "lucide-react"

type TicketStatus   = "open" | "in_progress" | "resolved" | "closed"
type TicketPriority = "low" | "normal" | "high" | "urgent"
type TicketCategory = "profile_issue" | "wallet_connection" | "nft_sync" | "job_application" | "other"

interface SupportTicket {
    id: string
    submitter: string
    category:  TicketCategory
    subject:   string
    body:      string
    status:    TicketStatus
    priority:  TicketPriority
    assigned_to: string | null
    age:       string
}

const mockTickets: SupportTicket[] = [
    { id: "t1", submitter:"Rahul S.", category:"wallet_connection", subject:"Phantom wallet not connecting on Firefox", body:"I get an error 'WalletNotReadyError' every time I try to log in via Phantom on Firefox. Tried in incognito mode — same error.", status:"open",        priority:"urgent",  assigned_to: null,        age:"45m" },
    { id: "t2", submitter:"Anita V.", category:"nft_sync",          subject:"Skill NFT minted but not showing on profile",  body:"I completed the Python skill assessment and the transaction confirmed on Solana Explorer (tx: abc123), but my profile still shows no skill NFT.", status:"in_progress", priority:"high",    assigned_to:"ver_priya",  age:"2h"  },
    { id: "t3", submitter:"Karan M.", category:"job_application",   subject:"Application failed — no confirmation email",   body:"I applied to the 'ML Engineer' position and the transaction succeeded, but I got no confirmation. The job is still showing as 'open'.",  status:"open",        priority:"normal",  assigned_to: null,        age:"4h"  },
    { id: "t4", submitter:"Priya N.", category:"profile_issue",     subject:"GitHub score not refreshing",                  body:"My GitHub score on my profile is still 0 even after linking my GitHub handle. I have 30+ public repos.",  status:"resolved",    priority:"low",     assigned_to:"sup_rahul",  age:"1d"  },
]

const categoryIcons: Record<TicketCategory, typeof Wallet> = {
    profile_issue:    User,
    wallet_connection: Wallet,
    nft_sync:         ShieldAlert,
    job_application:  Briefcase,
    other:            MessageSquare,
}

const priorityConfig: Record<TicketPriority, string> = {
    urgent: "text-red-400 bg-red-500/10 border-red-500/30",
    high:   "text-orange-400 bg-orange-500/10 border-orange-500/30",
    normal: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    low:    "text-slate-400 bg-slate-500/10 border-slate-500/30",
}

const statusConfig: Record<TicketStatus, string> = {
    open:        "text-blue-400 bg-blue-500/10 border-blue-500/30",
    in_progress: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    resolved:    "text-green-400 bg-green-500/10 border-green-500/30",
    closed:      "text-slate-400 bg-slate-500/10 border-slate-500/30",
}

export default function StaffTicketsPage() {
    const [tickets, setTickets] = useState(mockTickets)
    const [expanded, setExpanded] = useState<string | null>(null)
    const [filter, setFilter] = useState("all")

    const filtered = tickets.filter(t =>
        filter === "all" || t.status === filter || t.priority === filter
    )

    const updateStatus = (id: string, status: TicketStatus) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Support Tickets</h1>
                    <p className="text-slate-400 text-sm mt-1">Handle user-submitted support requests across all categories.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Ticket className="w-4 h-4 text-violet-400" />
                    <span><span className="text-white font-semibold">{tickets.filter(t => t.status === "open").length}</span> open</span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {["all", "open", "in_progress", "resolved", "urgent", "high"].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border ${filter === f ? "bg-violet-600/20 text-violet-300 border-violet-600/30" : "bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-100"}`}
                    >
                        {f.replace("_", " ")}
                    </button>
                ))}
            </div>

            {/* Ticket List */}
            <div className="space-y-3">
                {filtered.map(ticket => {
                    const Icon = categoryIcons[ticket.category]
                    return (
                        <div key={ticket.id} className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
                            <button
                                onClick={() => setExpanded(expanded === ticket.id ? null : ticket.id)}
                                className="w-full text-left p-5 hover:bg-slate-800/30 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-violet-500/10 mt-0.5 shrink-0">
                                            <Icon className="w-4 h-4 text-violet-400" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-medium text-white">{ticket.subject}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityConfig[ticket.priority]}`}>
                                                    {ticket.priority}
                                                </span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${statusConfig[ticket.status]}`}>
                                                    {ticket.status.replace("_", " ")}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                                                <span className="flex items-center gap-1"><User className="w-3 h-3" />{ticket.submitter}</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ticket.age} ago</span>
                                                {ticket.assigned_to && <span className="text-violet-400">→ {ticket.assigned_to}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 text-slate-600 shrink-0 transition-transform ${expanded === ticket.id ? "rotate-90" : ""}`} />
                                </div>
                            </button>

                            {expanded === ticket.id && (
                                <div className="border-t border-slate-800 px-5 py-4 bg-slate-800/20 space-y-4">
                                    <p className="text-sm text-slate-300 leading-relaxed">{ticket.body}</p>
                                    <div className="flex flex-wrap gap-2">
                                        <button onClick={() => updateStatus(ticket.id, "in_progress")}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/20 transition-all">
                                            <Clock className="w-3 h-3" /> Mark In Progress
                                        </button>
                                        <button onClick={() => updateStatus(ticket.id, "resolved")}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-all">
                                            <CheckCircle2 className="w-3 h-3" /> Resolve
                                        </button>
                                        <button
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition-all">
                                            <MessageSquare className="w-3 h-3" /> Reply to User
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
