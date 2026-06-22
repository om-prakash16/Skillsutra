/**
 * Pure component defaults data (no React imports).
 * This file is safe to import from the Zustand store.
 */
export const COMPONENT_DEFAULTS: Record<string, { props?: Record<string, any>; styles?: Record<string, any> }> = {
  // Layout
  Section:          { styles: { padding: "4rem 2rem", width: "100%", minHeight: "200px" } },
  Container:        { styles: { maxWidth: "1200px", margin: "0 auto", width: "100%", padding: "1rem" } },
  Box:              { styles: { width: "100%", padding: "1rem" } },
  Wrapper:          { styles: { width: "100%", padding: "1rem" } },
  Flex:             { styles: { display: "flex", flexDirection: "row", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" } },
  Grid:             { styles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", width: "100%" } },
  CSSGrid:          { styles: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" } },
  AutoGrid:         { styles: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" } },
  Stack:            { styles: { display: "flex", flexDirection: "column", gap: "1rem" } },
  HorizontalStack:  { styles: { display: "flex", flexDirection: "row", gap: "1rem", alignItems: "center" } },
  VerticalStack:    { styles: { display: "flex", flexDirection: "column", gap: "1rem" } },
  Columns:          { styles: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" } },
  Rows:             { styles: { display: "flex", flexDirection: "column", gap: "1rem", width: "100%" } },
  SplitLayout:      { styles: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" } },
  SidebarLayout:    { styles: { display: "grid", gridTemplateColumns: "280px 1fr", gap: "1.5rem" } },
  HolyGrailLayout:  { styles: { display: "grid", gridTemplateRows: "auto 1fr auto", minHeight: "100vh" } },
  Masonry:          { styles: { columns: "3", columnGap: "1.5rem" } },
  Spacer:           { styles: { height: "2rem", width: "100%" } },
  Divider:          { styles: { borderTop: "1px solid #e5e7eb", margin: "1rem 0", width: "100%" } },
  BasicCard:        { styles: { padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)", backgroundColor: "var(--card)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" } },

  // Typography
  Heading:          { props: { text: "Beautiful Heading", level: "h2" } },
  H1:               { props: { text: "Page Heading" } },
  H2:               { props: { text: "Section Heading" } },
  H3:               { props: { text: "Sub Heading" } },
  H4:               { props: { text: "Card Heading" } },
  H5:               { props: { text: "Small Heading" } },
  H6:               { props: { text: "Tiny Heading" } },
  Paragraph:        { props: { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique." } },
  Small:            { props: { text: "Small helper text." } },
  Caption:          { props: { text: "Caption text." } },
  Display:          { props: { text: "Display Heading", level: "h1" } },
  Quote:            { props: { text: "An inspiring quote.", author: "Someone Famous" } },
  Badge:            { props: { text: "New", variant: "default" } },
  Label:            { props: { text: "Field Label" } },

  // Buttons
  Button:           { props: { text: "Click Me", variant: "default" } },
  SecondaryButton:  { props: { text: "Learn More", variant: "secondary" } },
  OutlineButton:    { props: { text: "View Details", variant: "outline" } },
  GhostButton:      { props: { text: "Dismiss", variant: "ghost" } },

  // Forms
  Input:            { props: { placeholder: "Type here...", label: "Field Label" } },
  Textarea:         { props: { placeholder: "Write your message...", label: "Message", rows: 4 } },
  Checkbox:         { props: { label: "I agree to the terms", checked: false } },
  Toggle:           { props: { label: "Enable notifications", checked: false } },
  Select:           { props: { label: "Select option", placeholder: "Choose one...", options: ["Option A", "Option B"] } },
  Slider:           { props: { label: "Volume", min: 0, max: 100, value: 50 } },
  Rating:           { props: { label: "Rate this", value: 0, max: 5 } },

  // Media
  Image:            { props: { src: "/placeholder.png", alt: "Image description", width: "100%", height: "auto" } },
};

export function getComponentDefaults(type: string): { props: Record<string, any>; styles: Record<string, any> } {
  const defaults = COMPONENT_DEFAULTS[type] || {};
  return {
    props: defaults.props ? { ...defaults.props } : {},
    styles: defaults.styles ? { ...defaults.styles } : {},
  };
}
