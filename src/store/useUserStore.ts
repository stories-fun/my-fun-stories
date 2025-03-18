import { create } from "zustand";

interface UserState {
  username: string;
  setUsername: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  imageFile: File | null;
  setImageFile: (value: File | null) => void;
  imagePreview: string | null;
  setImagePreview: (value: string | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  username: "",
  setUsername: (value) => set({ username: value }),
  description: "",
  setDescription: (value) => set({ description: value }),
  isUploading: false,
  setIsUploading: (value) => set({ isUploading: value }),
  imageFile: null,
  setImageFile: (value) => set({ imageFile: value }),
  imagePreview: null,
  setImagePreview: (value) => set({ imagePreview: value }),
}));
