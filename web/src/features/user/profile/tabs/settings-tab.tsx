"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserProfile } from "@/types/profile"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { userApi } from "@/lib/api/user-api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SettingsTabProps {
    data: UserProfile
    onUpdateSettings?: (field: string, value: any) => void
}

export function SettingsTab({ data, onUpdateSettings }: SettingsTabProps) {
    const { theme, setTheme } = useTheme()
    const { user } = useAuth()
    const [mounted, setMounted] = useState(false)
    const [usernameInput, setUsernameInput] = useState(user?.username || "")
    const [isClaiming, setIsClaiming] = useState(false)

    useEffect(() => {
        if (user?.username) setUsernameInput(user.username)
    }, [user?.username])

    const handleClaimUsername = async () => {
        if (!usernameInput || usernameInput === user?.username) return
        setIsClaiming(true)
        try {
            await userApi.profile.claimUsername(usernameInput)
            toast.success("Username claimed successfully! Please refresh to see changes.")
            // Ideally we'd call a refetch for AuthContext here, but refreshing works for now
        } catch (error: any) {
            toast.error(error.message || "Failed to claim username")
        } finally {
            setIsClaiming(false)
        }
    }

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <Card className="glass border-border/50 rounded-[2rem] overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-border/50 pb-8 pt-8 px-10">
                <CardTitle className="text-3xl font-black tracking-tighter text-gradient">Protocol Settings</CardTitle>
                <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 pt-2">
                    Manage your platform preferences and visibility.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-10">
                <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-2">
                        <Label className="text-sm font-black uppercase tracking-[0.1em] text-foreground">Nexus Notifications</Label>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Receive cryptographic alerts about new matches.</p>
                    </div>
                    <Switch defaultChecked={data.settings.notifications} onCheckedChange={(checked) => onUpdateSettings?.('notifications', checked)} className="data-[state=checked]:bg-primary" />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                        <Label className="text-sm font-black uppercase tracking-[0.1em] text-foreground">Public URL Node</Label>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Your unique identifier on the network.</p>
                    </div>
                    <div className="flex w-full md:w-[320px] gap-2 items-center">
                        <span className="text-muted-foreground text-xs font-bold shrink-0">skillsutra.com/</span>
                        <Input 
                            value={usernameInput} 
                            onChange={(e) => setUsernameInput(e.target.value.toLowerCase())} 
                            placeholder="username"
                            className="h-12 glass border-border rounded-xl focus:ring-primary/20 text-xs font-bold"
                        />
                        <Button 
                            onClick={handleClaimUsername} 
                            disabled={isClaiming || usernameInput === user?.username || usernameInput.length < 3}
                            variant="default"
                            className="h-12 rounded-xl font-black uppercase tracking-widest text-[10px] shrink-0"
                        >
                            {isClaiming ? <Loader2 className="w-4 h-4 animate-spin" /> : "Claim"}
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-black uppercase tracking-[0.1em] text-foreground">Identity Visibility</Label>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Control the exposure of your Matrix Profile.</p>
                    </div>
                    <Select defaultValue={data.settings.visibility.toLowerCase()} onValueChange={(val) => onUpdateSettings?.('visibility', val === "public" ? "Public" : "Private")}>
                        <SelectTrigger className="w-full md:w-[220px] h-12 glass border-border rounded-xl focus:ring-primary/20 text-xs font-black uppercase tracking-widest">
                            <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent className="glass border-border rounded-xl">
                            <SelectItem value="public" className="text-xs font-bold uppercase tracking-widest focus:bg-primary/20">Public Node</SelectItem>
                            <SelectItem value="private" className="text-xs font-bold uppercase tracking-widest focus:bg-primary/20">Private Enclave</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-black uppercase tracking-[0.1em] text-foreground">Interface Theme</Label>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Select your preferred terminal environment.</p>
                    </div>
                    <Select
                        value={mounted ? theme : "system"}
                        onValueChange={setTheme}
                    >
                        <SelectTrigger className="w-full md:w-[220px] h-12 glass border-border rounded-xl focus:ring-primary/20 text-xs font-black uppercase tracking-widest">
                            <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent className="glass border-border rounded-xl">
                            <SelectItem value="light" className="text-xs font-bold uppercase tracking-widest focus:bg-primary/20">Light Energy</SelectItem>
                            <SelectItem value="dark" className="text-xs font-bold uppercase tracking-widest focus:bg-primary/20">Deep Space (Dark)</SelectItem>
                            <SelectItem value="system" className="text-xs font-bold uppercase tracking-widest focus:bg-primary/20">System Default</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
            <CardFooter className="border-t border-border/50 p-8 flex justify-between bg-muted/30">
                <Button variant="ghost" className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 font-black uppercase text-[10px] tracking-widest h-12 px-6 rounded-xl transition-all">Deactivate Identity</Button>
                <Button variant="outline" className="glass border-border hover:border-border font-black uppercase text-[10px] tracking-widest h-12 px-8 rounded-xl transition-all">Disconnect</Button>
            </CardFooter>
        </Card>
    )
}
