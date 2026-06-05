"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/api/user-api";
import { formatDistanceToNow } from "date-fns";
import { Bell, Check, CheckCircle2, Circle, AlertCircle, Info, ShieldAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
    link?: string;
}

export default function NotificationsPage() {
    const queryClient = useQueryClient();

    const { data: notifications = [], isLoading, isError } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const res = await userApi.notifications.get();
            if (res.status === "error") throw new Error(res.message);
            // Ensure we handle both direct array or wrapped inside 'data' or 'notifications'
            return (res.data || res.notifications || res || []) as Notification[];
        },
    });

    const markAsRead = useMutation({
        mutationFn: async (id: string) => {
            const res = await userApi.notifications.read(id);
            if (res.status === "error") throw new Error(res.message);
            return id;
        },
        onSuccess: (id) => {
            queryClient.setQueryData(["notifications"], (old: Notification[] = []) =>
                old.map((n) => (n.id === id ? { ...n, is_read: true } : n))
            );
            toast.success("Notification marked as read");
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to mark as read");
        }
    });

    const getIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case "alert":
            case "warning":
                return <AlertCircle className="w-5 h-5 text-amber-500" />;
            case "security":
                return <ShieldAlert className="w-5 h-5 text-red-500" />;
            case "success":
                return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            default:
                return <Info className="w-5 h-5 text-primary" />;
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-500">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-64 rounded-xl" />
                    <Skeleton className="h-4 w-96 rounded-lg" />
                </div>
                
                <div className="space-y-4 mt-8">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Card key={i} className="glass border-border/50 rounded-2xl overflow-hidden">
                            <CardContent className="p-6 flex items-start gap-4">
                                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                                <div className="space-y-3 w-full">
                                    <Skeleton className="h-5 w-3/4 rounded-lg" />
                                    <Skeleton className="h-4 w-full rounded-lg" />
                                    <Skeleton className="h-3 w-24 rounded-lg" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-4xl mx-auto py-24 px-4 text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto opacity-50" />
                <h2 className="text-xl font-black uppercase tracking-widest text-foreground">Failed to load alerts</h2>
                <p className="text-muted-foreground text-sm">We couldn't fetch your notifications at this time.</p>
                <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["notifications"] })} variant="outline" className="mt-4">
                    Retry
                </Button>
            </div>
        );
    }

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tight flex items-center gap-3">
                        <Bell className="w-8 h-8 text-primary" />
                        Command Center
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        System alerts and protocol updates. You have <span className="text-primary">{unreadCount}</span> unread messages.
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button 
                        variant="premium" 
                        size="sm" 
                        className="rounded-xl shadow-xl shadow-primary/20"
                        onClick={() => {
                            // Optionally add mark all as read logic here
                            toast.info("Mark all as read feature coming soon!");
                        }}
                    >
                        <Check className="w-4 h-4 mr-2" />
                        Acknowledge All
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <Card className="glass border-border/50 rounded-[2rem] overflow-hidden text-center py-24">
                        <CardContent>
                            <Bell className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
                            <h3 className="text-lg font-black uppercase tracking-widest text-foreground/70 mb-2">Silence</h3>
                            <p className="text-sm text-muted-foreground font-medium max-w-md mx-auto">
                                The network is quiet. No new alerts or notifications require your attention.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    notifications.map((notification) => (
                        <Card 
                            key={notification.id} 
                            className={cn(
                                "glass border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg relative group",
                                notification.is_read 
                                    ? "border-border/30 opacity-70 hover:opacity-100 bg-background/40" 
                                    : "border-primary/30 shadow-[0_0_20px_-5px_rgba(var(--primary),0.2)] bg-primary/5 hover:border-primary/50"
                            )}
                        >
                            {!notification.is_read && (
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                            )}
                            <CardContent className="p-5 md:p-6 flex items-start gap-4 md:gap-6">
                                <div className={cn(
                                    "p-3 rounded-full shrink-0",
                                    notification.is_read ? "bg-muted/50" : "bg-background shadow-inner"
                                )}>
                                    {getIcon(notification.type)}
                                </div>
                                <div className="space-y-1.5 flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <h3 className={cn(
                                            "font-bold tracking-tight",
                                            notification.is_read ? "text-foreground/80" : "text-foreground"
                                        )}>
                                            {notification.title}
                                        </h3>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 whitespace-nowrap">
                                            {notification.created_at ? formatDistanceToNow(new Date(notification.created_at), { addSuffix: true }) : 'Recently'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {notification.message}
                                    </p>
                                    
                                    {/* Actions */}
                                    <div className="flex items-center gap-4 pt-3">
                                        {notification.link && (
                                            <a 
                                                href={notification.link} 
                                                className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                                            >
                                                View Details →
                                            </a>
                                        )}
                                        {!notification.is_read && (
                                            <button 
                                                onClick={() => markAsRead.mutate(notification.id)}
                                                disabled={markAsRead.isPending}
                                                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
                                            >
                                                <CheckCircle2 className="w-3 h-3" />
                                                Mark Read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
