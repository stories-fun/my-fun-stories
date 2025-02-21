"use client";

import { TRPCReactProvider } from "~/trpc/react";
import { WalletChildrenProvider } from "./_components/wallet";

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
