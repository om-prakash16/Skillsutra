"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ProfileHeader } from "@/features/profile/components/profile-header"
import { OverviewTab } from "@/features/user/profile/tabs/overview-tab"
import { BasicInfoTab } from "@/features/user/profile/tabs/basic-info-tab"
import { SkillsTab } from "@/features/user/profile/tabs/skills-tab"
import { ExperienceTab } from "@/features/user/profile/tabs/experience-tab"
import { EducationTab } from "@/features/user/profile/tabs/education-tab"
import { ProjectsTab } from "@/features/user/profile/tabs/projects-tab"
import { GithubTab } from "@/features/user/profile/tabs/github-tab"
import { LeetcodeTab } from "@/features/user/profile/tabs/leetcode-tab"
import { ApplicationsTab } from "@/features/user/profile/tabs/applications-tab"
import { ReputationTab } from "@/features/user/profile/tabs/reputation-tab"
import { SettingsTab } from "@/features/user/profile/tabs/settings-tab"
import { DynamicProfileForm } from "@/features/profile/components/DynamicProfileForm"
import { UserProfile, Skill, Experience, Education, Project } from "@/types/profile"
import { userApi } from "@/lib/api/user-api"

import { Loader2, Edit, Save, X, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

// Fetch user profile using userApi (relational data aggregation)
const fetchUserProfile = async (): Promise<UserProfile> => {
    const response = await userApi.profile.get()
    
    if (!response || !response.profile) {
        throw new Error("Failed to load profile data")
    }

    const p = response.profile
    
    const nameParts = (p.full_name || p.username || "New User").split(" ")
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(" ") || ""

    // Map relational DB structure to frontend Profile structure
    return {
        id: p.user_id || p.id,
        basic: {
            firstName,
            lastName,
            email: p.email || "",
            phone: p.phone || "",
            bio: p.bio || "",
            location: p.location || "Remote",
            title: p.headline || "Developer",
            avatar: p.avatar_url || "",
            completion: p.completion_percent || 0,
            experienceLevel: p.experience_level || "Junior",
            jobType: p.job_type || "Full-time",
            languages: p.languages || [],
            joinDate: p.created_at ? new Date(p.created_at).toLocaleDateString() : ""
        },
        skills: (response.skills || []).map((s: any) => ({
            name: s.name,
            level: s.proficiency || "Intermediate",
            category: s.category,
            is_verified: s.verified || s.is_verified
        })),
        experience: (response.experiences || []).map((e: any) => ({
            id: e.id || Math.random().toString(),
            role: e.role,
            company: e.company_name,
            type: (e.type || "Full-time") as "Full-time" | "Part-time" | "Contract" | "Freelance",
            startDate: e.start_date,
            endDate: e.end_date || "Present",
            description: e.description
        })),
        education: (response.education || []).map((e: any) => {
            const startYear = e.start_date ? new Date(e.start_date).getFullYear().toString() : "";
            const endYear = e.end_date ? new Date(e.end_date).getFullYear().toString() : "";
            return {
                id: e.id || Math.random().toString(),
                institution: e.institution,
                degree: e.degree,
                startYear: startYear,
                endYear: endYear,
                current: !e.end_date && !!e.start_date, 
                fieldOfStudy: e.field_of_study,
                grade: e.grade || ""
            };
        }),
        projects: (response.projects || []).map((proj: any) => ({
            id: proj.id || Math.random().toString(),
            title: proj.title,
            description: proj.description,
            stack: proj.stack || [],
            link: proj.project_url,
            github: proj.github_url
        })),
        github: { username: p.github_handle || "", repos: [] },
        leetcode: { username: "", totalSolved: 0, easy: 0, medium: 0, hard: 0, ranking: 0 },
        applications: [],
        settings: { 
            notifications: true, 
            visibility: p.visibility === "private" ? "Private" : "Public", 
            theme: "system" 
        },
        ai_scores: response.ai_scores
    }
}

export default function EditableProfile() {
    const { user } = useAuth()
    const [profileData, setProfileData] = useState<UserProfile | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const { data: userProfile, isLoading, refetch, isError, error } = useQuery({
        queryKey: ["userProfile", user?.id],
        queryFn: fetchUserProfile,
        enabled: !!user?.id
    })

    // Sync query data to local state for editing
    if (userProfile && !profileData && !isLoading) {
        setProfileData(userProfile)
    }

    const handleSave = async () => {
        if (!user || !profileData) return
        
        setIsSaving(true)
        try {
            // Map frontend structure back to relational backend format
            const updatePayload = {
                profile: {
                    full_name: `${profileData.basic.firstName} ${profileData.basic.lastName}`,
                    bio: profileData.basic.bio,
                    location: profileData.basic.location,
                    headline: profileData.basic.title,
                    experience_level: profileData.basic.experienceLevel,
                    job_type: profileData.basic.jobType,
                    languages: profileData.basic.languages,
                    visibility: profileData.settings.visibility.toLowerCase(),
                    avatar_url: profileData.basic.avatar
                },
                skills: profileData.skills.map(s => ({
                    name: s.name,
                    proficiency: s.level,
                    category: s.category
                })),
                experiences: profileData.experience.map(e => ({
                    company_name: e.company,
                    role: e.role,
                    description: e.description,
                    start_date: e.startDate,
                    end_date: e.endDate === "Present" ? null : e.endDate
                })),
                projects: profileData.projects.map(p => ({
                    title: p.title,
                    description: p.description,
                    stack: p.stack,
                    project_url: p.link,
                    github_url: p.github
                })),
                education: profileData.education.map(e => ({
                    institution: e.institution,
                    degree: e.degree,
                    field_of_study: e.fieldOfStudy,
                    start_date: e.startYear ? `${e.startYear}-01-01` : null,
                    end_date: (e.current || !e.endYear) ? null : `${e.endYear}-12-31`,
                    grade: e.grade || null
                }))
            }

            const response = await userApi.profile.update(updatePayload)

            if (response.status === "error") throw new Error(response.message)
            
            toast.success("Profile synchronized with network!")
            setIsEditing(false)
            refetch()
        } catch (error: any) {
            toast.error(`Sync failed: ${error.message}`)
        } finally {
            setIsSaving(false)
        }
    }

    // --- Handlers for Basic Info & Settings ---
    const handleUpdateBasicInfo = (field: string, value: string) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            basic: { ...profileData.basic, [field]: value }
        })
    }

    const handleUpdateSettings = (field: string, value: any) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            settings: { ...profileData.settings, [field]: value }
        })
    }

    // --- Handlers for Skills ---
    const handleAddSkill = (newSkill: Skill) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            skills: [...profileData.skills, newSkill]
        })
    }

    const handleDeleteSkill = (skillName: string) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            skills: profileData.skills.filter((s: any) => s.name !== skillName)
        })
    }

    // --- Handlers for Experience ---
    const handleAddExperience = () => {
        if (!profileData) return
        const newExp = {
            id: Math.random().toString(),
            role: "New Role",
            company: "New Company",
            logo: "",
            type: "Full-time" as "Full-time" | "Part-time" | "Contract" | "Freelance",
            startDate: "2024",
            endDate: "Present",
            description: "Description..."
        }
        setProfileData({
            ...profileData,
            experience: [newExp, ...profileData.experience]
        })
    }

    const handleDeleteExperience = (id: string) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            experience: profileData.experience.filter((e: any) => e.id !== id)
        })
    }

    const handleUpdateExperience = (id: string, field: string, value: string) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            experience: profileData.experience.map((e: any) =>
                e.id === id ? { ...e, [field]: value } : e
            )
        })
    }

    // --- Handlers for Education ---
    const handleAddEducation = () => {
        if (!profileData) return
        const newEdu = {
            id: Math.random().toString(),
            institution: "University Name",
            degree: "Bachelor of Technology",
            startYear: "2020",
            endYear: "2024",
            current: false,
            grade: ""
        }
        setProfileData({
            ...profileData,
            education: [newEdu, ...profileData.education]
        })
    }

    const handleDeleteEducation = (id: string) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            education: profileData.education.filter((e: any) => e.id !== id)
        })
    }

    const handleUpdateEducation = (id: string, field: string, value: string) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            education: profileData.education.map((e: any) =>
                e.id === id ? { ...e, [field]: value } : e
            )
        })
    }

    // --- Handlers for Projects ---
    const handleAddProject = () => {
        if (!profileData) return
        const newProj = {
            id: Math.random().toString(),
            title: "New Project",
            description: "Description...",
            stack: ["React"],
            link: "#",
            github: "#"
        }
        setProfileData({
            ...profileData,
            projects: [newProj, ...profileData.projects]
        })
    }

    const handleDeleteProject = (id: string) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            projects: profileData.projects.filter((p: any) => p.id !== id)
        })
    }

    const handleUpdateProject = (id: string, field: string, value: string) => {
        if (!profileData) return

        let processedValue: any = value
        if (field === "stack") {
            processedValue = value.split(",").map(s => s.trim()).filter(s => s.length > 0)
        }

        setProfileData({
            ...profileData,
            projects: profileData.projects.map((p: any) =>
                p.id === id ? { ...p, [field]: processedValue } : p
            )
        })
    }

    const handleUpdateGitHubUsername = (username: string) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            github: {
                ...profileData.github,
                username
            }
        })
    }


    const handleUpdateAvatar = (url: string) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            basic: {
                ...profileData.basic,
                avatar: url
            }
        })
    }

    const [isSaving, setIsSaving] = useState(false)

    const EditAction = () => (
        !isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="bg-background">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
            </Button>
        ) : (
            <div className="flex gap-2">
                <Button onClick={handleSave} variant="default" size="sm" disabled={isSaving}>
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                        </>
                    )}
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm" disabled={isSaving}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                </Button>
            </div>
        )
    )

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto py-16 px-4 md:px-8 space-y-12 animate-in fade-in duration-500">
                {/* Profile Header Skeleton */}
                <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                    <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] md:rounded-[2.5rem]" />
                    <div className="space-y-4 w-full mt-4 md:mt-8">
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-64 rounded-xl" />
                            <Skeleton className="h-5 w-48 rounded-lg" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-8 w-24 rounded-full" />
                            <Skeleton className="h-8 w-24 rounded-full" />
                            <Skeleton className="h-8 w-24 rounded-full" />
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <Skeleton className="h-10 w-32 rounded-xl" />
                    </div>
                </div>

                {/* Tabs Skeleton */}
                <div className="space-y-10">
                    <div className="glass p-2 rounded-[2rem] border-border/50 w-full flex gap-2 overflow-hidden">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Skeleton key={i} className="h-10 w-24 rounded-2xl" />
                        ))}
                    </div>
                    
                    <div className="glass border-border/50 rounded-[2.5rem] p-8 md:p-12 min-h-[400px]">
                        <Skeleton className="h-8 w-48 mb-8 rounded-lg" />
                        <div className="space-y-4">
                            <Skeleton className="h-24 w-full rounded-2xl" />
                            <Skeleton className="h-24 w-full rounded-2xl" />
                            <Skeleton className="h-24 w-full rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (isError || !userProfile) {
        return (
            <div className="flex h-[60vh] w-full flex-col items-center justify-center space-y-4">
                <div className="p-4 rounded-full bg-red-500/10 text-red-500 mb-4">
                    <X className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-foreground">Identity Sync Failed</h3>
                <p className="text-sm text-muted-foreground font-medium max-w-md text-center">
                    {error instanceof Error ? error.message : "Unable to establish connection with the neural ledger."}
                </p>
                <Button onClick={() => refetch()} variant="outline" className="mt-4 font-black uppercase tracking-widest text-[10px]">
                    Re-establish Connection
                </Button>
            </div>
        )
    }

    const activeData = profileData || userProfile

    return (
        <div className="space-y-12 max-w-7xl mx-auto pb-24 pt-16 px-4 md:px-8 relative overflow-hidden">
            <ProfileHeader
                user={activeData.basic}
                profileId={activeData.id}
                isEditing={isEditing}
                onUpdateAvatar={handleUpdateAvatar}
                action={<div className="hidden md:block"><EditAction /></div>}
            />

            {/* Mobile Edit Button - Visible only on small screens */}
            <div className="md:hidden">
                <div className="w-full">
                    <EditAction />
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-10">
                <div className="overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] glass p-2 rounded-[2rem] border-border/50 w-full">
                    <TabsList className="w-max min-w-full justify-start flex-nowrap h-auto p-1 bg-transparent border-none gap-2">
                        {[
                            { value: "overview", label: "Overview" },
                            { value: "basic", label: "Basic Info" },
                            { value: "skills", label: "Skills" },
                            { value: "experience", label: "Experience" },
                            { value: "education", label: "Education" },
                            { value: "projects", label: "Projects" },
                            { value: "github", label: "GitHub" },
                            { value: "applications", label: "Applications" },
                            { value: "reputation", label: "Reputation", icon: Sparkles },
                            { value: "matrix", label: "AI Profile" },
                            { value: "settings", label: "Settings" }
                        ].map((tab) => (
                            <TabsTrigger 
                                key={tab.value} 
                                value={tab.value} 
                                className="rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary/20 hover:text-primary"
                            >
                                {tab.icon && <tab.icon className="w-3.5 h-3.5 mr-2" />}
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <div className="min-h-[600px]">
                    <TabsContent value="overview" className="animate-in fade-in-50 duration-500">
                        <OverviewTab data={activeData} isEditing={isEditing} onUpdateBio={(bio) => handleUpdateBasicInfo('bio', bio)} />
                    </TabsContent>
                    <TabsContent value="basic" className="animate-in fade-in-50 duration-500">
                        <BasicInfoTab data={activeData} isEditing={isEditing} onUpdate={handleUpdateBasicInfo} />
                    </TabsContent>
                    <TabsContent value="skills" className="animate-in fade-in-50 duration-500">
                        <SkillsTab
                            data={activeData}
                            isEditing={isEditing}
                            onAddSkill={handleAddSkill}
                            onDeleteSkill={handleDeleteSkill}
                        />
                    </TabsContent>
                    <TabsContent value="experience" className="animate-in fade-in-50 duration-500">
                        <ExperienceTab
                            data={activeData}
                            isEditing={isEditing}
                            onAdd={handleAddExperience}
                            onDelete={handleDeleteExperience}
                            onUpdate={handleUpdateExperience}
                        />
                    </TabsContent>
                    <TabsContent value="education" className="animate-in fade-in-50 duration-500">
                        <EducationTab
                            data={activeData}
                            isEditing={isEditing}
                            onAdd={handleAddEducation}
                            onDelete={handleDeleteEducation}
                            onUpdate={handleUpdateEducation}
                        />
                    </TabsContent>
                    <TabsContent value="projects" className="animate-in fade-in-50 duration-500">
                        <ProjectsTab
                            data={activeData}
                            isEditing={isEditing}
                            onAdd={handleAddProject}
                            onDelete={handleDeleteProject}
                            onUpdate={handleUpdateProject}
                        />
                    </TabsContent>
                    <TabsContent value="github" className="animate-in fade-in-50 duration-500">
                        <GithubTab
                            data={activeData}
                            isEditing={isEditing}
                            onUpdate={handleUpdateGitHubUsername}
                        />
                    </TabsContent>
                    <TabsContent value="applications" className="animate-in fade-in-50 duration-500">
                        <ApplicationsTab data={activeData} />
                    </TabsContent>
                    <TabsContent value="reputation" className="animate-in fade-in-50 duration-500">
                        <ReputationTab />
                    </TabsContent>
                    <TabsContent value="matrix" className="animate-in fade-in-50 duration-500">
                        <div className="glass rounded-[3rem] p-8 md:p-16 border-border/50 shadow-2xl">
                             <DynamicProfileForm 
                                initialData={{
                                    firstName: activeData.basic.firstName,
                                    lastName: activeData.basic.lastName,
                                    bio: activeData.basic.bio,
                                    primaryRole: activeData.basic.title,
                                    skills: activeData.skills.map(s => s.name).join(", "),
                                    experience: activeData.experience.map(e => ({ ...e, type: e.type || "Full-time" })),
                                    education: activeData.education
                                }} 
                             />
                        </div>
                    </TabsContent>
                    <TabsContent value="settings" className="animate-in fade-in-50 duration-500">
                        <SettingsTab data={activeData} onUpdateSettings={handleUpdateSettings} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
    // NOTE: This large replacement might fail if I'm not careful. I'll just replace the relevant parts.
    // I need to:
    // 1. Insert `profileData` state.
    // 2. Insert handlers.
    // 3. Update the JSX to use `activeData` and pass props.

}
