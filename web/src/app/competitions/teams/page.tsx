"use client"

import { useState, useEffect } from "react"
import { fetchWithAuth } from "@/lib/api/api-client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Users2, ShieldAlert, Plus, Check, X, Calendar, UserCheck } from "lucide-react"
import { toast } from "sonner"

export default function CompetitionsTeamsPage() {
    const [myTeams, setMyTeams] = useState<any[]>([])
    const [allCompetitions, setAllCompetitions] = useState<any[]>([])
    const [selectedCompId, setSelectedCompId] = useState("")
    const [teamName, setTeamName] = useState("")
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [inviteeId, setInviteeId] = useState("")
    const [invitingTeamId, setInvitingTeamId] = useState("")

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [teamsRes, compsRes] = await Promise.all([
                    fetchWithAuth("/competitions/teams/my"),
                    fetchWithAuth("/competitions/")
                ])
                setMyTeams(teamsRes.data || [])
                setAllCompetitions(compsRes.data || [])
                if (compsRes.data && compsRes.data.length > 0) {
                    setSelectedCompId(compsRes.data[0].id)
                }
            } catch (err) {
                console.error(err)
                toast.error("Failed to load team data")
            } finally {
                setLoading(false)
            }
        }
        loadInitialData()
    }, [])

    const handleCreateTeam = async () => {
        if (!teamName || !selectedCompId) return
        setCreating(true)
        try {
            const res = await fetchWithAuth(`/competitions/teams/create?comp_id=${selectedCompId}&name=${encodeURIComponent(teamName)}`, {
                method: "POST"
            })
            if (res.status === "success") {
                toast.success("Hackathon team established!")
                setTeamName("")
                // reload teams
                const reload = await fetchWithAuth("/competitions/teams/my")
                setMyTeams(reload.data || [])
            }
        } catch (err: any) {
            console.error(err)
            toast.error(err.message || "Failed to create team.")
        } finally {
            setCreating(false)
        }
    }

    const handleApprove = async (teamId: string, memberId: string, approve: boolean) => {
        try {
            const res = await fetchWithAuth(`/competitions/teams/approve?team_id=${teamId}&member_id=${memberId}&approve=${approve}`, {
                method: "POST"
            })
            if (res.status === "success") {
                toast.success(approve ? "Member approved!" : "Request rejected.")
                const reload = await fetchWithAuth("/competitions/teams/my")
                setMyTeams(reload.data || [])
            }
        } catch (err) {
            console.error(err)
            toast.error("Failed to update status")
        }
    }

    const handleInvite = async (teamId: string) => {
        if (!inviteeId) return
        try {
            const res = await fetchWithAuth(`/competitions/teams/invite?team_id=${teamId}&invitee_id=${inviteeId}`, {
                method: "POST"
            })
            if (res.status === "success") {
                toast.success("Invitation sent successfully!")
                setInviteeId("")
                setInvitingTeamId("")
                const reload = await fetchWithAuth("/competitions/teams/my")
                setMyTeams(reload.data || [])
            }
        } catch (err: any) {
            console.error(err)
            toast.error(err.message || "Invitation failed. Verify user ID.")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen py-32 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Syncing Teams...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 blur-[180px] -z-10 rounded-full" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/50 pb-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight flex items-center gap-3">
                        TEAM BUILDER <Users2 className="w-8 h-8 text-primary" />
                    </h1>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">
                        Form alliances, claim hackathons, and recruit Elite developers.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side: Create Team */}
                <div className="space-y-6">
                    <div className="glass border-border/50 p-8 rounded-[2rem] space-y-6">
                        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <Plus className="w-5 h-5 text-primary" /> Create Team
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Select Hackathon</label>
                                <select 
                                    value={selectedCompId}
                                    onChange={(e) => setSelectedCompId(e.target.value)}
                                    className="w-full bg-black/45 border border-border/50 rounded-2xl p-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                                >
                                    {allCompetitions.map(comp => (
                                        <option key={comp.id} value={comp.id}>{comp.title}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Team Name</label>
                                <input 
                                    placeholder="Enter unique team name..."
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    className="w-full bg-black/45 border border-border/50 rounded-2xl p-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        <Button 
                            onClick={handleCreateTeam}
                            disabled={creating || !teamName}
                            className="w-full h-12 rounded-xl text-xs font-bold tracking-widest uppercase"
                        >
                            {creating ? "ESTABLISHING..." : "ESTABLISH TEAM"}
                        </Button>
                    </div>
                </div>

                {/* Right side: My Teams Grid */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">My Coalitions</h3>
                    
                    {myTeams.length === 0 ? (
                        <div className="text-center py-24 glass rounded-[3rem] border-border/50 border-dashed max-w-md mx-auto">
                            <ShieldAlert className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">No Active Teams Joined or Led.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {myTeams.map((team) => (
                                <div key={team.id} className="glass border-border/50 rounded-3xl p-6 hover:border-primary/20 transition-colors space-y-6">
                                    <div>
                                        <div className="flex items-center gap-2 text-primary text-micro mb-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {team.competitions?.title}
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground tracking-tight">{team.name}</h3>
                                        <p className="text-xs text-muted-foreground/60 mt-1">Leader: {team.leader?.full_name}</p>
                                    </div>

                                    {/* Members list */}
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Active Roster</h4>
                                        <div className="space-y-2">
                                            {team.members?.map((member: any) => (
                                                <div key={member.user_id} className="flex items-center justify-between bg-muted/50 border border-border/50 p-3 rounded-xl">
                                                    <div>
                                                        <p className="text-xs font-bold text-foreground">{member.users?.full_name}</p>
                                                        <p className="text-[10px] text-primary/80 mt-0.5">{member.role}</p>
                                                    </div>
                                                    <Badge variant="outline" className={`text-micro px-2 py-0.5 rounded-md ${
                                                        member.status === "accepted" ? "text-emerald-400 border-emerald-500/20" : "text-amber-400 border-amber-500/20"
                                                    }`}>
                                                        {member.status.toUpperCase()}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action items for leader */}
                                    {team.members?.some((m: any) => m.status === "pending" && m.role !== "Team Leader") && (
                                        <div className="border-t border-border/50 pt-4 space-y-3">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-red-400/80">Pending Enlistments</h4>
                                            {team.members
                                                .filter((m: any) => m.status === "pending")
                                                .map((m: any) => (
                                                    <div key={m.user_id} className="flex items-center justify-between bg-red-500/5 border border-red-500/10 p-3 rounded-xl">
                                                        <div className="text-xs text-foreground font-medium">{m.users?.full_name}</div>
                                                        <div className="flex gap-2">
                                                            <button 
                                                                onClick={() => handleApprove(team.id, m.user_id, true)}
                                                                className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/30 transition-all"
                                                            >
                                                                <Check className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleApprove(team.id, m.user_id, false)}
                                                                className="p-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30 transition-all"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    )}

                                    {/* Invites Box */}
                                    <div className="border-t border-border/50 pt-4 space-y-2">
                                        {invitingTeamId === team.id ? (
                                            <div className="flex gap-2">
                                                <input 
                                                    placeholder="Enter invitee user UUID..."
                                                    value={inviteeId}
                                                    onChange={(e) => setInviteeId(e.target.value)}
                                                    className="flex-1 bg-black/35 border border-border/50 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                                                />
                                                <Button 
                                                    onClick={() => handleInvite(team.id)}
                                                    className="h-9 px-3 text-[10px] font-bold tracking-widest uppercase rounded-lg"
                                                >
                                                    SEND
                                                </Button>
                                                <Button 
                                                    variant="ghost"
                                                    onClick={() => setInvitingTeamId("")}
                                                    className="h-9 px-3 text-[10px] font-bold tracking-widest uppercase rounded-lg hover:bg-muted/50"
                                                >
                                                    CANCEL
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button 
                                                variant="outline" 
                                                onClick={() => setInvitingTeamId(team.id)}
                                                className="w-full h-10 border-border text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-muted/50 gap-1.5"
                                            >
                                                <UserCheck className="w-3.5 h-3.5 text-primary" /> RECRUIT MEMBERS
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
