"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Github, Loader2, Wand2, CheckCircle2, ArrowRight } from "lucide-react";
import { userApi } from "@/lib/api/user-api";
import { motion, AnimatePresence } from "framer-motion";

export const GitHubSyncWizard: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleAnalyze = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const res = await userApi.projects.analyzeGitHub(url);
      setAnalysis(res);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    setLoading(true);
    try {
      // Mocked import flow
      await userApi.projects.create({
        title: url.split("/").pop() || "GitHub Project",
        description: analysis?.description || "Imported from GitHub",
        role: "Contributor",
        github_url: url,
        stack: analysis?.suggested_skills || [],
        start_date: new Date().toISOString(),
      });
      setConfirmed(true);
      setTimeout(() => {
        onSuccess();
        setAnalysis(null);
        setUrl("");
        setConfirmed(false);
      }, 2000);
    } catch (error) {
      console.error("Import failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-background/40 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Github className="h-32 w-32" />
      </div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5" />
          GitHub Proof-of-Work Sync
        </CardTitle>
        <CardDescription>
          Instantly import repositories and map them to your Skill Graph.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analysis ? (
          <div className="flex gap-2">
            <Input
              placeholder="Paste GitHub Repository URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-primary/5 border-primary/10"
            />
            <Button onClick={handleAnalyze} disabled={loading || !url}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analyze"}
            </Button>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4 pt-2"
            >
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <h4 className="font-bold text-sm mb-1">AI Detected Skills:</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {analysis.suggested_skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <h4 className="font-bold text-sm mb-1">Generated Summary:</h4>
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  "{analysis.description}"
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setAnalysis(null)}>
                  Cancel
                </Button>
                <Button className="flex-1 gap-2" onClick={handleImport} disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : confirmed ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Imported!
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      Mint Proof
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-2">
          <div className="h-1 w-1 rounded-full bg-green-500" />
          <span>Verifying via GitHub API</span>
          <ArrowRight className="h-2 w-2" />
          <span>Generating Proof Score</span>
        </div>
      </CardContent>
    </Card>
  );
};
