'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, Globe2, Mail, Phone, Calendar } from 'lucide-react';

export function ProfileHeader({ user, isEditing, onUpdateAvatar, action }: any) {
  return (
    <div className="relative p-8 bg-card/20 backdrop-blur-xl border border-primary/10 rounded-[2.5rem] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
      
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        <Avatar className="w-32 h-32 border-4 border-background shadow-2xl">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="bg-primary/10 text-primary font-black text-2xl">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
           <div className="flex justify-between items-start">
              <div className="space-y-1">
                 <h1 className="text-3xl font-black tracking-tighter">{user.firstName} {user.lastName}</h1>
                 <p className="text-primary font-bold uppercase text-xs tracking-widest">{user.title}</p>
              </div>
              {action}
           </div>

           <div className="flex flex-wrap gap-4 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {user.location}</div>
              <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Joined {user.joinDate}</div>
              <div className="flex items-center gap-1.5"><Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{user.experienceLevel}</Badge></div>
           </div>

           <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                 <span>Profile Strength</span>
                 <span className="text-primary">{user.completion}%</span>
              </div>
              <Progress value={user.completion} className="h-1.5 bg-muted" />
           </div>
        </div>
      </div>
    </div>
  );
}
