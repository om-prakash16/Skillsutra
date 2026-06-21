"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api/api-client"
import { motion } from "framer-motion"
import {
    ShieldAlert,
    Loader2,
    Users,
    Key,
    Edit3,
    Trash2,
    PlusCircle,
    CheckCircle2
} from "lucide-react"
import { toast } from "sonner"

interface Role {
    id: string
    role_name: string
    description: string
    user_count?: number
}

export default function RolesManagementPage() {
    const [roles, setRoles] = useState<Role[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRoles()
    }, [])

    const fetchRoles = async () => {
        setLoading(true)
        try {
            const data = await api.get(`/admin/roles`)
            setRoles(Array.isArray(data) ? data : data?.data || [])
        } catch (err) {
            console.error("Failed to fetch roles", err)
            // Mock data for UI development if backend fails
            setRoles([
                { id: "1", role_name: "super_admin", description: "Unrestricted platform access", user_count: 2 },
                { id: "2", role_name: "admin", description: "General administrative access", user_count: 5 },
                { id: "3", role_name: "moderator", description: "Content moderation", user_count: 12 },
                { id: "4", role_name: "company", description: "Company account owner", user_count: 450 },
                { id: "5", role_name: "recruiter", description: "Company recruiter", user_count: 1200 },
                { id: "6", role_name: "user", description: "Basic user / talent", user_count: 85000 },
            ])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                        <Badge variant="outline" className="glass border-rose-500/30 text-rose-400 px-4 font-black tracking-widest text-[9px] uppercase rounded-full">
                            Identity Access Management
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter text-foreground">
                        Roles & <span className="text-rose-500">Permissions</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl">
                        Manage platform roles, define access levels, and audit permission assignments across the system.
                    </p>
                </div>
                
                <Button className="rounded-xl font-bold bg-rose-500 hover:bg-rose-600 text-white gap-2 px-6 h-11">
                    <PlusCircle className="w-4 h-4" />
                    Create Custom Role
                </Button>
            </div>

            {/* Roles Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-10 h-10 animate-spin text-rose-500/40" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map((role, idx) => (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Card className="glass border-border/50 rounded-[1.5rem] overflow-hidden hover:border-rose-500/20 transition-all duration-300 group">
                                <CardHeader className="pb-4 border-b border-border/30 bg-muted/20">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                                                <Key className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-sm font-black uppercase tracking-wider">{role.role_name}</CardTitle>
                                                <CardDescription className="text-xs font-medium mt-1">
                                                    {role.description || "System role"}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-5 space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Users className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Assigned Users</span>
                                        </div>
                                        <span className="text-lg font-black font-heading">{role.user_count?.toLocaleString() || 0}</span>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Capabilities</div>
                                        <div className="flex flex-wrap gap-2">
                                            {role.role_name === "super_admin" && <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10"><CheckCircle2 className="w-3 h-3 mr-1" /> Full System Access</Badge>}
                                            {role.role_name === "admin" && <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10"><CheckCircle2 className="w-3 h-3 mr-1" /> Manage Users</Badge>}
                                            {role.role_name === "moderator" && <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10"><CheckCircle2 className="w-3 h-3 mr-1" /> Content Moderation</Badge>}
                                            {(role.role_name === "user" || role.role_name === "career_professional") && <Badge variant="outline" className="text-[9px] border-blue-500/30 text-blue-400 bg-blue-500/10"><CheckCircle2 className="w-3 h-3 mr-1" /> Candidate Profile</Badge>}
                                            {role.role_name === "company" && <Badge variant="outline" className="text-[9px] border-indigo-500/30 text-indigo-400 bg-indigo-500/10"><CheckCircle2 className="w-3 h-3 mr-1" /> ATS Management</Badge>}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t border-border/50">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 h-8 rounded-lg text-[10px] font-black uppercase tracking-widest gap-1.5 glass"
                                        >
                                            <Edit3 className="w-3 h-3" />
                                            Edit Policy
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 w-8 p-0 rounded-lg text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 border-rose-500/20 glass"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
