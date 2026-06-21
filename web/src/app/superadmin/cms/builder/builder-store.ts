import { create } from 'zustand';
import { CanvasBlock } from './components/canvas';
import { findBlock, findBlockParent, insertBlock, removeBlock, updateBlock, duplicateBlockNode } from './utils/tree-helpers';

interface BuilderState {
  // Page Data
  pageId: string | null;
  pageName: string;
  blocks: CanvasBlock[];
  isSaving: boolean;
  isLoading: boolean;
  
  // Builder UI State
  selectedBlockId: string | null;
  isDragging: boolean;
  activeBreakpoint: 'base' | 'sm' | 'md' | 'lg' | 'xl';
  history: CanvasBlock[][];
  historyIndex: number;
  
  // Actions
  setPageContext: (pageId: string | null, pageName: string) => void;
  setBlocks: (blocks: CanvasBlock[]) => void;
  selectBlock: (id: string | null) => void;
  setDragging: (isDragging: boolean) => void;
  setActiveBreakpoint: (bp: 'base' | 'sm' | 'md' | 'lg' | 'xl') => void;
  
  // Block Operations
  addBlock: (newBlock: CanvasBlock, destinationId: string, index: number) => void;
  moveBlock: (blockId: string, destinationId: string, index: number) => void;
  deleteBlock: (id: string) => void;
  updateBlockProps: (id: string, newProps: any) => void;
  duplicateBlock: (id: string) => void;
  toggleBlockLock: (id: string) => void;
  toggleBlockVisibility: (id: string) => void;
  
  // History Operations
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  // API Operations
  savePage: () => Promise<void>;
  loadPage: (pageId: string) => Promise<void>;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  pageId: null,
  pageName: "New Page",
  blocks: [],
  selectedBlockId: null,
  isDragging: false,
  activeBreakpoint: 'base',
  isSaving: false,
  isLoading: false,
  history: [[]],
  historyIndex: 0,

  setPageContext: (pageId, pageName) => set({ pageId, pageName }),
  
  setBlocks: (blocks) => set({ 
    blocks,
    history: [blocks],
    historyIndex: 0
  }),
  
  selectBlock: (id) => set({ selectedBlockId: id }),
  setDragging: (isDragging) => set({ isDragging }),
  setActiveBreakpoint: (bp) => set({ activeBreakpoint: bp }),

  pushHistory: () => {
    const { blocks, history, historyIndex } = get();
    // Remove future history if we are in the middle of undo stack
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(blocks);
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  addBlock: (newBlock, destinationId, index) => {
    const { blocks, pushHistory } = get();
    const newBlocks = insertBlock(blocks, destinationId, index, newBlock);
    set({ blocks: newBlocks, selectedBlockId: newBlock.id });
    pushHistory();
  },

  moveBlock: (blockId, destinationId, index) => {
    const { blocks, pushHistory } = get();
    const blockToMove = findBlock(blocks, blockId);
    if (!blockToMove) return;
    
    const treeWithoutBlock = removeBlock(blocks, blockId);
    const newBlocks = insertBlock(treeWithoutBlock, destinationId, index, blockToMove);
    set({ blocks: newBlocks });
    pushHistory();
  },

  deleteBlock: (id) => {
    const { blocks, selectedBlockId, pushHistory } = get();
    const newBlocks = removeBlock(blocks, id);
    set({ 
      blocks: newBlocks,
      selectedBlockId: selectedBlockId === id ? null : selectedBlockId
    });
    pushHistory();
  },

  updateBlockProps: (id, newProps) => {
    const { blocks, pushHistory } = get();
    const newBlocks = updateBlock(blocks, id, newProps);
    set({ blocks: newBlocks });
    pushHistory();
  },

  duplicateBlock: (id) => {
    const { blocks, pushHistory } = get();
    const blockToCopy = findBlock(blocks, id);
    const parentInfo = findBlockParent(blocks, id);
    if (!blockToCopy || !parentInfo) return;
    
    const duplicate = duplicateBlockNode(blockToCopy);
    const newBlocks = insertBlock(blocks, parentInfo.parentId, parentInfo.index + 1, duplicate);
    
    set({ blocks: newBlocks, selectedBlockId: duplicate.id });
    pushHistory();
  },

  toggleBlockLock: (id) => {
    const { blocks, pushHistory } = get();
    const block = findBlock(blocks, id);
    if (!block) return;
    const newBlocks = updateBlock(blocks, id, { ...block.props, _locked: !block.props._locked });
    set({ blocks: newBlocks });
    pushHistory();
  },

  toggleBlockVisibility: (id) => {
    const { blocks, pushHistory } = get();
    const block = findBlock(blocks, id);
    if (!block) return;
    const newBlocks = updateBlock(blocks, id, { ...block.props, _hidden: !block.props._hidden });
    set({ blocks: newBlocks });
    pushHistory();
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      set({ 
        historyIndex: historyIndex - 1,
        blocks: history[historyIndex - 1]
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      set({ 
        historyIndex: historyIndex + 1,
        blocks: history[historyIndex + 1]
      });
    }
  },

  savePage: async () => {
    const { pageId, pageName, blocks } = get();
    if (!pageId) return;

    set({ isSaving: true });
    try {
      const res = await fetch(`http://localhost:8000/api/builder/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: pageName,
          slug: pageName.toLowerCase().replace(/\\s+/g, '-'),
          component_tree: blocks
        })
      });
      if (!res.ok) throw new Error('Failed to save page');
    } catch (error) {
      console.error('Error saving page:', error);
    } finally {
      set({ isSaving: false });
    }
  },

  loadPage: async (pageId: string) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`http://localhost:8000/api/builder/pages/${pageId}`);
      if (!res.ok) throw new Error('Failed to load page');
      const data = await res.json();
      
      set({ 
        pageId: data.id,
        pageName: data.name,
        blocks: data.component_tree || [],
        history: [data.component_tree || []],
        historyIndex: 0
      });
    } catch (error) {
      console.error('Error loading page:', error);
    } finally {
      set({ isLoading: false });
    }
  }
}));
