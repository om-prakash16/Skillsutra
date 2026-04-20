'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from "@/lib/utils";
import { 
  Sparkles, 
  User, 
  MapPin, 
  Briefcase, 
  Github, 
  Code2, 
  Save,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  GraduationCap,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface DynamicProfileFormProps {
    initialData?: any;
}

export function DynamicProfileForm({ initialData }: DynamicProfileFormProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    bio: initialData?.bio || '',
    primaryRole: initialData?.primaryRole || '',
    skills: initialData?.skills || '',
    experience: initialData?.experience || [{ id: '1', company: '', role: '', type: 'Full-time', startDate: '', endDate: '', description: '' }],
    education: initialData?.education || [{ id: '1', institution: '', degree: '', year: '', grade: '' }]
  });

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { id: Math.random().toString(), company: '', role: '', type: 'Full-time', startDate: '', endDate: '', description: '' }]
    });
  };

  const removeExperience = (id: string) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((exp: any) => exp.id !== id)
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { id: Math.random().toString(), institution: '', degree: '', year: '', grade: '' }]
    });
  };

  const removeEducation = (id: string) => {
    setFormData({
      ...formData,
      education: formData.education.filter((edu: any) => edu.id !== id)
    });
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp: any) => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu: any) => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const handleUpdate = async () => {
      try {
          const token = localStorage.getItem("auth_token");
          const res = await fetch(`${API}/users/update`, {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  ...(token ? { Authorization: `Bearer ${token}` } : {})
              },
              body: JSON.stringify(formData)
          });
          
          if (!res.ok) throw new Error("Update failed");
          
          toast.success("Profile fully updated and synchronized!");
      } catch (err) {
          console.error(err);
          toast.error("Failed to save changes. Please check your connection.");
      }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
         <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
                <div 
                  key={s} 
                  className={`h-1 w-12 rounded-full transition-all ${s <= step ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]' : 'bg-muted'}`} 
                />
            ))}
         </div>
         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Step {step} of 5</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={step}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
           transition={{ duration: 0.3 }}
        >
          {step === 1 && (
            <div className="space-y-6">
               <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" /> Identity & Bio
                  </h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">How the platform sees you professionally.</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label>First Name</Label>
                     <Input 
                        value={formData.firstName}
                        onChange={(e) => updateFormData('firstName', e.target.value)}
                        placeholder="Enter first name" 
                        className="bg-background/50 border-primary/10" 
                     />
                  </div>
                  <div className="space-y-2">
                     <Label>Last Name</Label>
                     <Input 
                        value={formData.lastName}
                        onChange={(e) => updateFormData('lastName', e.target.value)}
                        placeholder="Enter last name" 
                        className="bg-background/50 border-primary/10" 
                     />
                  </div>
               </div>
               <div className="space-y-2">
                  <Label>Professional Bio</Label>
                  <Textarea 
                     value={formData.bio}
                     onChange={(e) => updateFormData('bio', e.target.value)}
                     placeholder="Describe your technical journey..." 
                     className="h-32 bg-background/50 border-primary/10" 
                  />
               </div>
            </div>
          )}

          {step === 2 && (
             <div className="space-y-6">
               <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" /> Technical Stack
                  </h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Powering our resonance matching algorithms.</p>
               </div>
               <div className="space-y-2">
                  <Label>Primary Role</Label>
                  <Input 
                    value={formData.primaryRole}
                    onChange={(e) => updateFormData('primaryRole', e.target.value)}
                    placeholder="e.g. Lead Frontend Engineer" 
                    className="bg-background/50 border-primary/10" 
                  />
               </div>
               <div className="space-y-2">
                  <Label>Core Skills (CSV)</Label>
                  <Input 
                    value={formData.skills}
                    onChange={(e) => updateFormData('skills', e.target.value)}
                    placeholder="React, Rust, Anchor, Next.js" 
                    className="bg-background/50 border-primary/10" 
                  />
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                            <History className="w-5 h-5 text-primary" /> Work Experience
                        </h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">Your professional milestones.</p>
                    </div>
                </div>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                    {formData.experience.map((exp: any) => (
                        <div key={exp.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-4 relative group">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase">Company</Label>
                                    <Input 
                                        value={exp.company}
                                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                        placeholder="e.g. DeFi Labs" 
                                        className="bg-background/50 h-9 border-white/5" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase">Role</Label>
                                    <Input 
                                        value={exp.role}
                                        onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                                        placeholder="e.g. Senior Dev" 
                                        className="bg-background/50 h-9 border-white/5" 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <Input 
                                    value={exp.type}
                                    onChange={(e) => updateExperience(exp.id, 'type', e.target.value)}
                                    placeholder="Type" 
                                    className="bg-background/50 h-8 text-xs border-white/5" 
                                />
                                <Input 
                                    value={exp.startDate}
                                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                    placeholder="Start" 
                                    className="bg-background/50 h-8 text-xs border-white/5" 
                                />
                                <Input 
                                    value={exp.endDate}
                                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                    placeholder="End" 
                                    className="bg-background/50 h-8 text-xs border-white/5" 
                                />
                            </div>
                            <Textarea 
                                value={exp.description}
                                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                placeholder="Key achievements..." 
                                className="bg-background/50 text-xs h-20 border-white/5" 
                            />
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeExperience(exp.id)}
                                className="absolute top-2 right-2 h-7 w-7 text-destructive/50 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    ))}
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={addExperience}
                        className="w-full border-dashed border-primary/20 hover:border-primary/50 bg-transparent text-primary/60 outline-none"
                    >
                        <Plus className="w-3 h-3 mr-2" /> Add Position
                    </Button>
                </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
                <div className="space-y-2">
                    <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-primary" /> Education
                    </h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Academic background & Certifications.</p>
                </div>
                
                <div className="space-y-4">
                    {formData.education.map((edu: any) => (
                        <div key={edu.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-4 relative group">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase">Institution</Label>
                                    <Input 
                                        value={edu.institution}
                                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                        placeholder="University of X" 
                                        className="bg-background/50 h-9 border-white/5" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase">Degree</Label>
                                    <Input 
                                        value={edu.degree}
                                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                        placeholder="BSc Computer Science" 
                                        className="bg-background/50 h-9 border-white/5" 
                                    />
                                </div>
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <Input 
                                    value={edu.year}
                                    onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                                    placeholder="Year" 
                                    className="bg-background/50 h-8 text-xs border-white/5" 
                                />
                                <Input 
                                    value={edu.grade}
                                    onChange={(e) => updateEducation(edu.id, 'grade', e.target.value)}
                                    placeholder="Grade/GPA" 
                                    className="bg-background/50 h-8 text-xs border-white/5" 
                                />
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeEducation(edu.id)}
                                className="absolute top-2 right-2 h-7 w-7 text-destructive/50 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    ))}
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={addEducation}
                        className="w-full border-dashed border-primary/20 hover:border-primary/50 bg-transparent text-primary/60 outline-none"
                    >
                        <Plus className="w-3 h-3 mr-2" /> Add Education
                    </Button>
                </div>
            </div>
          )}

          {step === 5 && (
             <div className="space-y-6">
                <div className="space-y-4 text-center py-10">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]">
                        <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight font-heading">Ready for Verification</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                        Your profile data is encrypted and indexed for specialized search discovery and blockchain anchoring.
                    </p>
                </div>
             </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between pt-8 border-t border-primary/5">
         <Button 
            variant="ghost" 
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="font-black uppercase text-[10px] tracking-widest"
         >
            <ArrowLeft className="w-3 h-3 mr-2" /> back
         </Button>
         
         {step < totalSteps ? (
            <Button 
               onClick={() => setStep(s => Math.min(totalSteps, s + 1))}
               className="bg-primary/10 hover:bg-primary/20 text-primary font-black uppercase text-[10px] tracking-widest rounded-xl px-10 h-11 border border-primary/20"
            >
               Continue <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
         ) : (
            <Button 
              onClick={handleUpdate}
              className="bg-primary hover:bg-primary/90 font-black uppercase text-[10px] tracking-widest rounded-xl px-12 h-11 shadow-lg shadow-primary/20"
            >
               Complete Profile <Save className="w-3 h-3 ml-2" />
            </Button>
         )}
      </div>
    </div>
  );
}
