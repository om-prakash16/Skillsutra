"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWrapper } from "@/lib/fetch";
import { ArrowLeft, PlayCircle, CheckCircle2, ShieldCheck, Trophy, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export default function CoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [activeTab, setActiveTab] = useState<"video" | "assessment">("video");
  const [assessmentScore, setAssessmentScore] = useState<number | null>(null);

  const handleTakeAssessment = () => {
    setActiveTab("assessment");
  };

  const handleSubmitAssessment = async () => {
    const toastId = toast.loading("Evaluating your answers via AI...");
    try {
      // We pass a mock score for the demo. In reality, we'd send the answers to the API to be graded.
      // E.g. passing an assessment automatically writes "Verified Skill" to the Identity Graph.
      const res = await fetchWrapper(`/learning/assessments/mock-assessment-id/submit`, {
        method: "POST",
        body: JSON.stringify({ score: 85.0 })
      });
      if (res.success && res.passed) {
        toast.success("Assessment Passed! Identity Graph updated.", { id: toastId });
        setAssessmentScore(res.score);
      } else {
        toast.error("Assessment Failed. Please try again.", { id: toastId });
      }
    } catch (e) {
      toast.error("Failed to submit assessment", { id: toastId });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 h-full flex gap-8">
      
      {/* Sidebar: Curriculum */}
      <div className="w-80 flex flex-col gap-6 shrink-0">
        <div>
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Catalog
          </Button>
          <h2 className="text-xl font-bold">Course Curriculum</h2>
          <div className="mt-4 space-y-1">
            <p className="text-sm font-medium mb-1 flex justify-between">
              Progress <span>75%</span>
            </p>
            <Progress value={75} className="h-2" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Module 1: Foundations</div>
          <button onClick={() => setActiveTab("video")} className={`w-full text-left p-3 rounded-md flex items-center justify-between text-sm ${activeTab === 'video' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-muted'}`}>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Intro to Architecture</span>
            <span className="text-xs text-muted-foreground">12m</span>
          </button>
          <button className={`w-full text-left p-3 rounded-md flex items-center justify-between text-sm hover:bg-muted`}>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> State Management</span>
            <span className="text-xs text-muted-foreground">24m</span>
          </button>

          <div className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3 mt-6">Module 2: Validation</div>
          <button onClick={() => setActiveTab("assessment")} className={`w-full text-left p-3 rounded-md flex items-center justify-between text-sm ${activeTab === 'assessment' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-muted'}`}>
            <span className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-muted-foreground" /> Final Assessment</span>
            <span className="text-xs text-muted-foreground">30m</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {activeTab === "video" && (
          <div className="flex flex-col gap-6">
            <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center relative overflow-hidden group">
              <PlayCircle className="w-20 h-20 text-white/50 group-hover:text-white transition-colors cursor-pointer" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between text-white text-sm">
                <span>00:00 / 12:45</span>
                <span>HD</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Introduction to Architecture</h1>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                In this lesson, we cover the basics of modern system design and how it applies to frontend React applications. 
                By the end of this module, you will understand container/presentational patterns, context boundaries, and custom hooks.
              </p>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleTakeAssessment} className="bg-indigo-600 hover:bg-indigo-700">Next: Final Assessment</Button>
            </div>
          </div>
        )}

        {activeTab === "assessment" && (
          <div className="flex flex-col gap-6">
            {assessmentScore ? (
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <Trophy className="w-24 h-24 text-emerald-500 mb-6" />
                  <h2 className="text-3xl font-bold text-emerald-900 mb-2">Congratulations!</h2>
                  <p className="text-emerald-800 text-lg mb-6">You passed the assessment with a score of {assessmentScore}%.</p>
                  
                  <div className="bg-white p-4 rounded-lg border border-emerald-100 shadow-sm flex items-center gap-4">
                    <ShieldCheck className="w-8 h-8 text-emerald-500" />
                    <div className="text-left">
                      <p className="font-bold text-gray-900">Skill Verified</p>
                      <p className="text-sm text-gray-500">React Architecture has been automatically added to your Talent Identity.</p>
                    </div>
                  </div>
                  
                  <Button className="mt-8" onClick={() => router.push("/admin/talent/skills")}>View My Skills Graph</Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Final Assessment: Architecture</CardTitle>
                  <p className="text-muted-foreground">You must score 70% or higher to verify this skill on your Talent Profile.</p>
                </CardHeader>
                <CardContent className="space-y-8">
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">1. Which pattern is best for separating data-fetching logic from UI rendering?</h3>
                    <div className="space-y-2 pl-4">
                      <label className="flex items-center gap-3 p-3 border rounded-md hover:bg-muted cursor-pointer">
                        <input type="radio" name="q1" className="w-4 h-4 text-indigo-600" /> Higher-Order Components
                      </label>
                      <label className="flex items-center gap-3 p-3 border rounded-md hover:bg-muted cursor-pointer">
                        <input type="radio" name="q1" className="w-4 h-4 text-indigo-600" /> Container/Presentational Pattern
                      </label>
                      <label className="flex items-center gap-3 p-3 border rounded-md hover:bg-muted cursor-pointer">
                        <input type="radio" name="q1" className="w-4 h-4 text-indigo-600" /> Context API
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">2. Write a custom React hook that manages a toggle state.</h3>
                    <textarea 
                      className="w-full h-40 p-4 border rounded-md font-mono text-sm bg-slate-50"
                      placeholder="function useToggle(initial = false) { ... }"
                    ></textarea>
                    <p className="text-xs text-muted-foreground">This answer will be automatically graded by the AI Assessment Engine.</p>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button size="lg" onClick={handleSubmitAssessment} className="bg-indigo-600 hover:bg-indigo-700">
                      Submit Assessment for AI Evaluation
                    </Button>
                  </div>

                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
