"use client";

import React, { useState, useEffect } from "react";
import { Play, Send, Clock, Terminal, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScorecardModal } from "@/components/assessments/ScorecardModal";

export default function AssessmentEnvironment() {
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [showScorecard, setShowScorecard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock code state
  const [code, setCode] = useState(`import redis
import time

class RateLimiter:
    def __init__(self, redis_client, max_requests, window_size):
        self.redis = redis_client
        self.max_requests = max_requests
        self.window_size = window_size

    def is_allowed(self, user_id):
        current_time = time.time()
        window_start = current_time - self.window_size
        
        # Remove old requests
        self.redis.zremrangebyscore(user_id, 0, window_start)
        
        # Check current count
        count = self.redis.zcard(user_id)
        
        if count < self.max_requests:
            self.redis.zadd(user_id, {current_time: current_time})
            return True
        return False
`);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API POST /assessments/{id}/submit
    setTimeout(() => {
      setIsSubmitting(false);
      setShowScorecard(true);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-3 border-b bg-card">
        <div className="flex items-center gap-4">
          <Badge variant="secondary">SYSTEM DESIGN</Badge>
          <h2 className="font-semibold text-sm">Distributed Rate Limiter</h2>
        </div>
        
        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 font-mono font-medium ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Play className="w-3 h-3" /> Run Tests
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              size="sm" 
              className="gap-2 bg-indigo-600 hover:bg-indigo-700"
            >
              <Send className="w-3 h-3" /> {isSubmitting ? "Evaluating..." : "Submit to AI"}
            </Button>
          </div>
        </div>
      </div>

      {/* Split Pane */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Pane: Prompt */}
        <div className="w-1/3 border-r flex flex-col bg-card/50 overflow-y-auto p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Design a Rate Limiter</h1>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-yellow-600 bg-yellow-500/10">Medium</Badge>
              <Badge variant="outline">Python</Badge>
              <Badge variant="outline">Redis</Badge>
            </div>
          </div>
          
          <div className="prose prose-sm dark:prose-invert">
            <p>
              You need to implement a distributed rate limiter middleware for a high-traffic API gateway.
            </p>
            <h3>Requirements:</h3>
            <ul>
              <li>Use a <strong>sliding window log</strong> algorithm.</li>
              <li>Must support distributed nodes (store state in Redis).</li>
              <li>Implement the <code>is_allowed(user_id)</code> method.</li>
            </ul>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 p-4 rounded-lg mt-6 flex gap-3 text-yellow-800 dark:text-yellow-300">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <div className="text-xs">
                <strong>Anti-Cheat Active:</strong> Your keystrokes and tab-focus are being monitored by the AI Engine. Do not paste code from external sources.
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: IDE */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e] text-[#d4d4d4]">
          <div className="flex items-center px-4 py-2 bg-[#2d2d2d] border-b border-[#1e1e1e] text-xs font-mono text-gray-400 gap-4">
            <span className="text-white border-b border-white pb-1">solution.py</span>
            <span>test_cases.py</span>
          </div>
          
          <div className="flex-1 p-4 font-mono text-sm overflow-auto">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-transparent border-none resize-none focus:outline-none focus:ring-0 text-[#d4d4d4]"
              spellCheck="false"
            />
          </div>
          
          {/* Terminal Console */}
          <div className="h-48 border-t border-[#3c3c3c] bg-[#1e1e1e] flex flex-col">
            <div className="px-4 py-1.5 bg-[#2d2d2d] flex items-center gap-2 text-xs font-mono text-gray-400">
              <Terminal className="w-3 h-3" /> CONSOLE
            </div>
            <div className="p-4 font-mono text-xs text-gray-400">
              $ Ready to run tests...
            </div>
          </div>
        </div>
      </div>
      
      <ScorecardModal isOpen={showScorecard} onClose={() => setShowScorecard(false)} />
    </div>
  );
}
