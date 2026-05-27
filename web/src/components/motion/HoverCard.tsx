"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { hoverScale, tapScale, springTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface HoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: string; // e.g., "rgba(var(--primary), 0.15)"
}

export function HoverCard({ children, className, glowColor = "rgba(59, 130, 246, 0.15)", ...props }: HoverCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl transition-colors duration-300",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover="hover"
      whileTap="tap"
      variants={{
        hover: hoverScale,
        tap: tapScale,
      }}
      {...(props as any)}
    >
      {/* Dynamic Mouse Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent 40%)`,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Content wrapper to stay above the glow */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </motion.div>
  );
}
