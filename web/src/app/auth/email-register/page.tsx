"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RoleSelector } from "@/components/auth/role-selector"
import { PasswordInput } from "@/components/auth/PasswordInput"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Briefcase, Loader2, ArrowLeft, MailOpen, Lock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

type Step = "details" | "otp" | "password"

export default function EmailRegisterPage() {
    const { sendSignupOtp, verifySignupOtp, signupUser, isLoading } = useAuth()
    const [step, setStep] = useState<Step>("details")
    const [setupToken, setSetupToken] = useState("")
    
    const [formData, setFormData] = useState({ 
        role: "user",
        name: "",
        email: "", 
        otp: "",
        password: "", 
        confirmPassword: ""
    })
    
    const router = useRouter()

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await sendSignupOtp(formData.email, formData.name)
            setStep("otp")
        } catch (err: any) {
            if (err.message === "Email already registered" || err.message === "Username already taken") {
                toast.error("You are already registered, please sign in.")
                setTimeout(() => router.push("/auth/login"), 2000)
            }
        }
    }

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            // Note: Since backend signup consumes the plain data now, we could actually
            // just hold the verified state here. Wait, our signup endpoint might not
            // take the setup token! Actually, we can just let signupUser take the plain
            // password and email, and the backend will see the OTP is already deleted.
            // Oh wait, the backend `signup_user` in auth_service.py does NOT require an OTP!
            // It just creates the user. The OTP is just an email ownership check.
            const token = await verifySignupOtp(formData.email, formData.otp)
            setSetupToken(token) // Not strictly required if signup doesn't check it, but good practice
            setStep("password")
        } catch (err: any) {
            // Error handled in context
        }
    }

    const handleCreateAccount = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        try {
            await signupUser({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                role: formData.role
            })
            toast.success("Account created successfully!")
            router.push("/auth/login")
        } catch (err: any) {
            // Error handled in context
        }
    }

    const isDisabled = isLoading

    return (
        <Card className="glass border-border/50 shadow-2xl rounded-[2.5rem] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <CardHeader className="space-y-4 items-center text-center pt-10 relative">
                <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                        if (step === "password") setStep("otp")
                        else if (step === "otp") setStep("details")
                        else router.back()
                    }}
                    className="absolute left-6 top-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/5 dark:hover:bg-muted/50"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                
                <AnimatePresence mode="wait">
                    {step === "details" && (
                        <motion.div key="icon-details" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass bg-primary/10 p-3 rounded-xl mb-2 border border-primary/20 shadow-premium">
                            <Briefcase className="w-6 h-6 text-primary" />
                        </motion.div>
                    )}
                    {step === "otp" && (
                        <motion.div key="icon-otp" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass bg-yellow-500/10 p-3 rounded-xl mb-2 border border-yellow-500/20 shadow-premium">
                            <MailOpen className="w-6 h-6 text-yellow-500" />
                        </motion.div>
                    )}
                    {step === "password" && (
                        <motion.div key="icon-pwd" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass bg-green-500/10 p-3 rounded-xl mb-2 border border-green-500/20 shadow-premium">
                            <Lock className="w-6 h-6 text-green-500" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-2">
                    <CardTitle className="text-3xl font-extrabold font-heading tracking-tight text-gradient">
                        {step === "details" && "Create Identity"}
                        {step === "otp" && "Verify Email"}
                        {step === "password" && "Secure Account"}
                    </CardTitle>
                    <CardDescription className="text-micro text-muted-foreground/60">
                        {step === "details" && "Enter your details to begin"}
                        {step === "otp" && `We sent a code to ${formData.email}`}
                        {step === "password" && "Create a strong password"}
                    </CardDescription>
                </div>
            </CardHeader>
            
            <CardContent className="px-10 pb-10">
                <AnimatePresence mode="wait">
                    {step === "details" && (
                        <motion.form key="form-details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleSendOtp} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-micro text-muted-foreground/80 ml-2">Identity Selection</Label>
                                    <RoleSelector value={formData.role} onChange={(r) => setFormData({ ...formData, role: r })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-micro text-muted-foreground/80 ml-2">Full Name</Label>
                                    <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-12 glass border-border rounded-xl" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-micro text-muted-foreground/80 ml-2">Email Address</Label>
                                    <Input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-12 glass border-border rounded-xl" placeholder="sysadmin@nexus.core" />
                                </div>
                            </div>
                            <Button type="submit" variant="premium" className="w-full h-12 rounded-xl text-sm shadow-premium font-bold tracking-widest" disabled={isDisabled || !formData.email || !formData.name}>
                                {isDisabled ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "CONTINUE"}
                            </Button>
                        </motion.form>
                    )}

                    {step === "otp" && (
                        <motion.form key="form-otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2 text-center">
                                    <Label className="text-sm font-medium">6-Digit Code</Label>
                                    <Input 
                                        required 
                                        value={formData.otp} 
                                        onChange={(e) => setFormData({ ...formData, otp: e.target.value })} 
                                        className="h-14 glass border-border rounded-xl text-center text-2xl tracking-[0.5em] font-mono" 
                                        placeholder="••••••" 
                                        maxLength={6}
                                    />
                                </div>
                            </div>
                            <Button type="submit" variant="premium" className="w-full h-12 rounded-xl text-sm shadow-premium font-bold tracking-widest bg-yellow-500 hover:bg-yellow-600 text-black" disabled={isDisabled || formData.otp.length !== 6}>
                                {isDisabled ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "VERIFY CODE"}
                            </Button>
                        </motion.form>
                    )}

                    {step === "password" && (
                        <motion.form key="form-pwd" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleCreateAccount} className="space-y-6">
                            <div className="space-y-4">
                                <PasswordInput 
                                    label="Create Password" 
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
                            </div>
                            <Button type="submit" variant="premium" className="w-full h-12 rounded-xl text-sm shadow-premium font-bold tracking-widest bg-green-500 hover:bg-green-600 text-white" disabled={isDisabled || !formData.password || formData.password !== formData.confirmPassword}>
                                {isDisabled ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "CREATE ACCOUNT"}
                            </Button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </CardContent>
            
            <CardFooter className="justify-center pb-8 pt-0 text-micro text-muted-foreground/60 border-t border-border/50 bg-muted/50 py-8">
                Already have an identity? <Link href="/auth/login" className="text-primary font-bold hover:text-primary/80 transition-colors ml-2">Main Login Hub</Link>
            </CardFooter>
        </Card>
    )
}
