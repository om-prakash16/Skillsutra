"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Briefcase, Loader2, Eye, EyeOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import GoogleLoginButton from "@/components/auth/GoogleLoginButton"

export default function LoginPage() {
    const { signInWithGoogle, signInWithGitHub, loginUser, isLoading } = useAuth()
    const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | "email" | null>(null)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleLogin = async (provider: "google" | "github") => {
        setLoadingProvider(provider)
        try {
            switch (provider) {
                case "google":
                    await signInWithGoogle("user", "login")
                    break
                case "github":
                    await signInWithGitHub("user", "login")
                    break
            }
        } catch {
            setLoadingProvider(null)
        }
    }

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoadingProvider("email")
        try {
            await loginUser({ email_or_username: email, password })
        } catch {
            setLoadingProvider(null)
        }
    }

    const isDisabled = isLoading || loadingProvider !== null

    return (
        <Card className="glass border-border/50 shadow-2xl rounded-[2.5rem] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <CardHeader className="space-y-4 items-center text-center pt-10">
                <div className="glass bg-primary/10 p-3 rounded-xl mb-2 border border-primary/20 shadow-premium">
                    <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2">
                    <CardTitle className="text-3xl font-extrabold font-heading tracking-tight text-gradient">Welcome back</CardTitle>
                    <CardDescription className="text-micro text-muted-foreground/60">
                        Sign in to access the nexus
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-10 pb-10">
                <div className="space-y-4">
                    {/* Google */}
                    <div className="w-full">
                        <GoogleLoginButton />
                    </div>

                    {/* GitHub */}
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-12 glass border-border hover:border-white/40 text-foreground hover:text-foreground transition-all font-bold uppercase text-[11px] tracking-widest rounded-xl flex items-center justify-center gap-3"
                            onClick={() => handleLogin("github")}
                            disabled={isDisabled}
                        >
                            {loadingProvider === "github" ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                    SIGN IN WITH GITHUB
                                </>
                            )}
                        </Button>
                    </motion.div>

                    {/* Divider */}
                    <div className="pt-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                            <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.3em]"><span className="bg-background/95 px-4 text-muted-foreground/40 glass rounded-full">Or</span></div>
                        </div>
                    </div>

                    {/* Email/Password Form */}
                    <form onSubmit={handleEmailLogin} className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label className="text-micro text-muted-foreground/80 ml-2">Email Address</Label>
                            <Input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 glass border-border rounded-xl"
                                placeholder="you@example.com"
                                disabled={isDisabled}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-2 mr-2">
                                <Label className="text-micro text-muted-foreground/80">Password</Label>
                                <Link href="/auth/forgot-password" className="text-[10px] text-muted-foreground hover:text-primary transition-colors">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 glass border-border rounded-xl pr-12"
                                    placeholder="••••••••"
                                    disabled={isDisabled}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1 h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isDisabled}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="pt-2">
                            <Button
                                type="submit"
                                variant="premium"
                                className="w-full h-12 rounded-xl text-sm shadow-premium font-bold tracking-widest uppercase"
                                disabled={isDisabled || !email || !password}
                            >
                                {loadingProvider === "email" ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "SIGN IN WITH EMAIL"}
                            </Button>
                        </motion.div>
                    </form>
                </div>
            </CardContent>
            <CardFooter className="justify-center pb-8 pt-0 text-micro text-muted-foreground/60">
                Don't have an account? <Link href="/auth/register" className="text-primary font-bold hover:text-primary/80 transition-colors ml-2">Sign up</Link>
            </CardFooter>
        </Card>
    )
}
