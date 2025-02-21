"use client";

import {
  UnifiedWalletButton,
  UnifiedWalletProvider,
  useWallet,
} from "@jup-ag/wallet-adapter";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, type Cluster } from "@solana/web3.js";
import { WalletNotification } from "./wallet-notification";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";

import { useCallback, useEffect, useMemo, useState } from "react";
import WalletConnectHandler from "./WalletConnectHandler";

export const WALLET_CONFIG = {
  autoConnect: true,
  env: "devnet" as Cluster,
  metadata: {
    name: "storiesdotfun",
    description: "Stories Platform",
    url: "#",
    iconUrls: ["#"] as string[],
  },
  notificationCallback: WalletNotification,
  theme: "dark" as const,
  lang: "en" as const,
};

const wallets = [new PhantomWalletAdapter()];

export function WalletProvider() {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <UnifiedWalletProvider wallets={wallets} config={WALLET_CONFIG}>
        <WalletConnectHandler />
      </UnifiedWalletProvider>
    </ConnectionProvider>
  );
}

export function WalletChildrenProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <UnifiedWalletProvider wallets={wallets} config={WALLET_CONFIG}>
        {children}
      </UnifiedWalletProvider>
    </ConnectionProvider>
  );
}
