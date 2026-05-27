"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { fetchWithAuth } from "@/lib/api/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, BrainCircuit, Target, CheckCircle2, ArrowRight, XCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function QuizPage() {
    const { user } = useAuth();
    const [skill, setSkill] = useState("");
    const [difficulty, setDifficulty] = useState("intermediate");
    const [isGenerating, setIsGenerating] = useState(false);
    const [quizSession, setQuizSession] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleGenerate = async () => {
        if (!skill.trim()) {
            toast.error("Please enter a skill to evaluate.");
            return;
        }
        setIsGenerating(true);
        try {
            const res = await fetchWithAuth("/ai/generate", {
                method: "POST",
                body: JSON.stringify({ skill, difficulty, question_count: 5 })
            });
            if (res.status === "success") {
                setQuizSession(res.data);
                toast.success("AI Assessment generated successfully.");
            } else {
                toast.error(res.message || "Failed to generate assessment.");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred during generation.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAnswer = (questionId: string, option: string) => {
        // Extract the letter (A, B, C, D) from the option text "A) ..."
        const letter = option.charAt(0).toUpperCase();
        setAnswers(prev => ({ ...prev, [questionId]: letter }));
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < quizSession.questions.length) {
            toast.error("Please answer all questions before submitting.");
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await fetchWithAuth("/ai/evaluate", {
                method: "POST",
                body: JSON.stringify({ quiz_id: quizSession.quiz_id, answers })
            });
            if (res.status === "success") {
                setResult(res.data);
                toast.success("Assessment evaluated successfully!");
            } else {
                toast.error(res.message || "Failed to evaluate assessment.");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred during submission.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (result) {
        return (
            <div className="min-h-screen pt-28 pb-20 px-6 max-w-4xl mx-auto flex flex-col items-center">
                <Card className="glass border-white/10 w-full rounded-[2rem] shadow-2xl text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    <CardHeader className="pt-16 pb-8">
                        {result.passed ? (
                            <CheckCircle2 className="w-24 h-24 text-emerald-500 mx-auto mb-6" />
                        ) : (
                            <XCircle className="w-24 h-24 text-rose-500 mx-auto mb-6" />
                        )}
                        <CardTitle className="text-4xl font-black uppercase tracking-tight">
                            {result.passed ? "Verification Passed" : "Verification Failed"}
                        </CardTitle>
                        <CardDescription className="text-lg">
                            {result.message}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8 pb-16">
                        <div className="flex justify-center gap-12">
                            <div className="space-y-2">
                                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Final Score</p>
                                <p className={`text-5xl font-black ${result.passed ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {result.score}%
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Proof Level</p>
                                <Badge variant="outline" className={`px-4 py-2 text-sm border-white/10 ${result.passed ? 'text-primary' : 'text-muted-foreground'}`}>
                                    {result.level}
                                </Badge>
                            </div>
                        </div>
                        <div className="pt-8 flex items-center justify-center gap-4">
                            <Button variant="outline" className="h-12 px-8 rounded-xl font-bold tracking-widest uppercase text-xs border-white/10" onClick={() => { setResult(null); setQuizSession(null); setSkill(""); setAnswers({}); }}>
                                Start New Assessment
                            </Button>
                            <Link href="/user/dashboard">
                                <Button variant="premium" className="h-12 px-8 rounded-xl font-bold tracking-widest uppercase text-xs">
                                    Return to Dashboard
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (quizSession) {
        return (
            <div className="min-h-screen pt-28 pb-20 px-6 max-w-4xl mx-auto space-y-10">
                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                            <BrainCircuit className="w-8 h-8 text-primary" /> Neural Assessment
                        </h1>
                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest mt-2">
                            Skill: <span className="text-white">{quizSession.skill}</span> | Difficulty: <span className="text-white">{quizSession.difficulty}</span>
                        </p>
                    </div>
                    <Badge variant="outline" className="border-primary/20 text-primary text-xs uppercase tracking-widest px-4 py-2 bg-primary/10">
                        {quizSession.time_limit_minutes} Min Limit
                    </Badge>
                </div>

                <div className="space-y-8">
                    {quizSession.questions.map((q: any, i: number) => (
                        <Card key={q.id} className="glass border-white/5 bg-white/[0.02] rounded-2xl shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold leading-relaxed flex gap-4">
                                    <span className="text-primary/60 font-black">{i + 1}.</span> {q.text}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {q.options.map((opt: string, j: number) => {
                                    const letter = opt.charAt(0).toUpperCase();
                                    const isSelected = answers[q.id] === letter;
                                    return (
                                        <button
                                            key={j}
                                            onClick={() => handleAnswer(q.id, opt)}
                                            className={`w-full text-left p-4 rounded-xl border transition-all text-sm font-medium flex items-center gap-3
                                                ${isSelected ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_hsl(var(--primary)/0.2)]' : 'bg-black/40 border-white/5 text-muted-foreground hover:bg-white/5 hover:text-white'}
                                            `}
                                        >
                                            <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black border ${isSelected ? 'bg-primary text-white border-primary' : 'bg-white/5 border-white/10'}`}>
                                                {letter}
                                            </div>
                                            {opt.substring(3)}
                                        </button>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex justify-end pt-4">
                    <Button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        variant="premium"
                        className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest shadow-2xl"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Verifying Logic...</>
                        ) : (
                            <>Submit Assessment <ArrowRight className="ml-3 w-5 h-5" /></>
                        )}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center relative overflow-hidden bg-background">
            <div className="absolute top-[20%] right-[10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full pointer-events-none opacity-40" />

            <div className="text-center max-w-3xl mb-16 relative z-10 space-y-6">
                <h1 className="text-5xl md:text-7xl font-black font-heading tracking-tighter uppercase leading-none">
                    Prove Your <span className="text-primary italic">Expertise</span>
                </h1>
                <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                    Generate an AI-powered assessment tailored to any skill. Complete the challenge to instantly boost your Proof Score and stand out to recruiters.
                </p>
            </div>

            <Card className="w-full max-w-xl glass border-white/10 rounded-[2rem] shadow-2xl relative z-10 p-8 md:p-12 text-center flex flex-col items-center">
                <Target className="w-16 h-16 text-primary/50 mb-8" />
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Initiate Assessment</h3>
                <p className="text-sm text-muted-foreground mb-8">Enter the exact skill you wish to verify.</p>

                <div className="w-full space-y-6">
                    <div className="space-y-2 text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Target Skill</label>
                        <Input 
                            value={skill}
                            onChange={(e) => setSkill(e.target.value)}
                            placeholder="e.g., React, Python, System Design"
                            className="h-14 bg-black/50 border-white/10 text-center text-lg font-bold rounded-2xl focus-visible:ring-1 focus-visible:ring-primary/50"
                        />
                    </div>

                    <div className="space-y-2 text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Difficulty Curve</label>
                        <div className="flex gap-2 p-1 bg-black/50 border border-white/5 rounded-2xl">
                            {["beginner", "intermediate", "advanced"].map(lvl => (
                                <button
                                    key={lvl}
                                    onClick={() => setDifficulty(lvl)}
                                    className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                                        difficulty === lvl ? 'bg-primary/20 text-primary border border-primary/30 shadow-inner' : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    {lvl}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button 
                        onClick={handleGenerate}
                        disabled={isGenerating || !skill.trim()}
                        variant="premium"
                        className="w-full h-16 rounded-2xl font-black uppercase tracking-widest shadow-2xl mt-4"
                    >
                        {isGenerating ? (
                            <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Synthesizing Test...</>
                        ) : (
                            <>Generate Assessment <ArrowRight className="ml-3 w-5 h-5" /></>
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
