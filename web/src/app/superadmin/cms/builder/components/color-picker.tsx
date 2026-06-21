"use client";

import React, { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Paintbrush, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  presetColors?: string[];
}

const DEFAULT_PRESETS = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b', '#84cc16', 
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', 
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'
];

export function ColorPicker({ color, onChange, presetColors = DEFAULT_PRESETS }: ColorPickerProps) {
  const [hex, setHex] = useState(color || '#000000');
  const [opacity, setOpacity] = useState(100);
  const [copied, setCopied] = useState(false);

  // Sync internal state if external color changes
  useEffect(() => {
    if (color && color.startsWith('#')) {
      if (color.length === 9) { // #RRGGBBAA
        setHex(color.slice(0, 7));
        const alphaHex = color.slice(7, 9);
        setOpacity(Math.round((parseInt(alphaHex, 16) / 255) * 100));
      } else {
        setHex(color);
        setOpacity(100);
      }
    }
  }, [color]);

  const handleHexChange = (newHex: string) => {
    setHex(newHex);
    emitColor(newHex, opacity);
  };

  const handleOpacityChange = (newOpacity: number) => {
    setOpacity(newOpacity);
    emitColor(hex, newOpacity);
  };

  const emitColor = (h: string, o: number) => {
    if (o === 100) {
      onChange(h);
    } else {
      // Convert opacity to hex alpha
      const alphaHex = Math.round((o / 100) * 255).toString(16).padStart(2, '0');
      onChange(`${h}${alphaHex}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(color || hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start text-left font-normal px-3 py-4 h-auto"
        >
          <div className="flex items-center gap-2 w-full">
            <div 
              className="w-6 h-6 rounded-md border border-border shadow-sm overflow-hidden relative"
            >
              {/* Checkerboard for transparency */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjREREREREIj48L3JlY3Q+CjxyZWN0IHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNGRkZGRkYiPjwvcmVjdD4KPHJlY3QgeD0iNCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iI0ZGRkZGRiI+PC9yZWN0Pgo8cmVjdCB4PSI0IiB5PSI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjREREREREIj48L3JlY3Q+Cjwvc3ZnPg==')]" />
              <div className="absolute inset-0" style={{ backgroundColor: color || hex }} />
            </div>
            <span className="flex-1 font-mono text-xs uppercase">{color || hex}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Tabs defaultValue="solid" className="w-full">
          <div className="p-2 border-b border-border">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="solid">Solid</TabsTrigger>
              <TabsTrigger value="gradient" disabled>Gradient</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="solid" className="p-4 m-0 space-y-4">
            {/* Color Picker Native Input styled big */}
            <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border">
              <input 
                type="color" 
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
                className="absolute -inset-4 w-[200%] h-[200%] cursor-crosshair" 
              />
            </div>

            {/* Controls */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-xs w-12">Hex</Label>
                <div className="flex-1 flex relative">
                  <Input 
                    value={hex.toUpperCase()} 
                    onChange={(e) => handleHexChange(e.target.value)}
                    className="font-mono text-xs uppercase pr-8"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-0 h-full w-8 text-muted-foreground hover:text-foreground"
                    onClick={copyToClipboard}
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Label className="text-xs w-12">Alpha</Label>
                <Slider 
                  value={[opacity]} 
                  onValueChange={(v) => handleOpacityChange(v[0])} 
                  max={100} 
                  step={1} 
                  className="flex-1"
                />
                <span className="text-xs font-mono w-8 text-right">{opacity}%</span>
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Presets</Label>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {presetColors.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleHexChange(c)}
                    className={cn(
                      "w-full aspect-square rounded-md border border-border/50 transition-transform hover:scale-110",
                      hex === c && "ring-2 ring-primary ring-offset-1 ring-offset-background"
                    )}
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="gradient" className="p-4 m-0 space-y-4">
            <p className="text-xs text-muted-foreground text-center py-4">Gradient builder coming soon.</p>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
