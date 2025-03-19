import { create } from "zustand";

interface PresaleData {
  pricePerToken: string;
  tokensSold: string;
  hardcap: string;
  tokenMint: string;
}

interface PresaleState {
  pricePerToken: number;
  tokensSold: number;
  hardcap: number;
  tokenMint: string;
  error: string | null;
  setError: (value: string | null) => void;
  loadPresaleData: () => Promise<void>;
}

export const usePresaleStore = create<PresaleState>((set) => ({
  pricePerToken: 0,
  tokensSold: 0,
  hardcap: 0,
  tokenMint: "",
  error: null,
  setError: (value) => set({ error: value }),

  loadPresaleData: async () => {
    try {
      const isServerHealthy = await checkServerHealth();
      if (!isServerHealthy) {
        return;
      }

      const response = await fetch("http://localhost:3001/api/presale");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as PresaleData;
      console.log("Presale data received:", data);

      set({
        pricePerToken: Number(data.pricePerToken),
        tokensSold: Number(data.tokensSold),
        hardcap: Number(data.hardcap),
        tokenMint: data.tokenMint,
        error: null,
      });
    } catch (error) {
      console.error("Failed to load presale data:", error);
      set({ error: "Failed to load presale data. Please try again later." });
    }
  },
}));

async function checkServerHealth() {
  try {
    const response = await fetch("http://localhost:3001/health");
    if (!response.ok) {
      throw new Error("Server is not responding");
    }
    return true;
  } catch (error) {
    console.error("Server health check failed:", error);
    usePresaleStore
      .getState()
      .setError("Server is not available. Please try again later.");
    return false;
  }
}
