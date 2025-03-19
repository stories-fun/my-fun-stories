import { create } from "zustand";

interface StoryVideoState {
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  isMuted: boolean;
  setIsMuted: (value: boolean) => void;
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  isContentReady: boolean;
  setIsContentReady: (value: boolean) => void;
}

export const useStoryVideoStore = create<StoryVideoState>((set) => ({
  isPlaying: true,
  setIsPlaying: (value) => set({ isPlaying: value }),
  isMuted: true,
  setIsMuted: (value) => set({ isMuted: value }),
  isFullscreen: false,
  setIsFullscreen: (value) => set({ isFullscreen: value }),
  isLoading: true,
  setIsLoading: (value) => set({ isLoading: value }),
  isContentReady: true,
  setIsContentReady: (value) => set({ isContentReady: value }),
}));
