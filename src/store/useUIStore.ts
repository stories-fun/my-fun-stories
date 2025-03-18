import { create } from "zustand";

interface UIState {
  // ShareModal state
  copied: boolean;
  setCopied: (value: boolean) => void;

  // NavBar state
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
  mounted: boolean;
  setMounted: (value: boolean) => void;

  // User dialog state
  showUserDialog: boolean;
  setShowUserDialog: (value: boolean) => void;
  hasCheckedUser: boolean;
  setHasCheckedUser: (value: boolean) => void;

  // BuyToken state
  loading: boolean;
  setLoading: (value: boolean) => void;

  // Post actions state
  showShareModal: boolean;
  setShowShareModal: (value: boolean) => void;
  showBuyDialog: boolean;
  setShowBuyDialog: (value: boolean) => void;

  // Story page state
  hasScrolled: boolean;
  setHasScrolled: (value: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // ShareModal state
  copied: false,
  setCopied: (value) => set({ copied: value }),

  // NavBar state
  menuOpen: false,
  setMenuOpen: (value) => set({ menuOpen: value }),
  mounted: false,
  setMounted: (value) => set({ mounted: value }),

  // User dialog state
  showUserDialog: false,
  setShowUserDialog: (value) => set({ showUserDialog: value }),
  hasCheckedUser: false,
  setHasCheckedUser: (value) => set({ hasCheckedUser: value }),

  // BuyToken state
  loading: false,
  setLoading: (value) => set({ loading: value }),

  // Post actions state
  showShareModal: false,
  setShowShareModal: (value) => set({ showShareModal: value }),
  showBuyDialog: false,
  setShowBuyDialog: (value) => set({ showBuyDialog: value }),

  // Story page state
  hasScrolled: false,
  setHasScrolled: (value) => set({ hasScrolled: value }),
}));
