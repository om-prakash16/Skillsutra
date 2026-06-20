"use client"

import { useState, useEffect } from "react"
import { fetchWithAuth } from "@/lib/api/api-client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Loader2, Route, Compass, CheckCircle2, ChevronRight, Sparkles, Star, TrendingUp, CalendarDays, BarChart, MessageSquare, Target } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

// --- Sub-components for Career OS ---

function CareerVisionPanel() {
    const [visions, setVisions] = useState<any[]>([])
    const [title, setTitle] = useState("")
    const [timelineType, setTimelineType] = useState("1_YEAR")

    useEffect(() => {
        fetchWithAuth("/career/os/vision").then(res => {
            if (res.status === "success") setVisions(res.data)
        })
    }, [])

    const handleAdd = async () => {
        if (!title.trim()) return
        const res = await fetchWithAuth("/career/os/vision", {
            method: "POST",
            body: JSON.stringify({ title, timeline_type: timelineType, status: "ACTIVE" })
        })
        if (res.status === "success") {
            setVisions([...visions, res.data])
            setTitle("")
            toast.success("Goal added!")
        }
    }

    return (
        <div className="space-y-8">
            <div className="glass p-8 rounded-[2rem] border-border/50">
                <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> Career Vision (1/3/5 Year Goals)</h3>
                <div className="flex gap-4">
                    <select 
                        value={timelineType} 
                        onChange={e => setTimelineType(e.target.value)}
                        className="bg-muted border border-border rounded-xl px-4 text-sm text-foreground focus:outline-none"
                    >
                        <option value="1_YEAR">1 Year Goal</option>
                        <option value="3_YEAR">3 Year Goal</option>
                        <option value="5_YEAR">5 Year Goal</option>
                        <option value="LIFE_MILESTONE">Life Milestone</option>
                    </select>
                    <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Become Senior Developer" className="h-12 bg-muted/50 rounded-xl" />
                    <Button onClick={handleAdd} className="h-12 px-6 rounded-xl text-xs font-bold uppercase tracking-widest">Add</Button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['1_YEAR', '3_YEAR', '5_YEAR', 'LIFE_MILESTONE'].map(type => (
                    <div key={type} className="glass p-6 rounded-2xl border-border/50">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">{type.replace('_', ' ')}</h4>
                        <div className="space-y-3">
                            {visions.filter(v => v.timeline_type === type).map((v, i) => (
                                <div key={i} className="bg-black/20 p-4 rounded-xl border border-border/50 flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    <span className="text-sm text-foreground font-medium">{v.title}</span>
                                </div>
                            ))}
                            {visions.filter(v => v.timeline_type === type).length === 0 && (
                                <p className="text-xs text-muted-foreground italic">No goals set yet.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function DailyPlannerPanel() {
    const [tasks, setTasks] = useState<any[]>([])
    const [habits, setHabits] = useState<any[]>([])
    const [taskTitle, setTaskTitle] = useState("")
    const [taskTime, setTaskTime] = useState("")

    useEffect(() => {
        fetchWithAuth("/career/os/planner").then(res => {
            if (res.status === "success") {
                setTasks(res.data.tasks)
                setHabits(res.data.habits)
            }
        })
    }, [])

    // Notification Checker
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date()
            const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
            tasks.forEach(t => {
                if (t.time_start && t.time_start.startsWith(currentTimeStr) && t.status !== 'DONE' && !t.notified) {
                    toast.info(`Reminder: Time for ${t.title}!`, { icon: '⏰' })
                    t.notified = true // local flag to prevent duplicate toasts
                }
            })
        }, 60000) // check every minute
        return () => clearInterval(interval)
    }, [tasks])

    const handleAddTask = async () => {
        if (!taskTitle.trim()) return
        const today = new Date().toISOString().split('T')[0]
        const res = await fetchWithAuth("/career/os/planner/task", {
            method: "POST",
            body: JSON.stringify({ 
                title: taskTitle, 
                scheduled_date: today, 
                time_start: taskTime ? `${taskTime}:00` : null,
                status: "TODO" 
            })
        })
        if (res.status === "success") {
            setTasks([...tasks, { ...res.data, notified: false }])
            setTaskTitle("")
            setTaskTime("")
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
                <div className="glass p-8 rounded-[2rem] border-border/50">
                    <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2"><CalendarDays className="w-5 h-5 text-primary" /> Daily Planner & Tasks</h3>
                    <div className="flex gap-4 mb-6">
                        <Input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="What needs to be done today?" className="h-12 bg-muted/50 rounded-xl flex-1" />
                        <Input type="time" value={taskTime} onChange={e => setTaskTime(e.target.value)} className="h-12 bg-muted/50 rounded-xl w-32" />
                        <Button onClick={handleAddTask} className="h-12 px-6 rounded-xl text-xs font-bold uppercase tracking-widest">Add</Button>
                    </div>
                    <div className="space-y-3">
                        {tasks.map((t, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-black/20">
                                <div className="flex items-center gap-4">
                                    <input type="checkbox" className="w-5 h-5 rounded border-border text-primary focus:ring-primary bg-transparent" />
                                    <span className="text-sm font-medium text-foreground">{t.title}</span>
                                </div>
                                {t.time_start && (
                                    <Badge variant="outline" className="text-muted-foreground border-border/50 bg-muted/20 text-micro">
                                        ⏰ {t.time_start.substring(0, 5)}
                                    </Badge>
                                )}
                            </div>
                        ))}
                        {tasks.length === 0 && <p className="text-xs text-muted-foreground italic">No tasks for today.</p>}
                    </div>
                </div>
            </div>
            
            <div className="space-y-6">
                <div className="glass p-6 rounded-[2rem] border-border/50">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Daily Habits</h3>
                    <div className="space-y-3">
                        {habits.map((h, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                                <span className="text-xs font-bold text-foreground">{h.name}</span>
                                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 text-micro">{h.current_streak} Streak</Badge>
                            </div>
                        ))}
                        {habits.length === 0 && <p className="text-xs text-muted-foreground italic">No habits configured.</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

function AICoachPanel() {
    const [messages, setMessages] = useState<{role: string, text: string}[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSend = async () => {
        if (!input.trim()) return
        const msg = input
        setInput("")
        setMessages(prev => [...prev, { role: "user", text: msg }])
        setLoading(true)
        try {
            const res = await fetchWithAuth("/career/os/coach", {
                method: "POST",
                body: JSON.stringify({ message: msg })
            })
            if (res.status === "success") {
                setMessages(prev => [...prev, { role: "ai", text: res.reply }])
            } else {
                toast.error("Coach is unavailable.")
            }
        } catch (err) {
            toast.error("Failed to connect to Coach.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="glass p-8 rounded-[2rem] border-border/50 flex flex-col h-[600px]">
            <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary" /> AI Career Coach</h3>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground/50">
                        <MessageSquare className="w-12 h-12" />
                        <p className="text-xs uppercase tracking-widest font-bold">Ask for advice, gap analysis, or resume tips.</p>
                    </div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted border border-border/50 text-foreground rounded-tl-sm'}`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="max-w-[80%] p-4 rounded-2xl text-sm bg-muted border border-border/50 text-foreground flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                        </div>
                    </div>
                )}
            </div>
            <div className="flex gap-2">
                <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Ask your AI coach..." className="h-12 bg-black/40 rounded-xl" />
                <Button onClick={handleSend} disabled={loading} className="h-12 px-6 rounded-xl"><Sparkles className="w-4 h-4" /></Button>
            </div>
        </div>
    )
}

function ProgressPanel() {
    return (
        <div className="glass p-8 rounded-[2rem] border-border/50 flex flex-col items-center justify-center h-[400px]">
            <BarChart className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground">Analytics Engine Booting</h3>
            <p className="text-sm text-muted-foreground mt-2">Earn achievements and complete milestones to see your progress here.</p>
        </div>
    )
}

function OnboardingWizard({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        current_role: "", experience: "", skills: "",
        target_role: "", target_salary: "", target_timeline: "",
        skills_to_learn: "", career_challenge: "",
        daily_study_hours: 2, work_preference: "Remote", weekly_goals: ""
    })

    useEffect(() => {
        // Pre-fill with existing profile data
        fetchWithAuth("/profile/me").then(res => {
            if (res.status === "success" && res.data) {
                setData(prev => ({
                    ...prev,
                    current_role: res.data.current_position || "",
                    experience: res.data.years_of_experience ? `${res.data.years_of_experience} Years` : "",
                    skills: res.data.skills ? res.data.skills.join(", ") : ""
                }))
            }
        })
    }, [])

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const payload = {
                ...data,
                skills: data.skills.split(",").map(s => s.trim()).filter(Boolean),
                skills_to_learn: data.skills_to_learn.split(",").map(s => s.trim()).filter(Boolean),
                weekly_goals: data.weekly_goals.split(",").map(s => s.trim()).filter(Boolean)
            }
            await fetchWithAuth("/career/os/onboarding", {
                method: "POST",
                body: JSON.stringify(payload)
            })
            toast.success("Career OS Initialized!")
            onComplete()
        } catch (err) {
            toast.error("Failed to initialize Career OS")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
            <div className="glass w-full max-w-2xl p-8 rounded-[2rem] border-border/50 shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
                
                <h2 className="text-3xl font-black flex items-center gap-3"><Target className="w-8 h-8 text-primary" /> Career OS Setup</h2>
                
                <div className="flex gap-2 mb-8">
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} className={`h-2 flex-1 rounded-full ${step >= s ? 'bg-primary' : 'bg-muted'}`} />
                    ))}
                </div>

                {step === 1 && (
                    <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="space-y-4">
                        <h3 className="text-lg font-bold text-primary">Step 1: Current Situation</h3>
                        <p className="text-sm text-muted-foreground">We pre-filled this from your profile.</p>
                        <Input placeholder="Current Role (e.g. Frontend Intern)" value={data.current_role} onChange={e => setData({...data, current_role: e.target.value})} className="h-12 bg-black/40" />
                        <Input placeholder="Experience (e.g. 6 Months)" value={data.experience} onChange={e => setData({...data, experience: e.target.value})} className="h-12 bg-black/40" />
                        <Input placeholder="Skills (comma-separated, e.g. React, Python)" value={data.skills} onChange={e => setData({...data, skills: e.target.value})} className="h-12 bg-black/40" />
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="space-y-4">
                        <h3 className="text-lg font-bold text-primary">Step 2: Future Goals</h3>
                        <Input placeholder="Target Role (e.g. Senior Backend Engineer)" value={data.target_role} onChange={e => setData({...data, target_role: e.target.value})} className="h-12 bg-black/40" />
                        <Input placeholder="Target Salary (e.g. ₹12 LPA)" value={data.target_salary} onChange={e => setData({...data, target_salary: e.target.value})} className="h-12 bg-black/40" />
                        <Input placeholder="Target Timeline (e.g. 3 Years)" value={data.target_timeline} onChange={e => setData({...data, target_timeline: e.target.value})} className="h-12 bg-black/40" />
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="space-y-4">
                        <h3 className="text-lg font-bold text-primary">Step 3: Learning Interests</h3>
                        <Input placeholder="Skills to Learn (comma-separated, e.g. Docker, AWS)" value={data.skills_to_learn} onChange={e => setData({...data, skills_to_learn: e.target.value})} className="h-12 bg-black/40" />
                        <Input placeholder="Biggest Career Challenge?" value={data.career_challenge} onChange={e => setData({...data, career_challenge: e.target.value})} className="h-12 bg-black/40" />
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="space-y-4">
                        <h3 className="text-lg font-bold text-primary">Step 4: Lifestyle Preferences</h3>
                        <Input type="number" placeholder="Daily Study Hours" value={data.daily_study_hours} onChange={e => setData({...data, daily_study_hours: parseInt(e.target.value) || 0})} className="h-12 bg-black/40" />
                        <select value={data.work_preference} onChange={e => setData({...data, work_preference: e.target.value})} className="h-12 bg-black/40 w-full rounded-xl px-4 text-sm border border-border focus:outline-none">
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Onsite">Onsite</option>
                        </select>
                        <Input placeholder="Weekly Goals (comma-separated, e.g. Finish React Course, Apply 5 jobs)" value={data.weekly_goals} onChange={e => setData({...data, weekly_goals: e.target.value})} className="h-12 bg-black/40" />
                    </motion.div>
                )}

                <div className="flex justify-between pt-4">
                    <Button variant="ghost" onClick={() => step > 1 ? setStep(step - 1) : onComplete()} disabled={loading}>
                        {step > 1 ? "Back" : "Skip Setup"}
                    </Button>
                    <Button onClick={() => step < 4 ? setStep(step + 1) : handleSubmit()} disabled={loading} className="px-8 font-bold">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (step < 4 ? "Next Step" : "Launch Career OS")}
                    </Button>
                </div>
            </div>
        </div>
    )
}

// --- Main Career OS Dashboard ---

export default function CareerOSPage() {
    const [activeTab, setActiveTab] = useState("roadmap")
    
    // Roadmap State
    const [roadmap, setRoadmap] = useState<any>(null)
    const [gapAnalysis, setGapAnalysis] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [showOnboarding, setShowOnboarding] = useState(false)
    const [generating, setGenerating] = useState(false)
    const [customRole, setCustomRole] = useState("")
    const [currentState, setCurrentState] = useState("")
    const [timeline, setTimeline] = useState("")
    const [dailyRoutine, setDailyRoutine] = useState("")

    const fetchRoadmapData = async () => {
        try {
            const [roadmapRes, visionRes] = await Promise.all([
                fetchWithAuth("/career/roadmap"),
                fetchWithAuth("/career/os/vision")
            ])
            
            let hasData = false
            if (roadmapRes.status === "success" && roadmapRes.data) {
                setRoadmap(roadmapRes.data)
                hasData = true
                const gapRes = await fetchWithAuth(`/career/gap-analysis?target_role=${encodeURIComponent(roadmapRes.data.target_role)}`)
                if (gapRes.status === "success") setGapAnalysis(gapRes.data)
            }
            if (visionRes.status === "success" && visionRes.data && visionRes.data.length > 0) {
                hasData = true
            }

            if (!hasData) {
                setShowOnboarding(true)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRoadmapData()
    }, [])

    const handleOnboardingComplete = () => {
        setShowOnboarding(false)
        setLoading(true)
        fetchRoadmapData() // Refetch everything now that DB is seeded
    }

    const handleGenerate = async () => {
        if (!customRole.trim()) { toast.error("Please enter a target role."); return }
        setGenerating(true)
        try {
            const gapRes = await fetchWithAuth(`/career/gap-analysis?target_role=${encodeURIComponent(customRole)}`)
            if (gapRes.status === "success") setGapAnalysis(gapRes.data)

            const res = await fetchWithAuth("/career/roadmap/generate", {
                method: "POST",
                body: JSON.stringify({ target_role: customRole, current_state: currentState, timeline, daily_routine: dailyRoutine })
            })
            if (res.status === "success" && res.data) {
                setRoadmap(res.data)
                toast.success(`Generated custom AI roadmap for ${customRole}!`)
            }
        } catch (err) {
            toast.error("Failed to generate roadmap.")
        } finally {
            setGenerating(false)
        }
    }

    const handleAdvance = async () => {
        if (!roadmap) return
        const nextIndex = roadmap.current_milestone_index + 1
        if (nextIndex > roadmap.nodes_json.length) return
        try {
            const res = await fetchWithAuth("/career/roadmap/milestone", {
                method: "PATCH",
                body: JSON.stringify({ roadmap_id: roadmap.id, new_index: nextIndex })
            })
            if (res.status === "success") {
                setRoadmap({ ...roadmap, current_milestone_index: nextIndex })
                toast.success("Milestone cleared! Keep leveling up!")
            }
        } catch (err) {
            toast.error("Failed to update milestone.")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen py-32 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Booting Career OS...</p>
            </div>
        )
    }

    const tabs = [
        { id: "vision", label: "Career Vision", icon: <Target className="w-4 h-4" /> },
        { id: "roadmap", label: "AI Roadmap", icon: <Route className="w-4 h-4" /> },
        { id: "planner", label: "Daily Planner", icon: <CalendarDays className="w-4 h-4" /> },
        { id: "progress", label: "Progress", icon: <BarChart className="w-4 h-4" /> },
        { id: "coach", label: "AI Coach", icon: <MessageSquare className="w-4 h-4" /> },
    ]

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 md:px-8 max-w-[1400px] mx-auto relative overflow-hidden">
            {showOnboarding && <OnboardingWizard onComplete={handleOnboardingComplete} />}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[150px] -z-10 rounded-full" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight flex items-center gap-3">
                        CAREER OS <Sparkles className="w-8 h-8 text-primary" />
                    </h1>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">
                        Vision, Roadmap, Habits, and AI Coaching in one centralized dashboard.
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:w-64 flex-shrink-0 space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${
                                activeTab === tab.id 
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                : "hover:bg-muted text-muted-foreground"
                            }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    {activeTab === "vision" && <CareerVisionPanel />}
                    {activeTab === "planner" && <DailyPlannerPanel />}
                    {activeTab === "progress" && <ProgressPanel />}
                    {activeTab === "coach" && <AICoachPanel />}
                    
                    {activeTab === "roadmap" && (
                        <div className="space-y-10">
                            {/* Generator Panel */}
                            <div className="glass border-border/50 p-8 rounded-[2rem] space-y-6">
                                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <Compass className="w-5 h-5 text-primary" /> Define Your Career Trajectory
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Current State</label>
                                        <Input value={currentState} onChange={(e) => setCurrentState(e.target.value)} placeholder="e.g. Junior Dev, Student, Self-taught..." className="bg-muted/50 border-border text-foreground h-12 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Role</label>
                                        <Input value={customRole} onChange={(e) => setCustomRole(e.target.value)} placeholder="e.g. Senior Machine Learning Engineer" className="bg-muted/50 border-border text-foreground h-12 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Timeline Goal</label>
                                        <Input value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="e.g. 6 Months, 1 Year" className="bg-muted/50 border-border text-foreground h-12 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Daily Routine</label>
                                        <Input value={dailyRoutine} onChange={(e) => setDailyRoutine(e.target.value)} placeholder="e.g. 2 hours after work, Full-time study" className="bg-muted/50 border-border text-foreground h-12 rounded-xl" />
                                    </div>
                                </div>
                                
                                <Button onClick={handleGenerate} disabled={generating} className="h-12 px-8 rounded-xl text-xs font-bold tracking-widest uppercase gap-2 w-full">
                                    {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> SYNTHESIZING ROADMAP</> : <><Sparkles className="w-4 h-4" /> GENERATE DYNAMIC PATH</>}
                                </Button>
                            </div>

                            {/* Roadmap Timeline */}
                            {roadmap ? (
                                <div className="space-y-8 relative">
                                    <div className="absolute left-[39px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary via-primary/30 to-transparent -z-10" />

                                    <div className="pl-2">
                                        <h2 className="text-2xl font-bold text-foreground mb-2">Target Path: {roadmap.target_role}</h2>
                                        <div className="w-full bg-muted/50 h-2.5 rounded-full overflow-hidden border border-border/50 mt-4 max-w-md">
                                            <div className="bg-primary h-full transition-all duration-700" style={{ width: `${(roadmap.current_milestone_index / roadmap.nodes_json.length) * 100}%` }} />
                                        </div>
                                    </div>

                                    <div className="space-y-12">
                                        {roadmap.nodes_json.map((node: any, idx: number) => {
                                            const isCompleted = idx < roadmap.current_milestone_index
                                            const isActive = idx === roadmap.current_milestone_index
                                            
                                            return (
                                                <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="flex gap-8 items-start">
                                                    <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center border-2 z-10 transition-all flex-shrink-0 ${isCompleted ? "bg-primary/20 border-primary text-primary" : isActive ? "bg-black border-primary text-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)] animate-pulse" : "bg-muted/50 border-border/50 text-muted-foreground"}`}>
                                                        {isCompleted ? <CheckCircle2 className="w-8 h-8" /> : <Star className="w-8 h-8" />}
                                                    </div>

                                                    <div className={`flex-1 glass p-8 rounded-[2rem] border transition-all ${isActive ? "border-primary/30 bg-primary/5" : "border-border/50"}`}>
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h4 className="text-xl font-bold tracking-tight text-foreground">{node.milestone}</h4>
                                                            {isCompleted && <Badge variant="outline" className="text-emerald-400 border-emerald-500/20 text-micro">COMPLETED</Badge>}
                                                            {isActive && <Badge variant="outline" className="text-primary border-primary/20 text-micro">ACTIVE</Badge>}
                                                        </div>

                                                        <ul className="space-y-3.5 mb-6">
                                                            {node.tasks.map((task: string, taskIdx: number) => (
                                                                <li key={taskIdx} className="text-sm text-muted-foreground flex items-center gap-3">
                                                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isCompleted ? 'bg-primary' : isActive ? 'bg-primary/50' : 'bg-muted-foreground/30'}`} />
                                                                    {task}
                                                                </li>
                                                            ))}
                                                        </ul>

                                                        {isActive && (
                                                            <div className="flex justify-end">
                                                                <Button onClick={handleAdvance} className="h-10 px-5 rounded-lg text-micro font-bold tracking-widest uppercase gap-1.5">
                                                                    CLEAR MILESTONE <ChevronRight className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-24 glass rounded-[3rem] border-border/50 border-dashed max-w-md mx-auto">
                                    <Compass className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                                    <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">No active roadmap path selected.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
