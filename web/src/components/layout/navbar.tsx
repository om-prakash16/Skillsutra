"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useScrolled } from "@/hooks/use-scrolled"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Briefcase, Building2, User, ShieldCheck } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import Image from "next/image"
import { Sidebar } from "@/components/layout/sidebar"
import { NotificationBell } from "@/components/notifications/NotificationBell"
import { useCMS } from "@/context/cms-context"
import { GlobalSearchCommand } from "@/components/search/GlobalSearchCommand"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Skeleton } from "@/components/ui/skeleton"

export function Navbar() {
    const { user, logout, isLoading } = useAuth()
    const { getVal, getJson } = useCMS()
    const scrolled = useScrolled()
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    const navLinks = getJson("navbar", "links") || [
        { href: "/", label: "Home" },
        { href: "/about", label: "About Us" },
        { href: "/jobs", label: "Jobs" },
        { href: "/companies", label: "Companies" },
        { href: "/talent", label: "Talent" },
    ]

    const siteName = getVal("global", "site_name", "SkillProof AI")

    const isDashboard = pathname?.startsWith("/user") || pathname?.startsWith("/company") || pathname?.startsWith("/superadmin")

    return (
        <header
            className={cn(
                "fixed top-0 right-0 z-50 transition-all duration-500",
                scrolled
                    ? "glass shadow-premium border-b border-black/5 dark:border-border/50"
                    : "bg-transparent",
                isDashboard ? "left-0 lg:left-64" : "left-0"
            )}
        >
            <div className="container mx-auto flex items-center justify-between h-20 px-4 md:px-8 gap-4">

                <div className="flex items-center gap-8">
                    {/* Logo */}
                    {!isDashboard && (
                        <Link href={user ? (['super_admin', 'admin'].includes(user.role) ? '/superadmin' : user.role === 'company' ? '/company/dashboard' : user.role === 'mentor' ? '/mentor' : user.role === 'moderator' ? '/moderation' : '/feed') : '/'} className="flex items-center gap-3 group shrink-0">
                            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-all shadow-[0_0_20px_hsl(var(--primary)/0.15)] backdrop-blur-md border border-primary/20 shrink-0">
                                <ShieldCheck className="w-6 h-6 text-primary fill-primary/10" />
                            </div>
                            <span className="text-xl font-bold font-heading tracking-tight text-gradient leading-none hidden lg:block">
                                {siteName}
                            </span>
                        </Link>
                    )}

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link: any) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-bold transition-colors hover:text-primary relative py-2 block",
                                pathname === link.href ? "text-primary" : "text-foreground/80 hover:text-foreground"
                            )}
                        >
                            <motion.div whileTap={{ scale: 0.95 }}>
                                {link.label}
                                {pathname === link.href && (
                                    <motion.div
                                        layoutId="nav-underline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </motion.div>
                        </Link>
                    ))}
                    {user && (
                        <Link
                            href={`/in/${user.username || user.id}`}
                            className={cn(
                                "text-sm font-bold transition-colors hover:text-primary relative py-2 block uppercase",
                                pathname?.startsWith(`/in/${user.username || user.id}`) ? "text-primary" : "text-foreground/80 hover:text-foreground"
                            )}
                        >
                            <motion.div whileTap={{ scale: 0.95 }}>
                                PROFILE
                                {pathname?.startsWith(`/in/${user.username || user.id}`) && (
                                    <motion.div
                                        layoutId="nav-underline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </motion.div>
                        </Link>
                    )}
                </nav>
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-6">
                    <GlobalSearchCommand />
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <NotificationBell />
                    </div>
                    {isLoading ? (
                        <div className="flex items-center gap-4">
                             <Skeleton className="h-10 w-24 rounded-xl" />
                             <Skeleton className="h-10 w-24 rounded-xl" />
                        </div>
                    ) : !user ? (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="premium" className="text-micro font-bold h-10 px-6 rounded-xl shadow-premium">
                                        Sign In
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl glass border-white/10 shadow-2xl dark:bg-black/80 bg-white/80 backdrop-blur-xl">
                                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer w-full font-bold p-3 transition-all hover:bg-primary/10 hover:text-primary">
                                        <Link href="/auth/login">Log In</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer w-full font-bold p-3 text-primary transition-all hover:bg-primary/10 mt-1">
                                        <Link href="/auth/register">Register</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <div className="w-px h-6 bg-muted/5 dark:bg-muted/50 mx-1" />
                            <Link href="/post-job">
                                <Button variant="outline" size="sm" className="hidden lg:flex text-micro font-bold h-10 px-6 rounded-xl border-primary/20 hover:bg-primary/5 transition-all">
                                    Post a Job
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-primary/20 p-0 overflow-hidden shadow-premium">
                                        <Avatar className="h-full w-full">
                                            <AvatarImage src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name || "User"} />
                                            <AvatarFallback className="bg-primary/10 text-primary">{(user.name && user.name[0]) || 'U'}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-64 z-[200]" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal py-3">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-bold leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground pt-1">
                                                @{user.username || user.user_code || user.id.slice(0,8)}
                                            </p>
                                            <div className="mt-2 inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest bg-primary/10 text-primary border-primary/20 w-fit">
                                                {user.role}
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem asChild>
                                            <Link href={user.username ? `/in/${user.username}` : (user.role === 'admin' || user.role === 'super_admin' ? "/superadmin/profile" : user.role === 'company' ? "/company/profile" : `/in/${user.id}`)} className="cursor-pointer">
                                                <User className="w-4 h-4 mr-2" />
                                                <span>Profile</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={['super_admin', 'admin'].includes(user.role) ? "/superadmin" : user.role === 'company' ? "/company/dashboard" : user.role === 'mentor' ? "/mentor" : user.role === 'moderator' ? "/moderation" : "/user/dashboard"} className="cursor-pointer">
                                                Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/feed" className="cursor-pointer">
                                                Feed
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/user/applications" className="cursor-pointer">
                                                Applications
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/user/saved-jobs" className="cursor-pointer">
                                                Saved Jobs
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem asChild>
                                            <Link href="/user/messages" className="cursor-pointer">Messages</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/notifications" className="cursor-pointer">Notifications</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={['super_admin', 'admin'].includes(user.role) ? "/superadmin/settings" : user.role === 'company' ? "/company/settings" : "/user/settings"} className="cursor-pointer">
                                                Settings
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer font-bold">
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden flex items-center gap-2">
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[350px] px-6">
                            <div className="flex flex-col gap-8 mt-10">
                                {/* Mobile Quick Actions */}
                                <div className="flex items-center gap-4 p-4 glass rounded-2xl border-border/50">
                                    <div className="flex-1 flex flex-col gap-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Appearance</p>
                                        <ThemeToggle />
                                    </div>
                                    <div className="w-px h-10 bg-muted/50" />
                                    <div className="flex-1 flex flex-col gap-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Alerts</p>
                                        <NotificationBell />
                                    </div>
                                </div>

                                {/* Dashboard Links (if applicable) */}
                                {user ? (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-2">Dashboard</p>
                                        <Sidebar 
                                            variant="mobile"
                                            role={user?.role === 'company' ? 'company' : ['super_admin', 'admin'].includes(user?.role as string) ? 'admin' : 'user'} 
                                        />
                                        <div className="h-px bg-border my-4" />
                                    </div>
                                ) : null}

                                {/* Site Links */}
                                <div className="flex flex-col gap-4">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-2">Platform</p>
                                    {navLinks.map((link: any) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={cn(
                                                "text-lg font-semibold transition-colors hover:text-primary",
                                                pathname === link.href ? "text-primary" : "text-foreground"
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>

                                {!user ? (
                                    <div className="flex flex-col gap-3 mt-4">
                                        <Link href="/auth/login" className="w-full">
                                            <Button className="w-full" variant="outline">Log In</Button>
                                        </Link>
                                        <Link href="/auth/register" className="w-full">
                                            <Button className="w-full">Register</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3 mt-4">
                                        <Link href={['super_admin', 'admin'].includes(user.role) ? "/superadmin" : user.role === 'company' ? "/company/dashboard" : "/user/dashboard"} className="w-full">
                                            <Button className="w-full" variant="outline">Dashboard</Button>
                                        </Link>
                                        <Button className="w-full" variant="destructive" onClick={logout}>Sign Out</Button>
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
