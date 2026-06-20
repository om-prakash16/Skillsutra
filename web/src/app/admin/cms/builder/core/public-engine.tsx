"use client";

import React from "react";
import { CanvasBlock } from "../components/canvas";
import { Renderers } from "../components/renderers";

export function RenderEngine({ blocks }: { blocks: CanvasBlock[] }) {
  if (!blocks || !Array.isArray(blocks)) return null;

  return (
    <>
      {blocks.map((block) => {
        const Renderer = Renderers[block.type];

        if (!Renderer) {
          return null;
        }

        return (
          <Renderer key={block.id} props={block.props} blockId={block.id}>
            {block.children && block.children.length > 0 && (
              <RenderEngine blocks={block.children} />
            )}
          </Renderer>
        );
      })}
    </>
  );
}
