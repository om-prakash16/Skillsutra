'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, Globe2, Mail, Phone, Calendar, Github, Figma, Linkedin, Dribbble, Codepen, Twitter, Youtube, Link as LinkIcon, Code2 } from 'lucide-react';
import Link from 'next/link';

const getBrandConfig = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return { icon: Github, color: 'bg-[#24292e] text-white hover:bg-[#24292e]/90', label: 'GitHub' };
    if (p.includes('linkedin')) return { icon: Linkedin, color: 'bg-[#0077b5] text-white hover:bg-[#0077b5]/90', label: 'LinkedIn' };
    if (p.includes('figma')) return { icon: Figma, color: 'bg-[#F24E1E] text-white hover:bg-[#F24E1E]/90', label: 'Figma' };
    if (p.includes('dribbble')) return { icon: Dribbble, color: 'bg-[#ea4c89] text-white hover:bg-[#ea4c89]/90', label: 'Dribbble' };
    if (p.includes('behance')) return { icon: Globe2, color: 'bg-[#1769ff] text-white hover:bg-[#1769ff]/90', label: 'Behance' };
    if (p.includes('twitter') || p.includes('x.com')) return { icon: Twitter, color: 'bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90', label: 'Twitter' };
    if (p.includes('youtube')) return { icon: Youtube, color: 'bg-[#FF0000] text-white hover:bg-[#FF0000]/90', label: 'YouTube' };
    if (p.includes('leetcode')) return { icon: Code2, color: 'bg-[#FFA116] text-white hover:bg-[#FFA116]/90', label: 'LeetCode' };
    if (p.includes('codepen')) return { icon: Codepen, color: 'bg-[#000000] text-white hover:bg-[#000000]/90', label: 'CodePen' };
    return { icon: LinkIcon, color: 'bg-primary/10 text-primary hover:bg-primary/20', label: platform };
};

export function ProfileHeader({ user, socialLinks = [], isEditing, isOwner, onUpdateAvatar, action }: any) {
  return (
    <div className="relative p-6 md:p-10 glass border-border/50 rounded-[2rem] md:rounded-[3rem] overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
      
      <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start md:items-center relative z-10">
        <div className="relative group/avatar">
            <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <Avatar className="w-28 h-28 md:w-40 md:h-40 border-4 md:border-8 border-background/50 shadow-2xl relative z-10">
              <AvatarImage src={user.avatar} className="object-cover" />
              <AvatarFallback className="glass bg-primary/10 text-primary font-black text-4xl">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
            </Avatar>
            {(isEditing || isOwner) && (
                <label className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover/avatar:opacity-100 cursor-pointer transition-opacity backdrop-blur-sm border-8 border-transparent">
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/90">Change</span>
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append("file", file);
                            
                            // To avoid making this a huge change, we can temporarily set it to a local object URL 
                            // for instant preview, and theoretically call upload endpoint.
                            // In a real app, we'd wait for uploadFile to return the URL.
                            const tempUrl = URL.createObjectURL(file);
                            onUpdateAvatar?.(tempUrl);
                            
                            try {
                                const { userApi } = await import("@/lib/api/user-api");
                                const res = await userApi.profile.uploadFile(formData);
                                if (res && res.url) {
                                    onUpdateAvatar?.(res.url);
                                    // Instantly update backend
                                    try {
                                        await userApi.profile.update({ profile: { avatar_url: res.url } });
                                    } catch (updateErr) {
                                        console.error("Backend update failed", updateErr);
                                    }
                                }
                            } catch (err) {
                                console.error("Upload failed", err);
                            }
                        }} 
                    />
                </label>
            )}
            <div className="absolute -bottom-2 -right-2 w-12 h-12 glass rounded-full flex items-center justify-center border-border shadow-xl z-20 pointer-events-none">
                <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            </div>
        </div>

        <div className="flex-1 space-y-6">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-2">
                 <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gradient leading-none">{user.firstName} {user.lastName}</h1>
                 <p className="text-primary font-black uppercase text-[10px] tracking-[0.4em] pt-1">{user.title}</p>
              </div>
              <div className="flex items-center gap-4">
                {action}
              </div>
           </div>

           <div className="flex flex-wrap gap-4 md:gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 pt-2">
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
              <div className="relative h-2 w-full glass rounded-full border-border/50 overflow-hidden">
                <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/50 to-primary shadow-[0_0_15px_hsl(var(--primary)/0.5)] transition-all duration-1000 ease-out" 
                    style={{ width: `${user.completion}%` }} 
                />
              </div>
           </div>

           {socialLinks.length > 0 && (
             <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30 mt-4">
                 {socialLinks.map((link: any, idx: number) => {
                     const brand = getBrandConfig(link.platform);
                     const Icon = brand.icon;
                     // Format the URL properly if it's just a username
                     let href = link.url;
                     if (!href.startsWith('http') && !href.startsWith('https')) {
                         if (link.platform.toLowerCase() === 'github') href = `https://github.com/${href}`;
                         else if (link.platform.toLowerCase() === 'leetcode') href = `https://leetcode.com/${href}`;
                         else if (link.platform.toLowerCase() === 'behance') href = `https://behance.net/${href}`;
                         else if (link.platform.toLowerCase() === 'linkedin') href = `https://linkedin.com/in/${href}`;
                         else href = `https://${href}`;
                     }
                     
                     return (
                         <Link key={idx} href={href} target="_blank" rel="noopener noreferrer">
                             <Badge className={`px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer transition-all shadow-sm ${brand.color}`}>
                                 <Icon className="w-3.5 h-3.5" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">{brand.label}</span>
                             </Badge>
                         </Link>
                     );
                 })}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
