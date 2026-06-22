"use client";

import React from "react";
import { useBuilderStore } from "@/store/builderStore";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { getComponentRender } from "./registry";

// Container-type elements that can accept dropped children
const CONTAINER_TYPES = new Set([
  "Section", "Container", "Box", "Wrapper",
  "Flex", "Grid", "CSSGrid", "AutoGrid",
  "Stack", "HorizontalStack", "VerticalStack",
  "Columns", "Rows", "SplitLayout", "SidebarLayout",
  "HolyGrailLayout", "Masonry", "BasicCard",
]);

interface BuilderNodeProps {
  id: string;
  index: number;
}

export function BuilderNode({ id, index }: BuilderNodeProps) {
  const element = useBuilderStore((state) => state.elements[id]);
  const selectedIds = useBuilderStore((state) => state.selectedIds);
  const selectElement = useBuilderStore((state) => state.selectElement);

  if (!element) return null;

  const isSelected = selectedIds.includes(id);
  const isContainer = CONTAINER_TYPES.has(element.type);

  // Render children recursively
  const renderedChildren = element.children.map((childId, childIdx) => (
    <BuilderNode key={childId} id={childId} index={childIdx} />
  ));

  // Look up the render function from the central component registry
  const RegistryRender = getComponentRender(element.type);

  const elementContent = isContainer ? (
    // Container types get a Droppable zone for nesting
    <Droppable droppableId={id} type="ELEMENT">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`min-h-[60px] transition-colors ${
            snapshot.isDraggingOver
              ? "bg-indigo-50/50 outline-dashed outline-2 outline-indigo-400 outline-offset-2"
              : "outline-dashed outline-1 outline-border/40"
          }`}
        >
          {RegistryRender ? (
            <RegistryRender props={element.props} styles={element.styles}>
              {renderedChildren.length > 0 ? renderedChildren : null}
            </RegistryRender>
          ) : (
            <div style={element.styles}>
              {renderedChildren.length > 0 ? renderedChildren : (
                <div className="flex items-center justify-center min-h-[60px] text-xs text-muted-foreground/50 italic">
                  Drop components here
                </div>
              )}
            </div>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  ) : RegistryRender ? (
    // Non-container types just render their component
    <RegistryRender props={element.props} styles={element.styles} />
  ) : (
    // Fallback for unregistered component types
    <div
      style={element.styles}
      className="p-4 bg-muted text-muted-foreground border border-dashed border-border rounded-md flex items-center justify-center text-sm"
    >
      <span className="font-mono text-xs">{element.type}</span>
    </div>
  );

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          onClick={(e) => {
            e.stopPropagation();
            selectElement(id);
          }}
          className={`relative group transition-all outline-none ${
            isSelected
              ? "ring-2 ring-inset ring-indigo-500"
              : "hover:ring-1 hover:ring-inset hover:ring-indigo-300"
          } ${snapshot.isDragging ? "opacity-60 shadow-2xl scale-[1.01] z-50" : ""}`}
          style={{ ...provided.draggableProps.style }}
        >
          {/* Drag Handle - appears on hover at the top */}
          <div
            {...provided.dragHandleProps}
            className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full z-50 opacity-0 group-hover:opacity-100 transition-opacity
              bg-indigo-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-t-md cursor-grab active:cursor-grabbing whitespace-nowrap
              ${isSelected ? "opacity-100" : ""}
            `}
          >
            {element.type}
          </div>

          {elementContent}
        </div>
      )}
    </Draggable>
  );
}
