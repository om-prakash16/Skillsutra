'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Sparkles, 
  User, 
  MapPin, 
  Briefcase, 
  Github, 
  Code2, 
  Save,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function DynamicProfileForm() {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
         <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
                <div 
                  key={s} 
                  className={`h-1 w-12 rounded-full transition-all ${s <= step ? 'bg-primary' : 'bg-muted'}`} 
                />
            ))}
         </div>
         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Step {step} of 3</span>
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
                  <h3 className="text-xl font-bold tracking-tight">Identity & Bio</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">How the platform sees you professionally.</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label>First Name</Label>
                     <Input placeholder="Enter first name" className="bg-background/50 border-primary/10" />
                  </div>
                  <div className="space-y-2">
                     <Label>Last Name</Label>
                     <Input placeholder="Enter last name" className="bg-background/50 border-primary/10" />
                  </div>
               </div>
               <div className="space-y-2">
                  <Label>Professional Bio</Label>
                  <Textarea placeholder="Describe your technical journey..." className="h-32 bg-background/50 border-primary/10" />
               </div>
            </div>
          )}

          {step === 2 && (
             <div className="space-y-6">
               <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tight">Technical Stack</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Powering our resonance matching algorithms.</p>
               </div>
               <div className="space-y-2">
                  <Label>Primary Role</Label>
                  <Input placeholder="e.g. Lead Frontend Engineer" className="bg-background/50 border-primary/10" />
               </div>
               <div className="space-y-2">
                  <Label>Core Skills (CSV)</Label>
                  <Input placeholder="React, Rust, Anchor, Next.js" className="bg-background/50 border-primary/10" />
               </div>
            </div>
          )}

          {step === 3 && (
             <div className="space-y-6">
                <div className="space-y-2 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">Ready for Verification</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest leading-loose">
                        Your profile data is encrypted and indexed for specialized search discovery.
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
            className="font-bold uppercase text-[10px] tracking-widest"
         >
            <ArrowLeft className="w-3 h-3 mr-2" /> back
         </Button>
         
         {step < totalSteps ? (
            <Button 
              onClick={() => setStep(s => Math.min(totalSteps, s + 1))}
              className="bg-primary/10 hover:bg-primary/20 text-primary font-bold uppercase text-[10px] tracking-widest rounded-xl px-8"
            >
              Continue <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
         ) : (
            <Button className="bg-primary hover:bg-primary/90 font-bold uppercase text-[10px] tracking-widest rounded-xl px-12 shadow-lg shadow-primary/20">
              Complete Profile <Save className="w-3 h-3 ml-2" />
            </Button>
         )}
      </div>
    </div>
  );
}
