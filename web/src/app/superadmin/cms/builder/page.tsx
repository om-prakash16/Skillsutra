"use client";

import React, { useState } from "react";
import { 
  Layers, MousePointer2, Type, Image as ImageIcon, Box, LayoutGrid, 
  Smartphone, Monitor, Tablet, Play, Save, ChevronLeft, Settings, 
  ListTree, Code, Plus, MoreHorizontal, Undo, Redo, Eye, Database, SplitSquareHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function VisualBuilderPage() {
  const { user } = useAuth();
  const [deviceMap, setDeviceMap] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeRightTab, setActiveRightTab] = useState("styles");

  const canPublish = ["super_admin", "ai_admin"].includes(user?.role as string);

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden absolute inset-0 z-50">
      
      {/* Top Navbar */}
      <header className="h-14 border-b border-border/50 bg-background flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/admin/cms/pages">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><ChevronLeft className="w-4 h-4" /></Button>
          </Link>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none">Enterprise Landing Page</span>
            <span className="text-[10px] text-muted-foreground font-mono mt-1">/ (Published)</span>
          </div>
        </div>

        {/* Viewport Toggles */}
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/50">
          <Button variant={deviceMap === "desktop" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setDeviceMap("desktop")}><Monitor className="w-3.5 h-3.5" /></Button>
          <Button variant={deviceMap === "tablet" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setDeviceMap("tablet")}><Tablet className="w-3.5 h-3.5" /></Button>
          <Button variant={deviceMap === "mobile" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setDeviceMap("mobile")}><Smartphone className="w-3.5 h-3.5" /></Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 mr-4 border-r border-border/50 pr-4">
            <Button variant="ghost" size="icon" className="h-8 w-8"><Undo className="w-4 h-4 text-muted-foreground" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Redo className="w-4 h-4 text-muted-foreground" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 ml-2"><Eye className="w-4 h-4 text-muted-foreground" /></Button>
          </div>
          <Button variant="outline" size="sm" className="h-8"><Play className="w-3.5 h-3.5 mr-2" /> Preview</Button>
          {canPublish ? (
            <Button size="sm" className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white"><Save className="w-3.5 h-3.5 mr-2" /> Publish Changes</Button>
          ) : (
            <Button size="sm" className="h-8 bg-orange-500 hover:bg-orange-600 text-white"><Save className="w-3.5 h-3.5 mr-2" /> Request Publish</Button>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar: Elements & Tree */}
        <div className="w-[280px] border-r border-border/50 bg-muted/10 flex flex-col shrink-0">
          <Tabs defaultValue="add" className="w-full h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b border-border/50 bg-transparent h-12 p-0 px-2 shrink-0">
              <TabsTrigger value="add" className="text-xs h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none"><Plus className="w-3.5 h-3.5 mr-1.5"/> Add</TabsTrigger>
              <TabsTrigger value="tree" className="text-xs h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none"><ListTree className="w-3.5 h-3.5 mr-1.5"/> Layers</TabsTrigger>
              <TabsTrigger value="assets" className="text-xs h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none"><ImageIcon className="w-3.5 h-3.5 mr-1.5"/> Assets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="add" className="flex-1 overflow-y-auto p-4 m-0 space-y-6">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Layout</h3>
                <div className="grid grid-cols-2 gap-2">
                  <BuilderDraggable icon={LayoutGrid} label="Section" />
                  <BuilderDraggable icon={Box} label="Container" />
                  <BuilderDraggable icon={SplitSquareHorizontal} label="Grid" />
                  <BuilderDraggable icon={Layers} label="Flexbox" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Typography</h3>
                <div className="grid grid-cols-2 gap-2">
                  <BuilderDraggable icon={Type} label="Heading" />
                  <BuilderDraggable icon={Type} label="Paragraph" />
                  <BuilderDraggable icon={Type} label="Text Link" />
                  <BuilderDraggable icon={Type} label="Rich Text" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Components</h3>
                <div className="grid grid-cols-2 gap-2">
                  <BuilderDraggable icon={MousePointer2} label="Button" />
                  <BuilderDraggable icon={ImageIcon} label="Image" />
                  <BuilderDraggable icon={Play} label="Video" />
                  <BuilderDraggable icon={Code} label="Embed" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tree" className="flex-1 overflow-y-auto m-0 p-0">
              <div className="p-2 space-y-0.5">
                <LayerNode icon={LayoutGrid} label="Hero Section" active={false} />
                <div className="pl-4 space-y-0.5">
                  <LayerNode icon={Box} label="Container" active={false} />
                  <div className="pl-4 space-y-0.5">
                    <LayerNode icon={Type} label="Heading 1" active={true} />
                    <LayerNode icon={Type} label="Paragraph" active={false} />
                    <LayerNode icon={MousePointer2} label="Primary Button" active={false} />
                  </div>
                </div>
                <LayerNode icon={LayoutGrid} label="Features Section" active={false} />
                <LayerNode icon={LayoutGrid} label="Footer" active={false} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Center: Canvas Area */}
        <div className="flex-1 bg-muted/20 relative overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto flex justify-center items-start p-8">
            {/* The Mock Canvas */}
            <div 
              className={`bg-white shadow-2xl ring-1 ring-black/5 transition-all duration-300 relative flex flex-col ${
                deviceMap === "desktop" ? "w-full max-w-[1200px] min-h-[800px]" :
                deviceMap === "tablet" ? "w-[768px] min-h-[1024px]" :
                "w-[375px] min-h-[812px]"
              }`}
            >
              {/* Mock Canvas Content */}
              <div className="p-12 text-center border-b border-dashed border-indigo-200 bg-indigo-50/50">
                <h1 className="text-5xl font-bold text-slate-900 mb-6 border-2 border-indigo-500 rounded relative inline-block group cursor-default">
                  Build at the Speed of Light
                  <div className="absolute -top-3 -right-3 bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded shadow">Heading 1</div>
                  <div className="absolute -inset-1 border border-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </h1>
                <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto hover:ring-2 ring-indigo-500/50 rounded transition-all">
                  The Enterprise Visual Builder lets you drag, drop, and publish scalable frontend experiences directly to the edge CDN.
                </p>
                <button className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                  Start Building
                </button>
              </div>

              <div className="p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg mb-4"></div>
                    <h3 className="text-lg font-semibold mb-2">Feature Block {i}</h3>
                    <p className="text-slate-500 text-sm">Drag and drop global components into this layout grid.</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Bottom Breadcrumbs */}
          <div className="h-8 bg-background border-t border-border/50 flex items-center px-4 text-[11px] font-mono text-muted-foreground gap-2 shrink-0">
            <span className="hover:text-primary cursor-pointer">Body</span>
            <ChevronLeft className="w-3 h-3 rotate-180" />
            <span className="hover:text-primary cursor-pointer">Hero Section</span>
            <ChevronLeft className="w-3 h-3 rotate-180" />
            <span className="hover:text-primary cursor-pointer">Container</span>
            <ChevronLeft className="w-3 h-3 rotate-180" />
            <span className="text-primary font-bold bg-primary/10 px-1 rounded">Heading 1</span>
          </div>
        </div>

        {/* Right Sidebar: Properties */}
        <div className="w-[320px] border-l border-border/50 bg-background flex flex-col shrink-0">
          <Tabs value={activeRightTab} onValueChange={setActiveRightTab} className="w-full h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b border-border/50 bg-transparent h-12 p-0 px-2 shrink-0">
              <TabsTrigger value="styles" className="text-xs h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none flex-1"><Settings className="w-3.5 h-3.5 mr-1.5"/> Styles</TabsTrigger>
              <TabsTrigger value="settings" className="text-xs h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none flex-1"><Settings className="w-3.5 h-3.5 mr-1.5"/> Settings</TabsTrigger>
              <TabsTrigger value="data" className="text-xs h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none flex-1"><Database className="w-3.5 h-3.5 mr-1.5"/> Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="styles" className="flex-1 overflow-y-auto p-0 m-0">
              
              <div className="p-4 border-b border-border/50 bg-muted/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold">Selector</span>
                  <Badge variant="outline" className="text-[10px] h-5 bg-indigo-500/10 text-indigo-600 border-indigo-500/20">Inheriting 2 classes</Badge>
                </div>
                <div className="bg-background border border-border/50 rounded-md p-1.5 flex flex-wrap gap-1">
                  <span className="text-[11px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer">hero-heading <X className="w-3 h-3 opacity-50"/></span>
                </div>
              </div>

              <div className="p-4 space-y-6">
                
                {/* Layout Panel */}
                <div className="space-y-3">
                  <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                    Layout <ChevronLeft className="w-3 h-3 -rotate-90" />
                  </h3>
                  <div className="grid grid-cols-4 gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-full bg-muted/50"><LayoutGrid className="w-3.5 h-3.5" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-full"><Layers className="w-3.5 h-3.5" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-full"><AlignVerticalSpaceAround className="w-3.5 h-3.5" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-full"><Box className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>

                {/* Spacing Panel (Visual Box Model) */}
                <div className="space-y-3 pt-4 border-t border-border/50">
                  <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                    Spacing <ChevronLeft className="w-3 h-3 -rotate-90" />
                  </h3>
                  <div className="bg-muted/30 border border-border/50 rounded-lg p-4 flex items-center justify-center relative aspect-square max-w-[200px] mx-auto">
                    <div className="absolute inset-0 m-2 border border-dashed border-muted-foreground/50 flex items-center justify-center group hover:bg-muted/50 transition-colors cursor-text">
                      <span className="text-[10px] text-muted-foreground absolute top-1">Margin</span>
                      <span className="text-xs text-muted-foreground absolute top-4">0</span>
                      <span className="text-xs text-muted-foreground absolute bottom-4">24</span>
                      <span className="text-xs text-muted-foreground absolute left-4">auto</span>
                      <span className="text-xs text-muted-foreground absolute right-4">auto</span>
                      
                      <div className="absolute inset-6 bg-background border border-border/50 flex items-center justify-center group-hover:bg-muted/20 transition-colors">
                        <span className="text-[10px] text-muted-foreground absolute top-1">Padding</span>
                        <span className="text-xs text-muted-foreground absolute top-4">0</span>
                        <span className="text-xs text-muted-foreground absolute bottom-4">0</span>
                        <span className="text-xs text-muted-foreground absolute left-4">0</span>
                        <span className="text-xs text-muted-foreground absolute right-4">0</span>
                        
                        <div className="absolute inset-6 bg-muted/50 border border-border/50 flex items-center justify-center">
                          <span className="text-[9px] text-muted-foreground">Auto</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Typography Panel */}
                <div className="space-y-3 pt-4 border-t border-border/50">
                  <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                    Typography <ChevronLeft className="w-3 h-3 -rotate-90" />
                  </h3>
                  <div className="grid gap-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-foreground">Font</label>
                        <select className="w-full h-8 text-xs bg-background border border-input rounded-md px-2">
                          <option>Inter</option>
                          <option>Roboto</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-foreground">Weight</label>
                        <select className="w-full h-8 text-xs bg-background border border-input rounded-md px-2">
                          <option>700 - Bold</option>
                          <option>400 - Normal</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-foreground">Size</label>
                        <div className="flex">
                          <Input className="h-8 text-xs rounded-r-none pr-1" defaultValue="48" />
                          <select className="h-8 text-[10px] bg-muted border border-input border-l-0 rounded-l-none px-1">
                            <option>px</option>
                            <option>rem</option>
                            <option>em</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-foreground">Color</label>
                        <div className="flex items-center gap-2 h-8 border border-input rounded-md px-2 bg-background">
                          <div className="w-4 h-4 rounded-full bg-slate-900 border border-border"></div>
                          <span className="text-xs font-mono">#0f172a</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </TabsContent>
            
          </Tabs>
        </div>

      </div>
    </div>
  );
}

function BuilderDraggable({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-3 bg-background border border-border/50 rounded-lg hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-colors cursor-grab active:cursor-grabbing group">
      <Icon className="w-5 h-5 text-muted-foreground group-hover:text-indigo-500 mb-2 transition-colors" />
      <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground">{label}</span>
    </div>
  );
}

function LayerNode({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-2 py-1.5 px-2 rounded-md text-sm cursor-pointer ${active ? 'bg-indigo-500/10 text-indigo-600 font-medium' : 'hover:bg-muted text-muted-foreground'}`}>
      <Icon className={`w-3.5 h-3.5 ${active ? 'text-indigo-600' : 'opacity-70'}`} />
      <span className="truncate">{label}</span>
      {active && <MoreHorizontal className="w-3.5 h-3.5 ml-auto opacity-50" />}
    </div>
  );
}

// Temporary imports for the components used locally
import { AlignVerticalSpaceAround, X } from "lucide-react";
