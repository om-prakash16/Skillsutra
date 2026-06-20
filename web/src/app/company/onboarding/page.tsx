"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { companyApi } from "@/lib/api/company-api"
import { useAuth } from "@/context/auth-context"
import { CheckCircle, ShieldAlert, Users, Building, ChevronRight, Loader2 } from "lucide-react"

export default function CompanyOnboardingWizard() {
    const router = useRouter()
    const { user } = useAuth()
    
    const company = user?.companies?.[0]
    const status = company?.approval_status || "PENDING"
    const domainVerified = company?.domain_verified || false
    
    // Determine initial step
    const [step, setStep] = useState(() => {
        if (!company) return 1
        if (!company.industry) return 1 // Needs profile
        if (!domainVerified) return 3 // Skip to domain verification if profile is done
        return 4 // Waiting for approval
    })

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        company_name: company?.name || "",
        website: "",
        industry: "",
        company_size: "",
        location: "",
        description: ""
    })
    
    const [inviteEmail, setInviteEmail] = useState("")

    if (status === "APPROVED" && domainVerified) {
        router.push("/company/post-job")
        return null
    }

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await companyApi.profile.update(formData)
            toast.success("Profile saved")
            setStep(2)
        } catch (error: any) {
            toast.error(error.message || "Failed to save profile")
        } finally {
            setLoading(false)
        }
    }

    const handleInviteRecruiter = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!inviteEmail) return
        setLoading(true)
        try {
            await companyApi.team.invite(inviteEmail, "RECRUITER")
            toast.success(`Invite sent to ${inviteEmail}`)
            setInviteEmail("")
        } catch (error: any) {
            toast.error(error.message || "Failed to invite recruiter")
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyDomain = async () => {
        setLoading(true)
        try {
            await companyApi.profile.verifyDomain()
            toast.success("Domain verified successfully!")
            // Refresh to update user context
            window.location.reload()
        } catch (error: any) {
            toast.error(error.message || "Domain verification failed")
        } finally {
            setLoading(false)
        }
    }

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <form onSubmit={handleProfileSubmit} className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                                <Building className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold">Company Profile</h2>
                            <p className="text-zinc-400">Tell us about your organization</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">Company Name</label>
                                <input required type="text" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none" placeholder="Acme Corp" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">Website</label>
                                <input required type="url" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none" placeholder="https://acme.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">Industry</label>
                                <input required type="text" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none" placeholder="Technology" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">Company Size</label>
                                <select required value={formData.company_size} onChange={e => setFormData({...formData, company_size: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none">
                                    <option value="">Select Size</option>
                                    <option value="1-10">1-10</option>
                                    <option value="11-50">11-50</option>
                                    <option value="51-200">51-200</option>
                                    <option value="200+">200+</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1">Description</label>
                            <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none" placeholder="What does your company do?" />
                        </div>
                        
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue <ChevronRight className="w-5 h-5 ml-2" /></>}
                        </button>
                    </form>
                )
            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-purple-500/20 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                                <Users className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold">Add Recruiters</h2>
                            <p className="text-zinc-400">Invite your team to help manage jobs and candidates.</p>
                        </div>
                        
                        <form onSubmit={handleInviteRecruiter} className="flex gap-4">
                            <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required placeholder="recruiter@company.com" className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 focus:border-purple-500 outline-none" />
                            <button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 px-6 py-2.5 rounded-lg font-medium flex items-center">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Invite"}
                            </button>
                        </form>
                        
                        <div className="pt-6">
                            <button onClick={() => setStep(3)} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-lg flex items-center justify-center border border-zinc-700">
                                Skip for now <ChevronRight className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                                <ShieldAlert className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold">Verify Domain</h2>
                            <p className="text-zinc-400">Verify your domain to prove you represent this company.</p>
                        </div>
                        
                        <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 text-center">
                            <p className="text-sm text-zinc-400 mb-6">
                                Click the button below to simulate domain verification. This will unlock access to post jobs once an admin approves your account.
                            </p>
                            <button onClick={handleVerifyDomain} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 w-full py-3 rounded-lg font-medium flex justify-center items-center">
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Domain Now"}
                            </button>
                        </div>
                    </div>
                )
            case 4:
                return (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
                                <Loader2 className="w-10 h-10 animate-spin" />
                            </div>
                            <h2 className="text-2xl font-bold">Pending Approval</h2>
                            <p className="text-zinc-400 max-w-sm mx-auto mt-2">
                                Your account is fully set up and domain is verified. You are waiting for final administrative approval.
                            </p>
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
                {/* Progress bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800">
                    <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
                </div>
                
                <div className="flex gap-2 mb-8 mt-2 overflow-x-auto pb-2">
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-blue-500' : 'bg-zinc-800'}`} />
                    ))}
                </div>

                {renderStepContent()}
            </div>
        </div>
    )
}
