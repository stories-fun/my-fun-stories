import { UnifiedWalletButton, useWallet } from "@jup-ag/wallet-adapter";
import React, { useCallback, useEffect, useState } from "react";
import { api } from "~/trpc/react";

const WalletConnectHandler = () => {
  const wallet = useWallet();
  const [hasCreatedUser, setHasCreatedUser] = useState(false);

  const { data: existingUser, isLoading } = api.user.get.useQuery(
    {
      walletAddress: wallet.publicKey?.toString() as string,
    },
    {
      enabled: !!wallet.publicKey,
    },
  );

  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      setHasCreatedUser(true);
    },
    onError: (error: { message: string }) => {
      if (error.message !== "User already exists") {
        console.log("Failed to create user", error);
      }
    },
  });

  const handleWalletConnection = useCallback(async () => {
    if (!wallet.connected || !wallet.publicKey || hasCreatedUser || isLoading)
      return;

    if (!existingUser) {
      try {
        await createUser.mutate({
          walletAddress: wallet.publicKey.toString(),
          username: `user_${wallet.publicKey.toString().slice(0, 8)}`,
        });
      } catch (error) {
        console.log("Error creating user", error);
      }
    } else {
      setHasCreatedUser(true);
    }
  }, [wallet.connected, wallet.publicKey, hasCreatedUser, createUser]);

  useEffect(() => {
    handleWalletConnection();
  }, [handleWalletConnection]);

  return (
    <UnifiedWalletButton
      buttonClassName="!bg-[#FFE700] !text-sm !text-black"
      currentUserClassName="!bg-[#FFE700] !text-sm !text-black"
    />
  );
};

export default WalletConnectHandler;
