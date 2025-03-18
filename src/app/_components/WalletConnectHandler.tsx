"use client";

import { UnifiedWalletButton, useWallet } from "@jup-ag/wallet-adapter";
import React, { useEffect, useMemo } from "react";
import { api } from "~/trpc/react";
import { UserCreationDialog } from "./UserCreationDialog";
import { useUIStore } from "~/store/useUIStore";

const WalletConnectHandler = () => {
  const { publicKey } = useWallet();
  const wallet = useWallet();
  const {
    showUserDialog,
    setShowUserDialog,
    hasCheckedUser,
    setHasCheckedUser,
  } = useUIStore();

  useEffect(() => {
    if (publicKey) {
      console.log("Wallet connected:", publicKey.toString());
    }
  }, [publicKey]);

  const { error, isSuccess, isError } = api.user.get.useQuery(
    {
      walletAddress: wallet.publicKey?.toString() ?? "",
    },
    {
      enabled: !!wallet.publicKey && !hasCheckedUser,
      retry: false,
    },
  );

  useEffect(() => {
    if (isSuccess) {
      setHasCheckedUser(true);
      setShowUserDialog(false);
    } else if (
      isError &&
      error?.data?.code === "NOT_FOUND" &&
      wallet.connected
    ) {
      setHasCheckedUser(true);
      setShowUserDialog(true);
    }
  }, [
    isSuccess,
    isError,
    error,
    wallet.connected,
    setHasCheckedUser,
    setShowUserDialog,
  ]);

  useEffect(() => {
    if (!wallet.connected) {
      setShowUserDialog(false);
      setHasCheckedUser(false);
    }
  }, [wallet.connected, setShowUserDialog, setHasCheckedUser]);

  const walletAddress = useMemo(
    () => wallet.publicKey?.toString(),
    [wallet.publicKey],
  );

  useEffect(() => {
    setHasCheckedUser(false);
  }, [walletAddress, setHasCheckedUser]);

  return (
    <>
      <UnifiedWalletButton />
      {showUserDialog && wallet.publicKey && (
        <UserCreationDialog
          isOpen={showUserDialog}
          onClose={() => setShowUserDialog(false)}
          walletAddress={wallet.publicKey.toString()}
        />
      )}
    </>
  );
};

export default WalletConnectHandler;
