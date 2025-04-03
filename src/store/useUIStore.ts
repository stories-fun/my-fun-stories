import { create } from "zustand";

interface PostUIState {
  showShareModal: boolean;
  showBuyDialog: boolean;
}

interface UIState {
  copied: boolean;
  setCopied: (value: boolean) => void;

  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
  mounted: boolean;
  setMounted: (value: boolean) => void;

  showUserDialog: boolean;
  setShowUserDialog: (value: boolean) => void;
  hasCheckedUser: boolean;
  setHasCheckedUser: (value: boolean) => void;

  loading: boolean;
  setLoading: (value: boolean) => void;

  postUIStates: Record<string, PostUIState>;
  setShowShareModal: (postId: string, value: boolean) => void;
  setShowBuyDialog: (postId: string, value: boolean) => void;
  getShowShareModal: (postId: string) => boolean;
  getShowBuyDialog: (postId: string) => boolean;

  hasScrolled: boolean;
  setHasScrolled: (value: boolean) => void;
}

const getDefaultPostUIState = (): PostUIState => ({
  showShareModal: false,
  showBuyDialog: false,
});

export const useUIStore = create<UIState>((set, get) => ({
  copied: false,
  setCopied: (value) => set({ copied: value }),

  menuOpen: false,
  setMenuOpen: (value) => set({ menuOpen: value }),
  mounted: false,
  setMounted: (value) => set({ mounted: value }),

  showUserDialog: false,
  setShowUserDialog: (value) => set({ showUserDialog: value }),
  hasCheckedUser: false,
  setHasCheckedUser: (value) => set({ hasCheckedUser: value }),

  loading: false,
  setLoading: (value) => set({ loading: value }),

  postUIStates: {},
  setShowShareModal: (postId, value) =>
    set((state) => ({
      postUIStates: {
        ...state.postUIStates,
        [postId]: {
          ...(state.postUIStates[postId] ?? getDefaultPostUIState()),
          showShareModal: value,
        },
      },
    })),
  setShowBuyDialog: (postId, value) =>
    set((state) => ({
      postUIStates: {
        ...state.postUIStates,
        [postId]: {
          ...(state.postUIStates[postId] ?? getDefaultPostUIState()),
          showBuyDialog: value,
        },
      },
    })),
  getShowShareModal: (postId) => {
    const state = get().postUIStates[postId];
    return state?.showShareModal ?? false;
  },
  getShowBuyDialog: (postId) => {
    const state = get().postUIStates[postId];
    return state?.showBuyDialog ?? false;
  },

  hasScrolled: false,
  setHasScrolled: (value) => set({ hasScrolled: value }),
}));
