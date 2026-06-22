import React from "react";
import { useBuilderStore } from "@/store/builderStore";
import { Draggable, Droppable } from "@hello-pangea/dnd";

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

  // Helper to render the actual React element based on the AST type
  const renderElementContent = () => {
    switch (element.type) {
      case "Section":
      case "Container":
      case "Flex":
      case "Grid":
      case "Columns":
      case "Rows":
      case "Stack":
        return (
          <Droppable droppableId={id} type="ELEMENT">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={element.styles}
                className={`min-h-[100px] border border-dashed transition-colors ${
                  snapshot.isDraggingOver ? "bg-indigo-50/50 border-indigo-400" : "border-border/40"
                }`}
              >
                {element.children.map((childId, childIdx) => (
                  <BuilderNode key={childId} id={childId} index={childIdx} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        );

      case "H1":
      case "H2":
      case "H3":
      case "H4":
      case "H5":
      case "H6":
      case "Heading":
        const HeadingTag = element.type === "Heading" ? (element.props.level || "h2") as any : element.type.toLowerCase();
        return <HeadingTag style={element.styles}>{element.props.text}</HeadingTag>;

      case "Paragraph":
        return <p style={element.styles}>{element.props.text}</p>;

      case "Primary Button":
      case "Button":
        return (
          <button style={element.styles} className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
            {element.props.text}
          </button>
        );

      default:
        // Generic fallback for unimplemented components
        return (
          <div style={element.styles} className="p-4 bg-muted text-muted-foreground border border-border rounded-md flex items-center justify-center">
            {element.type} Component
          </div>
        );
    }
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={(e) => {
            e.stopPropagation();
            selectElement(id);
          }}
          className={`relative group transition-all outline-none ${
            isSelected ? "ring-2 ring-indigo-500 ring-offset-1" : "hover:ring-1 ring-indigo-300 ring-offset-1"
          } ${snapshot.isDragging ? "opacity-50 shadow-xl" : ""}`}
        >
          {isSelected && (
            <div className="absolute -top-6 -left-0.5 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-t-md z-50">
              {element.type}
            </div>
          )}
          {renderElementContent()}
        </div>
      )}
    </Draggable>
  );
}
