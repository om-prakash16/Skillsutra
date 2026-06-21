"use client";

import React from "react";
import { CanvasBlock } from "../components/canvas";
import { COMPONENT_REGISTRY } from "../components/registry";
import { Renderers } from "../components/renderers";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "../builder-store";

export interface RecursiveEngineProps {
  block: CanvasBlock;
  index: number;
}

export function RecursiveEngine({ block, index }: RecursiveEngineProps) {
  const { type, props, id, children } = block;
  const { selectedBlockId, selectBlock, deleteBlock } = useBuilderStore();

  const ComponentDef = COMPONENT_REGISTRY.find(c => c.type === type);
  const Renderer = Renderers[type];
  const isSelected = selectedBlockId === id;

  // We wrap every node in a Draggable, so it can be moved around
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={(e) => {
            e.stopPropagation();
            selectBlock(id);
          }}
          className={cn(
            "relative group transition-all duration-200 outline-none my-2",
            snapshot.isDragging ? "opacity-50 z-50 shadow-2xl scale-105" : "opacity-100",
            isSelected ? "ring-2 ring-emerald-500 rounded-md ring-offset-2 ring-offset-background" : "hover:ring-1 hover:ring-emerald-500/50 hover:rounded-md"
          )}
        >
          {/* Controls Overlay */}
          <div className={cn(
            "absolute -top-6 right-0 flex items-center gap-1 bg-emerald-500 text-white rounded-t-md px-2 py-1 z-20 transition-opacity duration-200 text-xs font-bold",
            isSelected ? "opacity-100" : "opacity-0"
          )}>
            <span>{ComponentDef?.displayName || type}</span>
            <button 
              className="ml-2 hover:text-red-200"
              onClick={(e) => {
                e.stopPropagation();
                deleteBlock(id);
              }}
            >
              🗑️
            </button>
          </div>

          {/* Render Component */}
          {Renderer ? (
            // If the component supports children, we inject a Droppable area inside it
            <Renderer props={props} blockId={id}>
              {ComponentDef?.supportsChildren && (
                <Droppable droppableId={id} type="block">
                  {(dropProvided, dropSnapshot) => (
                    <div
                      ref={dropProvided.innerRef}
                      {...dropProvided.droppableProps}
                      className={cn(
                        "min-h-[50px] transition-colors p-2 rounded-md",
                        dropSnapshot.isDraggingOver ? "bg-emerald-500/10 border-2 border-dashed border-emerald-500/50" : "",
                        (!children || children.length === 0) ? "border-2 border-dashed border-border/30" : ""
                      )}
                    >
                      {(!children || children.length === 0) && !dropSnapshot.isDraggingOver && (
                        <div className="w-full h-full flex items-center justify-center pointer-events-none opacity-50 text-xs py-4">
                          Drop items here
                        </div>
                      )}
                      {children?.map((child, i) => (
                        <RecursiveEngine key={child.id} block={child} index={i} />
                      ))}
                      {dropProvided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </Renderer>
          ) : (
            <div className="p-4 bg-red-500/10 border border-red-500 rounded-md text-red-500">
              Missing Renderer: {type}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
