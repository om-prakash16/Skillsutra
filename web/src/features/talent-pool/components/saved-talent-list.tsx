"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api/api-client"
import { TalentCard } from "@/features/talent/components/talent-card"
import { Bookmark, Loader2 } from "lucide-react"

export function SavedTalentList({ companyId }: { companyId: string }) {
    const [savedTalents, setSavedTalents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSaved = async () => {
            try {
                const res = await api.get(`/talent-pool/${companyId}/saved`)
                
                // Map to match the TalentCard props
                const mapped = res.data?.map((item: any) => {
                    const user = item.users
                    return {
                        id: user.id,
                        name: user.full_name,
                        title: user.profile_data?.headline || "Professional",
                        role: user.profile_data?.primary_role || "Developer",
                        avatar: "",
                        location: user.profile_data?.location || "Remote",
                        experience: `${user.profile_data?.experience_years || 0} Years`,
                        experienceLevel: (user.profile_data?.experience_years || 0) > 5 ? "Senior" : "Intermediate",
                        skills: user.profile_data?.skills || [],
                        availability: "Immediate",
                        completion: 80,
                        verified: true,
                    }
                }) || []
                
                setSavedTalents(mapped)
            } catch (err) {
                console.error("Failed to fetch saved talent", err)
            } finally {
                setLoading(false)
            }
        }
        
        if (companyId) fetchSaved()
    }, [companyId])

    if (loading) {
        return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
    }

    if (savedTalents.length === 0) {
        return (
            <div className="text-center py-20 glass rounded-[3rem] border-white/5">
                <Bookmark className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No Saved Talent</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                    Bookmark interesting profiles from the discovery page to build your pool.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedTalents.map(talent => (
                <TalentCard key={talent.id} talent={talent} />
            ))}
        </div>
    )
}
