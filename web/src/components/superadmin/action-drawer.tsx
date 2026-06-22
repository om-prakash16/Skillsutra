"use client"

import React from "react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { QuickActionId } from "./quick-actions-grid"
import { CreateTenantForm } from "./forms/create-tenant-form"
import { CreatePlatformAdminForm } from "./forms/create-platform-admin-form"
import { CreateUserForm } from "./forms/create-user-form"
import { PublishAnnouncementForm } from "./forms/publish-announcement-form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShieldAlert, Zap } from "lucide-react"

interface ActionDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    actionId: QuickActionId | null
}

export function ActionDrawer({ open, onOpenChange, actionId }: ActionDrawerProps) {
    const renderContent = () => {
        switch (actionId) {
            case "create-tenant":
                return <CreateTenantForm onSuccess={() => onOpenChange(false)} />
            case "create-platform-admin":
                return <CreatePlatformAdminForm onSuccess={() => onOpenChange(false)} />
            case "create-user":
                return <CreateUserForm onSuccess={() => onOpenChange(false)} />
            case "publish-announcement":
                return <PublishAnnouncementForm onSuccess={() => onOpenChange(false)} />
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                            <Zap className="w-8 h-8 text-muted-foreground opacity-50" />
                        </div>
                        <div>
                            <p className="font-bold text-lg">Action Not Available</p>
                            <p className="text-xs text-muted-foreground mt-1">This quick action is currently under development.</p>
                        </div>
                    </div>
                )
        }
    }

    const getTitles = () => {
        switch (actionId) {
            case "create-tenant": return { title: "Provision New Tenant", desc: "Create a fully isolated enterprise environment." }
            case "create-platform-admin": return { title: "Create Platform Admin", desc: "Provision a global root administrator." }
            case "create-user": return { title: "Global User Creation", desc: "Create an identity and assign to any tenant." }
            case "publish-announcement": return { title: "Broadcast Announcement", desc: "Push a real-time notification to the entire platform." }
            default: return { title: "Quick Action", desc: "Execute a platform-level command." }
        }
    }

    const titles = getTitles()

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent 
                side="right" 
                className="w-full sm:max-w-xl p-0 bg-background/95 backdrop-blur-xl border-l border-border/50 shadow-2xl z-[200] flex flex-col"
            >
                <div className="p-6 border-b border-border/50 bg-muted/20 relative overflow-hidden">
                    {/* Ambient glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
                    <SheetHeader>
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldAlert className="w-4 h-4 text-rose-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Super Admin Context</span>
                        </div>
                        <SheetTitle className="text-2xl font-black font-heading tracking-tight text-foreground/90">{titles.title}</SheetTitle>
                        <SheetDescription className="text-xs text-muted-foreground">
                            {titles.desc} All actions are recorded in the global audit ledger.
                        </SheetDescription>
                    </SheetHeader>
                </div>
                
                <ScrollArea className="flex-1">
                    <div className="p-6">
                        {renderContent()}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
