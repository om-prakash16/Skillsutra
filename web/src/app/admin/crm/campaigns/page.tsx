"use client";

import { useState } from "react";
import { fetchWrapper } from "@/lib/fetch";
import { Mail, MessageSquare, Send, Users, Activity, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function CRMCampaignsPage() {
  const [drafting, setDrafting] = useState(false);
  const [formData, setFormData] = useState({ name: "", subject: "", body: "" });

  const handleLaunch = async () => {
    const toastId = toast.loading("Launching campaign...");
    try {
      const res = await fetchWrapper(`/crm/campaigns`, {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          subject_template: formData.subject,
          body_template: formData.body,
          type: "email"
        })
      });
      if (res.success) {
        toast.success("Campaign launched and added to Workflow Queue!", { id: toastId });
        setDrafting(false);
      }
    } catch (e) {
      toast.error("Failed to launch campaign", { id: toastId });
    }
  };

  return (
    <div className="p-8 h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Talent Campaigns</h1>
          <p className="text-muted-foreground">Proactively nurture your passive talent pools.</p>
        </div>
        <Button onClick={() => setDrafting(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" /> New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14,205</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Converted to ATS</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">342</div>
          </CardContent>
        </Card>
      </div>

      {drafting ? (
        <Card className="border-indigo-200 shadow-sm">
          <CardHeader>
            <CardTitle>Draft New Campaign</CardTitle>
            <CardDescription>Compose your outreach. Use {"{{first_name}}"} for personalization.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              placeholder="Campaign Name (e.g. Q3 Engineering Outreach)" 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
            />
            <Input 
              placeholder="Subject Line" 
              value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} 
            />
            <Textarea 
              placeholder="Hi {{first_name}},\n\nWe have a new opening..." 
              className="min-h-[200px]"
              value={formData.body} onChange={e => setFormData({...formData, body: e.target.value})} 
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDrafting(false)}>Cancel</Button>
              <Button onClick={handleLaunch} className="bg-indigo-600 hover:bg-indigo-700">
                <Send className="w-4 h-4 mr-2" /> Launch via Workflow Engine
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Senior React Engineers (Bay Area)", sent: 450, opens: "52%", clicks: "12%", status: "Active" },
                { name: "Campus Interns 2026", sent: 1200, opens: "68%", clicks: "24%", status: "Completed" },
                { name: "Data Science Newsletter", sent: 320, opens: "41%", clicks: "8%", status: "Active" }
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-indigo-500" /> {c.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">Sent to {c.sent} contacts</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Opens</p>
                      <p className="font-semibold">{c.opens}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Clicks</p>
                      <p className="font-semibold">{c.clicks}</p>
                    </div>
                    <Badge variant={c.status === "Active" ? "default" : "secondary"}>{c.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
