"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader2, AlertCircle, CheckCircle2, User, Lock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

function VerifyMagicLogic() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const { loginWithMagicLink, completeMagicLinkSetup } = useAuth()
    const router = useRouter()

    const [status, setStatus] = useState<"validating" | "success" | "setup" | "error">("validating")
    const [errorMsg, setErrorMsg] = useState("")
    const [setupToken, setSetupToken] = useState("")
    
    // Setup form state
    const [formData, setFormData] = useState({ name: "", password: "", confirmPassword: "" })
    const [isSettingUp, setIsSettingUp] = useState(false)
    
    const hasVerified = React.useRef(false)

    useEffect(() => {
        if (!token) {
            setStatus("error")
            setErrorMsg("No magic link token provided.")
            return
        }

        if (hasVerified.current) return
        hasVerified.current = true

        let isMounted = true

        const verify = async () => {
            try {
                const res = await loginWithMagicLink(token)
                if (isMounted) {
                    if (res && res.needs_setup) {
                        setSetupToken(res.setup_token)
                        setStatus("setup")
                    } else {
                        setStatus("success")
                    }
                }
            } catch (err: any) {
                if (isMounted) {
                    setStatus("error")
                    setErrorMsg(err.message || "Invalid or expired magic link.")
                }
            }
        }

        verify()

        return () => { isMounted = false }
    }, [token, loginWithMagicLink])

    const handleCompleteSetup = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        setIsSettingUp(true)
        try {
            await completeMagicLinkSetup({
                token: setupToken,
                name: formData.name,
                password: formData.password
            })
            // Auth context handles the redirect
        } catch (err: any) {
            // Error handled in context
            setIsSettingUp(false)
        }
    }

    if (status === "validating") {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <h3 className="text-xl font-medium text-foreground">Verifying Magic Link</h3>
                <p className="text-muted-foreground text-sm">Authenticating your secure session...</p>
            </div>
        )
    }

    if (status === "setup") {
        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="text-center space-y-2">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2 mx-auto">
                        <User className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-foreground">Complete Setup</h3>
                    <p className="text-muted-foreground text-sm">Secure your account with a password</p>
                </div>

                <form onSubmit={handleCompleteSetup} className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Full Name (Optional)</Label>
                        <Input 
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="h-12 glass border-border rounded-xl"
                            placeholder="John Doe"
                        />
                    </div>
                    
                    <PasswordInput 
                        label="Password" 
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        showStrength={true}
                    />
                    
                    <PasswordInput 
                        label="Confirm Password" 
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        error={formData.password !== formData.confirmPassword && formData.confirmPassword.length > 0 ? "Passwords do not match" : undefined}
                    />
                    
                    <Button 
                        type="submit" 
                        variant="premium" 
                        className="w-full h-12 rounded-xl text-sm shadow-premium font-bold tracking-widest mt-4"
                        disabled={isSettingUp || !formData.password || formData.password !== formData.confirmPassword}
                    >
                        {isSettingUp ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "COMPLETE ACCOUNT"}
                    </Button>
                </form>
            </motion.div>
        )
    }

    if (status === "success") {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-medium text-foreground">Successfully Authenticated</h3>
                <p className="text-muted-foreground text-sm">Redirecting to your dashboard...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
            <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-medium text-foreground">Authentication Failed</h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-4">
                {errorMsg}
            </p>
            <Link 
                href="/auth/email-login" 
                className="px-6 py-2.5 rounded-xl bg-muted/50 hover:bg-white/20 text-foreground text-sm font-medium transition-colors"
            >
                Request a new link
            </Link>
        </div>
    )
}

export default function VerifyMagicPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 -left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-muted/30 border border-white/[0.05] py-8 px-4 shadow-2xl backdrop-blur-xl sm:rounded-2xl sm:px-10">
                    <Suspense fallback={
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                            <p className="text-muted-foreground text-sm">Loading...</p>
                        </div>
                    }>
                        <VerifyMagicLogic />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
