"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"

function VerifyMagicLogic() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const { loginWithMagicLink } = useAuth()
    const router = useRouter()

    const [status, setStatus] = useState<"validating" | "success" | "error">("validating")
    const [errorMsg, setErrorMsg] = useState("")

    useEffect(() => {
        if (!token) {
            setStatus("error")
            setErrorMsg("No magic link token provided.")
            return
        }

        let isMounted = true

        const verify = async () => {
            try {
                await loginWithMagicLink(token)
                if (isMounted) setStatus("success")
                // loginWithMagicLink handles the redirect automatically
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

    if (status === "validating") {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <h3 className="text-xl font-medium text-foreground">Verifying Magic Link</h3>
                <p className="text-muted-foreground text-sm">Authenticating your secure session...</p>
            </div>
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
        <div className="min-h-screen bg-[#050505] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
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
