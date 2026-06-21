import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CanvasBlock } from "./canvas";
import { COMPONENT_REGISTRY } from "./registry";
import { Settings2, Trash2 } from "lucide-react";
import { ColorPicker } from "./color-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertySchemaDefinition, PropertyCategory } from "./property-schema";
import { Monitor, Smartphone, Tablet, Database, Link2, Code } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface PropertyInspectorProps {
  selectedBlock: CanvasBlock | null;
  onUpdateProps: (id: string, newProps: any) => void;
  onRemoveBlock: (id: string) => void;
}

const CATEGORIES: PropertyCategory[] = ['General', 'Layout', 'Style', 'Typography', 'Effects', 'Animation', 'Responsive', 'Interactions', 'Data', 'Conditions', 'Accessibility', 'SEO', 'Advanced'];

export function PropertyInspector({ selectedBlock, onUpdateProps, onRemoveBlock }: PropertyInspectorProps) {
  if (!selectedBlock) {
    return (
      <div className="w-80 shrink-0 bg-card border-l border-border/50 p-6 flex flex-col items-center justify-center text-center text-muted-foreground z-10">
        <Settings2 className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm">Select a component on the canvas to edit its properties.</p>
      </div>
    );
  }

  const componentDef = COMPONENT_REGISTRY.find(c => c.id === selectedBlock.type);
  const props = selectedBlock.props || {};
  const schema = componentDef?.propertySchema || [];

  const handlePropChange = (key: string, value: any) => {
    onUpdateProps(selectedBlock.id, { ...props, [key]: value });
  };

  const renderField = (field: PropertySchemaDefinition) => {
    // Check if the property is bound to a variable or CMS field
    const isBound = typeof props[field.id] === 'object' && props[field.id] !== null && props[field.id].__binding;
    
    if (isBound) {
      return (
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-md px-2 py-1 h-8">
           <Database className="w-3 h-3 text-primary" />
           <span className="text-xs text-primary font-mono truncate">{props[field.id].path}</span>
        </div>
      );
    }

    const val = props[field.id] ?? field.defaultValue ?? '';
    
    switch (field.type) {
      case 'text':
      case 'url':
        return (
          <Input 
            value={val} 
            onChange={(e) => handlePropChange(field.id, e.target.value)}
            className="h-8 text-xs bg-muted/50"
            placeholder={field.description || "Enter text..."}
          />
        );
      case 'number':
        return (
          <Input 
            type="number"
            value={val} 
            onChange={(e) => handlePropChange(field.id, parseFloat(e.target.value))}
            className="h-8 text-xs bg-muted/50"
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );
      case 'textarea':
      case 'richtext':
      case 'code':
      case 'markdown':
        return (
          <Textarea 
            value={val} 
            onChange={(e) => handlePropChange(field.id, e.target.value)}
            className="text-xs bg-muted/50 min-h-[80px] font-mono"
            placeholder="Type here..."
          />
        );
      case 'color':
        return (
          <ColorPicker 
            color={val} 
            onChange={(c) => handlePropChange(field.id, c)} 
          />
        );
      case 'select':
        return (
          <Select value={val} onValueChange={(v) => handlePropChange(field.id, v)}>
            <SelectTrigger className="h-8 text-xs bg-muted/50">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt: any) => (
                <SelectItem key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                  {typeof opt === 'string' ? opt : opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'switch':
      case 'toggle':
        return (
          <Switch 
            checked={!!val} 
            onCheckedChange={(c) => handlePropChange(field.id, c)} 
          />
        );
      default:
        return (
          <Input 
            value={typeof val === 'object' ? JSON.stringify(val) : val} 
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handlePropChange(field.id, parsed);
              } catch {
                handlePropChange(field.id, e.target.value);
              }
            }}
            className="h-8 text-xs bg-muted/50"
          />
        );
    }
  };

  // Group schema by category
  const categorizedSchema = CATEGORIES.reduce((acc, cat) => {
    const fields = schema.filter(s => s.category === cat);
    if (fields.length > 0) acc[cat] = fields;
    return acc;
  }, {} as Record<PropertyCategory, PropertySchemaDefinition[]>);

  // If a component has no explicit schema, fallback to rendering existing props in 'General'
  const hasSchema = schema.length > 0;
  const renderFallback = () => (
    <div className="space-y-4">
      {Object.entries(props).map(([key, value]) => (
        <div key={key} className="space-y-1.5">
          <Label className="text-xs font-bold capitalize text-muted-foreground">{key}</Label>
          {key.toLowerCase().includes('color') || key.toLowerCase().includes('bg') ? (
            <ColorPicker color={value as string} onChange={(c) => handlePropChange(key, c)} />
          ) : typeof value === 'string' && value.length > 50 ? (
            <Textarea value={value} onChange={(e) => handlePropChange(key, e.target.value)} className="text-xs bg-muted/50" />
          ) : typeof value === 'boolean' ? (
             <Switch checked={value} onCheckedChange={(c) => handlePropChange(key, c)} />
          ) : (
            <Input value={value as any} onChange={(e) => handlePropChange(key, e.target.value)} className="h-8 text-xs bg-muted/50" />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-80 shrink-0 bg-card border-l border-border/50 flex flex-col h-full z-10">
      <div className="p-4 border-b border-border/50 flex items-center justify-between sticky top-0 bg-card/80 backdrop-blur-md z-10">
        <div>
          <h3 className="font-bold tracking-tight text-sm">{componentDef?.displayName || 'Component'}</h3>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mt-0.5">ID: {selectedBlock.id.slice(0, 8)}</p>
        </div>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 w-8" onClick={() => onRemoveBlock(selectedBlock.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {hasSchema ? (
          <Tabs defaultValue={Object.keys(categorizedSchema)[0]} className="w-full">
            <div className="sticky top-0 bg-card z-10 border-b border-border px-2 py-1">
              <TabsList className="w-full flex overflow-x-auto custom-scrollbar justify-start bg-transparent h-auto p-1 space-x-1">
                {Object.keys(categorizedSchema).map((cat) => (
                  <TabsTrigger 
                    key={cat} 
                    value={cat}
                    className="text-[10px] px-2.5 py-1 uppercase tracking-wider font-bold data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                  >
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {Object.entries(categorizedSchema).map(([cat, fields]) => (
              <TabsContent key={cat} value={cat} className="p-4 m-0 space-y-4">
                {fields.map((field) => (
                  <div key={field.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Label className="text-xs font-bold text-muted-foreground">{field.label}</Label>
                        {field.bindable && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="w-4 h-4 hover:bg-muted rounded-md flex items-center justify-center text-muted-foreground hover:text-primary transition-colors ml-1">
                                <Link2 className="w-3 h-3" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-2 text-xs" side="left">
                              <p className="font-bold mb-2">Data Binding</p>
                              <Input 
                                placeholder="e.g. {{cms.author.name}}" 
                                className="h-8 text-xs font-mono" 
                                onChange={(e) => handlePropChange(field.id, { __binding: true, path: e.target.value })}
                              />
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                      
                      {field.responsive && (
                        <div className="flex items-center gap-0.5 bg-muted/30 rounded p-0.5 border border-border/50">
                          <button className="w-5 h-5 rounded hover:bg-background flex items-center justify-center text-muted-foreground hover:text-foreground"><Monitor className="w-3 h-3" /></button>
                          <button className="w-5 h-5 rounded hover:bg-background flex items-center justify-center text-muted-foreground hover:text-foreground"><Tablet className="w-3 h-3" /></button>
                          <button className="w-5 h-5 rounded hover:bg-background flex items-center justify-center text-muted-foreground hover:text-foreground"><Smartphone className="w-3 h-3" /></button>
                        </div>
                      )}
                    </div>
                    {renderField(field)}
                    {field.description && <p className="text-[10px] text-muted-foreground leading-tight">{field.description}</p>}
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="p-4">
            <div className="mb-4 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
               <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">This component does not have a formal schema defined. Showing raw properties.</p>
            </div>
            {renderFallback()}
          </div>
        )}
      </div>
    </div>
  );
}
