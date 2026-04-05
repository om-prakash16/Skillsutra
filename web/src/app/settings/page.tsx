'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PrivacyToggles } from '@/components/features/settings/PrivacyToggles';
import { NotificationPreferences } from '@/components/features/settings/NotificationPreferences';
import { Settings, Shield, Bell, User2, Zap } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-muted/5 py-24 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <main className="max-w-5xl mx-auto space-y-12 relative">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b pb-8 border-primary/10">
          <div className="space-y-4">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-0.5">
                <Settings className="w-3 h-3 mr-2 group-hover:rotate-90 transition-transform" />
                Account Management
            </Badge>
            <h1 className="text-5xl font-black tracking-tighter text-foreground">
              Settings & <span className="text-primary italic">Privacy</span>
            </h1>
            <p className="text-xl text-muted-foreground uppercase tracking-widest text-xs font-bold">
               Refine your identity and platform intelligence preferences.
            </p>
          </div>
          <Card className="px-6 py-3 bg-card/30 backdrop-blur-xl border-primary/10 flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] uppercase font-black tracking-tighter text-muted-foreground">Connected Wallet</p>
                <p className="text-sm font-mono text-primary">0x862...59263</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-indigo-600 p-0.5">
                 <div className="w-full h-full rounded-full bg-background flex items-center justify-center font-bold text-xs">OP</div>
             </div>
          </Card>
        </header>

        <Tabs defaultValue="privacy" className="space-y-10">
           <TabsList className="w-full justify-start h-14 bg-card/20 backdrop-blur-md p-1 border border-primary/5 rounded-2xl">
              <TabsTrigger value="privacy" className="flex-1 md:flex-none gap-2 px-8 h-full rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
                 <Shield className="w-4 h-4" /> Privacy Controls
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex-1 md:flex-none gap-2 px-8 h-full rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
                 <Bell className="w-4 h-4" /> Notifications
              </TabsTrigger>
              <TabsTrigger value="job-prefs" className="flex-1 md:flex-none gap-2 px-8 h-full rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
                 <Zap className="w-4 h-4" /> Job Preferences
              </TabsTrigger>
              <TabsTrigger value="account" className="flex-1 md:flex-none gap-2 px-8 h-full rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
                 <User2 className="w-4 h-4" /> Profile Info
              </TabsTrigger>
           </TabsList>

           <TabsContent value="privacy" className="animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-black mb-8 tracking-tight">Data Sovereignty Control</h2>
                <PrivacyToggles />
              </div>
           </TabsContent>

           <TabsContent value="notifications" className="animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-black mb-8 tracking-tight">System Event Channels</h2>
                <NotificationPreferences />
              </div>
           </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
