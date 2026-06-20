"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface InfiniteCanvasProps {
  children: React.ReactNode;
  className?: string;
  gridSize?: number;
}

export function InfiniteCanvas({ children, className, gridSize = 20 }: InfiniteCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const [isPanning, setIsPanning] = useState(false);
  const startPanRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  // Handle zooming via mouse wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    // If holding Cmd/Ctrl, zoom. Otherwise pan.
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      
      const zoomSensitivity = 0.005;
      const delta = -e.deltaY * zoomSensitivity;
      const newScale = Math.min(Math.max(0.1, scale + delta), 5); // Clamped between 0.1x and 5x
      
      // Calculate mouse position relative to container to zoom towards pointer
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Adjust position so the point under the mouse stays stationary
        const scaleRatio = newScale / scale;
        const newX = mouseX - (mouseX - position.x) * scaleRatio;
        const newY = mouseY - (mouseY - position.y) * scaleRatio;
        
        setScale(newScale);
        setPosition({ x: newX, y: newY });
      }
    } else {
      // Pan
      setPosition(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY
      }));
    }
  }, [scale, position]);

  // Handle Middle-Click or Space+Drag panning
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Middle click (button 1) or Spacebar (handled via global state usually, but middle click is standard)
    if (e.button === 1 || e.button === 2 || e.altKey) {
      e.preventDefault();
      setIsPanning(true);
      startPanRef.current = {
        x: e.clientX,
        y: e.clientY,
        posX: position.x,
        posY: position.y
      };
      
      if (containerRef.current) {
        containerRef.current.setPointerCapture(e.pointerId);
      }
    }
  }, [position]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (isPanning) {
      const dx = e.clientX - startPanRef.current.x;
      const dy = e.clientY - startPanRef.current.y;
      setPosition({
        x: startPanRef.current.posX + dx,
        y: startPanRef.current.posY + dy
      });
    }
  }, [isPanning]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (isPanning) {
      setIsPanning(false);
      if (containerRef.current) {
        containerRef.current.releasePointerCapture(e.pointerId);
      }
    }
  }, [isPanning]);

  // Prevent default context menu if right-click panning
  const handleContextMenu = (e: React.MouseEvent) => {
    if (e.button === 2 || e.altKey) {
      e.preventDefault();
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden bg-[#0a0a0a]",
        isPanning ? "cursor-grabbing" : "cursor-auto",
        className
      )}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onContextMenu={handleContextMenu}
    >
      {/* Background Grid that scales and pans */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundSize: `${gridSize * scale}px ${gridSize * scale}px`,
          backgroundImage: `
            linear-gradient(to right, #4f4f4f 1px, transparent 1px),
            linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)
          `,
          backgroundPosition: `${position.x}px ${position.y}px`
        }}
      />
      
      {/* The actual canvas content wrapper */}
      <div
        className="absolute origin-top-left will-change-transform"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          // Add a large explicit size if needed, or let content dictate
        }}
      >
        {children}
      </div>
      
      {/* Controls Overlay (Zoom Info) */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-xs font-medium text-white/70">
        <span>{Math.round(scale * 100)}%</span>
        <div className="w-px h-3 bg-white/20 mx-1" />
        <button 
          onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }}
          className="hover:text-white transition-colors"
        >
          Reset View
        </button>
      </div>
    </div>
  );
}
