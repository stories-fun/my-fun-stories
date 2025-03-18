import { create } from "zustand";

interface BuyTokenState {
  solAmount: string;
  setSolAmount: (value: string) => void;
  errorState: string | null;
  setErrorState: (value: string | null) => void;
}

export const useBuyTokenStore = create<BuyTokenState>((set) => ({
  solAmount: "",
  setSolAmount: (value) => set({ solAmount: value }),
  errorState: null,
  setErrorState: (value) => set({ errorState: value }),
}));
