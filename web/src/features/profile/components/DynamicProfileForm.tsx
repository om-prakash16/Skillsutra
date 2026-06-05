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

import { userApi } from '@/lib/api/user-api';

const PLATFORM_CATEGORIES = [
  {
    field: "Software Development",
    platforms: ["GitHub", "LeetCode", "HackerRank", "Codeforces", "CodeChef", "HackerEarth", "Stack Overflow", "GitLab", "CodePen", "Personal Portfolio"]
  },
  {
    field: "Mobile & Cloud",
    platforms: ["Play Store", "App Store", "Docker Hub"]
  },
  {
    field: "AI & Data",
    platforms: ["Kaggle", "Google Colab", "Hugging Face"]
  },
  {
    field: "Cybersecurity",
    platforms: ["Hack The Box", "TryHackMe", "Bugcrowd", "HackerOne"]
  },
  {
    field: "Design & Video",
    platforms: ["Figma", "Behance", "Dribbble", "Adobe Portfolio", "Pinterest", "Vimeo", "YouTube"]
  },
  {
    field: "3D & Game Art",
    platforms: ["ArtStation", "Sketchfab"]
  },
  {
    field: "Writing & Content",
    platforms: ["Medium", "Substack", "Personal Blog"]
  },
  {
    field: "Product & Research",
    platforms: ["LinkedIn", "Notion", "Google Scholar", "ResearchGate", "ORCID"]
  }
];

export interface DynamicProfileFormProps {
    initialData?: any;
}

export function DynamicProfileForm({ initialData }: DynamicProfileFormProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    bio: initialData?.bio || '',
    primaryRole: initialData?.primaryRole || '',
    skills: initialData?.skills || '',
    experience: initialData?.experience || [{ id: '1', company: '', role: '', type: 'Full-time', startDate: '', endDate: '', description: '' }],
    education: initialData?.education || [{ id: '1', institution: '', degree: '', year: '', grade: '' }],
    socialLinks: initialData?.socialLinks || [],
    dynamicSections: initialData?.dynamicSections || []
  });

  const addSocialLink = () => {
    setFormData({
      ...formData,
      socialLinks: [...formData.socialLinks, { id: Math.random().toString(), platform: '', url: '' }]
    });
  };

  const removeSocialLink = (id: string) => {
    setFormData({
      ...formData,
      socialLinks: formData.socialLinks.filter((link: any) => link.id !== id)
    });
  };

  const updateSocialLink = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link: any) => link.id === id ? { ...link, [field]: value } : link)
    }));
  };

  const addDynamicSection = () => {
    setFormData({
      ...formData,
      dynamicSections: [...formData.dynamicSections, { id: Math.random().toString(), title: '', content: '' }]
    });
  };

  const removeDynamicSection = (id: string) => {
    setFormData({
      ...formData,
      dynamicSections: formData.dynamicSections.filter((sec: any) => sec.id !== id)
    });
  };

  const updateDynamicSection = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      dynamicSections: prev.dynamicSections.map((sec: any) => sec.id === id ? { ...sec, [field]: value } : sec)
    }));
  };

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
          // Map local formData to backend expected schema
          const payload = {
              profile: {
                  full_name: `${formData.firstName} ${formData.lastName}`.trim(),
                  headline: formData.primaryRole,
                  bio: formData.bio,
                  dynamic_profile_data: {
                      socialLinks: formData.socialLinks.filter((l: any) => l.platform && l.url),
                      customSections: formData.dynamicSections.filter((s: any) => s.title && s.content)
                  }
              },
              skills: formData.skills
                  ? formData.skills.split(",").map(s => ({ name: s.trim(), proficiency: "Intermediate" })).filter(s => s.name)
                  : [],
              experiences: formData.experience.filter((e: any) => e.company).map((e: any) => ({
                  company_name: e.company,
                  role: e.role,
                  employment_type: e.type,
                  start_date: e.startDate || null,
                  end_date: e.endDate || null,
                  description: e.description
              })),
              education: formData.education.filter((e: any) => e.institution).map((e: any) => ({
                  institution: e.institution,
                  degree: e.degree,
                  start_date: e.year || null,
                  grade: e.grade
              })),
              projects: []
          };

          await userApi.profile.update(payload);
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
                  className={`h-1 w-12 rounded-full transition-all ${s <= step ? 'bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.5)]' : 'bg-muted'}`} 
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
                        <div key={exp.id} className="p-4 rounded-xl border border-border/50 bg-muted/30 space-y-4 relative group">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase">Company</Label>
                                    <Input 
                                        value={exp.company}
                                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                        placeholder="e.g. DeFi Labs" 
                                        className="bg-background/50 h-9 border-border/50" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase">Role</Label>
                                    <Input 
                                        value={exp.role}
                                        onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                                        placeholder="e.g. Senior Dev" 
                                        className="bg-background/50 h-9 border-border/50" 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <Input 
                                    value={exp.type}
                                    onChange={(e) => updateExperience(exp.id, 'type', e.target.value)}
                                    placeholder="Type" 
                                    className="bg-background/50 h-8 text-xs border-border/50" 
                                />
                                <Input 
                                    value={exp.startDate}
                                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                    placeholder="Start" 
                                    className="bg-background/50 h-8 text-xs border-border/50" 
                                />
                                <Input 
                                    value={exp.endDate}
                                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                    placeholder="End" 
                                    className="bg-background/50 h-8 text-xs border-border/50" 
                                />
                            </div>
                            <Textarea 
                                value={exp.description}
                                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                placeholder="Key achievements..." 
                                className="bg-background/50 text-xs h-20 border-border/50" 
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
                        <div key={edu.id} className="p-4 rounded-xl border border-border/50 bg-muted/30 space-y-4 relative group">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase">Institution</Label>
                                    <Input 
                                        value={edu.institution}
                                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                        placeholder="University of X" 
                                        className="bg-background/50 h-9 border-border/50" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase">Degree</Label>
                                    <Input 
                                        value={edu.degree}
                                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                        placeholder="BSc Computer Science" 
                                        className="bg-background/50 h-9 border-border/50" 
                                    />
                                </div>
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <Input 
                                    value={edu.year}
                                    onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                                    placeholder="Year" 
                                    className="bg-background/50 h-8 text-xs border-border/50" 
                                />
                                <Input 
                                    value={edu.grade}
                                    onChange={(e) => updateEducation(edu.id, 'grade', e.target.value)}
                                    placeholder="Grade/GPA" 
                                    className="bg-background/50 h-8 text-xs border-border/50" 
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
                <div className="space-y-2">
                    <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-primary" /> Additional Profiles & Sections
                    </h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Link Behance, Twitter, Portfolios, or add custom profile sections.</p>
                </div>
                
                {/* Social Links Section */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">External Profiles</h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Provide your ID/Username or full Portfolio URL based on the platform.</p>
                    {formData.socialLinks.map((link: any) => (
                        <div key={link.id} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-center relative">
                            <select
                                value={link.platform}
                                onChange={(e) => updateSocialLink(link.id, 'platform', e.target.value)}
                                className="bg-background/50 h-9 border border-border/50 text-xs rounded-md px-3 text-foreground outline-none focus:border-primary/50"
                            >
                                <option value="" disabled>Select Platform</option>
                                {PLATFORM_CATEGORIES.map((cat) => (
                                    <optgroup key={cat.field} label={cat.field}>
                                        {cat.platforms.map((plat) => (
                                            <option key={plat} value={plat}>{plat}</option>
                                        ))}
                                    </optgroup>
                                ))}
                                <option value="Other">Other / Custom</option>
                            </select>
                            <Input 
                                value={link.url}
                                onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                                placeholder="Username / ID or Profile URL" 
                                className="bg-background/50 h-9 border-border/50 text-xs" 
                            />
                            <Button variant="ghost" size="icon" onClick={() => removeSocialLink(link.id)} className="h-8 w-8 text-destructive/50 hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addSocialLink} className="w-full border-dashed border-primary/20 hover:border-primary/50 text-primary/60">
                        <Plus className="w-3 h-3 mr-2" /> Add Showcase Link
                    </Button>
                </div>

                {/* Dynamic Sections Section */}
                <div className="space-y-4 pt-6 border-t border-border/50">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">Custom Profile Blocks</h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Add Awards, Certifications, Publications, etc.</p>
                    {formData.dynamicSections.map((sec: any) => (
                        <div key={sec.id} className="p-4 rounded-xl border border-border/50 bg-muted/30 space-y-3 relative group">
                            <Input 
                                value={sec.title}
                                onChange={(e) => updateDynamicSection(sec.id, 'title', e.target.value)}
                                placeholder="Section Title (e.g. Certifications)" 
                                className="bg-background/50 h-9 border-border/50 font-bold" 
                            />
                            <Textarea 
                                value={sec.content}
                                onChange={(e) => updateDynamicSection(sec.id, 'content', e.target.value)}
                                placeholder="List your achievements here..." 
                                className="bg-background/50 text-xs min-h-[80px] border-border/50" 
                            />
                            <Button variant="ghost" size="icon" onClick={() => removeDynamicSection(sec.id)} className="absolute top-2 right-2 h-7 w-7 text-destructive/50 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addDynamicSection} className="w-full border-dashed border-primary/20 hover:border-primary/50 text-primary/60">
                        <Plus className="w-3 h-3 mr-2" /> Add Custom Section
                    </Button>
                </div>
             </div>
          )}

          {step === 6 && (
             <div className="space-y-6">
                <div className="space-y-4 text-center py-10">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-[0_0_20px_hsl(var(--primary)/0.2)]">
                        <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight font-heading">Ready for Verification</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                        Your profile data is encrypted and indexed for specialized search discovery and infrastructure anchoring.
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
