import { 
  Box, LayoutGrid, PanelTop, AlignHorizontalJustifyStart, Columns, Columns3,
  Minus, List as ListIcon, SidebarOpen, Heading, Type, Code, Hash,
  Image as ImageIcon, FileUp, ImagePlus, MousePointerClick, CreditCard,
  MoreHorizontal, MessageCircle, Calendar, Lock, Users, Settings, Share2,
  Printer, Languages
} from "lucide-react";
import { ComponentDefinition } from "./types";

export const CoreRegistry: ComponentDefinition[] = [
  // --- Legacy & Phase 1 Layout ---
  { id: 'container', type: 'container', displayName: 'Container', label: 'Container', category: 'Layout', icon: Box, supportsChildren: true, defaultProps: { padding: 'p-4', bg: 'transparent' } },
  { id: 'grid', type: 'grid', displayName: 'Grid', label: 'Grid', category: 'Layout', icon: LayoutGrid, supportsChildren: true, defaultProps: { columns: 2, gap: 'gap-4' } },
  { id: 'section', type: 'section', displayName: 'Section', label: 'Section', category: 'Layout', icon: PanelTop, supportsChildren: true, defaultProps: { minHeight: '50vh' } },
  { id: 'flex', type: 'flex', displayName: 'Flexbox', label: 'Flexbox', category: 'Layout', icon: AlignHorizontalJustifyStart, supportsChildren: true, defaultProps: { direction: 'row', justify: 'between' } },
  { id: 'row', type: 'row', displayName: 'Row', label: 'Row', category: 'Layout', icon: Columns, supportsChildren: true, defaultProps: {} },
  { id: 'column', type: 'column', displayName: 'Column', label: 'Column', category: 'Layout', icon: Columns3, supportsChildren: true, defaultProps: {} },

  // --- Phase 2 Layout ---
  { id: 'spacer', type: 'spacer', displayName: 'Spacer', label: 'Spacer', category: 'Layout', icon: Minus, defaultProps: { height: '32px' } },
  { id: 'stack', type: 'stack', displayName: 'Stack', label: 'Stack', category: 'Layout', icon: ListIcon, supportsChildren: true, defaultProps: { direction: 'vertical', gap: '16px' } },
  { id: 'masonry', type: 'masonry', displayName: 'Masonry Grid', label: 'Masonry Grid', category: 'Layout', icon: LayoutGrid, supportsChildren: true, defaultProps: { columns: 3 } },
  { id: 'sidebar_layout', type: 'sidebar_layout', displayName: 'Sidebar Layout', label: 'Sidebar Layout', category: 'Layout', icon: SidebarOpen, supportsChildren: true, defaultProps: { sidebarWidth: '250px' } },

  // --- Legacy & Phase 1 Typography ---
  { id: 'heading', type: 'heading', displayName: 'Heading', label: 'Heading', category: 'Typography', icon: Heading, defaultProps: { text: 'New Heading', level: 'h2' } },
  { id: 'text', type: 'text', displayName: 'Rich Text', label: 'Rich Text', category: 'Typography', icon: Type, defaultProps: { content: 'Write your content here...' } },
  
  // --- Phase 2 Typography ---
  { id: 'code_block', type: 'code_block', displayName: 'Code Block', label: 'Code Block', category: 'Typography', icon: Code, defaultProps: { code: 'console.log("Hello");', language: 'javascript' } },
  { id: 'markdown', type: 'markdown', displayName: 'Markdown', label: 'Markdown', category: 'Typography', icon: Type, defaultProps: { content: '# Hello\nMarkdown supported.' } },
  { id: 'counter_text', type: 'counter_text', displayName: 'Animated Counter', label: 'Animated Counter', category: 'Typography', icon: Hash, defaultProps: { endValue: 1000, duration: 2000 } },
  { id: 'typewriter', type: 'typewriter', displayName: 'Typewriter', label: 'Typewriter', category: 'Typography', icon: Type, defaultProps: { strings: ['Hello', 'Welcome', 'Discover'], speed: 50 } },

  // --- Phase 2 Media ---
  { id: 'image', type: 'image', displayName: 'Image', label: 'Image', category: 'Media', icon: ImageIcon, defaultProps: { src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', alt: 'Placeholder' } },
  { id: 'pdf_viewer', type: 'pdf_viewer', displayName: 'PDF Viewer', label: 'PDF Viewer', category: 'Media', icon: FileUp, defaultProps: { url: '/sample.pdf' } },
  { id: 'image_compare', type: 'image_compare', displayName: 'Image Comparison', label: 'Image Comparison', category: 'Media', icon: ImagePlus, defaultProps: { leftImage: '', rightImage: '' } },

  // --- UI Elements ---
  { id: 'button', type: 'button', displayName: 'Button', label: 'Button', category: 'UI Elements', icon: MousePointerClick, defaultProps: { text: 'Click Here', variant: 'default' } },
  { id: 'card', type: 'card', displayName: 'Card', label: 'Card', category: 'UI Elements', icon: CreditCard, supportsChildren: true, defaultProps: { title: 'Card Title', description: 'Card Description' } },
  { id: 'stepper', type: 'stepper', displayName: 'Stepper', label: 'Stepper', category: 'UI Elements', icon: MoreHorizontal, defaultProps: { steps: ['Step 1', 'Step 2', 'Step 3'] } },

  // --- Marketing ---
  { id: 'announcement_bar', type: 'announcement_bar', displayName: 'Announcement Bar', label: 'Announcement Bar', category: 'Marketing', icon: MessageCircle, defaultProps: { text: 'Sale! 50% Off!', link: '/sale' } },
  { id: 'countdown', type: 'countdown', displayName: 'Countdown Timer', label: 'Countdown Timer', category: 'Marketing', icon: Calendar, defaultProps: { targetDate: '2026-12-31' } },

  // --- Authentication ---
  { id: 'login_form', type: 'login_form', displayName: 'Login Form', label: 'Login Form', category: 'Authentication', icon: Lock, defaultProps: { redirectUrl: '/dashboard' } },
  { id: 'register_form', type: 'register_form', displayName: 'Register Form', label: 'Register Form', category: 'Authentication', icon: Users, defaultProps: { redirectUrl: '/onboarding' } },

  // --- Utility ---
  { id: 'theme_switcher', type: 'theme_switcher', displayName: 'Theme Switcher', label: 'Theme Switcher', category: 'Utility', icon: Settings, defaultProps: {} },
  { id: 'share_btn', type: 'share_btn', displayName: 'Share Button', label: 'Share Button', category: 'Utility', icon: Share2, defaultProps: { platform: 'twitter' } },
  { id: 'print_btn', type: 'print_btn', displayName: 'Print Button', label: 'Print Button', category: 'Utility', icon: Printer, defaultProps: {} },
  { id: 'lang_switcher', type: 'lang_switcher', displayName: 'Language Switcher', label: 'Language Switcher', category: 'Utility', icon: Languages, defaultProps: { langs: ['EN', 'ES', 'FR'] } },
];
