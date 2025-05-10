"use client";

import { UnifiedWalletProvider } from "@jup-ag/wallet-adapter";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { clusterApiUrl, type Cluster } from "@solana/web3.js";
import { WalletNotification } from "../app/_components/ui/wallet-notification";
import { useMemo } from "react";
import WalletConnectHandler from "../app/_components/WalletConnectHandler";
import type { Adapter } from "@solana/wallet-adapter-base";

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

const wallets: Adapter[] = [];

export function WalletProvider() {
  // const endpoint = useMemo(() => clusterApiUrl("devnet"), []);

  // return (
  //   <ConnectionProvider endpoint={endpoint}>
  //     <UnifiedWalletProvider wallets={wallets} config={WALLET_CONFIG}>
  //       <WalletConnectHandler />
  //     </UnifiedWalletProvider>
  //   </ConnectionProvider>
  // );
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
