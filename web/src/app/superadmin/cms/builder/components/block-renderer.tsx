"use client";

import React from "react";
import { CanvasBlock } from "./canvas";
import { COMPONENT_REGISTRY } from "./registry";
import { Renderers } from "./renderers";

interface BlockRendererProps {
  block: CanvasBlock;
}

export function BlockRenderer({ block }: BlockRendererProps) {
  const { type, props, id } = block;

  const Renderer = Renderers[type];

  if (Renderer) {
    return <Renderer props={props} blockId={id} />;
  }

  // Fallback for legacy blocks or missing renderers
  const ComponentDef = COMPONENT_REGISTRY.find(c => c.type === type);
  return (
    <div className="p-6 bg-red-500/5 border border-dashed border-red-500/30 rounded-xl flex items-center gap-4 text-red-500/80 my-2">
      <div className="flex-1">
        <h4 className="font-bold">Missing Renderer for: {ComponentDef?.displayName || type}</h4>
        <p className="text-xs font-mono opacity-80 mt-1 truncate">Props: {JSON.stringify(props)}</p>
      </div>
    </div>
  );
}
