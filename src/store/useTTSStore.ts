import { create } from "zustand";

interface TTSState {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  currentChunkIndex: number;
  setCurrentChunkIndex: (value: number) => void;
  totalChunks: number;
  setTotalChunks: (value: number) => void;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  playbackProgress: number;
  setPlaybackProgress: (value: number) => void;
  error: string | null;
  setError: (value: string | null) => void;
  audioQueue: string[];
  setAudioQueue: (value: string[]) => void;
}

export const useTTSStore = create<TTSState>((set) => ({
  isLoading: false,
  setIsLoading: (value) => set({ isLoading: value }),
  currentChunkIndex: 0,
  setCurrentChunkIndex: (value) => set({ currentChunkIndex: value }),
  totalChunks: 0,
  setTotalChunks: (value) => set({ totalChunks: value }),
  isPlaying: false,
  setIsPlaying: (value) => set({ isPlaying: value }),
  playbackProgress: 0,
  setPlaybackProgress: (value) => set({ playbackProgress: value }),
  error: null,
  setError: (value) => set({ error: value }),
  audioQueue: [],
  setAudioQueue: (value) => set({ audioQueue: value }),
}));
