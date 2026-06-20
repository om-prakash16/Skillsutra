"use client";

import { useState, useEffect } from "react";
import { fetchWrapper } from "@/lib/fetch";
import { User, Briefcase, GraduationCap, Link as LinkIcon, Camera, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TalentProfileEditor() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [newExp, setNewExp] = useState({ company: "", role: "", start_date: "", description: "" });
  const [showExpForm, setShowExpForm] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await fetchWrapper(`/talent/profile`);
      if (res.success) {
        setProfile(res.data);
      }
    } catch (e) {
      toast.error("Failed to load talent profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddExperience = async () => {
    if (!newExp.company || !newExp.role || !newExp.start_date) {
      toast.error("Please fill required fields (Company, Role, Start Date)");
      return;
    }
    const toastId = toast.loading("Saving experience...");
    try {
      const res = await fetchWrapper(`/talent/profile/experience`, {
        method: "PUT",
        body: JSON.stringify(newExp)
      });
      if (res.success) {
        toast.success("Experience added!", { id: toastId });
        setShowExpForm(false);
        setNewExp({ company: "", role: "", start_date: "", description: "" });
        loadProfile();
      }
    } catch (e) {
      toast.error("Failed to save experience", { id: toastId });
    }
  };

  if (loading) return <div className="p-8">Loading Profile...</div>;
  if (!profile) return <div className="p-8">Failed to initialize profile.</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 h-full flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Talent Profile</h1>
        <p className="text-muted-foreground mt-1">This canonical identity represents you across ATS, CRM, and the Public Portfolio.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-8">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-32 h-32 ring-4 ring-muted">
                <AvatarFallback className="text-3xl bg-indigo-100 text-indigo-700">ME</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="w-full">
                <Camera className="w-4 h-4 mr-2" /> Upload
              </Button>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Public Username (URL Slug)</label>
                  <Input defaultValue={profile.username} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input defaultValue={profile.location || ""} placeholder="e.g. San Francisco, CA" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Professional Headline</label>
                <Input defaultValue={profile.headline} placeholder="e.g. Senior Full-Stack Engineer" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <Textarea defaultValue={profile.bio} placeholder="Write a short summary..." className="min-h-[100px]" />
              </div>
              <Button className="bg-indigo-600 hover:bg-indigo-700">Save Identity Info</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5" /> Experience</CardTitle>
            <CardDescription>Your verified employment history.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowExpForm(!showExpForm)}>
            {showExpForm ? "Cancel" : <><Plus className="w-4 h-4 mr-1"/> Add Role</>}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {showExpForm && (
            <div className="bg-muted/30 p-4 rounded-lg border space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Company Name" value={newExp.company} onChange={e => setNewExp({...newExp, company: e.target.value})} />
                <Input placeholder="Role (e.g. Lead Engineer)" value={newExp.role} onChange={e => setNewExp({...newExp, role: e.target.value})} />
                <Input type="date" placeholder="Start Date" value={newExp.start_date} onChange={e => setNewExp({...newExp, start_date: e.target.value})} />
              </div>
              <Textarea placeholder="Description of responsibilities..." value={newExp.description} onChange={e => setNewExp({...newExp, description: e.target.value})} />
              <Button onClick={handleAddExperience} className="w-full">Save Experience</Button>
            </div>
          )}

          {profile.experiences.length === 0 && !showExpForm && (
            <p className="text-sm text-muted-foreground italic">No experience recorded yet.</p>
          )}

          {profile.experiences.map((exp: any, i: number) => (
            <div key={i} className="flex gap-4 border-b last:border-0 pb-4 last:pb-0">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-md flex items-center justify-center shrink-0 border border-indigo-100">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">{exp.role}</h4>
                <p className="text-indigo-600 font-medium">{exp.company}</p>
                <p className="text-sm text-muted-foreground mt-1">Started: {new Date(exp.start_date).toLocaleDateString()}</p>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto text-destructive hover:text-destructive/90 hover:bg-destructive/10">
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Education Block omitted for brevity, follows same pattern as Experience */}
    </div>
  );
}
