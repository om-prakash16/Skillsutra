"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { RoleSelector } from "@/components/auth/role-selector"
import Link from "next/link"
import { Briefcase, Loader2, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function RegisterPage() {
    const { signInWithGoogle } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [selectedRole, setSelectedRole] = useState("user")

    async function handleRegister() {
        setIsLoading(true)
        try {
            await signInWithGoogle(selectedRole)
        } catch {
            // Error managed by context
            setIsLoading(false)
        }
    }

    return (
        <Card className="glass border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
            
            <CardHeader className="space-y-4 items-center text-center pt-10 pb-8 border-b border-white/5">
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

                <div className="space-y-6">
                    <Button 
                        variant="premium"
                        className="w-full h-12 text-sm font-bold tracking-widest rounded-xl gap-2 shadow-premium group" 
                        onClick={handleRegister} 
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                CONTINUE WITH GOOGLE
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>
                    
                    <p className="text-[9px] text-center text-muted-foreground/40 px-4 font-bold uppercase tracking-widest leading-relaxed">
                        By registering, you agree to our Terms and Privacy Policy.
                    </p>
                </div>
            </CardContent>

            <CardFooter className="justify-center text-micro text-muted-foreground/60 border-t border-white/5 bg-white/5 py-8">
                Already have an identity? <Link href="/auth/login" className="text-primary font-bold hover:text-primary/80 transition-colors ml-2">Log in</Link>
            </CardFooter>
        </Card>
    )
}
