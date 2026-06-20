"use client"

import { Suspense, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { RoleSelector } from "@/components/auth/role-selector"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Briefcase, Loader2, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import GoogleLoginButton from "@/components/auth/GoogleLoginButton"
import MicrosoftLoginButton from "@/components/auth/MicrosoftLoginButton"

function RegisterForm() {
    const { signInWithGoogle, signInWithGitHub, isLoading } = useAuth()
    const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | "keycloak" | null>(null)
    const searchParams = useSearchParams()
    const roleParam = searchParams.get("role") || "user"
    const [selectedRole, setSelectedRole] = useState(roleParam)
    const router = useRouter()

    const handleRegister = async (provider: "google" | "github" | "keycloak") => {
        setLoadingProvider(provider)
        try {
            switch (provider) {
                case "google":
                    await signInWithGoogle(selectedRole, "register")
                    break
                case "github":
                    await signInWithGitHub(selectedRole, "register")
                    break
                case "keycloak":
                    router.push(`/auth/email-register?role=${selectedRole}`)
                    break
            }
        } catch {
            setLoadingProvider(null)
        }
    }

    const isDisabled = isLoading || loadingProvider !== null

    return (
        <Card className="glass border-border/50 shadow-2xl rounded-[2.5rem] overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
            
            <CardHeader className="space-y-4 items-center text-center pt-10 pb-8 border-b border-border/50">
                <div className="glass bg-primary/10 p-3 rounded-xl mb-2 border border-primary/20 shadow-premium">
                    <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2">
                    <CardTitle className="text-3xl font-extrabold font-heading tracking-tight text-gradient">Initialize Identity</CardTitle>
                    <CardDescription className="max-w-[280px] text-micro text-muted-foreground/60 leading-relaxed">
                        Select your organizational role and securely create your profile.
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="pt-10 space-y-10 px-10">
                <div className="space-y-6">
                    <label className="text-micro text-muted-foreground/80 ml-2">Identity Selection</label>
                    <RoleSelector value={selectedRole} onChange={setSelectedRole} />
                </div>

                <div className="space-y-4">
                    {/* Google */}
                    <div className="w-full">
                        <GoogleLoginButton role={selectedRole} />
                    </div>

                    {/* GitHub - Only for Users */}
                    {selectedRole === "user" && (
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-12 glass border-border hover:border-white/40 text-foreground hover:text-foreground transition-all font-bold uppercase text-[11px] tracking-widest rounded-xl flex items-center justify-center gap-3"
                                onClick={() => handleRegister("github")}
                                disabled={isDisabled}
                            >
                                {loadingProvider === "github" ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                        </svg>
                                        SIGN UP WITH GITHUB
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    )}

                    {/* Future Auth Providers - Only for Companies */}
                    {selectedRole === "company" && (
                        <>
                            {/* Microsoft */}
                            <div className="w-full">
                                <MicrosoftLoginButton role={selectedRole} intent="register" />
                            </div>

                            {/* LinkedIn */}
                            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-12 glass border-border hover:border-white/40 text-foreground hover:text-foreground transition-all font-bold uppercase text-[11px] tracking-widest rounded-xl flex items-center justify-center gap-3 opacity-50 cursor-not-allowed"
                                    disabled
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2"/>
                                    </svg>
                                    SIGN UP WITH LINKEDIN (FUTURE)
                                </Button>
                            </motion.div>
                        </>
                    )}

                    {/* Divider */}
                    <div className="pt-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                            <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.3em]"><span className="bg-background/95 px-4 text-muted-foreground/40 glass rounded-full">Or</span></div>
                        </div>
                    </div>

                    {/* Email/Password */}
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Button
                            variant="premium"
                            className="w-full h-12 rounded-xl text-sm mt-2 shadow-premium font-bold tracking-widest gap-2 group"
                            onClick={() => handleRegister("keycloak")}
                            disabled={isDisabled}
                        >
                            {loadingProvider === "keycloak" ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (
                                <>
                                    {selectedRole === "company" ? "SIGN UP WITH BUSINESS EMAIL OTP" : "SIGN UP WITH EMAIL OTP"}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </motion.div>
                    
                    <p className="text-[9px] text-center text-muted-foreground/40 px-4 font-bold uppercase tracking-widest leading-relaxed mt-4">
                        By registering, you agree to our Terms and Privacy Policy.
                    </p>
                </div>
            </CardContent>

            <CardFooter className="flex flex-col justify-center gap-2 text-micro text-muted-foreground/60 border-t border-border/50 bg-muted/50 py-6">
                <div>
                    Already have an identity? <Link href="/auth/login" className="text-primary font-bold hover:text-primary/80 transition-colors ml-2">Log in</Link>
                </div>
                <Link href="/auth/register?role=company" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors underline decoration-border hover:decoration-primary underline-offset-4 mt-2">
                    for companies
                </Link>
            </CardFooter>
        </Card>
    )
}

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <RegisterForm />
        </Suspense>
    )
}
