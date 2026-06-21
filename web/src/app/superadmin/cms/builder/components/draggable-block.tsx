"use client";

import { Draggable } from "@hello-pangea/dnd";
import { ComponentDefinition } from "./registry";
import { Card, CardContent } from "@/components/ui/card";

interface DraggableBlockProps {
  component: ComponentDefinition;
  index: number;
}

export function DraggableBlock({ component, index }: DraggableBlockProps) {
  return (
    <Draggable draggableId={`sidebar-${component.type}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 transition-transform ${snapshot.isDragging ? 'z-50 shadow-xl' : ''}`}
          style={provided.draggableProps.style}
        >
          <Card className="glass cursor-grab active:cursor-grabbing hover:border-indigo-500/50 transition-colors">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                <component.icon className="w-5 h-5" />
              </div>
              <span className="font-medium text-sm">{component.label}</span>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
}
