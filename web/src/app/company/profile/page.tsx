"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Save, Loader2, Globe, FileText, MapPin } from "lucide-react"
import { toast } from "sonner"
import { companyApi } from "@/lib/api/company-api"

export default function CompanySettingsPage() {
    const [formData, setFormData] = useState<any>({
        name: "",
        website: "",
        description: "",
        industry: "",
        company_size: "",
        location: "",
        about_company: ""
    })
    const [isSaving, setIsSaving] = useState(false)

    const { data: companyProfile, isLoading, refetch } = useQuery({
        queryKey: ["companyProfile"],
        queryFn: async () => {
            const res = await companyApi.profile.get()
            return res.data
        }
    })

    useEffect(() => {
        if (companyProfile) {
            setFormData({
                name: companyProfile.name || "",
                website: companyProfile.website || "",
                description: companyProfile.description || "",
                industry: companyProfile.industry || "",
                company_size: companyProfile.company_size || "",
                location: companyProfile.location || "",
                about_company: companyProfile.about_company || ""
            })
        }
    }, [companyProfile])

    const handleUpdate = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const response = await companyApi.profile.update(formData)
            if (response.status === "error") throw new Error(response.message)
            toast.success("Company profile synchronized!")
            refetch()
        } catch (error: any) {
            toast.error(`Sync failed: ${error.message}`)
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700 max-w-4xl mx-auto pb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter uppercase italic">Company <span className="text-primary">Profile</span></h1>
                    <p className="text-muted-foreground text-sm max-w-xl italic">Manage your organization's identity and metadata on the platform.</p>
                </div>
                <div className="flex gap-4">
                    <Button onClick={handleSave} disabled={isSaving} className="gap-2 font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-primary/20">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid gap-8">
                <Card className="glass border-white/10 relative overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-primary" /> General Identity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-white/50">Company Name</Label>
                                <Input 
                                    value={formData.name}
                                    onChange={(e) => handleUpdate("name", e.target.value)}
                                    className="bg-black/20 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-white/50 flex items-center gap-2"><Globe className="w-3 h-3" /> Website</Label>
                                <Input 
                                    value={formData.website}
                                    onChange={(e) => handleUpdate("website", e.target.value)}
                                    className="bg-black/20 border-white/10"
                                    placeholder="https://"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-white/50">Industry</Label>
                                <Input 
                                    value={formData.industry}
                                    onChange={(e) => handleUpdate("industry", e.target.value)}
                                    className="bg-black/20 border-white/10"
                                    placeholder="e.g. Artificial Intelligence"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-white/50">Company Size</Label>
                                <Input 
                                    value={formData.company_size}
                                    onChange={(e) => handleUpdate("company_size", e.target.value)}
                                    className="bg-black/20 border-white/10"
                                    placeholder="e.g. 50-200"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-[10px] uppercase tracking-widest text-white/50 flex items-center gap-2"><MapPin className="w-3 h-3" /> Headquarters</Label>
                                <Input 
                                    value={formData.location}
                                    onChange={(e) => handleUpdate("location", e.target.value)}
                                    className="bg-black/20 border-white/10"
                                    placeholder="e.g. San Francisco, CA"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass border-white/10 relative overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                            <FileText className="w-5 h-5 text-primary" /> About
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest text-white/50">Tagline / Short Description</Label>
                            <Input 
                                value={formData.description}
                                onChange={(e) => handleUpdate("description", e.target.value)}
                                className="bg-black/20 border-white/10"
                                placeholder="One sentence describing what you do..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest text-white/50">Full Description</Label>
                            <Textarea 
                                value={formData.about_company}
                                onChange={(e) => handleUpdate("about_company", e.target.value)}
                                className="bg-black/20 border-white/10 min-h-[150px]"
                                placeholder="Detailed company background..."
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
