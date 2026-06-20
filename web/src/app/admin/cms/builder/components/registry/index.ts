import { CoreRegistry } from "./core.registry";
import { DataRegistry } from "./data.registry";
import { DashboardRegistry } from "./dashboard.registry";
import { ComponentDefinition } from "./types";

export const COMPONENT_REGISTRY: ComponentDefinition[] = [
  ...CoreRegistry,
  ...DataRegistry,
  ...DashboardRegistry,
];

export * from "./types";
