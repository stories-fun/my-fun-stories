"use client";

import {
  UnifiedWalletButton,
  UnifiedWalletProvider,
  useWallet,
} from "@jup-ag/wallet-adapter";
import type { Cluster } from "@solana/web3.js";
import { WalletNotification } from "./wallet-notification";

import { useCallback, useEffect, useState } from "react";
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

export function WalletProvider() {
  return (
    // <UnifiedWalletProvider wallets={[]} config={WALLET_CONFIG}>
    //   <UnifiedWalletButton
    //     buttonClassName="!bg-[#FFE700] !text-sm !text-black"
    //     currentUserClassName="!bg-[#FFE700] !text-sm !text-black"
    //   />
    // </UnifiedWalletProvider>
    <UnifiedWalletProvider wallets={[]} config={WALLET_CONFIG}>
      <WalletConnectHandler />
    </UnifiedWalletProvider>
  );
}
export function WalletChildrenProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <UnifiedWalletProvider wallets={[]} config={WALLET_CONFIG}>
    //   <UnifiedWalletButton
    //     buttonClassName="!bg-[#FFE700] !text-sm !text-black"
    //     currentUserClassName="!bg-[#FFE700] !text-sm !text-black"
    //   />
    // </UnifiedWalletProvider>
    <UnifiedWalletProvider wallets={[]} config={WALLET_CONFIG}>
      {children}
    </UnifiedWalletProvider>
  );
}
