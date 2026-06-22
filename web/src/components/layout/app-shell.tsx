"use client"

import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Zap } from "lucide-react"

interface AppShellProps {
    children: React.ReactNode
    sidebar: React.ReactNode
    header?: React.ReactNode
}

export function AppShell({ children, sidebar, header }: AppShellProps) {
    const { user, isLoading, isAuthenticated } = useAuth()
    const pathname = usePathname()

    // Public routes that might use this shell but don't strictly require auth for viewing
    const isPublicProfileRoute = pathname?.match(/^\/user\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i);
    const isAuthorized = isAuthenticated && !!user;

    if (!isPublicProfileRoute && (isLoading || !isAuthorized)) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground overflow-hidden relative">
                <div className="absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10"
                >
                    <div className="absolute inset-0 bg-primary/30 blur-[120px] rounded-full" />
                    <div className="bg-muted/50 p-8 rounded-[2.5rem] border border-border relative backdrop-blur-3xl shadow-2xl shadow-black/50 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
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
                        <p className="text-2xl font-black font-heading tracking-[0.6em] uppercase text-foreground/90 mb-1">Authenticating</p>
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
                
                <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-border/50 rounded-tl-3xl" />
                <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-border/50 rounded-br-3xl" />
            </div>
        )
    }

    return (
        <div className="flex h-[100dvh] w-full bg-background text-foreground overflow-hidden isolate relative selection:bg-primary/40">
            {/* Global Ambient Background - Locked behind the shell */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/[0.05] blur-[160px] rounded-full" />
                <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-blue-500/[0.03] blur-[140px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-emerald-500/[0.03] blur-[180px] rounded-full" />
            </div>

            {/* Sidebar Injection */}
            {sidebar}

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 min-h-0 flex flex-col relative overflow-hidden bg-background/50">
                {header}
                
                {/* The Scrolling Canvas */}
                <div 
                    id="app-shell-scroll-container"
                    data-lenis-prevent="true"
                    className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden scroll-smooth relative custom-scrollbar z-10"
                >
                    {/* Top inner gradient mask for premium scroll feel */}
                    <div className="sticky top-0 w-full h-6 bg-gradient-to-b from-background to-transparent z-40 pointer-events-none opacity-80" />
                    
                    <div className="w-full px-4 py-6 md:px-8 md:py-8 max-w-[1900px] mx-auto min-h-full flex flex-col">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={pathname}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="flex-1"
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Bottom inner gradient mask */}
                    <div className="sticky bottom-0 w-full h-8 bg-gradient-to-t from-background to-transparent z-30 pointer-events-none opacity-80" />
                </div>
            </main>
        </div>
    )
}
