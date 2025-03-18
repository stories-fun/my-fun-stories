"use client";

import { TRPCReactProvider } from "~/trpc/react";
import { WalletChildrenProvider } from "../context/wallet";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletChildrenProvider>
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </WalletChildrenProvider>
  );
}
