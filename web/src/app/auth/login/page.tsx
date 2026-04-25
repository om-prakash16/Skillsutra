"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginValues } from "@/lib/validations/auth"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Link from "next/link"
import { Briefcase, Eye, EyeOff, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function LoginPage() {
    const { demoLogin, login } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    })

    async function onSubmit(data: LoginValues) {
        setIsLoading(true)
        try {
            await login(data.email, data.password)
        } catch {
            // Error toast is already shown by auth-context
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="glass border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <CardHeader className="space-y-4 items-center text-center pt-10">
                <div className="glass bg-primary/10 p-4 rounded-2xl mb-2 border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                    <Briefcase className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                    <CardTitle className="text-4xl font-black font-heading tracking-tighter text-gradient">Welcome back</CardTitle>
                    <CardDescription className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                        Enter your credentials to access the nexus
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-10 pb-10">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="m@example.com" 
                                            className="h-14 bg-white/5 border-white/10 rounded-xl focus:ring-primary/30 transition-all font-medium" 
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between pb-1">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">Password</FormLabel>
                                        <Link href="#" className="text-[10px] font-black uppercase tracking-[0.1em] text-primary hover:underline hover:text-primary/80 transition-colors">Forgot password?</Link>
                                    </div>
                                    <FormControl>
                                        <div className="relative group">
                                            <Input 
                                                type={showPassword ? "text" : "password"} 
                                                className="pr-14 h-14 bg-white/5 border-white/10 rounded-xl focus:ring-primary/30 transition-all font-medium"
                                                {...field} 
                                            />
                                            <motion.button
                                                type="button"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center text-muted-foreground/50 hover:text-primary transition-colors glass bg-white/5 rounded-lg border border-white/5 hover:border-primary/30"
                                            >
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={showPassword ? "eye-off" : "eye"}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        transition={{ duration: 0.15 }}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </motion.div>
                                                </AnimatePresence>
                                            </motion.button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="rememberMe"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-2">
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value} 
                                            onCheckedChange={field.onChange} 
                                            className="w-5 h-5 rounded-md border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground cursor-pointer">
                                            Remember me
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <Button variant="premium" className="w-full h-14 rounded-xl text-sm mt-4 shadow-2xl" type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : "AUTHENTICATE"}
                        </Button>
                        
                        <div className="pt-8 space-y-4">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
                                <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.3em]"><span className="bg-background/95 px-4 text-muted-foreground/40 glass rounded-full">Development Bypass</span></div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-3 pt-2">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    className="w-full h-12 glass border-primary/20 hover:border-primary/50 text-foreground hover:text-primary transition-all font-black uppercase text-[10px] tracking-[0.2em] rounded-xl"
                                    onClick={() => demoLogin("USER")}
                                    disabled={isLoading}
                                >
                                    Demo: Job Seeker
                                </Button>

                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    className="w-full h-12 glass border-primary/20 hover:border-primary/50 text-foreground hover:text-primary transition-all font-black uppercase text-[10px] tracking-[0.2em] rounded-xl"
                                    onClick={() => demoLogin("COMPANY")}
                                    disabled={isLoading}
                                >
                                    Demo: Company
                                </Button>
                                
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    className="w-full h-12 glass border-rose-500/20 hover:border-rose-500/50 text-foreground hover:text-rose-500 transition-all font-black uppercase text-[10px] tracking-[0.2em] rounded-xl"
                                    onClick={() => demoLogin("ADMIN")}
                                    disabled={isLoading}
                                >
                                    Demo: Admin
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="justify-center pb-8 pt-0 text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground/60">
                Don't have an account? <Link href="/auth/register" className="text-primary hover:text-primary/80 transition-colors ml-2">Sign up</Link>
            </CardFooter>
        </Card>
    )
}
