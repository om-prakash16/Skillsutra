"use client";

import React, { useState } from "react"
import { QuickActionsGrid, QuickActionId } from "@/components/superadmin/quick-actions-grid"
import { ActionDrawer } from "@/components/superadmin/action-drawer"
import { ShieldAlert } from "lucide-react"

export default function QuickActionsPage() {
    const [selectedAction, setSelectedAction] = useState<QuickActionId | null>(null)
    const [drawerOpen, setDrawerOpen] = useState(false)

    const handleSelectAction = (id: QuickActionId) => {
        setSelectedAction(id)
        setDrawerOpen(true)
    }

    const handleDrawerOpenChange = (open: boolean) => {
        setDrawerOpen(open)
        if (!open) {
            setTimeout(() => setSelectedAction(null), 300) // Clear after animation
        }
    }

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                            <ShieldAlert className="w-5 h-5 text-rose-500" />
                        </div>
                        <h1 className="text-3xl font-black font-heading tracking-tight text-foreground/90">Global Quick Actions</h1>
                    </div>
                    <p className="text-sm text-muted-foreground ml-11">
                        Enterprise platform provisioning and global identity management. All actions execute in Super Admin context.
                    </p>
                </div>
            </div>

            <QuickActionsGrid onSelectAction={handleSelectAction} />

            <ActionDrawer 
                open={drawerOpen} 
                onOpenChange={handleDrawerOpenChange} 
                actionId={selectedAction} 
            />
        </div>
    )
}
