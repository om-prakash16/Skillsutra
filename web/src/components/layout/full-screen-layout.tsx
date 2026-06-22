import React from "react";
import { cn } from "@/lib/utils";

interface FullScreenLayoutProps {
  children: React.ReactNode;
  className?: string;
  hideSidebar?: boolean; // if true, it's totally full screen (z-index overlay), else it just takes up main content area without padding
}

export function FullScreenLayout({
  children,
  className,
  hideSidebar = false
}: FullScreenLayoutProps) {
  
  if (hideSidebar) {
    return (
      <div className={cn("fixed inset-0 z-[200] bg-background flex flex-col overflow-hidden", className)}>
        {children}
      </div>
    );
  }

  // Use within AppShell but bypass all paddings and standard enterprise margins
  return (
    <div className={cn("absolute inset-0 bg-background flex flex-col overflow-hidden z-50", className)}>
      {children}
    </div>
  );
}
