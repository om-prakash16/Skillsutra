"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api/api-client"
import { motion } from "framer-motion"
import { 
    ShieldCheck, 
    ShieldAlert, 
    Loader2, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    User, 
    Mail, 
    Calendar,
    Search,
    Filter,
    ChevronDown
} from "lucide-react"
import { toast } from "sonner"

interface VerificationUser {
    id: string
    email: string
    username: string
    first_name: string
    last_name: string
    avatar_url: string | null
    is_verified: boolean
    verification_status: string // PENDING, APPROVED, REJECTED
    created_at: string
    role: string
}

export default function UserVerificationPage() {
    const [users, setUsers] = useState<VerificationUser[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending")
    const [searchQuery, setSearchQuery] = useState("")
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const params = filter !== "all" ? `?verification_status=${filter}` : ""
            const data = await api.get(`/admin/users/verification${params}`)
            setUsers(Array.isArray(data) ? data : data?.data || [])
        } catch (err) {
            console.error("Failed to fetch verification queue", err)
            // Fallback: try the general users endpoint
            try {
                const data = await api.get(`/admin/users?limit=100`)
                const allUsers = Array.isArray(data) ? data : data?.data || []
                setUsers(allUsers.filter((u: any) => {
                    if (filter === "all") return true
                    if (filter === "pending") return !u.is_verified
                    if (filter === "approved") return u.is_verified
                    return false
                }))
            } catch {
                setUsers([])
            }
        } finally {
            setLoading(false)
        }
    }, [filter])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handleAction = async (userId: string, action: "approve" | "reject") => {
        setActionLoading(userId)
        try {
            await api.patch(`/admin/users/${userId}/verify`, { action })
            toast.success(`User ${action === "approve" ? "verified" : "rejected"} successfully`)
            fetchUsers()
        } catch (err) {
            console.error(err)
            toast.error(`Failed to ${action} user`)
        } finally {
            setActionLoading(null)
        }
    }

    const filteredUsers = users.filter(u => {
        if (!searchQuery) return true
        const q = searchQuery.toLowerCase()
        return (
            u.email?.toLowerCase().includes(q) ||
            u.username?.toLowerCase().includes(q) ||
            u.first_name?.toLowerCase().includes(q) ||
            u.last_name?.toLowerCase().includes(q)
        )
    })

    const statusColors: Record<string, string> = {
        pending: "text-amber-400 border-amber-500/30 bg-amber-500/10",
        approved: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
        rejected: "text-rose-400 border-rose-500/30 bg-rose-500/10",
    }

    const filterTabs = [
        { key: "pending", label: "Pending", icon: Clock, count: 0 },
        { key: "approved", label: "Approved", icon: CheckCircle2, count: 0 },
        { key: "rejected", label: "Rejected", icon: XCircle, count: 0 },
        { key: "all", label: "All", icon: User, count: 0 },
    ] as const

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                        <Badge variant="outline" className="glass border-amber-500/30 text-amber-400 px-4 font-black tracking-widest text-[9px] uppercase rounded-full">
                            Identity Verification Queue
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter text-foreground">
                        User <span className="text-amber-500">Verification</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl">
                        Review and verify user identities. Approve or reject pending verification requests.
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
                                    ? "bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30" 
                                    : "glass border-border hover:border-amber-500/20"
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
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 h-9 rounded-xl bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 w-64 transition-all"
                    />
                </div>
            </div>

            {/* User Cards Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-10 h-10 animate-spin text-amber-500/40" />
                </div>
            ) : filteredUsers.length === 0 ? (
                <Card className="glass border-border/50 rounded-[2rem]">
                    <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
                        <ShieldCheck className="w-16 h-16 text-emerald-500/30" />
                        <p className="text-muted-foreground/60 font-bold text-sm uppercase tracking-widest">
                            {filter === "pending" ? "No pending verifications" : "No users found"}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map((user, idx) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Card className="glass border-border/50 rounded-[1.5rem] overflow-hidden hover:border-amber-500/20 transition-all duration-300 group">
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-black text-sm">
                                                {(user.first_name || user.username || user.email || "?").charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <CardTitle className="text-sm font-black">
                                                    {user.first_name && user.last_name 
                                                        ? `${user.first_name} ${user.last_name}` 
                                                        : user.username || "Unknown User"}
                                                </CardTitle>
                                                <CardDescription className="text-[10px] font-bold tracking-wide">
                                                    @{user.username || "—"}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <Badge 
                                            variant="outline" 
                                            className={`text-[9px] font-black uppercase tracking-widest rounded-full px-3 ${
                                                statusColors[user.verification_status || (user.is_verified ? "approved" : "pending")]
                                            }`}
                                        >
                                            {user.verification_status || (user.is_verified ? "Verified" : "Pending")}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3 pb-5">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Mail className="w-3.5 h-3.5" />
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                                    </div>

                                    {/* Actions */}
                                    {(!user.is_verified || user.verification_status === "pending") && (
                                        <div className="flex gap-2 pt-3 border-t border-border/50">
                                            <Button
                                                size="sm"
                                                className="flex-1 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 text-[10px] font-black uppercase tracking-widest gap-1.5"
                                                onClick={() => handleAction(user.id, "approve")}
                                                disabled={actionLoading === user.id}
                                            >
                                                {actionLoading === user.id ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : (
                                                    <CheckCircle2 className="w-3 h-3" />
                                                )}
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="flex-1 h-8 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 text-[10px] font-black uppercase tracking-widest gap-1.5"
                                                onClick={() => handleAction(user.id, "reject")}
                                                disabled={actionLoading === user.id}
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
