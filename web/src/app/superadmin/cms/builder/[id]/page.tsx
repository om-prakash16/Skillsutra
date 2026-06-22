"use client";

import React, { useState } from "react";
import { 
  Layers, MousePointer2, Type, Image as ImageIcon, Box, LayoutGrid, 
  Smartphone, Monitor, Tablet, Play, Save, ChevronLeft, Settings, 
  ListTree, Code, Plus, MoreHorizontal, Undo, Redo, Eye, Database, SplitSquareHorizontal,
  AlignVerticalSpaceAround, X, Type as TypeIcon, Image as ImageIcon2, MessageSquare, ShoppingCart, Activity, BrainCircuit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useBuilderStore } from "@/store/builderStore";
import { BuilderCanvas } from "@/components/builder/BuilderCanvas";
import { PropertiesPanel } from "@/components/builder/PropertiesPanel";

import { toast } from "sonner";

export default function VisualBuilderPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [deviceMap, setDeviceMap] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeRightTab, setActiveRightTab] = useState("styles");
  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { addElement, moveElement, elements, rootElements, setElements } = useBuilderStore();

  React.useEffect(() => {
    setIsMounted(true);
    // Fetch data from backend
    const fetchPageData = async () => {
      try {
        const res = await fetch(`/api/v1/builder/pages/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch page data");
        const data = await res.json();
        
        if (data.component_tree && data.component_tree.elements) {
          setElements(data.component_tree);
        }
      } catch (error) {
        console.error("Error loading page:", error);
        toast.error("Failed to load page data.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (params.id) {
      fetchPageData();
    } else {
      setIsLoading(false);
    }
  }, [params.id, setElements]);

  const canPublish = ["super_admin", "ai_admin"].includes(user?.role as string);

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      const payload = { component_tree: { elements, rootElements } };
      const res = await fetch(`/api/v1/builder/pages/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("Failed to save changes");
      toast.success("Page published successfully!");
    } catch (error) {
      console.error("Publish error:", error);
      toast.error("Failed to publish changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return; 

    if (source.droppableId.startsWith('library-') && destination.droppableId === 'canvas') {
      const type = draggableId.split('-').slice(2).join('-'); 
      addElement(type, null, destination.index);
    } 
    else if (source.droppableId.startsWith('library-') && destination.droppableId !== 'canvas') {
      const type = draggableId.split('-').slice(2).join('-');
      addElement(type, destination.droppableId, destination.index);
    }
    else {
      const elementId = draggableId;
      const newParentId = destination.droppableId === 'canvas' ? null : destination.droppableId;
      moveElement(elementId, newParentId, destination.index);
    }
  };

  if (!isMounted) return null;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen w-full bg-background overflow-hidden absolute inset-0 z-50">
      
      {/* Top Navbar */}
      <header className="h-14 border-b border-border/50 bg-background flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/superadmin/cms/pages">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><ChevronLeft className="w-4 h-4" /></Button>
          </Link>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none">Enterprise Landing Page</span>
            <span className="text-[10px] text-muted-foreground font-mono mt-1">/ (Published)</span>
          </div>
        </div>

        {/* Viewport Toggles */}
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/50">
          <Button variant={deviceMap === "desktop" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setDeviceMap("desktop")}><Monitor className="w-3.5 h-3.5" /></Button>
          <Button variant={deviceMap === "tablet" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setDeviceMap("tablet")}><Tablet className="w-3.5 h-3.5" /></Button>
          <Button variant={deviceMap === "mobile" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setDeviceMap("mobile")}><Smartphone className="w-3.5 h-3.5" /></Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 mr-4 border-r border-border/50 pr-4">
            <Button variant="ghost" size="icon" className="h-8 w-8"><Undo className="w-4 h-4 text-muted-foreground" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Redo className="w-4 h-4 text-muted-foreground" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 ml-2"><Eye className="w-4 h-4 text-muted-foreground" /></Button>
          </div>
          <Button variant="outline" size="sm" className="h-8"><Play className="w-3.5 h-3.5 mr-2" /> Preview</Button>
          {canPublish ? (
            <Button size="sm" className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handlePublish} disabled={isSaving || isLoading}>
              <Save className="w-3.5 h-3.5 mr-2" /> {isSaving ? "Publishing..." : "Publish Changes"}
            </Button>
          ) : (
            <Button size="sm" className="h-8 bg-orange-500 hover:bg-orange-600 text-white"><Save className="w-3.5 h-3.5 mr-2" /> Request Publish</Button>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar: Elements & Tree */}
        <div className="w-[280px] border-r border-border/50 bg-muted/10 flex flex-col shrink-0">
          <Tabs defaultValue="add" className="w-full h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b border-border/50 bg-transparent h-12 p-0 px-2 shrink-0">
              <TabsTrigger value="add" className="text-xs h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none"><Plus className="w-3.5 h-3.5 mr-1.5"/> Add</TabsTrigger>
              <TabsTrigger value="tree" className="text-xs h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none"><ListTree className="w-3.5 h-3.5 mr-1.5"/> Layers</TabsTrigger>
              <TabsTrigger value="assets" className="text-xs h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none"><ImageIcon className="w-3.5 h-3.5 mr-1.5"/> Assets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="add" className="flex-1 overflow-y-auto m-0">
              <div className="p-3 pb-2 sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b border-border/50">
                <Input placeholder="Search components..." className="h-8 text-xs bg-muted/50" />
              </div>
              <Accordion type="multiple" defaultValue={["Layout", "Typography"]} className="w-full">
                {COMPONENT_CATEGORIES.map((category) => (
                  <AccordionItem value={category.name} key={category.name} className="border-b border-border/50">
                    <AccordionTrigger className="py-3 px-4 text-xs font-semibold hover:no-underline hover:bg-muted/30 uppercase tracking-wider text-muted-foreground">
                      {category.name}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-1">
                      <Droppable droppableId={`library-${category.name}`} isDropDisabled={true}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps} className="grid grid-cols-2 gap-2">
                            {category.items.map((item, idx) => (
                              <BuilderDraggable key={item.name} icon={item.icon || Box} label={item.name} index={idx} category={category.name} />
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="tree" className="flex-1 overflow-y-auto m-0 p-0">
              <div className="p-2 space-y-0.5">
                <LayerNode icon={LayoutGrid} label="Hero Section" active={false} />
                <div className="pl-4 space-y-0.5">
                  <LayerNode icon={Box} label="Container" active={false} />
                  <div className="pl-4 space-y-0.5">
                    <LayerNode icon={Type} label="Heading 1" active={true} />
                    <LayerNode icon={Type} label="Paragraph" active={false} />
                    <LayerNode icon={MousePointer2} label="Primary Button" active={false} />
                  </div>
                </div>
                <LayerNode icon={LayoutGrid} label="Features Section" active={false} />
                <LayerNode icon={LayoutGrid} label="Footer" active={false} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Center: Canvas Area */}
        <div className="flex-1 bg-muted/30 relative overflow-hidden flex flex-col items-center">
          
          <div className="w-full flex items-center justify-between p-2 absolute top-0 z-10 bg-background/50 backdrop-blur-sm border-b border-border/50">
            <div className="text-xs text-muted-foreground font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Canvas Ready
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground font-medium border border-border/50 px-2 py-1 rounded">1920 x 1080</span>
            </div>
          </div>

          <div className="w-full h-full p-12 overflow-auto flex items-start justify-center pt-16">
            {/* The Actual Canvas Document */}
            <div 
              className={`bg-background shadow-2xl ring-1 ring-border/50 min-h-[800px] transition-all duration-300 relative ${
                deviceMap === "desktop" ? "w-full max-w-[1200px]" : 
                deviceMap === "tablet" ? "w-[768px]" : "w-[375px]"
              }`}
            >
              <BuilderCanvas />
            </div>
          </div>
          
          {/* Bottom Breadcrumbs */}
          <div className="h-8 bg-background border-t border-border/50 flex items-center px-4 text-[11px] font-mono text-muted-foreground gap-2 shrink-0">
            <span className="hover:text-primary cursor-pointer">Body</span>
            <ChevronLeft className="w-3 h-3 rotate-180" />
            <span className="hover:text-primary cursor-pointer">Hero Section</span>
            <ChevronLeft className="w-3 h-3 rotate-180" />
            <span className="hover:text-primary cursor-pointer">Container</span>
            <ChevronLeft className="w-3 h-3 rotate-180" />
            <span className="text-primary font-bold bg-primary/10 px-1 rounded">Heading 1</span>
          </div>
        </div>

        {/* Right Sidebar: Properties */}
        <div className="w-[320px] border-l border-border/50 bg-background flex flex-col shrink-0">
          <PropertiesPanel />
        </div>

      </div>
      </div>
    </DragDropContext>
  );
}

function BuilderDraggable({ icon: Icon, label, index, category }: { icon: any, label: string, index?: number, category?: string }) {
  const draggableId = category && index !== undefined ? `library-${category}-${label}` : `mock-${label}`;
  return (
    <Draggable draggableId={draggableId} index={index || 0} isDragDisabled={!category}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`flex flex-col items-center justify-center p-3 bg-background border rounded-lg transition-colors cursor-grab active:cursor-grabbing group ${
            snapshot.isDragging ? "border-indigo-500 shadow-xl opacity-90 scale-105 z-50 bg-indigo-50" : "border-border/50 hover:border-indigo-500/50 hover:bg-indigo-500/5"
          }`}
          style={{ ...provided.draggableProps.style }}
        >
          <Icon className={`w-5 h-5 mb-2 transition-colors ${snapshot.isDragging ? "text-indigo-600" : "text-muted-foreground group-hover:text-indigo-500"}`} />
          <span className={`text-[10px] font-medium ${snapshot.isDragging ? "text-indigo-900" : "text-muted-foreground group-hover:text-foreground"}`}>{label}</span>
        </div>
      )}
    </Draggable>
  );
}

function LayerNode({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-2 py-1.5 px-2 rounded-md text-sm cursor-pointer ${active ? 'bg-indigo-500/10 text-indigo-600 font-medium' : 'hover:bg-muted text-muted-foreground'}`}>
      <Icon className={`w-3.5 h-3.5 ${active ? 'text-indigo-600' : 'opacity-70'}`} />
      <span className="truncate">{label}</span>
      {active && <MoreHorizontal className="w-3.5 h-3.5 ml-auto opacity-50" />}
    </div>
  );
}

const COMPONENT_CATEGORIES = [
  {
    name: "Layout",
    items: [
      { name: "Section", icon: LayoutGrid }, { name: "Container", icon: Box }, { name: "Flex", icon: Layers },
      { name: "Grid", icon: SplitSquareHorizontal }, { name: "Columns", icon: SplitSquareHorizontal }, { name: "Rows", icon: Layers },
      { name: "Stack", icon: Layers }, { name: "Spacer", icon: Box }, { name: "Divider", icon: Box },
      { name: "Tabs", icon: Box }, { name: "Accordion", icon: Box }, { name: "Carousel", icon: Box },
      { name: "Timeline", icon: Box }, { name: "Masonry", icon: LayoutGrid }, { name: "Sidebar", icon: Box },
      { name: "Drawer", icon: Box }, { name: "Modal", icon: Box }, { name: "Offcanvas", icon: Box },
      { name: "Sticky Section", icon: Box }, { name: "Hero", icon: LayoutGrid }, { name: "Feature Grid", icon: LayoutGrid },
      { name: "Pricing", icon: Box }, { name: "FAQ", icon: Box }, { name: "Testimonial", icon: Box },
      { name: "CTA", icon: Box }, { name: "Footer", icon: Box }, { name: "Header", icon: Box },
      { name: "Mega Menu", icon: Box }, { name: "Breadcrumb", icon: Box }, { name: "Card", icon: Box }, { name: "List", icon: ListTree }
    ]
  },
  {
    name: "Typography",
    items: [
      { name: "H1", icon: TypeIcon }, { name: "H2", icon: TypeIcon }, { name: "H3", icon: TypeIcon },
      { name: "H4", icon: TypeIcon }, { name: "H5", icon: TypeIcon }, { name: "H6", icon: TypeIcon },
      { name: "Paragraph", icon: TypeIcon }, { name: "Small", icon: TypeIcon }, { name: "Caption", icon: TypeIcon },
      { name: "Display", icon: TypeIcon }, { name: "Quote", icon: TypeIcon }, { name: "Rich Text", icon: TypeIcon },
      { name: "Markdown", icon: Code }, { name: "Code Block", icon: Code }, { name: "Inline Code", icon: Code },
      { name: "Highlight", icon: TypeIcon }, { name: "Badge", icon: Box }, { name: "Label", icon: TypeIcon }, { name: "Number", icon: TypeIcon }
    ]
  },
  {
    name: "Buttons",
    items: [
      { name: "Primary Button", icon: MousePointer2 }, { name: "Secondary", icon: MousePointer2 },
      { name: "Outline", icon: MousePointer2 }, { name: "Ghost", icon: MousePointer2 },
      { name: "Link", icon: MousePointer2 }, { name: "Icon Button", icon: MousePointer2 },
      { name: "Floating Button", icon: MousePointer2 }, { name: "Split Button", icon: MousePointer2 },
      { name: "Dropdown Button", icon: MousePointer2 }, { name: "Toggle Button", icon: MousePointer2 },
      { name: "FAB", icon: MousePointer2 }, { name: "Button Group", icon: MousePointer2 }
    ]
  },
  {
    name: "Forms",
    items: [
      { name: "Form", icon: Box }, { name: "Input", icon: TypeIcon }, { name: "Textarea", icon: TypeIcon },
      { name: "Email", icon: TypeIcon }, { name: "Password", icon: TypeIcon }, { name: "Number", icon: TypeIcon },
      { name: "Phone", icon: TypeIcon }, { name: "OTP", icon: Box }, { name: "Date", icon: Box },
      { name: "Time", icon: Box }, { name: "Date Range", icon: Box }, { name: "Checkbox", icon: Box },
      { name: "Radio", icon: Box }, { name: "Toggle", icon: Box }, { name: "Range Slider", icon: Box },
      { name: "Rating", icon: Box }, { name: "Color Picker", icon: Box }, { name: "File Upload", icon: Box },
      { name: "Image Upload", icon: ImageIcon2 }, { name: "Signature", icon: Box }, { name: "Search", icon: Box },
      { name: "Select", icon: Box }, { name: "Multi Select", icon: Box }, { name: "Tag Input", icon: Box },
      { name: "Autocomplete", icon: Box }, { name: "Combobox", icon: Box }
    ]
  },
  {
    name: "Media",
    items: [
      { name: "Image", icon: ImageIcon2 }, { name: "Video", icon: Play }, { name: "Audio", icon: Play },
      { name: "Lottie", icon: Play }, { name: "SVG", icon: ImageIcon2 }, { name: "Icon", icon: ImageIcon2 },
      { name: "Gallery", icon: ImageIcon2 }, { name: "Carousel", icon: ImageIcon2 }, { name: "Lightbox", icon: ImageIcon2 },
      { name: "Background Video", icon: Play }, { name: "PDF Viewer", icon: Box }, { name: "Map", icon: Box },
      { name: "QRCode", icon: Box }, { name: "Barcode", icon: Box }
    ]
  },
  {
    name: "Data",
    items: [
      { name: "Table", icon: Box }, { name: "Data Grid", icon: LayoutGrid }, { name: "List", icon: ListTree },
      { name: "Repeater", icon: Layers }, { name: "Collection List", icon: Database }, { name: "CMS Collection", icon: Database },
      { name: "API Collection", icon: Database }, { name: "Pagination", icon: Box }, { name: "Filter", icon: Box },
      { name: "Search", icon: Box }, { name: "Sorting", icon: Box }, { name: "Charts", icon: Activity },
      { name: "Calendar", icon: Box }, { name: "Timeline", icon: Box }, { name: "Kanban", icon: LayoutGrid },
      { name: "Statistics", icon: Activity }, { name: "Metric Cards", icon: LayoutGrid }, { name: "Progress", icon: Activity },
      { name: "Avatar", icon: Box }, { name: "Badge", icon: Box }, { name: "Tags", icon: Box }
    ]
  },
  {
    name: "Commerce",
    items: [
      { name: "Product Grid", icon: ShoppingCart }, { name: "Product Card", icon: ShoppingCart },
      { name: "Cart", icon: ShoppingCart }, { name: "Checkout", icon: ShoppingCart },
      { name: "Wishlist", icon: ShoppingCart }, { name: "Reviews", icon: MessageSquare },
      { name: "Coupon", icon: ShoppingCart }, { name: "Price", icon: ShoppingCart },
      { name: "Inventory", icon: Database }, { name: "Orders", icon: ShoppingCart },
      { name: "Subscriptions", icon: ShoppingCart }
    ]
  },
  {
    name: "Navigation",
    items: [
      { name: "Navbar", icon: Box }, { name: "Sidebar", icon: Box }, { name: "Mega Menu", icon: Box },
      { name: "Footer", icon: Box }, { name: "Tabs", icon: Box }, { name: "Breadcrumb", icon: Box },
      { name: "Pagination", icon: Box }, { name: "Anchor", icon: Box }, { name: "Scroll Spy", icon: Box },
      { name: "Search", icon: Box }, { name: "Command Palette", icon: Box }
    ]
  },
  {
    name: "Marketing",
    items: [
      { name: "Popup", icon: Box }, { name: "Announcement Bar", icon: Box }, { name: "Cookie Banner", icon: Box },
      { name: "Newsletter", icon: MessageSquare }, { name: "Contact Form", icon: MessageSquare },
      { name: "Countdown", icon: Activity }, { name: "Pricing", icon: Box }, { name: "Testimonials", icon: MessageSquare },
      { name: "FAQ", icon: MessageSquare }, { name: "Partners", icon: Box }, { name: "Logo Cloud", icon: ImageIcon2 },
      { name: "CTA", icon: Box }, { name: "Lead Form", icon: Box }, { name: "Referral", icon: Box }
    ]
  },
  {
    name: "AI",
    items: [
      { name: "AI Chat", icon: BrainCircuit }, { name: "AI Search", icon: BrainCircuit }, { name: "AI Prompt", icon: BrainCircuit },
      { name: "AI Assistant", icon: BrainCircuit }, { name: "AI Recommendation", icon: BrainCircuit },
      { name: "AI Summary", icon: BrainCircuit }, { name: "AI Form", icon: BrainCircuit }, { name: "AI Workflow", icon: BrainCircuit }
    ]
  }
];
