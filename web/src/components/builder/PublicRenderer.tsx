import React from "react";
import { BuilderElement } from "@/store/builderStore";
import { Button } from "@/components/ui/button";

interface PublicRendererProps {
  elements: Record<string, BuilderElement>;
  rootElements: string[];
}

export function PublicRenderer({ elements, rootElements }: PublicRendererProps) {
  if (!elements || !rootElements || rootElements.length === 0) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">This page is empty.</div>;
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      {rootElements.map((id) => (
        <RenderNode key={id} id={id} elements={elements} />
      ))}
    </div>
  );
}

function RenderNode({ id, elements }: { id: string, elements: Record<string, BuilderElement> }) {
  const element = elements[id];
  if (!element) return null;

  const { type, props, styles, children } = element;

  // Render children recursively
  const renderChildren = () => {
    if (!children || children.length === 0) return null;
    return children.map((childId) => (
      <RenderNode key={childId} id={childId} elements={elements} />
    ));
  };

  switch (type) {
    case "Section":
      return (
        <section style={{ ...styles, width: styles.width || "100%", padding: styles.padding || "4rem 2rem" }}>
          {renderChildren()}
        </section>
      );
      
    case "Container":
      return (
        <div style={{ ...styles, maxWidth: styles.maxWidth || "1200px", margin: styles.margin || "0 auto", width: styles.width || "100%" }}>
          {renderChildren()}
        </div>
      );
      
    case "Heading":
      const Tag = (props.level || "h2") as any;
      return (
        <Tag style={styles} className={`font-bold ${props.level === 'h1' ? 'text-5xl' : props.level === 'h2' ? 'text-4xl' : 'text-2xl'}`}>
          {props.text || "Heading"}
        </Tag>
      );
      
    case "Paragraph":
      return (
        <p style={{ ...styles, color: styles.color || "inherit" }} className="leading-relaxed">
          {props.text || "Paragraph text..."}
        </p>
      );
      
    case "Button":
      return (
        <Button variant={props.variant || "default"} style={styles}>
          {props.text || "Click Me"}
        </Button>
      );
      
    case "Flex":
      return (
        <div style={{ ...styles, display: "flex", gap: styles.gap || "1rem", flexDirection: styles.flexDirection || "row", alignItems: styles.alignItems || "center", justifyContent: styles.justifyContent || "flex-start" }}>
          {renderChildren()}
        </div>
      );

    case "Grid":
      return (
        <div style={{ ...styles, display: "grid", gap: styles.gap || "1rem", gridTemplateColumns: styles.gridTemplateColumns || "repeat(1, 1fr)" }}>
          {renderChildren()}
        </div>
      );

    case "Image":
      return (
        <img 
          src={props.src || "https://placehold.co/600x400"} 
          alt={props.alt || "Image"} 
          style={{ ...styles, width: styles.width || "100%", height: styles.height || "auto", objectFit: styles.objectFit || "cover" }} 
        />
      );

    // Fallback wrapper for unknown structural components
    default:
      return (
        <div style={styles}>
          {renderChildren()}
        </div>
      );
  }
}
