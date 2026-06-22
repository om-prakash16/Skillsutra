import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface NavigationState {
  isCollapsed: boolean;
  expandedItems: string[];
  favorites: string[]; // array of item IDs
  recent: string[]; // array of item IDs, max 20
  
  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  toggleExpanded: (itemId: string) => void;
  setExpanded: (itemIds: string[]) => void;
  
  addFavorite: (itemId: string) => void;
  removeFavorite: (itemId: string) => void;
  reorderFavorites: (newOrder: string[]) => void;
  
  addRecent: (itemId: string) => void;
  clearRecents: () => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set, get) => ({
      isCollapsed: false,
      expandedItems: ["dashboard-main", "identity-access", "cms"], // defaults
      favorites: [],
      recent: [],

      toggleSidebar: () => set({ isCollapsed: !get().isCollapsed }),
      setSidebarCollapsed: (collapsed) => set({ isCollapsed: collapsed }),

      toggleExpanded: (itemId) => {
        const { expandedItems } = get();
        if (expandedItems.includes(itemId)) {
          set({ expandedItems: expandedItems.filter((id) => id !== itemId) });
        } else {
          set({ expandedItems: [...expandedItems, itemId] });
        }
      },
      setExpanded: (itemIds) => set({ expandedItems: itemIds }),

      addFavorite: (itemId) => {
        const { favorites } = get();
        if (!favorites.includes(itemId)) {
          set({ favorites: [...favorites, itemId] });
        }
      },
      removeFavorite: (itemId) => {
        set({ favorites: get().favorites.filter((id) => id !== itemId) });
      },
      reorderFavorites: (newOrder) => set({ favorites: newOrder }),

      addRecent: (itemId) => {
        const { recent } = get();
        // Remove if already exists to push to top
        const filtered = recent.filter((id) => id !== itemId);
        const newRecent = [itemId, ...filtered].slice(0, 20); // Keep max 20
        set({ recent: newRecent });
      },
      clearRecents: () => set({ recent: [] }),
    }),
    {
      name: "enterprise-nav-storage", 
      storage: createJSONStorage(() => localStorage),
    }
  )
);
