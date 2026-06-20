"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api/api-client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, Users, Shield, ShieldAlert, UserCog, Mail } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function TeamManagementPage() {
    const queryClient = useQueryClient()
    const [isInviteOpen, setIsInviteOpen] = useState(false)
    const [inviteData, setInviteData] = useState({ wallet_address: "", role: "RECRUITER" })

    // Fetch team members
    const { data: team, isLoading } = useQuery({
        queryKey: ["companyTeam"],
        queryFn: async () => {
            const res = await api.company.getTeam()
            return res.data
        }
    })

    // Invite member mutation
    const inviteMutation = useMutation({
        mutationFn: (data: { wallet_address: string, role: string }) => 
            api.company.invite(data.wallet_address, data.role),
        onSuccess: () => {
            toast.success("Team member invited successfully!")
            setIsInviteOpen(false)
            setInviteData({ wallet_address: "", role: "RECRUITER" })
            queryClient.invalidateQueries({ queryKey: ["companyTeam"] })
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to invite team member.")
        }
    })

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault()
        if (!inviteData.wallet_address) {
            toast.error("Wallet address is required")
            return
        }
        inviteMutation.mutate(inviteData)
    }

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-6xl mx-auto pb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter uppercase italic">Team <span className="text-primary">Management</span></h1>
                    <p className="text-muted-foreground text-sm max-w-xl italic">Manage recruiters, admins, and workspace collaborators.</p>
                </div>
                <div className="flex gap-4">
                    <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-primary/20">
                                <Plus className="w-4 h-4" />
                                Invite Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-background border-border shadow-2xl rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black italic tracking-tight">Invite to Workspace</DialogTitle>
                                <DialogDescription className="text-xs">
                                    Add a new member to your company workspace via their Web3 wallet address.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleInvite} className="space-y-6 pt-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">User Wallet Address</Label>
                                    <Input
                                        placeholder="0x..."
                                        value={inviteData.wallet_address}
                                        onChange={(e) => setInviteData({ ...inviteData, wallet_address: e.target.value })}
                                        className="bg-black/20 border-border"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Workspace Role</Label>
                                    <Select 
                                        value={inviteData.role} 
                                        onValueChange={(v) => setInviteData({ ...inviteData, role: v })}
                                    >
                                        <SelectTrigger className="bg-black/20 border-border">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="RECRUITER">Recruiter</SelectItem>
                                            <SelectItem value="ADMIN">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex justify-end pt-4 border-t border-border/50">
                                    <Button type="submit" disabled={inviteMutation.isPending} className="font-black uppercase tracking-widest text-[10px] gap-2">
                                        {inviteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                                        Send Invite
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card className="glass border-border relative overflow-hidden">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                            <Users className="w-5 h-5 text-primary" /> Workspace Roster
                        </CardTitle>
                        <Badge variant="outline" className="font-bold">{team?.length || 0} Members</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[600px]">
                            <TableHeader className="bg-white/[0.01]">
                                <TableRow className="border-border/50 h-14">
                                    <TableHead className="pl-6 font-black uppercase text-[10px] tracking-widest text-muted-foreground">Team Member</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Role</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Status</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground text-right pr-6">Joined Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {team?.map((member: any) => (
                                    <TableRow key={member.id} className="border-border/50 group hover:bg-muted/30 transition-colors">
                                        <TableCell className="pl-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-muted/50 border border-border flex items-center justify-center text-primary/40">
                                                    <UserCog className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground leading-none mb-1">
                                                        {member.users?.full_name || 'Unknown User'}
                                                    </p>
                                                    <p className="text-[10px] font-mono text-muted-foreground">
                                                        {member.users?.wallet_address?.slice(0, 8)}...{member.users?.wallet_address?.slice(-6)}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {member.company_role === 'OWNER' && <ShieldAlert className="w-4 h-4 text-rose-500" />}
                                                {member.company_role === 'ADMIN' && <Shield className="w-4 h-4 text-purple-500" />}
                                                {member.company_role === 'RECRUITER' && <Users className="w-4 h-4 text-blue-500" />}
                                                <span className={cn(
                                                    "font-black uppercase tracking-widest text-[10px]",
                                                    member.company_role === 'OWNER' ? 'text-rose-500' :
                                                    member.company_role === 'ADMIN' ? 'text-purple-500' : 'text-blue-500'
                                                )}>
                                                    {member.company_role}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn(
                                                "font-black uppercase tracking-widest text-[8px]",
                                                member.status === 'ACTIVE' ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10" : "text-muted-foreground"
                                            )}>
                                                {member.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <span className="text-xs font-mono text-muted-foreground">
                                                {new Date(member.created_at).toLocaleDateString()}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
