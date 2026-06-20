import React from "react";
import { PropertySchemaDefinition } from "../property-schema";

export type ComponentCategory = 
  // Core
  | 'Layout' | 'Typography' | 'Media' | 'UI Elements' | 'Blocks' 
  | 'Forms' | 'Navigation' | 'Feedback' | 'Overlay' | 'Inputs'
  | 'Utility' | 'Authentication'
  // Phase 3 Extensions
  | 'Data Display' | 'Charts' | 'CMS' | 'Marketing' 
  // Phase 4 Extensions (Enterprise)
  | 'Ecommerce' | 'Shopping' | 'Customer' 
  | 'Dashboard' | 'Advanced Data' | 'Advanced Charts' 
  | 'AI' | 'Workflow' | 'Organization' | 'Financial' 
  | 'File Management' | 'Communication' | 'Scheduling' 
  | 'Maps' | 'Developer' | 'Integrations';

export interface ComponentDefinition {
  id: string;
  type: string;
  displayName: string;
  label: string;
  category: ComponentCategory;
  icon: React.ElementType;
  description?: string;
  keywords?: string[];
  tags?: string[];
  version?: string;
  author?: string;
  supportsChildren?: boolean;
  supportsResponsive?: boolean;
  supportsAnimation?: boolean;
  supportsDataBinding?: boolean;
  supportsVisibility?: boolean;
  supportsConditions?: boolean;
  defaultProps?: Record<string, any>;
  propertySchema?: PropertySchemaDefinition[];
}
