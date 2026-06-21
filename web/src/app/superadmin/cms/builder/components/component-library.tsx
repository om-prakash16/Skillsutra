"use client";

import React, { useState, useMemo } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Search, Library, Clock, Pin, Layers, ChevronRight, ChevronDown } from "lucide-react";
import { COMPONENT_REGISTRY } from "./registry";
import { DraggableBlock } from "./draggable-block";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBuilderStore } from "../builder-store";
import { CanvasBlock } from "./canvas";

const CATEGORIES = ['All', 'Layout', 'Typography', 'Media', 'UI Elements', 'Blocks', 'Forms', 'Navigation', 'Feedback', 'Overlay', 'Inputs'];

function LayerNode({ block, depth = 0 }: { block: CanvasBlock, depth?: number }) {
  const { selectedBlockId, selectBlock } = useBuilderStore();
  const [expanded, setExpanded] = useState(true);
  const def = COMPONENT_REGISTRY.find(c => c.type === block.type);
  const hasChildren = block.children && block.children.length > 0;
  
  return (
    <div className="select-none">
      <div 
        className={`flex items-center py-1.5 px-2 text-xs cursor-pointer hover:bg-muted/50 ${selectedBlockId === block.id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground'}`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={(e) => { e.stopPropagation(); selectBlock(block.id); }}
      >
        <div className="w-4 h-4 mr-1 flex items-center justify-center cursor-pointer opacity-50 hover:opacity-100" onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}>
          {hasChildren ? (expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />) : null}
        </div>
        {def && <def.icon className="w-3 h-3 mr-2 opacity-70" />}
        <span className="truncate">{def?.displayName || block.type}</span>
      </div>
      {expanded && hasChildren && (
        <div className="flex flex-col">
          {block.children!.map(child => (
            <LayerNode key={child.id} block={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ComponentLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { blocks, selectBlock } = useBuilderStore();

  const filteredComponents = useMemo(() => {
    return COMPONENT_REGISTRY.map((c, i) => ({ component: c, index: i }))
      .filter(({ component }) => {
        const matchesSearch = 
          component.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
          component.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || component.category === activeCategory;
        return matchesSearch && matchesCategory;
      });
  }, [searchTerm, activeCategory]);

  return (
    <div className="w-72 shrink-0 bg-card border-r border-border/50 flex flex-col h-full z-10">
      {/* Header & Search */}
      <div className="p-4 border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-10 space-y-4">
        <h3 className="font-black text-sm tracking-tight uppercase text-muted-foreground flex items-center gap-2">
          <Library className="w-4 h-4" />
          Component Library
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search components..." 
            className="pl-9 h-9 text-xs bg-muted/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="components" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full justify-start rounded-none border-b border-border px-4 h-12 bg-transparent space-x-2">
          <TabsTrigger value="components" className="data-[state=active]:bg-muted/50 data-[state=active]:shadow-none text-xs flex-1">Library</TabsTrigger>
          <TabsTrigger value="layers" className="data-[state=active]:bg-muted/50 data-[state=active]:shadow-none text-xs flex-1"><Layers className="w-3 h-3 mr-1" /> Layers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="components" className="flex-1 flex flex-col min-h-0 m-0">
          {/* Category Scroller */}
          <div className="overflow-x-auto custom-scrollbar border-b border-border px-2 py-2 flex shrink-0 space-x-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors ${
                  activeCategory === cat 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Draggable List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 relative">
            <Droppable droppableId="sidebar" isDropDisabled={true}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2 min-h-full"
                >
                  {filteredComponents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-center space-y-3">
                      <Search className="w-8 h-8 opacity-20" />
                      <p className="text-xs font-medium">No components found.</p>
                    </div>
                  ) : (
                    filteredComponents.map((item) => (
                      <DraggableBlock key={item.component.type} component={item.component} index={item.index} />
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </TabsContent>

        <TabsContent value="layers" className="flex-1 flex flex-col min-h-0 m-0 p-0 overflow-y-auto custom-scrollbar" onClick={() => selectBlock(null)}>
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-center space-y-3">
              <Layers className="w-8 h-8 opacity-20" />
              <p className="text-xs font-medium">No layers yet.<br/>Drag blocks to the canvas.</p>
            </div>
          ) : (
            <div className="py-2">
              {blocks.map(block => <LayerNode key={block.id} block={block} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
