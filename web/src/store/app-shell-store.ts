import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AppShellState {
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  mobileDrawerOpen: boolean;
  expandedGroups: Record<string, boolean>;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarWidth: (width: number) => void;
  setMobileDrawerOpen: (open: boolean) => void;
  toggleGroup: (groupId: string) => void;
}

export const useAppShellStore = create<AppShellState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      sidebarWidth: 260, // Default width
      mobileDrawerOpen: false,
      expandedGroups: {},
      
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setSidebarWidth: (width) => set({ sidebarWidth: Math.max(200, Math.min(width, 400)) }),
      setMobileDrawerOpen: (open) => set({ mobileDrawerOpen: open }),
      toggleGroup: (groupId) => set((state) => ({
        expandedGroups: {
          ...state.expandedGroups,
          [groupId]: !state.expandedGroups[groupId]
        }
      })),
    }),
    {
      name: 'skillsutra-app-shell', // key in localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        sidebarWidth: state.sidebarWidth,
        expandedGroups: state.expandedGroups,
      }), // Don't persist mobileDrawerOpen
    }
  )
)
