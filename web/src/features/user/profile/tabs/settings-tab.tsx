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
    onSave?: (payload: any) => Promise<void>
    isEditing?: boolean
    onUpdateSettings?: (field: string, value: any) => void
}

export function SettingsTab({ data, onSave }: SettingsTabProps) {
    const { theme, setTheme } = useTheme()
    const { user } = useAuth()
    const [mounted, setMounted] = useState(false)
    const [usernameInput, setUsernameInput] = useState(user?.username || "")
    const [isClaiming, setIsClaiming] = useState(false)
    const [availability, setAvailability] = useState<{available?: boolean, reason?: string, checking: boolean}>({ checking: false })

    useEffect(() => {
        if (user?.username) setUsernameInput(user.username)
    }, [user?.username])

    useEffect(() => {
        if (!usernameInput || usernameInput === user?.username || usernameInput.length < 3) {
            setAvailability({ checking: false });
            return;
        }
        
        setAvailability({ checking: true });
        const timer = setTimeout(async () => {
            try {
                const res = await userApi.profile.checkUsername(usernameInput);
                if (res) {
                    setAvailability({ available: res.available, reason: res.reason, checking: false });
                } else {
                    setAvailability({ checking: false });
                }
            } catch (e) {
                setAvailability({ checking: false });
            }
        }, 500);
        
        return () => clearTimeout(timer);
    }, [usernameInput, user?.username]);

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

    const [isEditingUrl, setIsEditingUrl] = useState(false)
    const domain = mounted && typeof window !== "undefined" ? window.location.origin : "https://yourdomain.com"

    return (
        <Card className="glass border-border/50 rounded-[2rem] overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-border/50 pb-8 pt-8 px-10">
                <CardTitle className="text-3xl font-black tracking-tighter text-gradient">Protocol Settings</CardTitle>
                <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 pt-2">
                    Manage your platform preferences and visibility.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-10">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                        <Label className="text-sm font-black uppercase tracking-[0.1em] text-foreground">Profile URL</Label>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Manage your custom profile link.</p>
                    </div>
                    
                    <div className="flex flex-col w-full md:w-[400px] gap-3">
                        {!isEditingUrl ? (
                            <div className="flex items-center justify-between glass border-border rounded-xl p-4">
                                <span className="text-xs font-bold text-foreground truncate">
                                    {domain}/in/{user?.username || "[username]"}
                                </span>
                                <Button variant="ghost" size="sm" onClick={() => setIsEditingUrl(true)} className="h-8 text-xs font-bold uppercase tracking-widest text-primary hover:text-primary hover:bg-primary/10">
                                    Edit
                                </Button>
                            </div>
                        ) : (
                            <div className="glass border border-border rounded-xl p-4 space-y-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Profile URL Preview:</Label>
                                    <p className="text-xs font-bold text-primary truncate">
                                        {domain}/in/{usernameInput || "[username]"}
                                    </p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <Input 
                                        value={usernameInput} 
                                        onChange={(e) => setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} 
                                        placeholder="username"
                                        className={`h-10 glass border-border rounded-lg focus:ring-primary/20 text-xs font-bold ${availability.available === false ? 'border-red-500/50' : availability.available === true ? 'border-green-500/50' : ''}`}
                                    />
                                    <Button 
                                        onClick={async () => {
                                            await handleClaimUsername();
                                            setIsEditingUrl(false);
                                        }} 
                                        disabled={isClaiming || usernameInput === user?.username || usernameInput.length < 3 || availability.available === false || availability.checking}
                                        variant="default"
                                        className="h-10 rounded-lg font-black uppercase tracking-widest text-[10px] shrink-0"
                                    >
                                        {isClaiming || availability.checking ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                                    </Button>
                                    <Button 
                                        onClick={() => {
                                            setUsernameInput(user?.username || "");
                                            setIsEditingUrl(false);
                                        }} 
                                        variant="ghost"
                                        className="h-10 rounded-lg font-black uppercase tracking-widest text-[10px] shrink-0"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                                {availability.reason && usernameInput !== user?.username && (
                                    <p className={`text-[10px] font-bold ${availability.available ? 'text-green-500' : 'text-red-500'}`}>
                                        {availability.available ? 'Username is available' : `Unavailable: ${availability.reason}`}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-black uppercase tracking-[0.1em] text-foreground">Identity Visibility</Label>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Control the exposure of your Matrix Profile.</p>
                    </div>
                    <Select defaultValue={data.settings?.visibility?.toLowerCase()} onValueChange={(val) => onSave?.({ settings: { visibility: val === "public" ? "Public" : "Private" } })}>
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
