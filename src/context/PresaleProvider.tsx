"use client";

import { usePresaleStore } from "~/store/usePresaleStore";
import type { ReactNode } from "react";

interface PresaleProviderProps {
  children: ReactNode;
}

export const PresaleProvider = ({ children }: PresaleProviderProps) => {
  return <>{children}</>;
};

export const usePresale = usePresaleStore;
