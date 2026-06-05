"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api/api-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, Info, MessageSquare, MoreVertical, Phone, Video, Image as ImageIcon, Paperclip, Smile } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function MessagesPage() {
    const [inbox, setInbox] = useState<any[]>([]);
    const [selectedConv, setSelectedConv] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [ws, setWs] = useState<WebSocket | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch inbox on load
    useEffect(() => {
        const loadInbox = async () => {
            try {
                const res = await api.messages.getInbox();
                if (res.status === "success") {
                    setInbox(res.data);
                }
            } catch (e) {
                console.error("Failed to load inbox", e);
            }
        };
        loadInbox();
    }, []);

    // When a conversation is selected
    useEffect(() => {
        if (!selectedConv) return;

        let activeWs: WebSocket | null = null;
        let pingInterval: NodeJS.Timeout;

        const loadChat = async () => {
            try {
                // 1. Fetch history
                const res = await api.messages.getHistory(selectedConv);
                if (res.status === "success") {
                    setMessages(res.data.reverse()); // Ensure chronological order for display
                }

                // Clear unread badge locally
                setInbox(prev => prev.map(c => c.id === selectedConv ? { ...c, unread_count: 0 } : c));

                // 2. Connect WebSocket
                const token = localStorage.getItem("token") || "";
                const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
                const wsUrl = `${wsProtocol}//${window.location.host}/api/v1/messages/ws/${selectedConv}?token=${token}`;
                
                activeWs = new WebSocket(wsUrl);
                
                activeWs.onopen = () => {
                    console.log("Connected to chat", selectedConv);
                    pingInterval = setInterval(() => {
                        if (activeWs?.readyState === WebSocket.OPEN) {
                            activeWs.send(JSON.stringify({ type: "ping" }));
                        }
                    }, 25000); // 25s ping
                };

                activeWs.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    if (data.type === "message") {
                        setMessages((prev) => [...prev, data.message]);
                        // Move conversation to top in inbox
                        setInbox(prev => {
                            const updated = prev.map(c => 
                                c.id === selectedConv 
                                ? { ...c, latest_message: data.message, updated_at: new Date().toISOString() } 
                                : c
                            );
                            return updated.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
                        });
                    }
                };

                activeWs.onclose = () => {
                    console.log("Disconnected from chat");
                };

                setWs(activeWs);

            } catch (e) {
                console.error("Failed to load chat", e);
            }
        };

        loadChat();

        return () => {
            if (activeWs) activeWs.close();
            if (pingInterval) clearInterval(pingInterval);
        };
    }, [selectedConv]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputMessage.trim() || !ws || ws.readyState !== WebSocket.OPEN) return;

        ws.send(JSON.stringify({
            type: "message",
            content: inputMessage
        }));
        
        setInputMessage("");
    };

    const activeConvData = inbox.find(c => c.id === selectedConv);

    return (
        <div className="flex h-[calc(100vh-80px)] bg-background/50 backdrop-blur-xl border rounded-2xl overflow-hidden my-4 shadow-2xl mx-auto max-w-7xl border-white/10 relative">
            {/* Subtle ambient glow behind the app */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

            {/* Left Pane: Inbox List */}
            <div className="w-full md:w-[380px] border-r border-border/50 flex flex-col bg-background/40 backdrop-blur-md">
                <div className="p-6 border-b border-border/50 flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight font-heading">Messages</h2>
                        <Badge variant="secondary" className="px-2.5 py-0.5 rounded-full font-medium shadow-sm bg-primary/10 text-primary border-primary/20">
                            {inbox.filter(c => c.unread_count > 0).length} New
                        </Badge>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                            placeholder="Search conversations..." 
                            className="pl-10 bg-muted/40 border-border/50 focus-visible:ring-1 focus-visible:ring-primary/50 rounded-xl shadow-inner transition-all h-10" 
                        />
                    </div>
                </div>
                <ScrollArea className="flex-1 px-3 py-2">
                    {inbox.length === 0 ? (
                        <div className="p-8 text-center flex flex-col items-center justify-center h-full text-muted-foreground">
                            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4 border border-border/50">
                                <MessageSquare className="w-8 h-8 opacity-50" />
                            </div>
                            <p className="font-medium">No messages yet</p>
                            <p className="text-sm opacity-70 mt-1">Start connecting with talent to see messages here.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1.5">
                            {inbox.map((conv) => {
                                const isSelected = selectedConv === conv.id;
                                const isUnread = conv.unread_count > 0;
                                return (
                                    <button
                                        key={conv.id}
                                        onClick={() => setSelectedConv(conv.id)}
                                        className={`w-full p-3.5 flex items-start gap-4 rounded-xl transition-all duration-300 ease-in-out text-left border ${
                                            isSelected 
                                            ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-sm' 
                                            : 'bg-transparent border-transparent hover:bg-muted/40 hover:border-border/50'
                                        }`}
                                    >
                                        <div className="relative shrink-0 mt-0.5">
                                            <Avatar className={`w-12 h-12 shadow-sm border ${isSelected ? 'border-primary/30' : 'border-border/50'}`}>
                                                <AvatarImage src={conv.other_user?.avatar_url} />
                                                <AvatarFallback className="bg-gradient-to-br from-muted to-muted/50 font-semibold">
                                                    {conv.other_user?.full_name?.charAt(0) || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            {isUnread && (
                                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary border-[3px] border-background rounded-full shadow-sm animate-pulse"></span>
                                            )}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className={`font-semibold truncate pr-2 ${isSelected ? 'text-primary' : (isUnread ? 'text-foreground' : 'text-foreground/90')}`}>
                                                    {conv.title || conv.other_user?.full_name || "Unknown User"}
                                                </h3>
                                                <span className={`text-[11px] whitespace-nowrap font-medium ${isSelected || isUnread ? 'text-primary/80' : 'text-muted-foreground'}`}>
                                                    {conv.latest_message ? formatDistanceToNow(new Date(conv.latest_message.created_at), { addSuffix: true }).replace('about ', '') : ""}
                                                </span>
                                            </div>
                                            <p className={`text-sm truncate pr-4 ${isUnread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                                                {conv.latest_message ? conv.latest_message.content : <span className="italic opacity-70">No messages yet</span>}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>
            </div>

            {/* Right Pane: Active Chat Window */}
            <div className="flex-1 flex flex-col bg-background/60 relative">
                {selectedConv ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-background/40 backdrop-blur-md z-10 shadow-sm">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-10 h-10 border shadow-sm">
                                    <AvatarImage src={activeConvData?.other_user?.avatar_url} />
                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                        {activeConvData?.other_user?.full_name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="font-bold text-base leading-tight tracking-tight">
                                        {activeConvData?.title || activeConvData?.other_user?.full_name}
                                    </h2>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                        <p className="text-xs font-medium text-muted-foreground">Active now</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary">
                                    <Phone className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary">
                                    <Video className="w-5 h-5" />
                                </Button>
                                <div className="w-px h-6 bg-border mx-1" />
                                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
                                    <Info className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <ScrollArea className="flex-1 px-6 py-4" ref={scrollRef}>
                            <div className="flex flex-col gap-6 pb-4">
                                {messages.map((msg, idx) => {
                                    const isMe = msg.user_name !== activeConvData?.other_user?.full_name; // Consider using user_id
                                    const showAvatar = idx === 0 || messages[idx - 1].user_name !== msg.user_name;
                                    
                                    return (
                                        <div key={idx} className={`flex gap-3 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                                            {!isMe && (
                                                <div className="shrink-0 pt-1">
                                                    {showAvatar ? (
                                                        <Avatar className="w-8 h-8 shadow-sm">
                                                            <AvatarImage src={activeConvData?.other_user?.avatar_url} />
                                                            <AvatarFallback className="text-xs bg-muted">
                                                                {activeConvData?.other_user?.full_name?.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    ) : (
                                                        <div className="w-8" /> // Spacer
                                                    )}
                                                </div>
                                            )}
                                            
                                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                <div 
                                                    className={`px-5 py-3 shadow-sm ${
                                                        isMe 
                                                        ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-2xl rounded-tr-sm' 
                                                        : 'bg-muted/60 text-foreground rounded-2xl rounded-tl-sm border border-border/50'
                                                    }`}
                                                >
                                                    <div className="whitespace-pre-wrap text-[15px] leading-relaxed">{msg.content}</div>
                                                </div>
                                                <span className="text-[11px] font-medium text-muted-foreground/70 mt-1.5 px-1">
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </ScrollArea>

                        {/* Chat Input Area */}
                        <div className="p-4 bg-background/80 backdrop-blur-xl border-t border-border/50">
                            <div className="max-w-4xl mx-auto flex items-end gap-2 bg-muted/30 p-2 rounded-2xl border border-border/60 shadow-sm focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all duration-300">
                                <div className="flex pb-1 pl-1">
                                    <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
                                        <Paperclip className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
                                        <ImageIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Input 
                                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 min-h-[44px] px-2 text-[15px] resize-none" 
                                    placeholder="Type your message..."
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                />
                                <div className="flex items-center gap-1 pb-1 pr-1">
                                    <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
                                        <Smile className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                        onClick={handleSendMessage} 
                                        disabled={!inputMessage.trim()}
                                        className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        <Send className="w-4 h-4 ml-0.5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-b from-transparent to-muted/20">
                        <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-6 border border-primary/10 shadow-[0_0_60px_-15px_rgba(var(--primary),0.3)]">
                            <MessageSquare className="w-10 h-10 text-primary/60" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 font-heading text-foreground">Your Messages</h2>
                        <p className="text-[15px] opacity-80 max-w-sm text-center">
                            Select a conversation from the sidebar to continue chatting, or start a new one from a user's profile.
                        </p>
                    </div>
                )}
            </div>

        </div>
    );
}
