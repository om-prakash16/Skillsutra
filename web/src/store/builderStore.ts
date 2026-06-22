import { create } from 'zustand';


export interface BuilderElement {
  id: string;
  type: string;
  name: string;
  parentId: string | null;
  props: Record<string, any>;
  styles: Record<string, any>;
  children: string[];
  isLocked?: boolean;
  isHidden?: boolean;
}

interface BuilderState {
  elements: Record<string, BuilderElement>;
  rootElements: string[];
  selectedIds: string[];
  hoveredId: string | null;
  deviceMode: "desktop" | "tablet" | "mobile";
  
  // Actions
  addElement: (type: string, parentId: string | null, index?: number) => string;
  moveElement: (id: string, newParentId: string | null, newIndex: number) => void;
  removeElement: (id: string) => void;
  updateElementProps: (id: string, props: Record<string, any>) => void;
  updateElementStyles: (id: string, styles: Record<string, any>) => void;
  selectElement: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  setHovered: (id: string | null) => void;
  setDeviceMode: (mode: "desktop" | "tablet" | "mobile") => void;
  setElements: (data: { elements: Record<string, BuilderElement>, rootElements: string[] }) => void;
}

// Initial empty canvas state
const initialState = {
  elements: {},
  rootElements: [],
  selectedIds: [],
  hoveredId: null,
  deviceMode: "desktop" as const,
};

export const useBuilderStore = create<BuilderState>((set, get) => ({
  ...initialState,

  addElement: (type, parentId, index) => {
    const id = `el_${crypto.randomUUID().split('-')[0]}`;
    
    // Default config based on type
    let name = type;
    let props = {};
    let styles = {};

    switch (type) {
      case 'Heading':
        props = { text: 'New Heading', level: 'h2' };
        break;
      case 'Paragraph':
        props = { text: 'This is a new paragraph block. Double click to edit text.' };
        break;
      case 'Button':
        props = { text: 'Click Me', variant: 'default' };
        break;
      case 'Section':
        styles = { padding: '4rem 2rem', width: '100%' };
        break;
      case 'Container':
        styles = { maxWidth: '1200px', margin: '0 auto', width: '100%' };
        break;
    }

    const newElement: BuilderElement = {
      id,
      type,
      name,
      parentId,
      props,
      styles,
      children: [],
    };

    set((state) => {
      const newElements = { ...state.elements, [id]: newElement };
      const newRootElements = [...state.rootElements];

      if (parentId && newElements[parentId]) {
        // Add to parent's children
        const parent = newElements[parentId];
        const newChildren = [...parent.children];
        if (index !== undefined) {
          newChildren.splice(index, 0, id);
        } else {
          newChildren.push(id);
        }
        newElements[parentId] = { ...parent, children: newChildren };
      } else {
        // Add to root
        if (index !== undefined) {
          newRootElements.splice(index, 0, id);
        } else {
          newRootElements.push(id);
        }
      }

      return {
        elements: newElements,
        rootElements: newRootElements,
        selectedIds: [id], // auto-select newly added element
      };
    });

    return id;
  },

  moveElement: (id, newParentId, newIndex) => {
    set((state) => {
      const elements = { ...state.elements };
      const rootElements = [...state.rootElements];
      
      const element = elements[id];
      if (!element) return state;

      const oldParentId = element.parentId;

      // 1. Remove from old parent / root
      if (oldParentId && elements[oldParentId]) {
        elements[oldParentId] = {
          ...elements[oldParentId],
          children: elements[oldParentId].children.filter((childId) => childId !== id),
        };
      } else {
        const idx = rootElements.indexOf(id);
        if (idx > -1) rootElements.splice(idx, 1);
      }

      // 2. Add to new parent / root
      element.parentId = newParentId;
      if (newParentId && elements[newParentId]) {
        const newChildren = [...elements[newParentId].children];
        newChildren.splice(newIndex, 0, id);
        elements[newParentId] = {
          ...elements[newParentId],
          children: newChildren,
        };
      } else {
        rootElements.splice(newIndex, 0, id);
      }

      return { elements, rootElements };
    });
  },

  removeElement: (id) => {
    set((state) => {
      const elements = { ...state.elements };
      const rootElements = [...state.rootElements];

      // Recursive deletion helper
      const deleteRecursive = (elementId: string) => {
        const el = elements[elementId];
        if (!el) return;
        el.children.forEach(deleteRecursive);
        delete elements[elementId];
      };

      const element = elements[id];
      if (!element) return state;

      // Remove from parent or root
      if (element.parentId && elements[element.parentId]) {
        elements[element.parentId] = {
          ...elements[element.parentId],
          children: elements[element.parentId].children.filter((childId) => childId !== id),
        };
      } else {
        const idx = rootElements.indexOf(id);
        if (idx > -1) rootElements.splice(idx, 1);
      }

      deleteRecursive(id);

      return {
        elements,
        rootElements,
        selectedIds: state.selectedIds.filter(selId => selId !== id),
      };
    });
  },

  updateElementProps: (id, props) => {
    set((state) => {
      if (!state.elements[id]) return state;
      return {
        elements: {
          ...state.elements,
          [id]: {
            ...state.elements[id],
            props: { ...state.elements[id].props, ...props },
          },
        },
      };
    });
  },

  updateElementStyles: (id, styles) => {
    set((state) => {
      if (!state.elements[id]) return state;
      return {
        elements: {
          ...state.elements,
          [id]: {
            ...state.elements[id],
            styles: { ...state.elements[id].styles, ...styles },
          },
        },
      };
    });
  },

  selectElement: (id, multi = false) => {
    set((state) => {
      if (multi) {
        return { selectedIds: state.selectedIds.includes(id) ? state.selectedIds : [...state.selectedIds, id] };
      }
      return { selectedIds: [id] };
    });
  },

  clearSelection: () => set({ selectedIds: [] }),
  setHovered: (id) => set({ hoveredId: id }),
  setDeviceMode: (mode) => set({ deviceMode: mode }),

  setElements: (data: { elements: Record<string, BuilderElement>, rootElements: string[] }) => {
    set({ 
      elements: data.elements || {}, 
      rootElements: data.rootElements || [], 
      selectedIds: [] 
    });
  },

}));
