"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { Briefcase, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export default function LoginPage() {
    const { signInWithGoogle, signInWithGitHub, signInWithApple, login, isLoading } = useAuth()
    const [loading, setLoading] = useState(false)

    const handleLogin = async (provider: "google" | "github" | "apple" | "keycloak") => {
        setLoading(true)
        try {
            switch (provider) {
                case "google":
                    await signInWithGoogle()
                    break
                case "github":
                    await signInWithGitHub()
                    break
                case "apple":
                    await signInWithApple()
                    break
                case "keycloak":
                    await login()
                    break
            }
        } catch {
            setLoading(false)
        }
    }

    const isDisabled = isLoading || loading

    return (
        <Card className="glass border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden relative">
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
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-12 glass border-white/10 hover:border-primary/50 text-foreground hover:text-primary transition-all font-bold uppercase text-[11px] tracking-widest rounded-xl flex items-center justify-center gap-3"
                            onClick={() => handleLogin("google")}
                            disabled={isDisabled}
                        >
                            {isDisabled ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    SIGN IN WITH GOOGLE
                                </>
                            )}
                        </Button>
                    </motion.div>

                    {/* GitHub */}
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-12 glass border-white/10 hover:border-white/40 text-foreground hover:text-white transition-all font-bold uppercase text-[11px] tracking-widest rounded-xl flex items-center justify-center gap-3"
                            onClick={() => handleLogin("github")}
                            disabled={isDisabled}
                        >
                            {isDisabled ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                    SIGN IN WITH GITHUB
                                </>
                            )}
                        </Button>
                    </motion.div>

                    {/* Apple */}
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-12 glass border-white/10 hover:border-white/40 text-foreground hover:text-white transition-all font-bold uppercase text-[11px] tracking-widest rounded-xl flex items-center justify-center gap-3"
                            onClick={() => handleLogin("apple")}
                            disabled={isDisabled}
                        >
                            {isDisabled ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                    </svg>
                                    SIGN IN WITH APPLE
                                </>
                            )}
                        </Button>
                    </motion.div>

                    {/* Divider */}
                    <div className="pt-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
                            <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.3em]"><span className="bg-background/95 px-4 text-muted-foreground/40 glass rounded-full">Or</span></div>
                        </div>
                    </div>

                    {/* Email/Password via Keycloak */}
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Button
                            variant="premium"
                            className="w-full h-12 rounded-xl text-sm mt-2 shadow-premium font-bold tracking-widest"
                            onClick={() => handleLogin("keycloak")}
                            disabled={isDisabled}
                        >
                            {isDisabled ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "SIGN IN WITH EMAIL"}
                        </Button>
                    </motion.div>
                </div>
            </CardContent>
            <CardFooter className="justify-center pb-8 pt-0 text-micro text-muted-foreground/60">
                Don't have an account? <Link href="/auth/register" className="text-primary font-bold hover:text-primary/80 transition-colors ml-2">Sign up</Link>
            </CardFooter>
        </Card>
    )
}
