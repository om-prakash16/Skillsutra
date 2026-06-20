"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { api } from "@/lib/api/api-client";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Send, Search, Info, MessageSquare, Phone, Video,
    Image as ImageIcon, Paperclip, Smile, ArrowLeft,
    Loader2, CheckCheck, Clock
} from "lucide-react";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

function DateSeparator({ date }: { date?: string }) {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    let label = format(d, "MMMM d, yyyy");
    if (isToday(d)) label = "Today";
    else if (isYesterday(d)) label = "Yesterday";
    return (
        <div className="flex items-center gap-4 py-4">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">{label}</span>
            <div className="flex-1 h-px bg-border/50" />
        </div>
    );
}

export default function MessagesPage() {
    const { user } = useAuth();
    const [inbox, setInbox] = useState<any[]>([]);
    const [selectedConv, setSelectedConv] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [loadingInbox, setLoadingInbox] = useState(true);
    const [loadingChat, setLoadingChat] = useState(false);
    const [sending, setSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const currentUserId = user?.id;

    // Fetch inbox on load
    useEffect(() => {
        const loadInbox = async () => {
            setLoadingInbox(true);
            try {
                const res = await api.messages.getInbox();
                // api-client unwraps { status: "success", data: [...] } so res is the array
                if (Array.isArray(res)) {
                    setInbox(res);
                } else if (res && res.data) {
                    setInbox(res.data);
                } else {
                    setInbox([]);
                }
            } catch (e) {
                console.error("Failed to load inbox", e);
            } finally {
                setLoadingInbox(false);
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
            setLoadingChat(true);
            try {
                const res = await api.messages.getHistory(selectedConv);
                if (Array.isArray(res)) {
                    setMessages(res);
                } else if (res && res.data) {
                    setMessages(res.data);
                } else {
                    setMessages([]);
                }

                // Clear unread badge locally
                setInbox(prev => prev.map(c => c.id === selectedConv ? { ...c, unread_count: 0 } : c));

                // Connect WebSocket
                const token = localStorage.getItem("accessToken") || "";
                const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
                const wsUrl = `${wsProtocol}//${window.location.host}/api/v1/messages/ws/${selectedConv}?token=${token}`;
                
                activeWs = new WebSocket(wsUrl);
                
                activeWs.onopen = () => {
                    pingInterval = setInterval(() => {
                        if (activeWs?.readyState === WebSocket.OPEN) {
                            activeWs.send(JSON.stringify({ type: "ping" }));
                        }
                    }, 25000);
                };

                activeWs.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    if (data.type === "ping") {
                        if (activeWs?.readyState === WebSocket.OPEN) {
                            activeWs.send(JSON.stringify({ type: "pong" }));
                        }
                        return;
                    }
                    if (data.type === "message") {
                        setMessages((prev) => [...prev, data.message]);
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

                activeWs.onclose = () => {};
                setWs(activeWs);

            } catch (e) {
                console.error("Failed to load chat", e);
            } finally {
                setLoadingChat(false);
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

    const handleSendMessage = useCallback(() => {
        if (!inputMessage.trim() || !ws || ws.readyState !== WebSocket.OPEN) return;

        ws.send(JSON.stringify({
            type: "message",
            content: inputMessage
        }));
        
        setInputMessage("");
        inputRef.current?.focus();
    }, [inputMessage, ws]);

    const activeConvData = inbox.find(c => c.id === selectedConv);

    // Filter inbox by search
    const filteredInbox = searchQuery.trim()
        ? inbox.filter(c => {
            const name = (c.title || c.other_user?.full_name || "").toLowerCase();
            const lastMsg = (c.latest_message?.content || "").toLowerCase();
            const q = searchQuery.toLowerCase();
            return name.includes(q) || lastMsg.includes(q);
        })
        : inbox;

    // Group messages by date
    const getDateKey = (dateStr?: string) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? "" : format(d, "yyyy-MM-dd");
    };

    return (
        <div className="flex h-[calc(100vh-80px)] bg-background/50 backdrop-blur-xl border rounded-2xl overflow-hidden my-4 shadow-2xl mx-auto max-w-7xl border-white/10 relative">
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

            {/* ─── Left Pane: Inbox ─── */}
            <div className={`w-full md:w-[380px] border-r border-border/50 bg-background/40 backdrop-blur-md flex-col ${selectedConv ? 'hidden md:flex' : 'flex'}`}>
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-muted/40 border-border/50 focus-visible:ring-1 focus-visible:ring-primary/50 rounded-xl shadow-inner transition-all h-10" 
                        />
                    </div>
                </div>
                <ScrollArea className="flex-1 px-3 py-2">
                    {loadingInbox ? (
                        <div className="flex flex-col gap-3 p-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-start gap-3 p-3">
                                    <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredInbox.length === 0 ? (
                        <div className="p-8 text-center flex flex-col items-center justify-center h-full text-muted-foreground">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-5 border border-primary/10 shadow-[0_0_40px_-10px_rgba(var(--primary),0.2)]">
                                <MessageSquare className="w-9 h-9 text-primary/50" />
                            </div>
                            <p className="font-semibold text-foreground/80 text-lg">
                                {searchQuery ? "No results found" : "No messages yet"}
                            </p>
                            <p className="text-sm opacity-70 mt-2 max-w-[250px]">
                                {searchQuery 
                                    ? "Try a different search term" 
                                    : "Visit someone's profile and send them a message to get started."}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {filteredInbox.map((conv) => {
                                const isSelected = selectedConv === conv.id;
                                const isUnread = conv.unread_count > 0;
                                return (
                                    <motion.button
                                        key={conv.id}
                                        onClick={() => setSelectedConv(conv.id)}
                                        initial={false}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        className={`w-full p-3.5 flex items-start gap-3.5 rounded-xl transition-all duration-200 text-left border ${
                                            isSelected 
                                            ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-sm' 
                                            : 'bg-transparent border-transparent hover:bg-muted/40 hover:border-border/30'
                                        }`}
                                    >
                                        <div className="relative shrink-0 mt-0.5">
                                            <Avatar className={`w-12 h-12 shadow-sm border-2 transition-colors ${isSelected ? 'border-primary/30' : 'border-border/30'}`}>
                                                <AvatarImage src={conv.other_user?.avatar_url} />
                                                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold">
                                                    {conv.other_user?.full_name?.charAt(0) || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            {isUnread && (
                                                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-primary border-[2.5px] border-background rounded-full shadow-sm" />
                                            )}
                                        </div>
                                        <div className="flex-1 overflow-hidden min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h3 className={`font-semibold truncate pr-2 text-[15px] ${isSelected ? 'text-primary' : (isUnread ? 'text-foreground' : 'text-foreground/90')}`}>
                                                    {conv.other_user?.full_name || conv.title || "Unknown User"}
                                                </h3>
                                                <span className={`text-[11px] whitespace-nowrap font-medium ${isSelected || isUnread ? 'text-primary/80' : 'text-muted-foreground/70'}`}>
                                                    {conv.latest_message 
                                                        ? formatDistanceToNow(new Date(conv.latest_message.created_at), { addSuffix: false })
                                                        : ""}
                                                </span>
                                            </div>
                                            <p className={`text-sm truncate ${isUnread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                                                {conv.latest_message 
                                                    ? conv.latest_message.content 
                                                    : <span className="italic opacity-60">No messages yet</span>}
                                            </p>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>
            </div>

            {/* ─── Right Pane: Active Chat ─── */}
            <div className={`flex-1 flex-col bg-background/60 relative ${selectedConv ? 'flex' : 'hidden md:flex'}`}>
                {selectedConv ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-4 md:px-6 py-3.5 border-b border-border/50 flex items-center justify-between bg-background/60 backdrop-blur-xl z-10 shadow-sm">
                            <div className="flex items-center gap-3">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="md:hidden shrink-0 -ml-2 text-muted-foreground hover:text-foreground" 
                                    onClick={() => setSelectedConv(null)}
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                                <Avatar className="w-10 h-10 border-2 border-primary/20 shadow-sm shrink-0">
                                    <AvatarImage src={activeConvData?.other_user?.avatar_url} />
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                        {activeConvData?.other_user?.full_name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="font-bold text-[15px] leading-tight tracking-tight">
                                        {activeConvData?.other_user?.full_name || activeConvData?.title}
                                    </h2>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        <p className="text-xs font-medium text-muted-foreground">Online</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-0.5">
                                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5">
                                    <Phone className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5">
                                    <Video className="w-4 h-4" />
                                </Button>
                                <div className="w-px h-5 bg-border/50 mx-1" />
                                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50">
                                    <Info className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <ScrollArea className="flex-1 px-4 md:px-6 py-4" ref={scrollRef}>
                            {loadingChat ? (
                                <div className="flex flex-col gap-4 py-6">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className={`flex gap-3 ${i % 2 === 0 ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                                            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                                            <Skeleton className={`h-12 rounded-2xl ${i % 2 === 0 ? 'w-48 rounded-tl-sm' : 'w-36 rounded-tr-sm'}`} />
                                        </div>
                                    ))}
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-20">
                                    <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4 border border-primary/10">
                                        <Send className="w-7 h-7 text-primary/40" />
                                    </div>
                                    <p className="font-semibold text-foreground/70">Start the conversation</p>
                                    <p className="text-sm opacity-60 mt-1">Send a message below to begin chatting.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col pb-4">
                                    {messages.map((msg, idx) => {
                                        const isMe = msg.sender_id === currentUserId;
                                        const showAvatar = idx === 0 || messages[idx - 1].sender_id !== msg.sender_id;
                                        const isLastInGroup = idx === messages.length - 1 || messages[idx + 1]?.sender_id !== msg.sender_id;
                                        
                                        // Date separator
                                        const showDateSep = idx === 0 || 
                                            getDateKey(msg.created_at) !== getDateKey(messages[idx - 1].created_at);
                                        
                                        return (
                                            <div key={msg.id || idx}>
                                                {showDateSep && <DateSeparator date={msg.created_at} />}
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.2, delay: idx > messages.length - 3 ? 0.05 : 0 }}
                                                    className={`flex gap-2.5 max-w-[80%] ${isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'} ${showAvatar ? 'mt-4' : 'mt-0.5'}`}
                                                >
                                                    <div className="shrink-0 pt-0.5 w-8">
                                                        {showAvatar && !isMe ? (
                                                            <Avatar className="w-8 h-8 shadow-sm border border-border/50">
                                                                <AvatarImage src={msg.user_avatar || activeConvData?.other_user?.avatar_url} />
                                                                <AvatarFallback className="text-xs bg-muted font-semibold">
                                                                    {(msg.user_name || activeConvData?.other_user?.full_name || "U").charAt(0)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        ) : showAvatar && isMe ? (
                                                            <Avatar className="w-8 h-8 shadow-sm border border-primary/20">
                                                                <AvatarImage src={user?.avatar_url} />
                                                                <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                                                                    {(user?.name || "Me").charAt(0)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        ) : null}
                                                    </div>
                                                    
                                                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                        {showAvatar && (
                                                            <span className="text-[11px] font-semibold text-muted-foreground/60 mb-1 px-1">
                                                                {isMe ? "You" : (msg.user_name || activeConvData?.other_user?.full_name)}
                                                            </span>
                                                        )}
                                                        <div 
                                                            className={`px-4 py-2.5 shadow-sm ${
                                                                isMe 
                                                                ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-2xl rounded-tr-md' 
                                                                : 'bg-muted/50 text-foreground rounded-2xl rounded-tl-md border border-border/40'
                                                            }`}
                                                        >
                                                            <div className="whitespace-pre-wrap text-[14.5px] leading-relaxed break-words">{msg.content}</div>
                                                        </div>
                                                        {isLastInGroup && (
                                                            <div className={`flex items-center gap-1 mt-1 px-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                                                                <span className="text-[10px] font-medium text-muted-foreground/50">
                                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                                {isMe && (
                                                                    <CheckCheck className="w-3.5 h-3.5 text-primary/50" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </ScrollArea>

                        {/* Chat Input */}
                        <div className="p-3 md:p-4 bg-background/80 backdrop-blur-xl border-t border-border/50">
                            <div className="max-w-4xl mx-auto flex items-end gap-2 bg-muted/30 p-1.5 md:p-2 rounded-2xl border border-border/50 shadow-sm focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all duration-300">
                                <div className="hidden sm:flex pb-0.5 pl-0.5 gap-0.5">
                                    <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full text-muted-foreground hover:bg-muted/60 hover:text-foreground">
                                        <Paperclip className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full text-muted-foreground hover:bg-muted/60 hover:text-foreground">
                                        <ImageIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Input 
                                    ref={inputRef}
                                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 min-h-[44px] px-2 md:px-3 text-[15px] resize-none placeholder:text-muted-foreground/50" 
                                    placeholder="Type a message..."
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                />
                                <div className="flex items-center gap-0.5 pb-0.5 pr-0.5">
                                    <Button variant="ghost" size="icon" className="hidden sm:flex w-9 h-9 rounded-full text-muted-foreground hover:bg-muted/60 hover:text-foreground">
                                        <Smile className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                        onClick={handleSendMessage} 
                                        disabled={!inputMessage.trim() || sending}
                                        className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none"
                                    >
                                        {sending 
                                            ? <Loader2 className="w-4 h-4 animate-spin" /> 
                                            : <Send className="w-4 h-4 ml-0.5" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Empty State */
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-b from-transparent to-muted/10">
                        <div className="relative mb-8">
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/10 shadow-[0_0_80px_-15px_rgba(var(--primary),0.3)]">
                                <MessageSquare className="w-12 h-12 text-primary/50" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                                <Send className="w-4 h-4 text-primary/60" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 font-heading text-foreground">Your Messages</h2>
                        <p className="text-[15px] opacity-70 max-w-sm text-center leading-relaxed">
                            Select a conversation to continue chatting, or visit someone&apos;s profile to start a new one.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
