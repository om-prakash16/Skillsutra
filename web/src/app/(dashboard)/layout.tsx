"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { useAuth } from "@/context/auth-context"
import { Loader2, Zap, Menu } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading, isAuthenticated } = useAuth()
    const pathname = usePathname()

    // Check if this is a dynamic profile route (UUID)
    const isPublicProfileRoute = pathname?.match(/^\/user\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i);
    
    // If not a public profile, enforce auth
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
                        <p className="text-2xl font-black font-heading tracking-[0.6em] uppercase text-foreground/90 mb-1">Best Hiring Tool</p>
                        <p className="text-[10px] font-black tracking-[0.8em] uppercase text-primary/60 ml-2">Intelligence Engine</p>
                    </div>
                    
                    <div className="flex items-center gap-3 px-6 py-2.5 bg-muted/50 rounded-2xl border border-border backdrop-blur-md">
                        <div className="relative h-4 w-4">
                            <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
                            <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                        <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest animate-pulse">Synchronizing your workspace...</span>
                    </div>
                </motion.div>
                
                <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-border/50 rounded-tl-3xl" />
                <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-border/50 rounded-br-3xl" />
            </div>
        )
    }

    const showSidebar = isAuthorized && !isLoading;

    const MobileHeader = showSidebar ? (
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-md z-50 flex items-center px-4">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0 text-foreground">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 bg-background border-border z-[200]">
                    <Sidebar role={(user?.role as any) || "user"} variant="mobile" />
                </SheetContent>
            </Sheet>
            <div className="ml-4 font-black tracking-widest text-primary uppercase text-[10px]">Dashboard</div>
        </div>
    ) : null;

    return (
        <AppShell 
            sidebar={showSidebar ? <Sidebar role={(user?.role as any) || "user"} className="hidden lg:flex" /> : null}
            header={MobileHeader}
        >
            {children}
        </AppShell>
    )
}
