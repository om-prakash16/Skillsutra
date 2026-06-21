export type PropertyCategory = 
  | 'General'
  | 'Layout'
  | 'Style'
  | 'Typography'
  | 'Effects'
  | 'Animation'
  | 'Responsive'
  | 'Interactions'
  | 'Data'
  | 'Conditions'
  | 'Accessibility'
  | 'SEO'
  | 'Advanced';

export type PropertyType = 
  | 'text' | 'textarea' | 'number' | 'slider' | 'toggle' | 'switch'
  | 'color' | 'gradient' | 'shadow' | 'border' | 'radius' | 'spacing'
  | 'typography' | 'icon' | 'image' | 'video' | 'url' | 'file'
  | 'json' | 'richtext' | 'code' | 'markdown' | 'select' | 'multiselect'
  | 'date' | 'time' | 'variable' | 'cms_binding' | 'expression';

export interface PropertyOption {
  label: string;
  value: string | number | boolean;
  icon?: any; // e.g. Lucide Icon
}

export interface PropertySchemaDefinition {
  id: string;              // The key in the props object (e.g., 'backgroundColor')
  name?: string;           // Display name (defaults to id capitalized)
  label: string;           // User-facing label (e.g., 'Background Color')
  category: PropertyCategory; // Tab to show this property under
  type: PropertyType;      // The UI control to render
  defaultValue?: any;      // Default value for this prop
  
  // Advanced settings
  responsive?: boolean;    // Whether this prop supports separate values per breakpoint
  bindable?: boolean;      // Whether this prop can be bound to CMS data / Variables
  group?: string;          // Sub-group within a category (e.g. 'Margins' inside 'Layout')
  description?: string;    // Tooltip description to help the user
  
  // Validation
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
  
  // Visibility conditions (e.g. show this prop only if another prop equals a certain value)
  conditions?: {
    dependsOn: string;     // The id of another property
    equals?: any;          // Show if the depended property equals this
    notEquals?: any;
    contains?: any;
  };

  // Specific settings for certain types (e.g. options for 'select')
  options?: PropertyOption[] | string[];
}
