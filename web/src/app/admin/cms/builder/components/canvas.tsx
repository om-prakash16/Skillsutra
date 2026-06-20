"use client";

import { Droppable, Draggable } from "@hello-pangea/dnd";
import { COMPONENT_REGISTRY } from "./registry";
import { cn } from "@/lib/utils";
import { Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecursiveEngine } from "../core/engine";
import { InfiniteCanvas } from "./infinite-canvas";

import { useBuilderStore } from "../builder-store";

export interface CanvasBlock {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: CanvasBlock[];
}

interface CanvasProps {
  blocks: CanvasBlock[];
  onRemoveBlock: (id: string) => void;
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
}

export function Canvas({ blocks, onRemoveBlock, selectedBlockId, onSelectBlock }: CanvasProps) {
  const { activeBreakpoint } = useBuilderStore();
  
  const getCanvasWidth = () => {
    switch(activeBreakpoint) {
      case 'sm': return 'w-[375px]'; // Mobile
      case 'md': return 'w-[768px]'; // Tablet
      case 'lg': return 'w-[1024px]'; // Laptop
      case 'xl': return 'w-[1440px]'; // Desktop XL
      default: return 'w-[1200px]'; // Base Desktop
    }
  };

  return (
    <div className="flex-1 bg-muted/30 border-2 border-dashed border-border/50 rounded-3xl overflow-hidden relative">
      <InfiniteCanvas>
        <Droppable droppableId="canvas">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                `${getCanvasWidth()} transition-all duration-300 h-[800px] bg-background shadow-2xl border border-border/50 rounded-lg p-8`,
                snapshot.isDraggingOver ? "bg-emerald-500/5 border-emerald-500/50" : ""
              )}
            >
              {blocks.length === 0 && !snapshot.isDraggingOver && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-muted-foreground font-medium text-lg">Drag components here to build your layout.</p>
                </div>
              )}
              
              <div className="space-y-4 w-full h-full min-h-[500px]">
                {blocks.map((block, index) => (
                  <RecursiveEngine key={block.id} block={block} index={index} />
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </InfiniteCanvas>
    </div>
  );
}
