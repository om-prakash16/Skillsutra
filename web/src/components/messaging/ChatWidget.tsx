"use client";

import React, { useState } from "react";
import { MessageCircle, X, Send, Sparkles, Minus } from "lucide-react";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState("");

  if (!isOpen) {
    return (
      <button 
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className="fixed bottom-6 right-6 p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95 z-50 group"
      >
        <MessageCircle className="w-6 h-6" />
        {/* Unread badge mock */}
        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
          1
        </span>
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-0 right-6 w-72 bg-card border border-b-0 rounded-t-xl shadow-2xl z-50 cursor-pointer hover:bg-muted/50 transition-colors"
      >
        <div className="px-4 py-3 flex justify-between items-center text-sm font-semibold">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Tech Recruiter @ Stripe
          </span>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-card border rounded-2xl shadow-2xl z-50 flex flex-col h-[500px] overflow-hidden animate-in slide-in-from-bottom-5">
      
      {/* Header */}
      <div className="px-4 py-3 bg-indigo-600 text-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center font-bold text-xs">TR</div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-indigo-600 rounded-full"></span>
          </div>
          <div>
            <h4 className="font-medium text-sm leading-tight">Tech Recruiter</h4>
            <p className="text-[10px] text-indigo-200">Stripe • Active Now</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsMinimized(true)} className="text-indigo-200 hover:text-white transition-colors">
            <Minus className="w-4 h-4" />
          </button>
          <button onClick={() => setIsOpen(false)} className="text-indigo-200 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
        <div className="text-center">
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded-full">10:42 AM</span>
        </div>

        <div className="flex gap-2">
          <div className="bg-muted text-foreground px-3 py-2 rounded-2xl rounded-tl-sm max-w-[85%] text-sm">
            Hi! Your Proof Score in System Design is exactly what we're looking for. Free for a chat?
          </div>
        </div>

        {/* Mock typing indicator */}
        <div className="flex gap-2">
          <div className="bg-muted px-3 py-2.5 rounded-2xl rounded-tl-sm w-12 flex justify-center gap-1">
            <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 border-t bg-card shrink-0">
        <div className="flex gap-2 relative">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-muted border-0 rounded-full px-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button 
            className={`absolute right-1 top-1 p-1.5 rounded-full transition-colors ${inputText.trim() ? 'bg-indigo-600 text-white' : 'text-muted-foreground'}`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {/* Quick AI Replies */}
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1 no-scrollbar">
          <button className="flex-shrink-0 text-[10px] border rounded-full px-2 py-1 text-muted-foreground hover:bg-muted flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500" /> Yes, I'm available.
          </button>
          <button className="flex-shrink-0 text-[10px] border rounded-full px-2 py-1 text-muted-foreground hover:bg-muted flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500" /> Could we do next week?
          </button>
        </div>
      </div>
      
    </div>
  );
}
