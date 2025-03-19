import { create } from "zustand";

interface RightSidebarState {
  expandedTiers: Record<number, boolean>;
  setExpandedTiers: (
    value:
      | Record<number, boolean>
      | ((prev: Record<number, boolean>) => Record<number, boolean>),
  ) => void;
  toggleTier: (tierIndex: number) => void;
}

export const useRightSidebarStore = create<RightSidebarState>((set) => ({
  expandedTiers: {},
  setExpandedTiers: (value) =>
    set((state) => ({
      expandedTiers:
        typeof value === "function" ? value(state.expandedTiers) : value,
    })),
  toggleTier: (tierIndex) =>
    set((state) => ({
      expandedTiers: {
        ...state.expandedTiers,
        [tierIndex]: !state.expandedTiers[tierIndex],
      },
    })),
}));
