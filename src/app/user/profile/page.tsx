"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ProfileHeader } from "@/components/features/user/profile/profile-header"
import { OverviewTab } from "@/components/features/user/profile/tabs/overview-tab"
import { BasicInfoTab } from "@/components/features/user/profile/tabs/basic-info-tab"
import { SkillsTab } from "@/components/features/user/profile/tabs/skills-tab"
import { ExperienceTab } from "@/components/features/user/profile/tabs/experience-tab"
import { EducationTab } from "@/components/features/user/profile/tabs/education-tab"
import { ProjectsTab } from "@/components/features/user/profile/tabs/projects-tab"
import { GithubTab } from "@/components/features/user/profile/tabs/github-tab"
import { LeetcodeTab } from "@/components/features/user/profile/tabs/leetcode-tab"
import { ApplicationsTab } from "@/components/features/user/profile/tabs/applications-tab"
import { SettingsTab } from "@/components/features/user/profile/tabs/settings-tab"
import { USER_PROFILE, UserProfile } from "@/lib/mock-api/user-profile"
import { Loader2, Edit, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock fetch function
const fetchUserProfile = async (): Promise<UserProfile> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))
    return USER_PROFILE
}

export default function ProfilePage() {
    const { data: userProfile, isLoading } = useQuery({
        queryKey: ["userProfile"],
        queryFn: fetchUserProfile
    })

    const [profileData, setProfileData] = useState<UserProfile | null>(null)
    const [isEditing, setIsEditing] = useState(false)

    // Sync query data to local state for editing
    if (userProfile && !profileData && !isLoading) {
        setProfileData(userProfile)
    }

    const handleSave = () => {
        // Here you would trigger a mutation to save 'profileData'
        console.log("Saving profile:", profileData)
        setIsEditing(false)
    }

    // --- Handlers for Skills ---
    const handleAddSkill = (newSkill: { name: string, level: "Advanced" | "Intermediate" | "Beginner" }) => {
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
            skills: profileData.skills.filter(s => s.name !== skillName)
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
            type: "Full-time",
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
            experience: profileData.experience.filter(e => e.id !== id)
        })
    }

    const handleUpdateExperience = (id: string, field: string, value: string) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            experience: profileData.experience.map(e =>
                e.id === id ? { ...e, [field]: value } : e
            )
        })
    }

    // --- Handlers for Education ---
    const handleAddEducation = () => {
        if (!profileData) return
        const newEdu = {
            id: Math.random().toString(),
            institution: "New Institution",
            degree: "New Degree",
            year: "2024",
            grade: "A"
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
            education: profileData.education.filter(e => e.id !== id)
        })
    }

    const handleUpdateEducation = (id: string, field: string, value: string) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            education: profileData.education.map(e =>
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
            projects: profileData.projects.filter(p => p.id !== id)
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
            projects: profileData.projects.map(p =>
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

    const EditAction = () => (
        !isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="bg-background">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
            </Button>
        ) : (
            <div className="flex gap-2">
                <Button onClick={handleSave} variant="default" size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                </Button>
            </div>
        )
    )

    if (isLoading || !userProfile) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const activeData = profileData || userProfile

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12 pt-8 px-4">
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

            <Tabs defaultValue="overview" className="space-y-6">
                <div className="overflow-x-auto pb-2 scrollbar-hide">
                    {/* ... TabsList ... */}
                    <TabsList className="w-full justify-start h-auto p-1 bg-transparent border-b rounded-none gap-2">
                        <TabsTrigger value="overview" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Overview</TabsTrigger>
                        <TabsTrigger value="basic" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Basic Info</TabsTrigger>
                        <TabsTrigger value="skills" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Skills</TabsTrigger>
                        <TabsTrigger value="experience" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Experience</TabsTrigger>
                        <TabsTrigger value="education" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Education</TabsTrigger>
                        <TabsTrigger value="projects" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Projects</TabsTrigger>
                        <TabsTrigger value="github" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">GitHub</TabsTrigger>
                        <TabsTrigger value="applications" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Applications</TabsTrigger>
                        <TabsTrigger value="settings" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Settings</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="overview" className="animate-in fade-in-50 duration-300">
                    <OverviewTab data={activeData} isEditing={isEditing} />
                </TabsContent>
                <TabsContent value="basic" className="animate-in fade-in-50 duration-300">
                    <BasicInfoTab data={activeData} isEditing={isEditing} />
                </TabsContent>
                <TabsContent value="skills" className="animate-in fade-in-50 duration-300">
                    <SkillsTab
                        data={activeData}
                        isEditing={isEditing}
                        onAddSkill={handleAddSkill}
                        onDeleteSkill={handleDeleteSkill}
                    />
                </TabsContent>
                <TabsContent value="experience" className="animate-in fade-in-50 duration-300">
                    <ExperienceTab
                        data={activeData}
                        isEditing={isEditing}
                        onAdd={handleAddExperience}
                        onDelete={handleDeleteExperience}
                        onUpdate={handleUpdateExperience}
                    />
                </TabsContent>
                <TabsContent value="education" className="animate-in fade-in-50 duration-300">
                    <EducationTab
                        data={activeData}
                        isEditing={isEditing}
                        onAdd={handleAddEducation}
                        onDelete={handleDeleteEducation}
                        onUpdate={handleUpdateEducation}
                    />
                </TabsContent>
                <TabsContent value="projects" className="animate-in fade-in-50 duration-300">
                    <ProjectsTab
                        data={activeData}
                        isEditing={isEditing}
                        onAdd={handleAddProject}
                        onDelete={handleDeleteProject}
                        onUpdate={handleUpdateProject}
                    />
                </TabsContent>
                <TabsContent value="github" className="animate-in fade-in-50 duration-300">
                    <GithubTab
                        data={activeData}
                        isEditing={isEditing}
                        onUpdate={handleUpdateGitHubUsername}
                    />
                </TabsContent>
                <TabsContent value="applications" className="animate-in fade-in-50 duration-300">
                    <ApplicationsTab data={activeData} />
                </TabsContent>
                <TabsContent value="settings" className="animate-in fade-in-50 duration-300">
                    <SettingsTab data={activeData} />
                </TabsContent>
            </Tabs>
        </div>
    )
    // NOTE: This large replacement might fail if I'm not careful. I'll just replace the relevant parts.
    // I need to:
    // 1. Insert `profileData` state.
    // 2. Insert handlers.
    // 3. Update the JSX to use `activeData` and pass props.

}
