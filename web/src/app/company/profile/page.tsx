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
        about_company: "",
        socialLinks: [],
        dynamicSections: []
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
                about_company: companyProfile.about_company || "",
                socialLinks: companyProfile.company_metadata?.socialLinks || [],
                dynamicSections: companyProfile.company_metadata?.customSections || []
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
                ...formData,
                company_metadata: {
                    socialLinks: formData.socialLinks.filter((l: any) => l.platform && l.url),
                    customSections: formData.dynamicSections.filter((s: any) => s.title && s.content)
                }
            }
            const response = await companyApi.profile.update(payload)
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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
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
                <Card className="glass border-border relative overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-primary" /> General Identity
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
                                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Globe className="w-3 h-3" /> Website</Label>
                                <Input 
                                    value={formData.website}
                                    onChange={(e) => handleUpdate("website", e.target.value)}
                                    className="bg-black/20 border-border"
                                    placeholder="https://"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Industry</Label>
                                <Input 
                                    value={formData.industry}
                                    onChange={(e) => handleUpdate("industry", e.target.value)}
                                    className="bg-black/20 border-border"
                                    placeholder="e.g. Artificial Intelligence"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Company Size</Label>
                                <Input 
                                    value={formData.company_size}
                                    onChange={(e) => handleUpdate("company_size", e.target.value)}
                                    className="bg-black/20 border-border"
                                    placeholder="e.g. 50-200"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2"><MapPin className="w-3 h-3" /> Headquarters</Label>
                                <Input 
                                    value={formData.location}
                                    onChange={(e) => handleUpdate("location", e.target.value)}
                                    className="bg-black/20 border-border"
                                    placeholder="e.g. San Francisco, CA"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass border-border relative overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                            <FileText className="w-5 h-5 text-primary" /> About
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
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
                            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Full Description</Label>
                            <Textarea 
                                value={formData.about_company}
                                onChange={(e) => handleUpdate("about_company", e.target.value)}
                                className="bg-black/20 border-border min-h-[150px]"
                                placeholder="Detailed company background..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* DYNAMIC SECTIONS */}
                <Card className="glass border-border relative overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                            <Globe className="w-5 h-5 text-primary" /> External & Dynamic Sections
                        </CardTitle>
                        <CardDescription className="italic text-xs">Add social media, custom platform links, and dynamic company blocks (e.g. Funding, Perks, Awards).</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-10">
                        {/* Social Links Section */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">External Platforms</h4>
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
                                            <option value="LeetCode">LeetCode</option>
                                            <option value="HackerRank">HackerRank</option>
                                            <option value="Stack Overflow">Stack Overflow</option>
                                            <option value="CodePen">CodePen</option>
                                        </optgroup>
                                        <optgroup label="Design & Video">
                                            <option value="Behance">Behance</option>
                                            <option value="Figma">Figma</option>
                                            <option value="Dribbble">Dribbble</option>
                                            <option value="YouTube">YouTube</option>
                                        </optgroup>
                                        <optgroup label="Social & Professional">
                                            <option value="LinkedIn">LinkedIn</option>
                                            <option value="Twitter">Twitter / X</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Substack">Substack</option>
                                        </optgroup>
                                        <optgroup label="Other">
                                            <option value="Portfolio">Custom Website / Portfolio</option>
                                        </optgroup>
                                    </select>
                                    <Input 
                                        value={link.url}
                                        onChange={(e) => {
                                            const newLinks = [...formData.socialLinks];
                                            newLinks[idx].url = e.target.value;
                                            handleUpdate("socialLinks", newLinks);
                                        }}
                                        placeholder="Username / URL" 
                                        className="bg-black/20 border-border h-9 text-xs" 
                                    />
                                    <Button variant="ghost" size="icon" onClick={() => {
                                        const newLinks = formData.socialLinks.filter((_: any, i: number) => i !== idx);
                                        handleUpdate("socialLinks", newLinks);
                                    }} className="h-8 w-8 text-destructive/50 hover:text-destructive">
                                        <Loader2 className="w-4 h-4 hidden" /> {/* spacer */}
                                        <span className="font-bold">×</span>
                                    </Button>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={() => handleUpdate("socialLinks", [...formData.socialLinks, { platform: '', url: '' }])} className="w-full border-dashed border-primary/20 hover:border-primary/50 text-primary/60">
                                + Add Platform Link
                            </Button>
                        </div>

                        {/* Custom Sections Section */}
                        <div className="space-y-4 pt-6 border-t border-border/50">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">Custom Information Blocks</h4>
                            {formData.dynamicSections.map((sec: any, idx: number) => (
                                <div key={idx} className="p-4 rounded-xl border border-border/50 bg-muted/10 space-y-3 relative group">
                                    <Input 
                                        value={sec.title}
                                        onChange={(e) => {
                                            const newSecs = [...formData.dynamicSections];
                                            newSecs[idx].title = e.target.value;
                                            handleUpdate("dynamicSections", newSecs);
                                        }}
                                        placeholder="Section Title (e.g. Funding & Investors)" 
                                        className="bg-black/20 border-border h-9 font-bold" 
                                    />
                                    <Textarea 
                                        value={sec.content}
                                        onChange={(e) => {
                                            const newSecs = [...formData.dynamicSections];
                                            newSecs[idx].content = e.target.value;
                                            handleUpdate("dynamicSections", newSecs);
                                        }}
                                        placeholder="List details here..." 
                                        className="bg-black/20 border-border min-h-[80px] text-xs" 
                                    />
                                    <Button variant="ghost" size="icon" onClick={() => {
                                        const newSecs = formData.dynamicSections.filter((_: any, i: number) => i !== idx);
                                        handleUpdate("dynamicSections", newSecs);
                                    }} className="absolute top-2 right-2 h-7 w-7 text-destructive/50 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="font-bold">×</span>
                                    </Button>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={() => handleUpdate("dynamicSections", [...formData.dynamicSections, { title: '', content: '' }])} className="w-full border-dashed border-primary/20 hover:border-primary/50 text-primary/60">
                                + Add Custom Section
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
