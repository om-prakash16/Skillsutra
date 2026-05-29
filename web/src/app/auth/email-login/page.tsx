"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { requestMagicLink } from "@/lib/api/auth-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Briefcase, Loader2, ArrowLeft, Eye, EyeOff, Mail, KeyRound, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function EmailLoginPage() {
    const { loginUser, isLoading } = useAuth()
    const [mode, setMode] = useState<"magic" | "password" | "sent">("magic")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({ email: "", password: "" })
    const router = useRouter()

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await requestMagicLink(formData.email)
            setMode("sent")
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await loginUser({ email_or_username: formData.email, password: formData.password })
        } catch {
            setLoading(false)
        }
    }

    const isDisabled = isLoading || loading

    return (
        <Card className="glass border-border/50 shadow-2xl rounded-[2.5rem] overflow-hidden relative min-h-[500px] flex flex-col">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <CardHeader className="space-y-4 items-center text-center pt-10 relative">
                <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    onClick={() => router.back()}
                    className="absolute left-6 top-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-muted/50"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                
                <AnimatePresence mode="wait">
                    {mode === "sent" ? (
                        <motion.div 
                            key="icon-sent"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass bg-green-500/10 p-3 rounded-xl mb-2 border border-green-500/20 shadow-premium"
                        >
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="icon-default"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass bg-primary/10 p-3 rounded-xl mb-2 border border-primary/20 shadow-premium"
                        >
                            {mode === "magic" ? <Mail className="w-6 h-6 text-primary" /> : <KeyRound className="w-6 h-6 text-primary" />}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-2">
                    <CardTitle className="text-3xl font-extrabold font-heading tracking-tight text-gradient">
                        {mode === "sent" ? "Check your email" : mode === "magic" ? "Magic Link" : "Password Login"}
                    </CardTitle>
                    <CardDescription className="text-micro text-muted-foreground/60 max-w-[240px] mx-auto">
                        {mode === "sent" 
                            ? `We sent a magic link to ${formData.email}` 
                            : mode === "magic" 
                            ? "We'll send you a secure, passwordless login link." 
                            : "Enter your secure credentials to continue."}
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="px-10 pb-10 flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    {mode === "sent" ? (
                        <motion.div 
                            key="sent-state"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center space-y-6"
                        >
                            <p className="text-sm text-muted-foreground">
                                Click the link in your email to instantly securely sign in. You can close this window.
                            </p>
                            <Button
                                variant="outline"
                                className="w-full h-12 glass border-border hover:border-primary/50 text-foreground transition-all font-bold tracking-widest rounded-xl text-xs uppercase"
                                onClick={() => setMode("magic")}
                            >
                                Send another link
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.form 
                            key={`form-${mode}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            onSubmit={mode === "magic" ? handleMagicLink : handlePasswordLogin} 
                            className="space-y-6"
                        >
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-micro text-muted-foreground/80 ml-2">Email Address</Label>
                                    <Input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="h-12 glass border-border rounded-xl"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                
                                {mode === "password" && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="space-y-2 overflow-hidden"
                                    >
                                        <div className="flex justify-between items-center ml-2 mr-2">
                                            <Label className="text-micro text-muted-foreground/80">Password</Label>
                                            <Link href="/auth/forgot-password" className="text-[10px] text-muted-foreground hover:text-primary transition-colors">
                                                Forgot?
                                            </Link>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                required={mode === "password"}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="h-12 glass border-border rounded-xl pr-12"
                                                placeholder="••••••••"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-1 top-1 h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                <Button
                                    type="submit"
                                    variant="premium"
                                    className="w-full h-12 rounded-xl text-sm shadow-premium font-bold tracking-widest uppercase"
                                    disabled={isDisabled || !formData.email || (mode === "password" && !formData.password)}
                                >
                                    {isDisabled ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : mode === "magic" ? "Send Magic Link" : "Sign In"}
                                </Button>
                            </motion.div>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setMode(mode === "magic" ? "password" : "magic")}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {mode === "magic" ? "Use password instead" : "Use magic link instead"}
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </CardContent>
            <CardFooter className="justify-center mt-auto pb-8 pt-0 text-micro text-muted-foreground/60 border-t border-border/50 bg-muted/50 py-8">
                Return to <Link href="/auth/login" className="text-primary font-bold hover:text-primary/80 transition-colors ml-2">Main Hub</Link>
            </CardFooter>
        </Card>
    )
}
