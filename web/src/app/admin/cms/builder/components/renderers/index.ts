import React from "react";
import { CoreRenderers } from "./core.renderers";
import { DataRenderers } from "./data.renderers";

export const Renderers: Record<string, React.FC<{ props: any, blockId: string, children?: React.ReactNode }>> = {
  ...CoreRenderers,
  ...DataRenderers,
};
