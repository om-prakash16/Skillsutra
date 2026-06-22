"use client";

import React from "react";
import {
  Layout, Type, MousePointer2, Image as ImageIcon, FormInput,
  CreditCard, Database, Megaphone, ShoppingCart, Lock, Users,
  Briefcase, Sparkles, BarChart, MapPin, Wrench, Plug, Settings,
  Navigation, Square, Layers, AlignLeft, Star, Video, Music,
  Calendar, Globe, Cpu, Bot
} from "lucide-react";

// -----------------------------------------------------------------------
// Interfaces
// -----------------------------------------------------------------------
export interface RegistryComponent {
  type: string;
  name: string;
  icon: any;
  render: React.FC<{ props: any; styles: any; children?: React.ReactNode }>;
}

export interface RegistryCategory {
  name: string;
  icon: any;
  components: RegistryComponent[];
}

// -----------------------------------------------------------------------
// Helper
// -----------------------------------------------------------------------
const DROP_PLACEHOLDER = (
  <div className="flex items-center justify-center min-h-[60px] text-xs text-muted-foreground/50 italic pointer-events-none">
    Drop components here
  </div>
);

// -----------------------------------------------------------------------
// LAYOUT Components
// -----------------------------------------------------------------------
const SectionComp: RegistryComponent = {
  type: "Section",
  name: "Section",
  icon: Layout,
  render: ({ styles, children }) => (
    <section style={{ padding: "4rem 2rem", width: "100%", ...styles }}>
      {children || DROP_PLACEHOLDER}
    </section>
  ),
};

const ContainerComp: RegistryComponent = {
  type: "Container",
  name: "Container",
  icon: Square,
  render: ({ styles, children }) => (
    <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", padding: "1rem", ...styles }}>
      {children || DROP_PLACEHOLDER}
    </div>
  ),
};

const FlexComp: RegistryComponent = {
  type: "Flex",
  name: "Flex",
  icon: Layout,
  render: ({ styles, children }) => (
    <div style={{ display: "flex", flexDirection: "row", gap: "1rem", flexWrap: "wrap", ...styles }}>
      {children || DROP_PLACEHOLDER}
    </div>
  ),
};

const GridComp: RegistryComponent = {
  type: "Grid",
  name: "Grid",
  icon: Layout,
  render: ({ styles, children }) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", ...styles }}>
      {children || DROP_PLACEHOLDER}
    </div>
  ),
};

const AutoGridComp: RegistryComponent = {
  type: "AutoGrid",
  name: "Auto Grid",
  icon: Layout,
  render: ({ styles, children }) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", ...styles }}>
      {children || DROP_PLACEHOLDER}
    </div>
  ),
};

const StackComp: RegistryComponent = {
  type: "Stack",
  name: "Stack",
  icon: Layers,
  render: ({ styles, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", ...styles }}>
      {children || DROP_PLACEHOLDER}
    </div>
  ),
};

const ColumnsComp: RegistryComponent = {
  type: "Columns",
  name: "Columns",
  icon: Layout,
  render: ({ styles, children }) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", ...styles }}>
      {children || DROP_PLACEHOLDER}
    </div>
  ),
};

const SplitLayoutComp: RegistryComponent = {
  type: "SplitLayout",
  name: "Split Layout",
  icon: Layout,
  render: ({ styles, children }) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", ...styles }}>
      {children || DROP_PLACEHOLDER}
    </div>
  ),
};

const SpacerComp: RegistryComponent = {
  type: "Spacer",
  name: "Spacer",
  icon: AlignLeft,
  render: ({ props, styles }) => (
    <div style={{ height: props.height || "2rem", width: "100%", ...styles }} className="border-dashed border border-border/30 flex items-center justify-center">
      <span className="text-[10px] text-muted-foreground/40">Spacer</span>
    </div>
  ),
};

const DividerComp: RegistryComponent = {
  type: "Divider",
  name: "Divider",
  icon: AlignLeft,
  render: ({ styles }) => <hr style={{ margin: "1rem 0", borderTop: "1px solid var(--border)", ...styles }} />,
};

const BasicCardComp: RegistryComponent = {
  type: "BasicCard",
  name: "Basic Card",
  icon: CreditCard,
  render: ({ styles, children }) => (
    <div style={{ padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)", backgroundColor: "var(--card)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", ...styles }}>
      {children || DROP_PLACEHOLDER}
    </div>
  ),
};

// -----------------------------------------------------------------------
// TYPOGRAPHY Components
// -----------------------------------------------------------------------
const HeadingComp: RegistryComponent = {
  type: "Heading",
  name: "Heading",
  icon: Type,
  render: ({ props, styles }) => {
    const level = props.level || "h2";
    const sizeClass = level === "h1" ? "text-5xl font-bold" :
                      level === "h2" ? "text-4xl font-bold" :
                      level === "h3" ? "text-3xl font-semibold" :
                      level === "h4" ? "text-2xl font-semibold" : "text-xl font-medium";
    if (level === "h1") return <h1 style={styles} className={`${sizeClass} leading-tight tracking-tight`}>{props.text || "Heading Text"}</h1>;
    if (level === "h3") return <h3 style={styles} className={`${sizeClass} leading-tight tracking-tight`}>{props.text || "Heading Text"}</h3>;
    if (level === "h4") return <h4 style={styles} className={`${sizeClass} leading-tight`}>{props.text || "Heading Text"}</h4>;
    if (level === "h5") return <h5 style={styles} className={`${sizeClass} leading-tight`}>{props.text || "Heading Text"}</h5>;
    if (level === "h6") return <h6 style={styles} className={`${sizeClass}`}>{props.text || "Heading Text"}</h6>;
    return <h2 style={styles} className={`${sizeClass} leading-tight tracking-tight`}>{props.text || "Heading Text"}</h2>;
  },
};

const H1Comp: RegistryComponent = {
  type: "H1",
  name: "H1",
  icon: Type,
  render: ({ props, styles }) => <h1 style={styles} className="text-5xl font-bold leading-tight tracking-tight">{props.text || "Page Heading"}</h1>,
};
const H2Comp: RegistryComponent = {
  type: "H2",
  name: "H2",
  icon: Type,
  render: ({ props, styles }) => <h2 style={styles} className="text-4xl font-bold leading-tight">{props.text || "Section Heading"}</h2>,
};
const H3Comp: RegistryComponent = {
  type: "H3",
  name: "H3",
  icon: Type,
  render: ({ props, styles }) => <h3 style={styles} className="text-3xl font-semibold">{props.text || "Sub Heading"}</h3>,
};
const H4Comp: RegistryComponent = {
  type: "H4",
  name: "H4",
  icon: Type,
  render: ({ props, styles }) => <h4 style={styles} className="text-2xl font-semibold">{props.text || "Card Heading"}</h4>,
};
const H5Comp: RegistryComponent = {
  type: "H5",
  name: "H5",
  icon: Type,
  render: ({ props, styles }) => <h5 style={styles} className="text-xl font-medium">{props.text || "Small Heading"}</h5>,
};
const H6Comp: RegistryComponent = {
  type: "H6",
  name: "H6",
  icon: Type,
  render: ({ props, styles }) => <h6 style={styles} className="text-lg font-medium">{props.text || "Tiny Heading"}</h6>,
};

const ParagraphComp: RegistryComponent = {
  type: "Paragraph",
  name: "Paragraph",
  icon: AlignLeft,
  render: ({ props, styles }) => (
    <p style={{ lineHeight: "1.7", ...styles }} className="text-muted-foreground">
      {props.text || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
    </p>
  ),
};

const QuoteComp: RegistryComponent = {
  type: "Quote",
  name: "Quote",
  icon: Type,
  render: ({ props, styles }) => (
    <blockquote style={styles} className="border-l-4 border-primary pl-6 italic text-muted-foreground text-lg">
      <p>&ldquo;{props.text || "An inspiring quote."}&rdquo;</p>
      {props.author && <cite className="mt-2 block text-sm font-medium not-italic text-foreground">— {props.author}</cite>}
    </blockquote>
  ),
};

const BadgeComp: RegistryComponent = {
  type: "Badge",
  name: "Badge",
  icon: Type,
  render: ({ props }) => {
    const variantClasses: Record<string, string> = {
      default: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      destructive: "bg-destructive text-destructive-foreground",
      outline: "border border-input text-foreground",
      success: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      warning: "bg-amber-100 text-amber-700 border border-amber-200",
    };
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variantClasses[props.variant || "default"] || variantClasses.default}`}>
        {props.text || "Badge"}
      </span>
    );
  },
};

const LabelComp: RegistryComponent = {
  type: "Label",
  name: "Label",
  icon: Type,
  render: ({ props, styles }) => (
    <label style={styles} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {props.text || "Field Label"}
    </label>
  ),
};

const SmallComp: RegistryComponent = {
  type: "Small",
  name: "Small",
  icon: Type,
  render: ({ props, styles }) => <small style={styles} className="text-sm text-muted-foreground">{props.text || "Small helper text."}</small>,
};

const CaptionComp: RegistryComponent = {
  type: "Caption",
  name: "Caption",
  icon: Type,
  render: ({ props, styles }) => <p style={styles} className="text-xs text-muted-foreground">{props.text || "Caption text."}</p>,
};

const DisplayComp: RegistryComponent = {
  type: "Display",
  name: "Display",
  icon: Type,
  render: ({ props, styles }) => (
    <h1 style={styles} className="text-7xl font-black leading-none tracking-tighter">
      {props.text || "Display Heading"}
    </h1>
  ),
};

// -----------------------------------------------------------------------
// BUTTONS Components
// -----------------------------------------------------------------------
const ButtonComp: RegistryComponent = {
  type: "Button",
  name: "Button",
  icon: MousePointer2,
  render: ({ props, styles }) => {
    const variantClasses: Record<string, string> = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      link: "text-primary underline-offset-4 hover:underline",
    };
    const sizeClasses: Record<string, string> = {
      sm: "h-9 px-3 text-sm",
      default: "h-10 px-4 py-2",
      lg: "h-11 px-8 text-lg",
    };
    return (
      <button
        style={styles}
        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer
          ${variantClasses[props.variant || "default"]}
          ${sizeClasses[props.size || "default"]}
        `}
      >
        {props.text || "Click Me"}
      </button>
    );
  },
};

// -----------------------------------------------------------------------
// MEDIA Components
// -----------------------------------------------------------------------
const ImageComp: RegistryComponent = {
  type: "Image",
  name: "Image",
  icon: ImageIcon,
  render: ({ props, styles }) => (
    <div style={{ position: "relative", overflow: "hidden", ...styles }}>
      {props.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={props.src}
          alt={props.alt || ""}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      ) : (
        <div className="bg-muted flex flex-col items-center justify-center gap-2 text-muted-foreground" style={{ minHeight: "200px" }}>
          <ImageIcon className="w-10 h-10 opacity-30" />
          <span className="text-xs">Click to set image URL</span>
        </div>
      )}
    </div>
  ),
};

const VideoComp: RegistryComponent = {
  type: "Video",
  name: "Video",
  icon: Video,
  render: ({ props, styles }) => (
    props.src ? (
      <video src={props.src} controls style={{ width: "100%", ...styles }} />
    ) : (
      <div className="bg-muted flex flex-col items-center justify-center gap-2 text-muted-foreground" style={{ minHeight: "200px", ...styles }}>
        <Video className="w-10 h-10 opacity-30" />
        <span className="text-xs">Set video URL in properties</span>
      </div>
    )
  ),
};

// -----------------------------------------------------------------------
// UTILITY Components
// -----------------------------------------------------------------------
const SkeletonComp: RegistryComponent = {
  type: "Skeleton",
  name: "Skeleton",
  icon: Wrench,
  render: ({ props, styles }) => (
    <div style={styles} className="space-y-3">
      <div className="h-4 bg-muted animate-pulse rounded" style={{ width: props.width || "100%" }} />
      <div className="h-4 bg-muted animate-pulse rounded" style={{ width: "85%" }} />
      <div className="h-4 bg-muted animate-pulse rounded" style={{ width: "70%" }} />
    </div>
  ),
};

const SpinnerComp: RegistryComponent = {
  type: "Spinner",
  name: "Spinner",
  icon: Wrench,
  render: ({ props, styles }) => (
    <div style={styles} className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full border-2 border-muted border-t-primary"
        style={{ width: props.size || "2rem", height: props.size || "2rem" }} />
    </div>
  ),
};

const AlertComp: RegistryComponent = {
  type: "Alert",
  name: "Alert",
  icon: Wrench,
  render: ({ props, styles }) => {
    const typeClasses: Record<string, string> = {
      default: "bg-background border",
      info: "border-blue-200 bg-blue-50 text-blue-800",
      success: "border-emerald-200 bg-emerald-50 text-emerald-800",
      warning: "border-amber-200 bg-amber-50 text-amber-800",
      error: "border-red-200 bg-red-50 text-red-800",
    };
    return (
      <div role="alert" style={styles} className={`relative w-full rounded-lg border p-4 ${typeClasses[props.type || "default"]}`}>
        <h5 className="mb-1 font-medium leading-none">{props.title || "Alert Title"}</h5>
        <p className="text-sm opacity-80">{props.message || "Alert message content."}</p>
      </div>
    );
  },
};

// -----------------------------------------------------------------------
// CARDS Components
// -----------------------------------------------------------------------
const FeatureCardComp: RegistryComponent = {
  type: "FeatureCard",
  name: "Feature Card",
  icon: CreditCard,
  render: ({ props, styles }) => (
    <div style={styles} className="p-6 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        <Sparkles className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{props.title || "Feature Title"}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{props.description || "A great feature description that explains the value."}</p>
    </div>
  ),
};

const TestimonialCardComp: RegistryComponent = {
  type: "TestimonialCard",
  name: "Testimonial Card",
  icon: CreditCard,
  render: ({ props, styles }) => (
    <div style={styles} className="p-6 rounded-xl border border-border bg-card">
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
      </div>
      <p className="text-muted-foreground italic mb-4">&ldquo;{props.text || "This product changed my life completely!"}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
          {(props.author || "A").charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-sm">{props.author || "Alex Johnson"}</p>
          <p className="text-xs text-muted-foreground">{props.role || "CEO at TechCorp"}</p>
        </div>
      </div>
    </div>
  ),
};

const PricingCardComp: RegistryComponent = {
  type: "PricingCard",
  name: "Pricing Card",
  icon: CreditCard,
  render: ({ props, styles }) => (
    <div style={styles} className={`p-8 rounded-2xl border-2 relative ${props.featured ? "border-primary shadow-xl scale-105" : "border-border"}`}>
      {props.featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
        </div>
      )}
      <h3 className="text-xl font-bold mb-1">{props.name || "Pro Plan"}</h3>
      <p className="text-muted-foreground text-sm mb-4">{props.description || "For growing teams"}</p>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-4xl font-black">${props.price || "29"}</span>
        <span className="text-muted-foreground text-sm">/month</span>
      </div>
      <ul className="space-y-2 mb-6">
        {(props.features || ["10 Users", "50GB Storage", "Priority Support"]).map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <span className="text-emerald-500 font-bold">✓</span> {f}
          </li>
        ))}
      </ul>
      <button className={`w-full py-2 rounded-lg font-semibold transition-colors ${props.featured ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-primary text-primary hover:bg-primary/5"}`}>
        {props.cta || "Get Started"}
      </button>
    </div>
  ),
};

const KPICardComp: RegistryComponent = {
  type: "KPICard",
  name: "KPI Card",
  icon: CreditCard,
  render: ({ props, styles }) => (
    <div style={styles} className="p-5 rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground font-medium">{props.label || "Total Revenue"}</p>
        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
          {props.change || "+12.5%"}
        </span>
      </div>
      <p className="text-3xl font-black tracking-tight">{props.value || "$24,500"}</p>
      <p className="text-xs text-muted-foreground mt-1">{props.subtitle || "Compared to last month"}</p>
    </div>
  ),
};

// -----------------------------------------------------------------------
// MARKETING Components
// -----------------------------------------------------------------------
const HeroComp: RegistryComponent = {
  type: "Hero",
  name: "Hero Section",
  icon: Megaphone,
  render: ({ props, styles, children }) => (
    <div style={{ textAlign: "center", padding: "6rem 2rem", ...styles }} className="flex flex-col items-center gap-6">
      {props.badge && (
        <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/20">
          {props.badge}
        </span>
      )}
      <h1 className="text-6xl font-black tracking-tighter max-w-3xl leading-none">
        {props.headline || "Build Something Amazing Today"}
      </h1>
      <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
        {props.subheadline || "The fastest way to launch your next project with modern tooling."}
      </p>
      <div className="flex gap-3 mt-2">
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
          {props.primaryCta || "Get Started Free"}
        </button>
        <button className="border border-border px-6 py-3 rounded-lg font-semibold hover:bg-accent transition-colors">
          {props.secondaryCta || "View Demo"}
        </button>
      </div>
      {children}
    </div>
  ),
};

const CTAComp: RegistryComponent = {
  type: "CTA",
  name: "CTA Section",
  icon: Megaphone,
  render: ({ props, styles }) => (
    <div style={styles} className="bg-primary text-primary-foreground rounded-2xl p-12 text-center">
      <h2 className="text-4xl font-black mb-3">{props.headline || "Ready to Get Started?"}</h2>
      <p className="text-primary-foreground/80 text-lg mb-6">{props.subheadline || "Join thousands of happy customers today."}</p>
      <button className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-white/90 transition-colors">
        {props.cta || "Start for Free"}
      </button>
    </div>
  ),
};

// -----------------------------------------------------------------------
// FORM Components
// -----------------------------------------------------------------------
const InputComp: RegistryComponent = {
  type: "Input",
  name: "Input",
  icon: FormInput,
  render: ({ props, styles }) => (
    <div style={styles} className="space-y-1.5">
      {props.label && <label className="text-sm font-medium">{props.label}</label>}
      <input
        type={props.inputType || "text"}
        placeholder={props.placeholder || "Type here..."}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        readOnly
      />
    </div>
  ),
};

const TextareaComp: RegistryComponent = {
  type: "Textarea",
  name: "Textarea",
  icon: FormInput,
  render: ({ props, styles }) => (
    <div style={styles} className="space-y-1.5">
      {props.label && <label className="text-sm font-medium">{props.label}</label>}
      <textarea
        placeholder={props.placeholder || "Write your message..."}
        rows={props.rows || 4}
        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        readOnly
      />
    </div>
  ),
};

// -----------------------------------------------------------------------
// CENTRAL REGISTRY
// -----------------------------------------------------------------------
export const COMPONENT_REGISTRY: RegistryCategory[] = [
  {
    name: "Layout",
    icon: Layout,
    components: [SectionComp, ContainerComp, FlexComp, GridComp, AutoGridComp, StackComp, ColumnsComp, SplitLayoutComp, SpacerComp, DividerComp, BasicCardComp],
  },
  {
    name: "Typography",
    icon: Type,
    components: [HeadingComp, H1Comp, H2Comp, H3Comp, H4Comp, H5Comp, H6Comp, ParagraphComp, DisplayComp, QuoteComp, BadgeComp, LabelComp, SmallComp, CaptionComp],
  },
  {
    name: "Buttons",
    icon: MousePointer2,
    components: [ButtonComp],
  },
  {
    name: "Forms",
    icon: FormInput,
    components: [InputComp, TextareaComp],
  },
  {
    name: "Media",
    icon: ImageIcon,
    components: [ImageComp, VideoComp],
  },
  {
    name: "Cards",
    icon: CreditCard,
    components: [BasicCardComp, FeatureCardComp, TestimonialCardComp, PricingCardComp, KPICardComp],
  },
  {
    name: "Marketing",
    icon: Megaphone,
    components: [HeroComp, CTAComp],
  },
  {
    name: "Utility",
    icon: Wrench,
    components: [SkeletonComp, SpinnerComp, AlertComp],
  },
  // Future categories (shell)
  { name: "Navigation",       icon: Navigation, components: [] },
  { name: "CMS & Data",       icon: Database,   components: [] },
  { name: "Charts",           icon: BarChart,   components: [] },
  { name: "Maps",             icon: MapPin,     components: [] },
  { name: "Commerce",         icon: ShoppingCart, components: [] },
  { name: "Authentication",   icon: Lock,       components: [] },
  { name: "Community",        icon: Users,      components: [] },
  { name: "HR & Recruitment", icon: Briefcase,  components: [] },
  { name: "AI Features",      icon: Bot,        components: [] },
  { name: "Integrations",     icon: Plug,       components: [] },
  { name: "Global",           icon: Settings,   components: [] },
];

// -----------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------
export function getComponentRender(
  type: string
): React.FC<{ props: any; styles: any; children?: React.ReactNode }> | null {
  for (const category of COMPONENT_REGISTRY) {
    const found = category.components.find((c) => c.type === type);
    if (found) return found.render;
  }
  return null;
}
