"use client";

import React from "react";
import { CanvasBlock } from "../canvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import { Loader2, Star, ArrowLeft, AlertTriangle, MessageCircle, FileUp, LayoutTemplate, Search } from "lucide-react";

export const CoreRenderers: Record<string, React.FC<{ props: any, blockId: string, children?: React.ReactNode }>> = {
  // Layout
  container: ({ props, children }) => (
    <div className={`w-full ${props.padding || 'p-4'} ${props.bg || 'bg-transparent'} rounded-xl min-h-[100px] flex items-center justify-center border border-dashed border-border/30 hover:border-primary/50 transition-colors`}>
      {children || <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Container Area</span>}
    </div>
  ),
  grid: ({ props }) => (
    <div className={`w-full grid ${props.gap || 'gap-4'}`} style={{ gridTemplateColumns: `repeat(${props.columns || 2}, minmax(0, 1fr))` }}>
      {Array.from({ length: props.columns || 2 }).map((_, i) => (
         <div key={i} className="bg-muted/10 border border-dashed border-border/50 rounded-lg min-h-[80px] flex items-center justify-center">
           <span className="text-xs text-muted-foreground">Grid Cell {i+1}</span>
         </div>
      ))}
    </div>
  ),
  section: ({ props, children }) => (
    <section className="w-full py-16 px-8 border-y border-dashed border-border/50 bg-background" style={{ minHeight: props.minHeight || '50vh' }}>
       <div className="max-w-6xl mx-auto h-full flex items-center justify-center border border-dashed border-border/30 rounded-xl">
           {children || <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Section Content Area</span>}
       </div>
    </section>
  ),
  flex: ({ props }) => (
    <div className="w-full flex gap-4 p-4 border border-dashed border-border/30 rounded-xl min-h-[80px] items-center justify-between">
        <div className="flex-1 h-12 bg-muted/20 rounded border border-dashed border-border/50 flex items-center justify-center text-xs text-muted-foreground">Flex Item</div>
        <div className="flex-1 h-12 bg-muted/20 rounded border border-dashed border-border/50 flex items-center justify-center text-xs text-muted-foreground">Flex Item</div>
    </div>
  ),
  row: ({ props }) => (
    <div className="w-full flex gap-4 p-4 border border-dashed border-border/30 rounded-xl min-h-[80px] items-center justify-between">
        <div className="flex-1 h-12 bg-muted/20 rounded border border-dashed border-border/50 flex items-center justify-center text-xs text-muted-foreground">Row Item</div>
        <div className="flex-1 h-12 bg-muted/20 rounded border border-dashed border-border/50 flex items-center justify-center text-xs text-muted-foreground">Row Item</div>
    </div>
  ),
  column: ({ props }) => (
    <div className="w-full flex flex-col gap-4 p-4 border border-dashed border-border/30 rounded-xl min-h-[150px]">
        <div className="w-full h-12 bg-muted/20 rounded border border-dashed border-border/50 flex items-center justify-center text-xs text-muted-foreground">Col Item</div>
        <div className="w-full h-12 bg-muted/20 rounded border border-dashed border-border/50 flex items-center justify-center text-xs text-muted-foreground">Col Item</div>
    </div>
  ),
  spacer: ({ props }) => <div style={{ height: props.height || '32px' }} className="w-full bg-muted/10 border-y border-dashed border-border/30" title="Spacer" />,
  stack: ({ props }) => (
    <div className={`w-full flex ${props.direction === 'horizontal' ? 'flex-row' : 'flex-col'} ${props.gap === '16px' ? 'gap-4' : 'gap-2'} p-4 border border-dashed border-border/30 rounded-xl min-h-[100px]`}>
       <div className="flex-1 bg-muted/20 border border-dashed border-border/50 rounded-lg min-h-[40px] flex items-center justify-center text-xs text-muted-foreground">Stack Item</div>
       <div className="flex-1 bg-muted/20 border border-dashed border-border/50 rounded-lg min-h-[40px] flex items-center justify-center text-xs text-muted-foreground">Stack Item</div>
    </div>
  ),
  masonry: ({ props }) => (
    <div className="w-full columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
       {[1,2,3,4,5].map(i => (
         <div key={i} className="bg-card border border-border rounded-xl w-full break-inside-avoid shadow-sm flex flex-col items-center justify-center text-muted-foreground text-sm font-medium" style={{ height: `${[150, 200, 180, 220, 160][i-1]}px` }}>
           Masonry Block {i}
         </div>
       ))}
    </div>
  ),
  sidebar_layout: ({ props }) => (
    <div className="w-full flex min-h-[300px] border border-border rounded-xl overflow-hidden my-4">
       <div className="bg-card border-r border-border shrink-0 p-4" style={{ width: props.sidebarWidth || '250px' }}>
          <div className="w-full h-8 bg-muted rounded mb-2" />
          <div className="w-full h-8 bg-muted rounded mb-2" />
          <div className="w-full h-8 bg-muted rounded mb-2" />
       </div>
       <div className="flex-1 bg-muted/10 p-4 flex items-center justify-center text-muted-foreground font-bold border border-dashed border-border/30 m-4 rounded-xl">Main Content Area</div>
    </div>
  ),

  // Typography
  heading: ({ props }) => {
    const Tag = (props.level || "h2") as any;
    return (
      <Tag className="font-black tracking-tight my-4 text-foreground" style={{ fontSize: props.level === 'h1' ? '2.5rem' : props.level === 'h2' ? '2rem' : '1.5rem', color: props.color }}>
        {props.text || "Heading"}
      </Tag>
    );
  },
  text: ({ props }) => (
    <div className="text-base text-muted-foreground leading-relaxed my-2" style={{ color: props.textColor }}>
      {props.content || "Write your content here..."}
    </div>
  ),
  list: ({ props }) => (
    <ul className="list-disc pl-6 my-4 space-y-2 text-muted-foreground">
      {(props.items || ['Item 1', 'Item 2']).map((item: string, i: number) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  ),
  divider: ({ props }) => <hr className="my-8 border-border" style={{ borderStyle: props.style || 'solid' }} />,
  blockquote: ({ props }) => (
    <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 italic text-muted-foreground bg-muted/10 rounded-r-lg">
      "{props.text || 'Inspiring quote here'}"
      {props.author && <footer className="text-sm font-bold mt-2 not-italic text-foreground">— {props.author}</footer>}
    </blockquote>
  ),
  label: ({ props }) => <Label className="text-sm font-bold text-foreground my-2 block">{props.text || "Field Label"}</Label>,
  code_block: ({ props }) => (
    <pre className="w-full p-4 bg-[#0d1117] text-[#c9d1d9] rounded-xl overflow-x-auto text-sm font-mono my-4 border border-border/50 shadow-inner">
       <code>{props.code || 'console.log("Hello World");'}</code>
    </pre>
  ),
  markdown: ({ props }) => (
    <div className="w-full prose dark:prose-invert max-w-none my-4 p-6 border border-border rounded-xl bg-card shadow-sm">
       <ReactMarkdown>{props.content || '# Hello\nMarkdown supported.'}</ReactMarkdown>
    </div>
  ),
  counter_text: ({ props }) => (
    <div className="text-4xl font-black text-primary my-4 tracking-tighter tabular-nums">
       {props.endValue || 1000}<span className="text-2xl text-muted-foreground font-normal">+</span>
    </div>
  ),
  typewriter: ({ props }) => (
    <div className="text-2xl font-bold my-4">
       We help you <span className="text-primary border-r-2 border-primary pr-1 animate-pulse">{(props.strings && props.strings[0]) || 'Grow'}</span>
    </div>
  ),

  // Media
  image: ({ props }) => (
    <div className="my-4 rounded-2xl overflow-hidden border border-border/50 bg-muted/20 flex items-center justify-center relative group">
      <img 
        src={props.src || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"} 
        alt={props.alt || "Placeholder image"}
        className="w-full h-auto object-cover"
        style={{ maxHeight: props.height || 'auto' }}
      />
    </div>
  ),
  pdf_viewer: ({ props }) => (
    <div className="w-full h-96 bg-muted/20 border-2 border-dashed border-border/50 rounded-xl flex flex-col items-center justify-center my-4">
       <span className="text-4xl mb-2">📄</span>
       <span className="font-bold text-muted-foreground">PDF Viewer</span>
       <span className="text-xs mt-1 text-muted-foreground">{props.url || 'sample.pdf'}</span>
    </div>
  ),
  image_compare: ({ props }) => (
    <div className="w-full aspect-video bg-card border border-border rounded-xl overflow-hidden relative my-4 flex shadow-sm">
       <div className="w-1/2 h-full bg-muted flex items-center justify-center text-muted-foreground font-bold border-r-2 border-primary">Before Image</div>
       <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg font-bold z-10 cursor-ew-resize">{'<>'}</div>
       <div className="w-1/2 h-full bg-background flex items-center justify-center text-foreground font-bold">After Image</div>
    </div>
  ),

  // UI Elements
  button: ({ props }) => (
    <Button variant={props.variant || "default"} size={props.size || "default"} className="my-2" style={props.bgColor ? { backgroundColor: props.bgColor, color: props.textColor } : {}}>
      {props.label || props.text || "Button"}
    </Button>
  ),
  card: ({ props }) => (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow my-2" style={{ backgroundColor: props.backgroundColor, borderColor: props.borderColor }}>
       <h3 className="text-xl font-bold mb-2">{props.title || "Card Title"}</h3>
       <p className="text-muted-foreground text-sm">{props.description || "Card description content goes here. You can add more details."}</p>
    </div>
  ),
  stepper: ({ props }) => (
    <div className="w-full flex items-center justify-between my-8 relative">
       <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-muted -z-10" />
       {(props.steps || ['Step 1', 'Step 2', 'Step 3']).map((step: string, i: number) => (
         <div key={i} className="flex flex-col items-center bg-background px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 ${i === 0 ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground'}`}>{i+1}</div>
            <span className="text-xs font-medium">{step}</span>
         </div>
       ))}
    </div>
  ),
  accordion: ({ props }) => (
    <div className="w-full my-4">
      <Accordion type="single" collapsible className="w-full bg-card rounded-xl border border-border px-4">
        {(props.items || [{title: 'Panel 1', content: 'Content'}]).map((item: any, i: number) => (
          <AccordionItem key={i} value={`item-${i}`} className={i === (props.items?.length || 1) - 1 ? 'border-b-0' : ''}>
            <AccordionTrigger className="font-bold">{item.title}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
  tabs: ({ props }) => (
    <div className="w-full my-4">
      <Tabs defaultValue="tab-0" className="w-full">
        <TabsList className="w-full justify-start bg-muted/50 rounded-lg p-1 h-auto">
          {(props.tabs || ['Tab 1', 'Tab 2']).map((tab: string, i: number) => (
            <TabsTrigger key={i} value={`tab-${i}`} className="font-medium text-sm px-4 py-2">{tab}</TabsTrigger>
          ))}
        </TabsList>
        <div className="mt-4 p-6 border border-dashed border-border/50 rounded-xl bg-card min-h-[150px] flex items-center justify-center text-muted-foreground text-sm font-medium">
          Tab Content Dropzone
        </div>
      </Tabs>
    </div>
  ),
  badge: ({ props }) => <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary my-2">{props.text || "New"}</span>,
  avatar: ({ props }) => <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center font-bold text-muted-foreground my-2 overflow-hidden"><img src={props.src || 'https://via.placeholder.com/100'} alt="Avatar" className="w-full h-full object-cover opacity-50" /></div>,
  progress: ({ props }) => (
    <div className="w-full my-4">
      <Progress value={props.value || 50} className="h-2.5" />
    </div>
  ),

  // Marketing & Auth
  announcement_bar: ({ props }) => (
    <div className="w-full bg-primary text-primary-foreground py-2.5 px-4 text-center text-sm font-bold flex justify-center items-center gap-4 my-2 rounded-lg shadow-md">
       <span>{props.text || 'Free shipping on orders over $50!'}</span>
       <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors">Shop Now</Button>
    </div>
  ),
  countdown: ({ props }) => (
    <div className="flex justify-center gap-4 my-6">
       {['Days', 'Hours', 'Mins', 'Secs'].map((l, i) => (
         <div key={i} className="flex flex-col items-center">
            <div className="w-16 h-16 bg-card border border-border rounded-xl flex items-center justify-center text-2xl font-black shadow-inner mb-2">{['12', '05', '45', '30'][i]}</div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{l}</span>
         </div>
       ))}
    </div>
  ),
  login_form: ({ props }) => (
    <div className="w-full max-w-sm mx-auto p-8 bg-card border border-border rounded-3xl shadow-xl my-8">
       <h2 className="text-2xl font-black text-center mb-2">Welcome Back</h2>
       <p className="text-sm text-muted-foreground text-center mb-8">Enter your credentials to access your account.</p>
       <div className="space-y-4">
          <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="m@example.com" readOnly /></div>
          <div className="space-y-2">
            <div className="flex items-center justify-between"><Label>Password</Label><span className="text-xs text-primary font-medium cursor-pointer">Forgot?</span></div>
            <Input type="password" placeholder="••••••••" readOnly />
          </div>
          <Button className="w-full py-6 text-base font-bold rounded-xl shadow-md mt-2">Sign In</Button>
       </div>
    </div>
  ),
  register_form: ({ props }) => (
    <div className="w-full max-w-sm mx-auto p-8 bg-card border border-border rounded-3xl shadow-xl my-8">
       <h2 className="text-2xl font-black text-center mb-2">Create Account</h2>
       <p className="text-sm text-muted-foreground text-center mb-8">Sign up to get started with our platform.</p>
       <div className="space-y-4">
          <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="m@example.com" readOnly /></div>
          <div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="••••••••" readOnly /></div>
          <Button className="w-full py-6 text-base font-bold rounded-xl shadow-md mt-2">Sign Up</Button>
       </div>
    </div>
  ),

  // Utility
  theme_switcher: ({ props }) => (
    <div className="inline-flex items-center justify-center py-2 px-4 bg-card border border-border rounded-full shadow-sm hover:shadow hover:bg-muted transition-all my-2 cursor-pointer gap-2">
       <span className="text-lg">🌓</span>
       <span className="text-sm font-bold capitalize">theme switcher</span>
    </div>
  ),
  share_btn: ({ props }) => (
    <div className="inline-flex items-center justify-center py-2 px-4 bg-card border border-border rounded-full shadow-sm hover:shadow hover:bg-muted transition-all my-2 cursor-pointer gap-2">
       <span className="text-lg">🔗</span>
       <span className="text-sm font-bold capitalize">share btn</span>
    </div>
  ),
  print_btn: ({ props }) => (
    <div className="inline-flex items-center justify-center py-2 px-4 bg-card border border-border rounded-full shadow-sm hover:shadow hover:bg-muted transition-all my-2 cursor-pointer gap-2">
       <span className="text-lg">🖨️</span>
       <span className="text-sm font-bold capitalize">print btn</span>
    </div>
  ),
  lang_switcher: ({ props }) => (
    <div className="inline-flex items-center justify-center py-2 px-4 bg-card border border-border rounded-full shadow-sm hover:shadow hover:bg-muted transition-all my-2 cursor-pointer gap-2">
       <span className="text-lg">🌐</span>
       <span className="text-sm font-bold capitalize">lang switcher</span>
    </div>
  ),
};
