"use client";

import React, { useState, useEffect } from "react";
import { Search, Command, Users, Briefcase, Building2, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function GlobalSearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Keyboard shortcut listener (Cmd/Ctrl + K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      {/* Navbar Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted/50 hover:bg-muted border rounded-md transition-colors w-64"
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-left">Search platform...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Mobile Trigger */}
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 text-muted-foreground"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Search Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-[10vh]">
          <div className="w-full max-w-2xl bg-card border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 mx-4">
            
            {/* Input Header */}
            <div className="flex items-center px-4 py-3 border-b border-muted">
              <Search className="w-5 h-5 text-indigo-500 mr-3" />
              <input
                autoFocus
                className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none text-lg"
                placeholder="Search jobs, people, companies, or ask the AI..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:bg-muted p-1 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Semantic Search Banner */}
            {query.length > 3 && (
              <div className="px-4 py-3 bg-indigo-50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900 flex items-center justify-between cursor-pointer hover:bg-indigo-100 transition-colors">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Use Semantic Search for "{query}"</span>
                </div>
                <Command className="w-4 h-4 text-indigo-400" />
              </div>
            )}

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              
              {!query ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  <p>Type to start searching across the ecosystem.</p>
                  <div className="flex justify-center gap-4 mt-4">
                    <Badge variant="outline"><Briefcase className="w-3 h-3 mr-1"/> Jobs</Badge>
                    <Badge variant="outline"><Users className="w-3 h-3 mr-1"/> Talent</Badge>
                    <Badge variant="outline"><Building2 className="w-3 h-3 mr-1"/> Companies</Badge>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Job Results */}
                  <div>
                    <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Jobs</div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 text-blue-600 p-1.5 rounded"><Briefcase className="w-4 h-4" /></div>
                          <div>
                            <p className="text-sm font-medium">Senior Frontend Engineer (React)</p>
                            <p className="text-xs text-muted-foreground">Stripe • Remote</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* People Results */}
                  <div>
                    <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Talent</div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 text-purple-600 p-1.5 rounded"><Users className="w-4 h-4" /></div>
                          <div>
                            <p className="text-sm font-medium">Alice Johnson</p>
                            <p className="text-xs text-muted-foreground">Proof Score: 912 • Open to Work</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-2 border-t border-muted bg-muted/30 text-xs text-muted-foreground flex justify-between items-center">
              <span className="flex items-center gap-1">Powered by <span className="font-semibold text-foreground">SkillSutra AI</span></span>
              <span className="flex items-center gap-1">Press <kbd className="font-mono bg-background border px-1 rounded">esc</kbd> to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
