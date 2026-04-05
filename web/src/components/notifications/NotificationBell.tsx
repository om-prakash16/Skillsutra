"use client";

import { useState, useEffect } from "react";
import { Bell, BellDot, X, Check, Loader2, MessageSquare, Zap, Gift, User, ShieldAlert } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

export function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id) fetchNotifications();
  }, [user?.id]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications/list`);
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications/${id}/read`, {
            method: "PATCH",
        });
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'read' } : n));
    } catch (err) {
        console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-white/5 rounded-full transition-colors">
          {unreadCount > 0 ? (
            <BellDot className="w-5 h-5 text-primary fill-primary/10" />
          ) : (
            <Bell className="w-5 h-5 text-neutral-400" />
          )}
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-black font-black text-[10px] rounded-full border-2 border-black">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80 bg-black/90 border-white/10 backdrop-blur-2xl p-0 overflow-hidden" align="end">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-widest italic">Notifications</h3>
            <span className="text-[10px] font-bold text-neutral-500 uppercase">{unreadCount} Unread</span>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-neutral-500 italic text-[10px] uppercase">
                No recent activity.
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 border-b border-white/5 flex gap-4 hover:bg-white/5 transition-colors cursor-pointer group ${notification.status === 'unread' ? 'bg-primary/5' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className={`mt-1 h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${getIconColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                </div>
                <div className="space-y-1 overflow-hidden">
                    <p className={`text-xs font-bold truncate leading-none ${notification.status === 'unread' ? 'text-white' : 'text-neutral-400'}`}>
                        {notification.title}
                    </p>
                    <p className="text-[10px] text-neutral-500 italic line-clamp-2 leading-relaxed">
                        {notification.message}
                    </p>
                    <p className="text-[9px] font-mono text-neutral-600">
                        {new Date(notification.created_at).toLocaleTimeString()}
                    </p>
                </div>
                {notification.status === 'unread' && (
                    <div className="ml-auto flex items-start">
                         <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    </div>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="p-3 bg-white/5 text-center">
            <Button variant="link" className="text-[10px] font-black text-neutral-400 hover:text-white uppercase tracking-widest no-underline">
                View All Notifications
            </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getNotificationIcon(type: string) {
    switch (type) {
        case 'ai_score': return <Zap className="w-4 h-4" />;
        case 'nft_mint': return <Gift className="w-4 h-4" />;
        case 'job_app': return <MessageSquare className="w-4 h-4" />;
        case 'admin': return <ShieldAlert className="w-4 h-4" />;
        default: return <User className="w-4 h-4" />;
    }
}

function getIconColor(type: string) {
    switch (type) {
        case 'ai_score': return 'bg-amber-500/10 text-amber-500';
        case 'nft_mint': return 'bg-primary/10 text-primary';
        case 'job_app': return 'bg-sky-500/10 text-sky-500';
        case 'admin': return 'bg-rose-500/10 text-rose-500';
        default: return 'bg-white/5 text-neutral-400';
    }
}
