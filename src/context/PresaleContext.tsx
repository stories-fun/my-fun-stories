"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface PresaleContextType {
  pricePerToken: number;
  tokensSold: number;
  hardcap: number;
  tokenMint: string;
  error: string | null;
  loadPresaleData: () => Promise<void>;
}

interface PresaleData {
  pricePerToken: string;
  tokensSold: string;
  hardcap: string;
  tokenMint: string;
}

const PresaleContext = createContext<PresaleContextType>(
  {} as PresaleContextType,
);

export const PresaleProvider = ({ children }: { children: ReactNode }) => {
  const [pricePerToken, setPricePerToken] = useState(0);
  const [tokensSold, setTokensSold] = useState(0);
  const [hardcap, setHardcap] = useState(0);
  const [tokenMint, setTokenMint] = useState("");
  const [error, setError] = useState<string | null>(null);

  const checkServerHealth = async () => {
    try {
      const response = await fetch("http://localhost:3001/health");
      if (!response.ok) {
        throw new Error("Server is not responding");
      }
      return true;
    } catch (error) {
      console.error("Server health check failed:", error);
      setError("Server is not available. Please try again later.");
      return false;
    }
  };

  const loadPresaleData = async () => {
    try {
      // Check if server is running first
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
      setPricePerToken(Number(data.pricePerToken));
      setTokensSold(Number(data.tokensSold));
      setHardcap(Number(data.hardcap));
      setTokenMint(data.tokenMint);
      setError(null);
    } catch (error) {
      console.error("Failed to load presale data:", error);
      setError("Failed to load presale data. Please try again later.");
    }
  };

  // useEffect(() => {
  //   loadPresaleData();
  // }, []);

  return (
    <PresaleContext.Provider
      value={{
        pricePerToken,
        tokensSold,
        hardcap,
        tokenMint,
        loadPresaleData,
        error,
      }}
    >
      {children}
    </PresaleContext.Provider>
  );
};

export const usePresale = () => useContext(PresaleContext);
