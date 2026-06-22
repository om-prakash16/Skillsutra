import React from "react";
import { useBuilderStore } from "@/store/builderStore";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { BuilderNode } from "./BuilderNode";

export function BuilderCanvas() {
  const { rootElements, selectedIds, selectElement } = useBuilderStore();

  return (
    <Droppable droppableId="canvas" type="ELEMENT">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`min-h-[500px] h-full w-full relative transition-colors ${
            snapshot.isDraggingOver ? "bg-indigo-50/50 ring-2 ring-indigo-500/50" : ""
          }`}
          onClick={(e) => {
            // If clicking directly on the canvas background, clear selection
            if (e.target === e.currentTarget) {
              useBuilderStore.getState().clearSelection();
            }
          }}
        >
          {rootElements.length === 0 && !snapshot.isDraggingOver && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-muted-foreground text-sm border-2 border-dashed border-border/50 p-8 rounded-xl bg-background/50">
                Drag and drop components here to start building.
              </p>
            </div>
          )}
          
          {rootElements.map((id, index) => (
            <BuilderNode key={id} id={id} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
