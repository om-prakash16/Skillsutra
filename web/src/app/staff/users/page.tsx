"use client"

import { useState } from "react"
import { Search, Filter, Flag, ShieldAlert, RefreshCw, MessageSquare, Star, Github, ChevronDown } from "lucide-react"

type UserStatus = "active" | "suspended" | "pending"
type ActionType = "flag_suspicious" | "request_reverification" | "suspend" | "warn" | "send_message"

interface MockUser {
    wallet: string
    name: string
    email: string
    reputation: number
    github_score: number
    status: UserStatus
    skills: string[]
    nft_count: number
    ai_score: number
    joined: string
}

const mockUsers: MockUser[] = [
    { wallet: "0xabc...1a2b", name: "Rahul Sharma",  email: "rahul@dev.io",  reputation: 92, github_score: 88, status: "active",    skills: ["React","Python","Solana"],  nft_count: 4, ai_score: 91, joined: "Jan 2025" },
    { wallet: "0xdef...3c4d", name: "Anita Verma",   email: "anita@ml.io",   reputation: 78, github_score: 65, status: "active",    skills: ["ML","TensorFlow","Python"], nft_count: 2, ai_score: 77, joined: "Feb 2025" },
    { wallet: "0x123...5e6f", name: "Suspicious Bot", email: "bot@fake.io",  reputation: 12, github_score: 3,  status: "suspended", skills: ["Rust"],                     nft_count: 7, ai_score: 10, joined: "Mar 2025" },
    { wallet: "0x789...7g8h", name: "Priya Nair",    email: "priya@ux.io",   reputation: 85, github_score: 72, status: "active",    skills: ["Figma","React","CSS"],      nft_count: 3, ai_score: 84, joined: "Dec 2024" },
    { wallet: "0xaaa...9i0j", name: "Karan Mehta",   email: "karan@dev.io",  reputation: 55, github_score: 40, status: "pending",   skills: ["Java","Spring"],            nft_count: 1, ai_score: 52, joined: "Mar 2025" },
]

const statusBadge: Record<UserStatus, string> = {
    active:    "text-green-400 bg-green-500/10 border-green-500/30",
    suspended: "text-red-400 bg-red-500/10 border-red-500/30",
    pending:   "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
}

const actions: { action: ActionType; label: string; icon: typeof Flag; color: string }[] = [
    { action: "flag_suspicious",        label: "Flag Suspicious",     icon: Flag,          color: "text-orange-400 hover:bg-orange-500/10" },
    { action: "request_reverification", label: "Request Re-verify",   icon: RefreshCw,     color: "text-blue-400 hover:bg-blue-500/10" },
    { action: "suspend",                label: "Suspend Account",     icon: ShieldAlert,    color: "text-red-400 hover:bg-red-500/10" },
    { action: "warn",                   label: "Send Warning",        icon: MessageSquare,  color: "text-yellow-400 hover:bg-yellow-500/10" },
]

export default function StaffUsersPage() {
    const [search, setSearch] = useState("")
    const [activeUser, setActiveUser] = useState<string | null>(null)

    const filtered = mockUsers.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.wallet.toLowerCase().includes(search.toLowerCase()) ||
        u.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">User Moderation</h1>
                <p className="text-slate-400 text-sm mt-1">Search, review, and take action on platform users.</p>
            </div>

            {/* Search Bar */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name, wallet, or skill..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-400 hover:text-slate-100 hover:border-slate-600 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800 text-left">
                            {["User", "Reputation", "GitHub Score", "AI Score", "NFTs", "Status", "Actions"].map(h => (
                                <th key={h} className="px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(user => (
                            <>
                                <tr
                                    key={user.wallet}
                                    onClick={() => setActiveUser(activeUser === user.wallet ? null : user.wallet)}
                                    className="border-b border-slate-800/50 hover:bg-slate-800/40 cursor-pointer transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-medium text-white">{user.name}</p>
                                            <p className="text-xs text-slate-500 font-mono">{user.wallet}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-yellow-400" />
                                            <span className="text-white font-semibold">{user.reputation}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <Github className="w-3 h-3 text-slate-400" />
                                            <span className="text-slate-300">{user.github_score}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`font-semibold ${user.ai_score >= 75 ? "text-green-400" : user.ai_score >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                                            {user.ai_score}%
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 bg-violet-500/10 text-violet-400 rounded text-xs font-medium border border-violet-500/20">
                                            {user.nft_count} NFTs
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 text-xs rounded border font-medium capitalize ${statusBadge[user.status]}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${activeUser === user.wallet ? "rotate-180" : ""}`} />
                                    </td>
                                </tr>
                                {/* Expanded Action Row */}
                                {activeUser === user.wallet && (
                                    <tr key={`${user.wallet}-actions`} className="bg-slate-800/30">
                                        <td colSpan={7} className="px-4 py-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-xs text-slate-500 mr-2">Staff Actions:</span>
                                                {actions.map(a => (
                                                    <button
                                                        key={a.action}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition-all ${a.color}`}
                                                        onClick={() => alert(`Action: ${a.label} on ${user.name}`)}
                                                    >
                                                        <a.icon className="w-3 h-3" />
                                                        {a.label}
                                                    </button>
                                                ))}
                                                <div className="ml-auto text-xs text-slate-500">
                                                    Skills: {user.skills.join(", ")}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
