"use client";

import React, { useState, useEffect } from "react";
import { Bell, CheckCircle2, Clock, AlertTriangle, ShieldAlert, FileText, UserPlus, Briefcase, Mail, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  type: string;
  priority: string;
  title: string;
  description: string;
  action_url: string;
  is_read: boolean;
  created_at: string;
}

const getIconForType = (type: string) => {
  switch (type) {
    case "JOB": return <Briefcase className="h-5 w-5 text-blue-500" />;
    case "APPLICATION": return <FileText className="h-5 w-5 text-purple-500" />;
    case "INTERVIEW": return <Clock className="h-5 w-5 text-orange-500" />;
    case "SECURITY": return <ShieldAlert className="h-5 w-5 text-red-500" />;
    case "SYSTEM": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case "CONNECTION": return <UserPlus className="h-5 w-5 text-green-500" />;
    default: return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "CRITICAL": return <Badge variant="destructive">Critical</Badge>;
    case "HIGH": return <Badge className="bg-orange-500">High</Badge>;
    default: return null;
  }
};

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState("ALL"); // ALL, UNREAD, SYSTEM

  useEffect(() => {
    // In a real app, this would be an API call to GET /communication/notifications
    setNotifications([
      {
        id: "1",
        type: "SECURITY",
        priority: "CRITICAL",
        title: "New Login Detected",
        description: "A new login was detected from a Windows device in New York.",
        action_url: "/settings/security",
        is_read: false,
        created_at: new Date().toISOString()
      },
      {
        id: "2",
        type: "INTERVIEW",
        priority: "HIGH",
        title: "Interview Scheduled",
        description: "Google has scheduled a technical interview with you for tomorrow at 10 AM.",
        action_url: "/interviews/2",
        is_read: false,
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: "3",
        type: "JOB",
        priority: "NORMAL",
        title: "New Job Match",
        description: "A new Senior Frontend Engineer role at Stripe matches your profile.",
        action_url: "/jobs/stripe-123",
        is_read: true,
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ]);
  }, []);

  const filteredNotifications = notifications.filter(n => {
    if (filter === "UNREAD") return !n.is_read;
    if (filter === "SYSTEM") return n.type === "SYSTEM" || n.type === "SECURITY";
    return true;
  });

  const markAsRead = (id: string) => {
    // PATCH /communication/notifications/{id}/read
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-muted-foreground">Manage your alerts, messages, and system events.</p>
        </div>
        <Button variant="outline" onClick={markAllAsRead}>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Mark All as Read
        </Button>
      </div>

      <div className="flex space-x-2">
        <Button variant={filter === "ALL" ? "default" : "outline"} onClick={() => setFilter("ALL")}>All</Button>
        <Button variant={filter === "UNREAD" ? "default" : "outline"} onClick={() => setFilter("UNREAD")}>Unread</Button>
        <Button variant={filter === "SYSTEM" ? "default" : "outline"} onClick={() => setFilter("SYSTEM")}>System Alerts</Button>
      </div>

      <div className="grid gap-4">
        {filteredNotifications.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <Bell className="h-12 w-12 mb-4 opacity-20" />
            <p>You are all caught up!</p>
          </Card>
        ) : (
          filteredNotifications.map((notif) => (
            <Card key={notif.id} className={`transition-all ${!notif.is_read ? 'border-l-4 border-l-blue-500 shadow-md bg-blue-50/10 dark:bg-blue-900/10' : 'opacity-80'}`}>
              <div className="flex items-start p-6 gap-4">
                <div className={`p-2 rounded-full ${!notif.is_read ? 'bg-background shadow-sm' : 'bg-muted'}`}>
                  {getIconForType(notif.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-semibold ${!notif.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notif.title}
                      </h4>
                      {getPriorityBadge(notif.priority)}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notif.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notif.description}
                  </p>
                  <div className="pt-2 flex items-center gap-4">
                    {notif.action_url && (
                      <a href={notif.action_url} className="text-sm font-medium text-blue-600 hover:underline">
                        View Details →
                      </a>
                    )}
                    {!notif.is_read && (
                      <button onClick={() => markAsRead(notif.id)} className="text-sm font-medium text-muted-foreground hover:text-foreground">
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
