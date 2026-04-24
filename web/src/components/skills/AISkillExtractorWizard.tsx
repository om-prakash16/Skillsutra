"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { userApi } from "@/lib/api/user-api";

interface ExtractedSkill {
  skill_name: string;
  category: string;
  proficiency_estimate: string;
  confidence: number;
  evidence: string;
  matched_taxonomy_id?: string;
  taxonomy_name?: string;
  selected?: boolean;
}

type WizardStep = "input" | "processing" | "review" | "done";

export default function AISkillExtractorWizard({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<WizardStep>("input");
  const [mode, setMode] = useState<"resume" | "github">("resume");
  const [resumeText, setResumeText] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [extractedSkills, setExtractedSkills] = useState<ExtractedSkill[]>([]);
  const [processingLogs, setProcessingLogs] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const simulateProcessing = useCallback((logs: string[], callback: () => void) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setProcessingLogs((prev) => [...prev, logs[i]]);
        i++;
      } else {
        clearInterval(interval);
        callback();
      }
    }, 400);
  }, []);

  const handleExtract = useCallback(async () => {
    setStep("processing");
    setProcessingLogs([]);

    const logs = mode === "resume"
      ? [
          "> INITIALIZING AI SKILL EXTRACTION ENGINE...",
          "> LOADING GEMINI 1.5 PRO MODEL...",
          "> PARSING RESUME CONTENT...",
          "> TOKENIZING DOCUMENT STRUCTURE...",
          "> RUNNING NLP ENTITY RECOGNITION...",
          "> CROSS-REFERENCING SKILL TAXONOMY...",
          "> CALCULATING CONFIDENCE SCORES...",
          "> EXTRACTION COMPLETE ✓",
        ]
      : [
          "> CONNECTING TO GITHUB API...",
          `> FETCHING REPOS FOR @${githubUsername}...`,
          "> ANALYZING REPOSITORY LANGUAGES...",
          "> PARSING PROJECT DESCRIPTIONS...",
          "> LOADING GEMINI 1.5 PRO MODEL...",
          "> INFERRING SKILL PROFICIENCY FROM COMMIT PATTERNS...",
          "> CROSS-REFERENCING SKILL TAXONOMY...",
          "> GITHUB ANALYSIS COMPLETE ✓",
        ];

    simulateProcessing(logs, async () => {
      try {
        const res = mode === "resume"
          ? await userApi.skillGraph.extractFromResume(resumeText)
          : await userApi.skillGraph.extractFromGitHub(githubUsername);

        const skills = (res?.extracted_skills || []).map((s: ExtractedSkill) => ({
          ...s,
          selected: (s.confidence || 0) >= 0.5,
        }));
        setExtractedSkills(skills);
        setStep("review");
      } catch (e) {
        setProcessingLogs((prev) => [...prev, "> ERROR: Extraction failed. Please try again."]);
        setTimeout(() => setStep("input"), 2000);
      }
    });
  }, [mode, resumeText, githubUsername, simulateProcessing]);

  const handleConfirm = useCallback(async () => {
    setIsSubmitting(true);
    const confirmed = extractedSkills
      .filter((s) => s.selected && s.matched_taxonomy_id)
      .map((s) => ({
        matched_taxonomy_id: s.matched_taxonomy_id,
        proficiency_estimate: s.proficiency_estimate,
        confidence: s.confidence,
      }));

    try {
      await userApi.skillGraph.confirmExtracted(confirmed);
      setStep("done");
      setTimeout(() => onComplete(), 1500);
    } catch (e) {
      console.error("Failed to confirm skills:", e);
    }
    setIsSubmitting(false);
  }, [extractedSkills, onComplete]);

  const toggleSkill = (index: number) => {
    setExtractedSkills((prev) =>
      prev.map((s, i) => (i === index ? { ...s, selected: !s.selected } : s))
    );
  };

  const confidenceColor = (c: number) =>
    c >= 0.8 ? "text-green-400" : c >= 0.5 ? "text-amber-400" : "text-red-400";

  return (
    <Card className="border-white/5 bg-zinc-950/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <span className="text-cyan-400">⚡</span> AI Skill Extractor
          <Badge variant="outline" className="text-[10px] font-mono">
            {step === "input" ? "READY" : step === "processing" ? "SCANNING" : step === "review" ? "REVIEW" : "DONE"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Step 1: Input */}
        {step === "input" && (
          <>
            <div className="flex gap-2">
              <Button
                variant={mode === "resume" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("resume")}
                className="text-xs"
              >
                📄 Resume Text
              </Button>
              <Button
                variant={mode === "github" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("github")}
                className="text-xs"
              >
                🐙 GitHub Profile
              </Button>
            </div>

            {mode === "resume" ? (
              <Textarea
                placeholder="Paste your resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={6}
                className="bg-zinc-900/50 border-white/10 text-sm font-mono"
              />
            ) : (
              <Input
                placeholder="GitHub username (e.g., torvalds)"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                className="bg-zinc-900/50 border-white/10"
              />
            )}

            <Button
              onClick={handleExtract}
              disabled={(mode === "resume" && !resumeText.trim()) || (mode === "github" && !githubUsername.trim())}
              className="w-full"
            >
              Extract Skills with AI
            </Button>
          </>
        )}

        {/* Step 2: Processing Terminal */}
        {step === "processing" && (
          <div className="bg-black rounded-lg p-4 font-mono text-xs space-y-1 min-h-[200px] border border-cyan-500/20">
            {processingLogs.map((log, i) => (
              <div key={i} className={`${log.includes("✓") ? "text-green-400" : log.includes("ERROR") ? "text-red-400" : "text-cyan-400"} animate-[fadeIn_0.3s_ease-in]`}>
                {log}
              </div>
            ))}
            {!processingLogs.some((l) => l.includes("✓") || l.includes("ERROR")) && (
              <div className="text-cyan-400 animate-pulse">▌</div>
            )}
          </div>
        )}

        {/* Step 3: Review */}
        {step === "review" && (
          <>
            <p className="text-sm text-zinc-400">
              Found <span className="text-white font-semibold">{extractedSkills.length}</span> skills.
              Select which to add to your graph:
            </p>
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {extractedSkills.map((skill, i) => (
                <button
                  key={i}
                  onClick={() => toggleSkill(i)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    skill.selected
                      ? "border-cyan-500/30 bg-cyan-500/5"
                      : "border-white/5 bg-zinc-900/30 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-base ${skill.selected ? "text-cyan-400" : "text-zinc-600"}`}>
                        {skill.selected ? "☑" : "☐"}
                      </span>
                      <span className="font-medium text-sm">{skill.taxonomy_name || skill.skill_name}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {skill.category}
                      </Badge>
                    </div>
                    <span className={`text-xs font-mono ${confidenceColor(skill.confidence)}`}>
                      {(skill.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Progress value={skill.confidence * 100} className="h-1 flex-1" />
                    <span className="text-[10px] text-zinc-500 capitalize">{skill.proficiency_estimate}</span>
                  </div>
                  {skill.evidence && (
                    <p className="text-[11px] text-zinc-600 mt-1 truncate">{skill.evidence}</p>
                  )}
                  {!skill.matched_taxonomy_id && (
                    <p className="text-[10px] text-amber-500 mt-1">⚠ Not found in taxonomy — won&apos;t be saved</p>
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setStep("input")} className="flex-1">
                ← Back
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isSubmitting || !extractedSkills.some((s) => s.selected && s.matched_taxonomy_id)}
                className="flex-1"
              >
                {isSubmitting ? "Saving..." : `Confirm ${extractedSkills.filter((s) => s.selected && s.matched_taxonomy_id).length} Skills`}
              </Button>
            </div>
          </>
        )}

        {/* Step 4: Done */}
        {step === "done" && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-sm text-zinc-400">Skills added to your graph successfully!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
