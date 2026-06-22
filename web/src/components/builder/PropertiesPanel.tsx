import React, { useState } from "react";
import { useBuilderStore } from "@/store/builderStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Edit3, Palette, Box, Layers, MousePointer2 } from "lucide-react";

export function PropertiesPanel() {
  const { selectedIds, elements, updateElementProps, updateElementStyles, clearSelection } = useBuilderStore();
  const [activeTab, setActiveTab] = useState("content");

  // Only handle single selection for the inspector for now
  const selectedId = selectedIds.length > 0 ? selectedIds[0] : null;
  const element = selectedId ? elements[selectedId] : null;

  if (!element) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center space-y-4">
        <MousePointer2 className="w-12 h-12 opacity-20" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">No Component Selected</p>
          <p className="text-xs">Click on any element in the canvas to edit its properties and styles.</p>
        </div>
      </div>
    );
  }

  const handlePropChange = (key: string, value: any) => {
    updateElementProps(element.id, { [key]: value });
  };

  const handleStyleChange = (key: string, value: any) => {
    updateElementStyles(element.id, { [key]: value });
  };

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden border-l border-border/50">
      {/* Header */}
      <div className="h-12 border-b border-border/50 flex items-center justify-between px-4 shrink-0 bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-xs font-bold tracking-wider uppercase">{element.type}</span>
        </div>
        <button onClick={clearSelection} className="text-xs text-muted-foreground hover:text-foreground">Deselect</button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full justify-start rounded-none border-b border-border/50 bg-transparent h-12 p-0 px-2 shrink-0">
          <TabsTrigger value="content" className="text-xs h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none">
            <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Content
          </TabsTrigger>
          <TabsTrigger value="styles" className="text-xs h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none">
            <Palette className="w-3.5 h-3.5 mr-1.5" /> Styles
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none">
            <Settings className="w-3.5 h-3.5 mr-1.5" /> Settings
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="content" className="p-4 m-0 space-y-6">
            
            {/* Dynamic Content Forms based on Props */}
            {element.props.text !== undefined && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Text Content</Label>
                {element.type === "Paragraph" ? (
                  <textarea 
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={element.props.text}
                    onChange={(e) => handlePropChange('text', e.target.value)}
                  />
                ) : (
                  <Input 
                    value={element.props.text} 
                    onChange={(e) => handlePropChange('text', e.target.value)}
                    className="text-sm font-medium"
                  />
                )}
              </div>
            )}

            {element.props.level !== undefined && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Heading Level</Label>
                <select 
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={element.props.level}
                  onChange={(e) => handlePropChange('level', e.target.value)}
                >
                  <option value="h1">H1 (Display)</option>
                  <option value="h2">H2 (Title)</option>
                  <option value="h3">H3 (Subtitle)</option>
                  <option value="h4">H4</option>
                  <option value="h5">H5</option>
                  <option value="h6">H6</option>
                </select>
              </div>
            )}

            {Object.keys(element.props).length === 0 && (
              <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-md border border-border/50 text-center">
                This component does not have editable text content. Switch to the Styles tab to configure its layout.
              </div>
            )}
          </TabsContent>

          <TabsContent value="styles" className="p-4 m-0 space-y-8">
            {/* Sizing */}
            <div className="space-y-4">
              <Label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Box className="w-3.5 h-3.5" /> Sizing
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] text-muted-foreground uppercase">Width</Label>
                  <Input 
                    value={element.styles.width || ""} 
                    onChange={(e) => handleStyleChange('width', e.target.value)}
                    placeholder="auto, 100%, 500px"
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] text-muted-foreground uppercase">Max W</Label>
                  <Input 
                    value={element.styles.maxWidth || ""} 
                    onChange={(e) => handleStyleChange('maxWidth', e.target.value)}
                    placeholder="none, 1200px"
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] text-muted-foreground uppercase">Height</Label>
                  <Input 
                    value={element.styles.height || ""} 
                    onChange={(e) => handleStyleChange('height', e.target.value)}
                    placeholder="auto, 100vh"
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] text-muted-foreground uppercase">Min H</Label>
                  <Input 
                    value={element.styles.minHeight || ""} 
                    onChange={(e) => handleStyleChange('minHeight', e.target.value)}
                    placeholder="0px"
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Spacing */}
            <div className="space-y-4">
              <Label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" /> Spacing (Margin / Padding)
              </Label>
              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg border border-border/50">
                <div className="space-y-2">
                  <Label className="text-[10px] text-muted-foreground uppercase">Margin</Label>
                  <Input 
                    value={element.styles.margin || ""} 
                    onChange={(e) => handleStyleChange('margin', e.target.value)}
                    placeholder="0 auto"
                    className="h-8 text-xs font-mono bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] text-muted-foreground uppercase">Padding</Label>
                  <Input 
                    value={element.styles.padding || ""} 
                    onChange={(e) => handleStyleChange('padding', e.target.value)}
                    placeholder="2rem 1rem"
                    className="h-8 text-xs font-mono bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Typography Styles */}
            <div className="space-y-4">
              <Label className="text-xs font-bold text-foreground uppercase tracking-wider">Typography</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] text-muted-foreground uppercase">Font Size</Label>
                  <Input 
                    value={element.styles.fontSize || ""} 
                    onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                    placeholder="inherit, 24px, 2rem"
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] text-muted-foreground uppercase">Font Weight</Label>
                  <Input 
                    value={element.styles.fontWeight || ""} 
                    onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                    placeholder="normal, 700, bold"
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label className="text-[10px] text-muted-foreground uppercase">Color</Label>
                  <Input 
                    value={element.styles.color || ""} 
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                    placeholder="#000000, inherit"
                    className="h-8 text-xs font-mono border-l-4"
                    style={{ borderLeftColor: element.styles.color || "transparent" }}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label className="text-[10px] text-muted-foreground uppercase">Text Align</Label>
                  <select 
                    className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    value={element.styles.textAlign || ""}
                    onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                  >
                    <option value="">Inherit</option>
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                    <option value="justify">Justify</option>
                  </select>
                </div>
              </div>
            </div>

          </TabsContent>

          <TabsContent value="settings" className="p-4 m-0 space-y-6">
            <div className="space-y-4">
              <Label className="text-xs font-bold text-foreground uppercase tracking-wider">Advanced</Label>
              <div className="space-y-2">
                <Label className="text-[10px] text-muted-foreground uppercase">ID Attribute</Label>
                <Input 
                  value={element.id} 
                  disabled
                  className="h-8 text-xs font-mono bg-muted text-muted-foreground"
                />
                <p className="text-[10px] text-muted-foreground">Unique identifier used for CSS targeting and anchor links.</p>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
