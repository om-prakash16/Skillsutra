"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Building2, Save, Loader2, Globe, FileText, MapPin, Target, Palette, Heart, Users } from "lucide-react"
import { toast } from "sonner"
import { companyApi } from "@/lib/api/company-api"

export default function CompanySettingsPage() {
    const [formData, setFormData] = useState<any>({
        // General
        name: "",
        username: "",
        industry: "",
        sub_industry: "",
        size: "",
        founded_year: "",
        hq_location: "",
        locations: "",
        website: "",
        
        // Branding
        description: "",
        about_company: "",
        career_page_url: "",
        socialLinks: [],
        
        // Culture & Perks
        mission: "",
        vision: "",
        core_values: "",
        benefits: "",
        perks: "",
        work_culture: "",
        tech_stack: "",
        remote_policy: ""
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
                name: companyProfile.company_name || "",
                username: companyProfile.username || "",
                industry: companyProfile.industry || "",
                sub_industry: companyProfile.company_metadata?.sub_industry || "",
                size: companyProfile.size || "",
                founded_year: companyProfile.company_metadata?.founded_year || "",
                hq_location: companyProfile.hq_location || "",
                locations: companyProfile.company_metadata?.locations || "",
                website: companyProfile.website || "",
                
                description: companyProfile.branding_profile?.description || "",
                about_company: companyProfile.branding_profile?.about_company || "",
                career_page_url: companyProfile.branding_profile?.career_page_url || "",
                socialLinks: companyProfile.branding_profile?.socialLinks || [],
                
                mission: companyProfile.company_metadata?.mission || "",
                vision: companyProfile.company_metadata?.vision || "",
                core_values: companyProfile.company_metadata?.core_values || "",
                benefits: companyProfile.company_metadata?.benefits || "",
                perks: companyProfile.company_metadata?.perks || "",
                work_culture: companyProfile.company_metadata?.work_culture || "",
                tech_stack: companyProfile.company_metadata?.tech_stack || "",
                remote_policy: companyProfile.company_metadata?.remote_policy || ""
            })
        }
    }, [companyProfile])

    const handleUpdate = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const payload = {
                name: formData.name,
                username: formData.username,
                industry: formData.industry,
                size: formData.size,
                country: formData.country,
                hq_location: formData.hq_location,
                website: formData.website,
                branding_profile: {
                    description: formData.description,
                    about_company: formData.about_company,
                    career_page_url: formData.career_page_url,
                    socialLinks: formData.socialLinks.filter((l: any) => l.platform && l.url),
                },
                company_metadata: {
                    sub_industry: formData.sub_industry,
                    founded_year: formData.founded_year,
                    locations: formData.locations,
                    mission: formData.mission,
                    vision: formData.vision,
                    core_values: formData.core_values,
                    benefits: formData.benefits,
                    perks: formData.perks,
                    work_culture: formData.work_culture,
                    tech_stack: formData.tech_stack,
                    remote_policy: formData.remote_policy
                }
            }
            
            await companyApi.profile.update(payload)
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
        <div className="space-y-10 animate-in fade-in duration-700 max-w-5xl mx-auto pb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter uppercase italic">Company <span className="text-primary">Profile</span></h1>
                    <p className="text-muted-foreground text-sm max-w-xl italic">Manage your enterprise identity, branding, and culture.</p>
                </div>
                <div className="flex gap-4">
                    <Button onClick={handleSave} disabled={isSaving} className="gap-2 font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-primary/20">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-8 w-full md:w-auto overflow-x-auto justify-start border border-border/50 bg-black/20 p-1">
                    <TabsTrigger value="general" className="gap-2"><Building2 className="w-4 h-4"/> General</TabsTrigger>
                    <TabsTrigger value="branding" className="gap-2"><Palette className="w-4 h-4"/> Branding</TabsTrigger>
                    <TabsTrigger value="culture" className="gap-2"><Heart className="w-4 h-4"/> Culture & Perks</TabsTrigger>
                </TabsList>

                {/* GENERAL TAB */}
                <TabsContent value="general" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="glass border-border relative overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                                <Building2 className="w-5 h-5 text-primary" /> Core Identity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Company Name</Label>
                                    <Input 
                                        value={formData.name}
                                        onChange={(e) => handleUpdate("name", e.target.value)}
                                        className="bg-black/20 border-border"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Company Username</Label>
                                    <Input 
                                        value={formData.username}
                                        onChange={(e) => handleUpdate("username", e.target.value)}
                                        className="bg-black/20 border-border"
                                        placeholder="e.g. google"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Globe className="w-3 h-3" /> Website</Label>
                                    <Input 
                                        value={formData.website}
                                        onChange={(e) => handleUpdate("website", e.target.value)}
                                        className="bg-black/20 border-border"
                                        placeholder="https://"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2"><MapPin className="w-3 h-3" /> Headquarters</Label>
                                    <Input 
                                        value={formData.hq_location}
                                        onChange={(e) => handleUpdate("hq_location", e.target.value)}
                                        className="bg-black/20 border-border"
                                        placeholder="e.g. San Francisco, CA"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Industry</Label>
                                    <Input 
                                        value={formData.industry}
                                        onChange={(e) => handleUpdate("industry", e.target.value)}
                                        className="bg-black/20 border-border"
                                        placeholder="e.g. Technology"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Sub Industry</Label>
                                    <Input 
                                        value={formData.sub_industry}
                                        onChange={(e) => handleUpdate("sub_industry", e.target.value)}
                                        className="bg-black/20 border-border"
                                        placeholder="e.g. Artificial Intelligence"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Users className="w-3 h-3" /> Company Size</Label>
                                    <Input 
                                        value={formData.size}
                                        onChange={(e) => handleUpdate("size", e.target.value)}
                                        className="bg-black/20 border-border"
                                        placeholder="e.g. 50-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Founded Year</Label>
                                    <Input 
                                        value={formData.founded_year}
                                        onChange={(e) => handleUpdate("founded_year", e.target.value)}
                                        className="bg-black/20 border-border"
                                        placeholder="e.g. 2010"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2"><MapPin className="w-3 h-3" /> Additional Locations</Label>
                                    <Input 
                                        value={formData.locations}
                                        onChange={(e) => handleUpdate("locations", e.target.value)}
                                        className="bg-black/20 border-border"
                                        placeholder="e.g. New York, London, Tokyo"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* BRANDING TAB */}
                <TabsContent value="branding" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="glass border-border relative overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                                <Palette className="w-5 h-5 text-primary" /> Visuals & Voice
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Placeholder for Logo/Banner uploads */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border/30">
                                <div className="space-y-3">
                                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Company Logo</Label>
                                    <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-border flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors cursor-pointer text-xs font-bold text-muted-foreground">
                                        Upload Logo
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Company Banner</Label>
                                    <div className="w-full h-24 rounded-2xl border-2 border-dashed border-border flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors cursor-pointer text-xs font-bold text-muted-foreground">
                                        Upload Banner (1200x300)
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Tagline / Short Description</Label>
                                <Input 
                                    value={formData.description}
                                    onChange={(e) => handleUpdate("description", e.target.value)}
                                    className="bg-black/20 border-border"
                                    placeholder="One sentence describing what you do..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2"><FileText className="w-3 h-3" /> Full Company Description</Label>
                                <Textarea 
                                    value={formData.about_company}
                                    onChange={(e) => handleUpdate("about_company", e.target.value)}
                                    className="bg-black/20 border-border min-h-[150px]"
                                    placeholder="Detailed company background..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Career Page URL</Label>
                                <Input 
                                    value={formData.career_page_url}
                                    onChange={(e) => handleUpdate("career_page_url", e.target.value)}
                                    className="bg-black/20 border-border"
                                    placeholder="https://"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass border-border relative overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                                <Globe className="w-5 h-5 text-primary" /> External Platforms
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {formData.socialLinks.map((link: any, idx: number) => (
                                    <div key={idx} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-center relative">
                                        <select
                                            value={link.platform}
                                            onChange={(e) => {
                                                const newLinks = [...formData.socialLinks];
                                                newLinks[idx].platform = e.target.value;
                                                handleUpdate("socialLinks", newLinks);
                                            }}
                                            className="flex h-9 w-full rounded-md border border-border bg-black/20 px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="" disabled>Select Platform</option>
                                            <optgroup label="Software Development">
                                                <option value="GitHub">GitHub</option>
                                                <option value="GitLab">GitLab</option>
                                            </optgroup>
                                            <optgroup label="Social & Professional">
                                                <option value="LinkedIn">LinkedIn</option>
                                                <option value="Twitter">Twitter / X</option>
                                                <option value="Instagram">Instagram</option>
                                                <option value="YouTube">YouTube</option>
                                            </optgroup>
                                            <optgroup label="Other">
                                                <option value="Portfolio">Custom URL</option>
                                            </optgroup>
                                        </select>
                                        <Input 
                                            value={link.url}
                                            onChange={(e) => {
                                                const newLinks = [...formData.socialLinks];
                                                newLinks[idx].url = e.target.value;
                                                handleUpdate("socialLinks", newLinks);
                                            }}
                                            placeholder="URL" 
                                            className="bg-black/20 border-border h-9 text-xs" 
                                        />
                                        <Button variant="ghost" size="icon" onClick={() => {
                                            const newLinks = formData.socialLinks.filter((_: any, i: number) => i !== idx);
                                            handleUpdate("socialLinks", newLinks);
                                        }} className="h-8 w-8 text-destructive/50 hover:text-destructive">
                                            <span className="font-bold">×</span>
                                        </Button>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={() => handleUpdate("socialLinks", [...formData.socialLinks, { platform: '', url: '' }])} className="w-full border-dashed border-primary/20 hover:border-primary/50 text-primary/60">
                                    + Add Platform Link
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* CULTURE & PERKS TAB */}
                <TabsContent value="culture" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="glass border-border relative overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                                <Target className="w-5 h-5 text-primary" /> Vision & Values
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Mission Statement</Label>
                                    <Textarea 
                                        value={formData.mission}
                                        onChange={(e) => handleUpdate("mission", e.target.value)}
                                        className="bg-black/20 border-border min-h-[100px]"
                                        placeholder="What is your company's primary goal?"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Vision</Label>
                                    <Textarea 
                                        value={formData.vision}
                                        onChange={(e) => handleUpdate("vision", e.target.value)}
                                        className="bg-black/20 border-border min-h-[100px]"
                                        placeholder="Where is the company heading long-term?"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Core Values</Label>
                                <Input 
                                    value={formData.core_values}
                                    onChange={(e) => handleUpdate("core_values", e.target.value)}
                                    className="bg-black/20 border-border"
                                    placeholder="e.g. Innovation, Integrity, Customer Success"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass border-border relative overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                                <Heart className="w-5 h-5 text-primary" /> Workplace & Benefits
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Remote Policy</Label>
                                    <Input 
                                        value={formData.remote_policy}
                                        onChange={(e) => handleUpdate("remote_policy", e.target.value)}
                                        className="bg-black/20 border-border"
                                        placeholder="e.g. Remote-First, Hybrid, On-Site"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Tech Stack</Label>
                                    <Input 
                                        value={formData.tech_stack}
                                        onChange={(e) => handleUpdate("tech_stack", e.target.value)}
                                        className="bg-black/20 border-border"
                                        placeholder="e.g. React, Python, PostgreSQL"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Benefits & Health</Label>
                                <Textarea 
                                    value={formData.benefits}
                                    onChange={(e) => handleUpdate("benefits", e.target.value)}
                                    className="bg-black/20 border-border min-h-[100px]"
                                    placeholder="Detail health insurance, 401k matching, etc."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Perks & Extras</Label>
                                <Textarea 
                                    value={formData.perks}
                                    onChange={(e) => handleUpdate("perks", e.target.value)}
                                    className="bg-black/20 border-border min-h-[100px]"
                                    placeholder="Detail gym stipends, catered lunches, learning budget, etc."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Work Culture</Label>
                                <Textarea 
                                    value={formData.work_culture}
                                    onChange={(e) => handleUpdate("work_culture", e.target.value)}
                                    className="bg-black/20 border-border min-h-[100px]"
                                    placeholder="Describe the day-to-day culture and team dynamics..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    )
}
