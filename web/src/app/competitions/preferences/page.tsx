"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PreferencesPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [preferences, setPreferences] = useState({
        interested_types: [] as string[],
        preferred_skills: [] as string[],
        receive_notifications: true
    })

    const [skillInput, setSkillInput] = useState("")

    useEffect(() => {
        const fetchPrefs = async () => {
            try {
                const res = await api.get("/competitions/preferences")
                if (res.data && Object.keys(res.data).length > 0) {
                    setPreferences({
                        interested_types: res.data.interested_types || [],
                        preferred_skills: res.data.preferred_skills || [],
                        receive_notifications: res.data.receive_notifications ?? true
                    })
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchPrefs()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            await api.post("/competitions/preferences", preferences)
            toast.success("Preferences updated successfully")
        } catch (err) {
            toast.error("Failed to save preferences")
        } finally {
            setSaving(false)
        }
    }

    const toggleType = (type: string) => {
        setPreferences(prev => ({
            ...prev,
            interested_types: prev.interested_types.includes(type)
                ? prev.interested_types.filter(t => t !== type)
                : [...prev.interested_types, type]
        }))
    }

    const addSkill = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && skillInput.trim()) {
            e.preventDefault()
            const skill = skillInput.trim().toLowerCase()
            if (!preferences.preferred_skills.includes(skill)) {
                setPreferences(prev => ({
                    ...prev,
                    preferred_skills: [...prev.preferred_skills, skill]
                }))
            }
            setSkillInput("")
        }
    }

    const removeSkill = (skill: string) => {
        setPreferences(prev => ({
            ...prev,
            preferred_skills: prev.preferred_skills.filter(s => s !== skill)
        }))
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center pt-24"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>

    return (
        <div className="min-h-screen flex flex-col pt-24 pb-12 px-4 sm:px-8 container mx-auto max-w-3xl">
            <div className="mb-8 flex items-center gap-4">
                <Link href="/competitions">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-black font-heading italic uppercase tracking-tight">Notification Preferences</h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Tune your neural matching filters</p>
                </div>
            </div>

            <div className="glass rounded-[2rem] p-8 border-white/5 space-y-10">
                <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest">Competition Types</h3>
                    <div className="flex flex-wrap gap-4">
                        {["hackathon", "bounty", "grant"].map(type => (
                            <Button
                                key={type}
                                variant={preferences.interested_types.includes(type) ? "default" : "outline"}
                                className={`rounded-xl px-6 h-12 text-[10px] font-black uppercase tracking-widest ${
                                    preferences.interested_types.includes(type) ? "bg-primary text-primary-foreground" : "border-white/10 glass"
                                }`}
                                onClick={() => toggleType(type)}
                            >
                                {type}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest">Preferred Skill Stack</h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Press Enter to add skills to your radar</p>
                    <Input 
                        value={skillInput}
                        onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={addSkill}
                        placeholder="e.g. react, rust, solidity..."
                        className="h-12 glass border-white/10 rounded-xl"
                    />
                    <div className="flex flex-wrap gap-2 mt-4">
                        {preferences.preferred_skills.map(skill => (
                            <div key={skill} className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 group">
                                <span className="text-[10px] font-black uppercase tracking-widest">{skill}</span>
                                <button onClick={() => removeSkill(skill)} className="text-white/20 hover:text-rose-500 transition-colors">
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold uppercase tracking-widest">Enable Notifications</h3>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Receive alerts when matches are found</p>
                    </div>
                    <Button 
                        variant={preferences.receive_notifications ? "default" : "outline"}
                        onClick={() => setPreferences(p => ({ ...p, receive_notifications: !p.receive_notifications }))}
                        className={`rounded-xl w-16 h-8 ${preferences.receive_notifications ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}
                    >
                        {preferences.receive_notifications ? "ON" : "OFF"}
                    </Button>
                </div>

                <Button 
                    variant="premium" 
                    className="w-full h-14 rounded-xl font-black text-[10px] uppercase tracking-widest"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save Neural Preferences
                </Button>
            </div>
        </div>
    )
}
