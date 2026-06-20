"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Shield, Smartphone, Laptop, Globe, History, Activity, AlertTriangle, XCircle, Clock } from "lucide-react"
import { toast } from "sonner"
import { publicApi } from "@/lib/api/public-api"
import { fetchWithAuth } from "@/lib/api/api-client"
import { formatDistanceToNow } from "date-fns"

// Mock or real API endpoints for Security
const securityApi = {
    getDevices: () => fetchWithAuth("/security/devices"),
    revokeDevice: (id: string) => fetchWithAuth(`/security/devices/${id}`, { method: "DELETE" }),
    getSessions: () => fetchWithAuth("/security/sessions"),
    revokeSession: (id: string) => fetchWithAuth(`/security/sessions/${id}`, { method: "DELETE" }),
    getHistory: () => fetchWithAuth("/security/history"),
    getEvents: () => fetchWithAuth("/security/events"),
}

export default function SecurityCenterPage() {
    const queryClient = useQueryClient()

    // Data Fetching
    const { data: devices, isLoading: devicesLoading } = useQuery({
        queryKey: ["security-devices"],
        queryFn: securityApi.getDevices,
        initialData: [] // fallback
    })
    
    const { data: sessions, isLoading: sessionsLoading } = useQuery({
        queryKey: ["security-sessions"],
        queryFn: securityApi.getSessions,
        initialData: []
    })

    const { data: history, isLoading: historyLoading } = useQuery({
        queryKey: ["security-history"],
        queryFn: securityApi.getHistory,
        initialData: []
    })

    const { data: events, isLoading: eventsLoading } = useQuery({
        queryKey: ["security-events"],
        queryFn: securityApi.getEvents,
        initialData: []
    })

    const { data: scoreData, isLoading: scoreLoading } = useQuery({
        queryKey: ["security-score"],
        queryFn: () => fetchWithAuth("/security/score"),
        initialData: { score: 50 }
    })

    // Mutations
    const revokeDeviceMut = useMutation({
        mutationFn: securityApi.revokeDevice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["security-devices"] })
            toast.success("Device revoked successfully.")
        }
    })

    const revokeSessionMut = useMutation({
        mutationFn: securityApi.revokeSession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["security-sessions"] })
            toast.success("Session terminated successfully.")
        }
    })

    if (devicesLoading && sessionsLoading) {
        return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
    }

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 md:px-8 space-y-12 relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] -z-10 rounded-full" />
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <h1 className="text-5xl font-black font-heading tracking-tighter italic uppercase leading-none text-foreground flex items-center gap-4">
                        <Shield className="w-12 h-12 text-primary" /> Security Center
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="h-px w-24 bg-primary" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Advanced Protection & Audit Logs</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 bg-background border border-border p-4 rounded-3xl shadow-xl">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                        <p className="text-2xl font-black italic text-emerald-500">{scoreData?.score}</p>
                    </div>
                    <div className="pr-4">
                        <p className="text-sm font-black uppercase tracking-wider text-foreground">Security Score</p>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">System Integrity Status</p>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="devices" className="w-full">
                <TabsList className="grid w-full grid-cols-4 h-14 glass border-border p-1 rounded-2xl mb-8">
                    <TabsTrigger value="devices" className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary/20 data-[state=active]:text-primary"><Smartphone className="w-4 h-4 mr-2" /> Devices</TabsTrigger>
                    <TabsTrigger value="sessions" className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary/20 data-[state=active]:text-primary"><Laptop className="w-4 h-4 mr-2" /> Sessions</TabsTrigger>
                    <TabsTrigger value="history" className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary/20 data-[state=active]:text-primary"><History className="w-4 h-4 mr-2" /> Logins</TabsTrigger>
                    <TabsTrigger value="events" className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary/20 data-[state=active]:text-primary"><Activity className="w-4 h-4 mr-2" /> Events</TabsTrigger>
                </TabsList>

                {/* TRUSTED DEVICES */}
                <TabsContent value="devices" className="space-y-6">
                    <Card className="glass border-border/50 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <CardHeader className="border-b border-border/50 p-8">
                            <CardTitle className="text-xl font-black italic uppercase tracking-tight text-foreground">Trusted Devices</CardTitle>
                            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Devices that bypass strict multi-factor authentication.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 divide-y divide-border/50">
                            {devices?.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground text-sm font-bold">No trusted devices found.</div>
                            ) : (
                                devices?.map((device: any) => (
                                    <div key={device.id} className="p-8 flex items-center justify-between hover:bg-muted/5 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                                <Smartphone className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">{device.device_name}</p>
                                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">IP: {device.last_ip_address} • Last Used: {new Date(device.last_used_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" className="text-rose-500 hover:text-rose-500 hover:bg-rose-500/10" onClick={() => revokeDeviceMut.mutate(device.id)} disabled={revokeDeviceMut.isPending}>
                                            Revoke
                                        </Button>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ACTIVE SESSIONS */}
                <TabsContent value="sessions" className="space-y-6">
                    <Card className="glass border-border/50 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <CardHeader className="border-b border-border/50 p-8">
                            <CardTitle className="text-xl font-black italic uppercase tracking-tight text-foreground">Active Sessions</CardTitle>
                            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Currently active login sessions across all devices.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 divide-y divide-border/50">
                            {sessions?.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground text-sm font-bold">No active sessions.</div>
                            ) : (
                                sessions?.map((session: any) => (
                                    <div key={session.id} className="p-8 flex items-center justify-between hover:bg-muted/5 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                                                <Globe className="w-6 h-6 text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">Session {session.id.slice(0,8)}...</p>
                                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">IP: {session.ip_address} • Started: {new Date(session.created_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" className="text-rose-500 hover:text-rose-500 hover:bg-rose-500/10" onClick={() => revokeSessionMut.mutate(session.id)} disabled={revokeSessionMut.isPending}>
                                            Terminate
                                        </Button>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* LOGIN HISTORY */}
                <TabsContent value="history" className="space-y-6">
                    <Card className="glass border-border/50 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <CardHeader className="border-b border-border/50 p-8">
                            <CardTitle className="text-xl font-black italic uppercase tracking-tight text-foreground">Login History</CardTitle>
                            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Recent authentication attempts.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 divide-y divide-border/50 max-h-[600px] overflow-y-auto">
                            {history?.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground text-sm font-bold">No login history available.</div>
                            ) : (
                                history?.map((log: any) => (
                                    <div key={log.id} className="p-6 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${log.status === 'SUCCESS' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                                                {log.status === 'SUCCESS' ? <Shield className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-rose-500" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">{log.location} ({log.ip_address})</p>
                                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground line-clamp-1">{log.user_agent}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${log.status === 'SUCCESS' ? 'text-emerald-500' : 'text-rose-500'}`}>{log.status}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 justify-end mt-1"><Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(log.created_at))} ago</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SECURITY EVENTS */}
                <TabsContent value="events" className="space-y-6">
                    <Card className="glass border-border/50 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <CardHeader className="border-b border-border/50 p-8">
                            <CardTitle className="text-xl font-black italic uppercase tracking-tight text-foreground">Security Events</CardTitle>
                            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Audit log of critical security actions.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 divide-y divide-border/50 max-h-[600px] overflow-y-auto">
                            {events?.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground text-sm font-bold">No security events found.</div>
                            ) : (
                                events?.map((event: any) => (
                                    <div key={event.id} className="p-6 flex items-center gap-4 hover:bg-muted/5 transition-colors">
                                        <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0">
                                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-foreground text-sm uppercase tracking-wide">{event.event_type}</p>
                                            <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                                        </div>
                                        <div className="text-[10px] font-bold uppercase text-muted-foreground shrink-0 text-right">
                                            <p>{formatDistanceToNow(new Date(event.created_at))} ago</p>
                                            <p className="mt-1 opacity-50">{event.ip_address}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    )
}
