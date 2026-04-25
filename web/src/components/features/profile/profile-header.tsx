'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, Globe2, Mail, Phone, Calendar } from 'lucide-react';

export function ProfileHeader({ user, isEditing, onUpdateAvatar, action }: any) {
  return (
    <div className="relative p-10 glass border-white/5 rounded-[3rem] overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
      
      <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start md:items-center relative z-10">
        <div className="relative">
            <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <Avatar className="w-40 h-40 border-8 border-background/50 shadow-2xl relative z-10">
              <AvatarImage src={user.avatar} className="object-cover" />
              <AvatarFallback className="glass bg-primary/10 text-primary font-black text-4xl">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 glass rounded-full flex items-center justify-center border-white/10 shadow-xl z-20">
                <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            </div>
        </div>

        <div className="flex-1 space-y-6">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-2">
                 <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-gradient leading-none">{user.firstName} {user.lastName}</h1>
                 <p className="text-primary font-black uppercase text-[10px] tracking-[0.4em] pt-1">{user.title}</p>
              </div>
              <div className="flex items-center gap-4">
                {action}
              </div>
           </div>

           <div className="flex flex-wrap gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 pt-2">
              <div className="flex items-center gap-2.5"><MapPin className="w-4 h-4 text-primary" /> {user.location}</div>
              <div className="flex items-center gap-2.5"><Calendar className="w-4 h-4 text-primary" /> Joined {user.joinDate}</div>
              <div className="flex items-center gap-2.5">
                <Badge variant="outline" className="glass text-emerald-500 border-emerald-500/20 px-4 py-1 text-[9px] font-black uppercase tracking-widest rounded-full">
                    {user.experienceLevel}
                </Badge>
              </div>
           </div>

           <div className="space-y-3 pt-2">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em]">
                 <span className="opacity-40">Profile Signal Strength</span>
                 <span className="text-primary">{user.completion}%</span>
              </div>
              <div className="relative h-2 w-full glass rounded-full border-white/5 overflow-hidden">
                <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/50 to-primary shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all duration-1000 ease-out" 
                    style={{ width: `${user.completion}%` }} 
                />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
