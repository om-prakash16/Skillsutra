"use client";

import React, { useState } from "react";
import { Search, MoreVertical, Send, Phone, Video, Paperclip, CheckCircle2, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const mockConversations = [
  {
    id: "conv-1",
    name: "Tech Recruiter @ Stripe",
    initials: "TR",
    lastMessage: "Are you free for a call tomorrow?",
    timestamp: "10:42 AM",
    unread: 1,
    active: true,
    type: "DIRECT_MESSAGE"
  },
  {
    id: "conv-2",
    name: "SkillSutra Career AI",
    initials: "AI",
    lastMessage: "I've analyzed your resume. Here are 3 tips to improve your system design section.",
    timestamp: "Yesterday",
    unread: 0,
    active: false,
    type: "AI_COPILOT"
  },
  {
    id: "conv-3",
    name: "Alex (System Design Mentor)",
    initials: "AM",
    lastMessage: "Great mock interview! I'll send the feedback scorecard shortly.",
    timestamp: "Tue",
    unread: 0,
    active: false,
    type: "MENTORSHIP"
  }
];

export default function MessagingInbox() {
  const [activeConv, setActiveConv] = useState(mockConversations[0]);
  const [inputText, setInputText] = useState("");

  return (
    <div className="flex h-[calc(100vh-4rem)] border-t overflow-hidden">
      
      {/* Left Sidebar - Conversation List */}
      <div className="w-80 border-r bg-muted/20 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg mb-4">Messages</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full bg-background border rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {mockConversations.map(conv => (
            <div 
              key={conv.id}
              onClick={() => setActiveConv(conv)}
              className={`flex items-start gap-3 p-4 border-b cursor-pointer transition-colors ${activeConv.id === conv.id ? 'bg-indigo-50 dark:bg-indigo-950/20' : 'hover:bg-muted/50'}`}
            >
              <Avatar>
                <AvatarFallback className={conv.type === 'AI_COPILOT' ? 'bg-indigo-100 text-indigo-700' : ''}>
                  {conv.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-semibold text-sm truncate pr-2 flex items-center gap-1">
                    {conv.name}
                    {conv.type === 'AI_COPILOT' && <Sparkles className="w-3 h-3 text-indigo-500" />}
                  </h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{conv.timestamp}</span>
                </div>
                <p className={`text-xs truncate ${conv.unread > 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                  {conv.lastMessage}
                </p>
              </div>
              {conv.unread > 0 && (
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Pane - Chat Window */}
      <div className="flex-1 flex flex-col bg-background relative">
        
        {/* Chat Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-card/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className={activeConv.type === 'AI_COPILOT' ? 'bg-indigo-100 text-indigo-700' : ''}>
                {activeConv.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                {activeConv.name}
                {activeConv.type === 'AI_COPILOT' && <Badge variant="secondary" className="text-[10px] h-4">AI</Badge>}
              </h3>
              <p className="text-xs text-muted-foreground">
                {activeConv.type === 'DIRECT_MESSAGE' ? 'Recruiting Team' : 'Active Now'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            {activeConv.type !== 'AI_COPILOT' && (
              <>
                <button className="hover:text-foreground transition-colors"><Phone className="w-4 h-4" /></button>
                <button className="hover:text-foreground transition-colors"><Video className="w-5 h-5" /></button>
              </>
            )}
            <button className="hover:text-foreground transition-colors"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-center">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">Today</span>
          </div>

          <div className="flex items-end gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback>{activeConv.initials}</AvatarFallback>
            </Avatar>
            <div className="bg-muted px-4 py-2 rounded-2xl rounded-bl-sm max-w-[75%]">
              <p className="text-sm">Hi there! I saw your stellar Proof Score. Are you free for a call tomorrow to discuss the Senior Engineer role?</p>
              <div className="text-[10px] text-muted-foreground text-right mt-1">10:42 AM</div>
            </div>
          </div>

          <div className="flex items-end gap-2 justify-end">
            <div className="bg-indigo-600 text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-[75%]">
              <p className="text-sm">Yes, absolutely! Does 2 PM PST work for you?</p>
              <div className="text-[10px] text-indigo-200 text-right mt-1 flex items-center justify-end gap-1">
                10:45 AM <CheckCircle2 className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t bg-card">
          <div className="flex items-end gap-2 bg-muted/50 border rounded-xl p-2 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
            <button className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activeConv.name}...`}
              className="flex-1 bg-transparent border-0 resize-none max-h-32 min-h-[40px] focus:ring-0 py-2 text-sm"
              rows={1}
            />
            <button 
              className={`p-2 rounded-full transition-colors ${inputText.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
          <div className="text-center mt-2">
            <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Smart Reply: "That sounds great, I'll send an invite."
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
