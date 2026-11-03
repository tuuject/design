import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NavLayout = 'sidebar' | 'horizontal';

interface UiState {
  /** Desktop sidebar collapsed to icons only. Persisted. Ignored in the horizontal layout. */
  sidebarCollapsed: boolean;
  /** Desktop navigation layout. Persisted; below md the drawer is always used. */
  navLayout: NavLayout;
  /** Mobile off-canvas navigation drawer. Never persisted. */
  mobileNavOpen: boolean;
  toggleSidebar: () => void;
  setNavLayout: (layout: NavLayout) => void;
  setMobileNavOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      navLayout: 'sidebar',
      mobileNavOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setNavLayout: (layout) => set({ navLayout: layout }),
      setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
    }),
    {
      name: 'koi-admin-ui',
      partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed, navLayout: s.navLayout }),
    },
  ),
);
