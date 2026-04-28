'use client';

import { Bell, Briefcase, Sparkles, CheckCircle2, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const PREFS = [
  { id: 'app', label: 'Application Updates', desc: 'Alerts for view, interview, and feedback status.', icon: CheckCircle2 },
  { id: 'jobs', label: 'AI Job Recommendations', desc: 'New opportunities with 95%+ skill correlation.', icon: Sparkles },
  { id: 'verif', label: 'Skill Verification', desc: 'Results from automated GitHub audits and quizzes.', icon: Briefcase },
  { id: 'inter', label: 'Interview Requests', desc: 'Direct scheduling invites from verified recruiters.', icon: Calendar },
];

export function NotificationPreferences() {
  return (
    <Card className="p-8 bg-card/20 border-primary/10 backdrop-blur-md">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
            <Bell className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
            <h3 className="text-xl font-black tracking-tighter">Event Streams</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Select which platform updates you wish to receive.</p>
        </div>
      </div>

      <div className="space-y-6">
        {PREFS.map((pref) => (
          <div key={pref.id} className="flex items-start justify-between group">
            <div className="flex gap-4">
               <div className="w-10 h-10 rounded-xl border border-primary/5 bg-background/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <pref.icon className="w-5 h-5 text-indigo-400" />
               </div>
               <div className="space-y-1">
                  <Label className="text-sm font-bold block cursor-pointer" htmlFor={pref.id}>{pref.label}</Label>
                  <p className="text-xs text-muted-foreground leading-snug max-w-sm">{pref.desc}</p>
               </div>
            </div>
            <Checkbox id={pref.id} defaultChecked className="mt-1 h-5 w-5 data-[state=checked]:bg-indigo-500" />
          </div>
        ))}
      </div>
    </Card>
  );
}
