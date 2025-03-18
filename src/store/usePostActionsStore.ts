import { create } from "zustand";

interface PostActionsState {
  userWallet: string | null;
  setUserWallet: (value: string | null) => void;
  isLiked: boolean;
  setIsLiked: (value: boolean) => void;
  count: number;
  setCount: (value: number | ((prev: number) => number)) => void;
}

export const usePostActionsStore = create<PostActionsState>((set) => ({
  userWallet: null,
  setUserWallet: (value) => set({ userWallet: value }),
  isLiked: false,
  setIsLiked: (value) => set({ isLiked: value }),
  count: 0,
  setCount: (value) =>
    set((state) => ({
      count: typeof value === "function" ? value(state.count) : value,
    })),
}));
