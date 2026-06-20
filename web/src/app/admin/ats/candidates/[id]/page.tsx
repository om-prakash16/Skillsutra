"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWrapper } from "@/lib/fetch";
import { ArrowLeft, FileText, Sparkles, Mail, Phone, Calendar, MapPin, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CommentsThread } from "@/components/shared/CommentsThread";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function CandidateProfilePage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params?.id as string;
  
  const [parsing, setParsing] = useState(false);

  // In a full implementation, we'd fetch this candidate from `/api/v1/ats/candidates/${candidateId}`
  const mockCandidate = {
    first_name: "Jane",
    last_name: "Doe",
    email: "jane.doe@example.com",
    phone: "+1 555-0198",
    source: "LinkedIn",
    profile: {
      ai_summary: "Strong candidate with extensive frontend experience. Excellent fit for the Senior React role based on 5+ years of scaling enterprise applications.",
      skills: ["React", "TypeScript", "Next.js", "GraphQL", "Tailwind CSS"],
      experience: [
        { role: "Senior Frontend Engineer", company: "TechCorp", duration: "2021 - Present" },
        { role: "Frontend Developer", company: "StartupX", duration: "2018 - 2021" }
      ]
    }
  };

  const handleAiParse = async () => {
    setParsing(true);
    const toastId = toast.loading("AI is analyzing the resume...");
    try {
      const res = await fetchWrapper(`/ats/candidates/${candidateId}/parse-resume`, { method: "POST" });
      if (res.success) {
        toast.success("AI extraction completed", { id: toastId });
        // loadCandidate();
      } else {
        toast.error("Failed to parse resume", { id: toastId });
      }
    } catch (e) {
      toast.error("An error occurred", { id: toastId });
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 h-full flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="w-4 h-4" /></Button>
        <div className="flex-1 flex justify-between items-start">
          <div className="flex items-center gap-6">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-xl bg-primary/10 text-primary">JD</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{mockCandidate.first_name} {mockCandidate.last_name}</h1>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center"><Mail className="w-4 h-4 mr-1" /> {mockCandidate.email}</span>
                <span className="flex items-center"><Phone className="w-4 h-4 mr-1" /> {mockCandidate.phone}</span>
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> San Francisco, CA</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><FileText className="w-4 h-4 mr-2" /> View Resume</Button>
            <Button onClick={handleAiParse} disabled={parsing} className="bg-emerald-600 hover:bg-emerald-700">
              <Sparkles className="w-4 h-4 mr-2" /> {parsing ? "Parsing..." : "AI Extract"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col gap-6">
          <Card className="border-emerald-500/30 shadow-emerald-500/5 bg-emerald-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-emerald-700 text-lg">
                <Sparkles className="w-5 h-5 mr-2" /> AI Candidate Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-900/80 leading-relaxed">{mockCandidate.profile.ai_summary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills & Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-sm mb-3 text-muted-foreground">Extracted Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {mockCandidate.profile.skills.map(s => (
                    <Badge key={s} variant="secondary">{s}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-semibold text-sm text-muted-foreground">Experience History</h4>
                {mockCandidate.profile.experience.map((exp, i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{exp.role}</p>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{exp.duration}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Applied</span>
                <span className="font-medium">Oct 12, 2026</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Source</span>
                <span className="font-medium">{mockCandidate.source}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Stage</span>
                <Badge>Technical Interview</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardContent className="p-4">
              {/* REUSING THE MILESTONE 9 COLLABORATION COMPONENT! */}
              <CommentsThread entityType="ats_candidate" entityId={candidateId} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
