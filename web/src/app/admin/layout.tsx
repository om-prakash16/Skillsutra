"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2, Zap } from "lucide-react"
import { GlobalSearchCommand } from "@/components/admin/GlobalSearchCommand"
import { PlatformHealthHeader } from "@/components/admin/PlatformHealthHeader"
import { AppShell } from "@/components/layout/app-shell"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push("/auth/login")
            } else if (!["super_admin", "admin", "security_admin", "support_admin", "ai_admin", "moderator"].includes(user.role as string)) {
                router.push("/user/dashboard")
            }
        }
    }, [user, isLoading, router])

    if (isLoading || !user || (!["super_admin", "admin", "security_admin", "support_admin", "ai_admin", "moderator"].includes(user.role as string))) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground overflow-hidden relative">
                {/* Background Glows */}
                <div className="absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10"
                >
                    <div className="absolute inset-0 bg-primary/30 blur-[120px] rounded-full" />
                    <div className="bg-muted/50 p-8 rounded-[2.5rem] border border-border relative backdrop-blur-3xl shadow-2xl shadow-black/50 overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
                        <motion.div
                            animate={{ 
                                rotate: [0, 360],
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-12 -right-12 w-24 h-24 bg-primary/20 blur-2xl rounded-full"
                        />
                        <Zap className="h-16 w-16 text-primary relative z-10 drop-shadow-[0_0_15px_hsl(var(--primary)/0.8)]" />
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="mt-12 flex flex-col items-center gap-4 relative z-10"
                >
                    <div className="flex flex-col items-center">
                        <p className="text-2xl font-black font-heading tracking-[0.6em] uppercase text-foreground/90 mb-1">Nexus Admin</p>
                        <p className="text-[10px] font-black tracking-[0.8em] uppercase text-primary/60 ml-2">Secure Terminal Access</p>
                    </div>
                    
                    <div className="flex items-center gap-3 px-6 py-2.5 bg-muted/50 rounded-2xl border border-border backdrop-blur-md">
                        <div className="relative h-4 w-4">
                            <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
                            <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                        <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest animate-pulse">Syncing matrix protocols...</span>
                    </div>
                </motion.div>
                
                {/* Decorative border elements */}
                <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-border/50 rounded-tl-3xl" />
                <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-border/50 rounded-br-3xl" />
            </div>
        )
    }

    return (
        <>
            <AppShell 
                sidebar={<Sidebar role={(user?.role as string) || "admin"} className="hidden lg:flex" />}
                header={<PlatformHealthHeader />}
            >
                {children}
            </AppShell>
            <GlobalSearchCommand />
        </>
    )
}
