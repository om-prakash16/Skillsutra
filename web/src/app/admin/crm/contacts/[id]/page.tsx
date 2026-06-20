"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWrapper } from "@/lib/fetch";
import { ArrowLeft, Mail, MessageSquare, Briefcase, FileText, Globe, Calendar, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function CRMContactTimelinePage() {
  const params = useParams();
  const router = useRouter();
  const contactId = params.id as string;
  
  const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
    // In production, fetch from `/crm/contacts/${contactId}/timeline`
    // Mocking the unified timeline for the demo:
    setTimeline([
      { type: "ats_applied", title: "Applied for Senior Frontend Engineer", date: "Today, 10:42 AM", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-100" },
      { type: "email_clicked", title: "Clicked link in 'Q3 Engineering Outreach' campaign", date: "Yesterday, 2:15 PM", icon: Globe, color: "text-indigo-500", bg: "bg-indigo-100" },
      { type: "email_opened", title: "Opened 'Q3 Engineering Outreach' campaign", date: "Yesterday, 1:30 PM", icon: Mail, color: "text-indigo-500", bg: "bg-indigo-100" },
      { type: "ai_enriched", title: "AI Profile Enrichment completed", date: "Oct 12, 2026", icon: Bot, color: "text-emerald-500", bg: "bg-emerald-100" },
      { type: "form_submitted", title: "Joined Talent Community: React Engineers", date: "Oct 10, 2026", icon: FileText, color: "text-purple-500", bg: "bg-purple-100" },
    ]);
  }, [contactId]);

  return (
    <div className="max-w-4xl mx-auto p-8 h-full flex flex-col gap-6">
      <div className="flex items-center gap-4 border-b pb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="w-4 h-4" /></Button>
        <Avatar className="w-16 h-16">
          <AvatarFallback className="text-xl bg-indigo-100 text-indigo-700">AS</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Alex Smith</h1>
            <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">Passive Talent</Badge>
          </div>
          <p className="text-muted-foreground mt-1">alex.smith@example.com • +1 555-0199</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Engagement Score</p>
          <p className="text-3xl font-bold text-emerald-600">92%</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <Card className="shadow-sm border-0 bg-transparent">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Unified Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="relative border-l-2 border-muted ml-4 space-y-8 pb-4">
                {timeline.map((event, i) => (
                  <div key={i} className="relative pl-8">
                    <div className={`absolute -left-3.5 top-1 p-1.5 rounded-full ring-4 ring-background ${event.bg}`}>
                      <event.icon className={`w-4 h-4 ${event.color}`} />
                    </div>
                    <div>
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <Calendar className="w-3 h-3 mr-1" /> {event.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Talent Communities</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge variant="secondary">React Engineers</Badge>
              <Badge variant="secondary">Bay Area Tech</Badge>
              <Badge variant="secondary">Silver Medalists</Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex items-start gap-3">
                <Bot className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-900 leading-relaxed">
                  Highly likely to respond to <strong>Senior Frontend</strong> roles in <strong>San Francisco</strong>. Recommended contact channel: <strong>Email</strong>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
