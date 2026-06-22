"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Building2, Users, ShieldAlert, Megaphone, Server, Network, FolderOpen, UserPlus, FileSpreadsheet, Lock, CheckCircle2, Copy, GitMerge, Fingerprint } from "lucide-react"

export type QuickActionId = 
    | "create-tenant"
    | "create-platform-admin"
    | "create-user"
    | "publish-announcement"
    | "create-org"
    | "create-workspace"
    | "bulk-import-users"
    | "assign-roles"

interface ActionItem {
    id: QuickActionId
    label: string
    description: string
    icon: React.ElementType
    color: string
}

const ACTION_GROUPS = [
    {
        title: "Platform Provisioning",
        actions: [
            { id: "create-tenant", label: "Create Tenant", description: "Provision a new isolated SaaS tenant with default roles and resources.", icon: Building2, color: "text-rose-400 bg-rose-500/10" },
            { id: "create-org", label: "Create Organization", description: "Create an organization under a specific tenant.", icon: Network, color: "text-blue-400 bg-blue-500/10" },
            { id: "create-workspace", label: "Create Workspace", description: "Create a functional workspace inside an organization.", icon: FolderOpen, color: "text-indigo-400 bg-indigo-500/10" },
            { id: "create-platform-admin", label: "Create Platform Admin", description: "Provision a global super administrator for the enterprise platform.", icon: ShieldAlert, color: "text-red-500 bg-red-500/10" },
        ] as ActionItem[]
    },
    {
        title: "Global User Management",
        actions: [
            { id: "create-user", label: "Create User", description: "Create any user type across any tenant globally.", icon: UserPlus, color: "text-emerald-400 bg-emerald-500/10" },
            { id: "bulk-import-users", label: "Bulk Import Users", description: "Import users from CSV or enterprise directory.", icon: FileSpreadsheet, color: "text-teal-400 bg-teal-500/10" },
            { id: "assign-roles", label: "Assign Roles", description: "Grant or revoke roles and ABAC policies globally.", icon: Lock, color: "text-amber-400 bg-amber-500/10" },
        ] as ActionItem[]
    },
    {
        title: "Communication & Ops",
        actions: [
            { id: "publish-announcement", label: "Publish Announcement", description: "Broadcast a message to the entire platform or specific tenants.", icon: Megaphone, color: "text-fuchsia-400 bg-fuchsia-500/10" },
        ] as ActionItem[]
    }
]

export function QuickActionsGrid({ onSelectAction }: { onSelectAction: (id: QuickActionId) => void }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    }
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="space-y-12">
            {ACTION_GROUPS.map((group, gIdx) => (
                <div key={gIdx} className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/50 border-b border-border/50 pb-2">
                        {group.title}
                    </h3>
                    <motion.div 
                        variants={container} 
                        initial="hidden" 
                        animate="show" 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    >
                        {group.actions.map((action) => (
                            <motion.div key={action.id} variants={item}>
                                <Card 
                                    onClick={() => onSelectAction(action.id)}
                                    className="p-5 cursor-pointer hover:bg-muted/50 transition-all duration-300 border border-border/50 hover:border-primary/50 group h-full flex flex-col glass"
                                >
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className={`p-2.5 rounded-xl ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                                            <action.icon className="w-5 h-5" />
                                        </div>
                                        <h4 className="font-bold text-sm text-foreground/90 group-hover:text-primary transition-colors">{action.label}</h4>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                                        {action.description}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            ))}
        </div>
    )
}
