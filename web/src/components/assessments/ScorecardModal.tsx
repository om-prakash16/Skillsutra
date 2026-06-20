"use client";

import React from "react";
import { CheckCircle2, XCircle, Lightbulb, Trophy, X, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ScorecardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScorecardModal({ isOpen, onClose }: ScorecardModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-card border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex justify-between items-end">
            <div>
              <Badge className="bg-white/20 hover:bg-white/20 text-white border-none mb-3">SYSTEM DESIGN</Badge>
              <h2 className="text-2xl font-bold">Assessment Complete</h2>
              <p className="text-indigo-100 mt-1">Distributed Rate Limiter Middleware</p>
            </div>
            
            <div className="text-right">
              <div className="text-5xl font-black mb-1">88<span className="text-3xl text-indigo-200">.5</span></div>
              <div className="text-xs font-semibold text-indigo-100 uppercase tracking-wider">AI Confidence Score</div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Proof Score Impact */}
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 text-green-600 rounded-lg">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-400">Proof Score Increased</h4>
                <p className="text-sm text-green-700 dark:text-green-500">Your Backend ranking has improved</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600 flex items-center gap-1">
              +15 <span className="text-sm text-green-600/70">pts</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Strengths
              </h4>
              <ul className="space-y-2">
                <li className="text-sm bg-muted/50 p-3 rounded-lg border-l-2 border-green-500">
                  Correctly implemented sliding window logic.
                </li>
                <li className="text-sm bg-muted/50 p-3 rounded-lg border-l-2 border-green-500">
                  Excellent use of Redis sorted sets (ZADD/ZREMRANGEBYSCORE).
                </li>
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider">
                <XCircle className="w-4 h-4 text-red-500" /> Areas to Improve
              </h4>
              <ul className="space-y-2">
                <li className="text-sm bg-muted/50 p-3 rounded-lg border-l-2 border-red-500">
                  Missed edge case: handling Redis connection failures gracefully.
                </li>
                <li className="text-sm bg-muted/50 p-3 rounded-lg border-l-2 border-red-500">
                  Time complexity of ZREMRANGEBYSCORE was not optimally bounded.
                </li>
              </ul>
            </div>
          </div>

          {/* AI Suggestion */}
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/50 p-4 rounded-xl">
            <h4 className="font-semibold flex items-center gap-2 text-sm text-blue-800 dark:text-blue-400 mb-2">
              <Lightbulb className="w-4 h-4" /> AI Suggestion
            </h4>
            <p className="text-sm text-blue-900/80 dark:text-blue-300">
              Consider adding a local in-memory fallback cache if Redis goes down to ensure high availability for the API gateway layer.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-muted/30 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>View Submitted Code</Button>
          <Button onClick={onClose} className="bg-indigo-600 hover:bg-indigo-700">Return to Dashboard</Button>
        </div>
      </div>
    </div>
  );
}
