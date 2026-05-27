"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Briefcase, Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"

export default function EmailLoginPage() {
    const { loginUser, isLoading } = useAuth()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({ email_or_username: "", password: "" })
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await loginUser(formData)
        } catch {
            setLoading(false)
        }
    }

    const isDisabled = isLoading || loading

    return (
        <Card className="glass border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <CardHeader className="space-y-4 items-center text-center pt-10 relative">
                <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    onClick={() => router.back()}
                    className="absolute left-6 top-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="glass bg-primary/10 p-3 rounded-xl mb-2 border border-primary/20 shadow-premium">
                    <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2">
                    <CardTitle className="text-3xl font-extrabold font-heading tracking-tight text-gradient">Email Identity</CardTitle>
                    <CardDescription className="text-micro text-muted-foreground/60">
                        Authenticate manually via system credentials
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-10 pb-10">
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-micro text-muted-foreground/80 ml-2">Email Address</Label>
                            <Input
                                type="email"
                                required
                                value={formData.email_or_username}
                                onChange={(e) => setFormData({ ...formData, email_or_username: e.target.value })}
                                className="h-12 glass border-white/10 rounded-xl"
                                placeholder="sysadmin@nexus.core"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-micro text-muted-foreground/80 ml-2">Password Protocol</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="h-12 glass border-white/10 rounded-xl pr-12"
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
                        </div>
                    </div>

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Button
                            type="submit"
                            variant="premium"
                            className="w-full h-12 rounded-xl text-sm shadow-premium font-bold tracking-widest"
                            disabled={isDisabled || !formData.email_or_username || !formData.password}
                        >
                            {isDisabled ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "AUTHENTICATE SESSIONS"}
                        </Button>
                    </motion.div>
                </form>
            </CardContent>
            <CardFooter className="justify-center pb-8 pt-0 text-micro text-muted-foreground/60 border-t border-white/5 bg-white/5 py-8">
                Return to <Link href="/auth/login" className="text-primary font-bold hover:text-primary/80 transition-colors ml-2">Main Login Hub</Link>
            </CardFooter>
        </Card>
    )
}
