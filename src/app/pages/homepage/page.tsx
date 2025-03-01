"use client";
import React, { useEffect } from "react";
import StoriesCard from "./_components/StoriesCard";
import PreLoginSide from "~/app/_components/PreLoginSide";
import { useWallet } from "@jup-ag/wallet-adapter";
import { useStoriesStore } from "~/store/useStoriesStore";
import HasnotInvestedSide from "~/app/_components/HasNotInvestedSide";
import { api } from "~/trpc/react";

const HomePage = () => {
  const wallet = useWallet();
  const walletAddress = wallet.publicKey?.toString();
  const { getStories, isLoading } = useStoriesStore();

  useEffect(() => {
    if (wallet.connected && walletAddress) {
      void getStories(walletAddress);
    }
  }, [wallet.connected, walletAddress, getStories]);

  const { data: user } = api.user.get.useQuery(
    {
      walletAddress: walletAddress!, // '!' assets walletAddress is defined
    },
    {
      enabled: !!wallet.connected && !!walletAddress, //only run the query when wallet is connected and  address exists
    },
  );

  let rightSidebarContent;
  if (isLoading) {
    rightSidebarContent = <p className="text-gray-500">Loading...</p>;
  } else if (!wallet.connected) {
    rightSidebarContent = <PreLoginSide />;
  } else {
    rightSidebarContent = (
      <HasnotInvestedSide username={user?.username ?? "Unknown User"} />
    );
  }

  return (
    <div className="bg-white-50 min-h-screen">
      <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Main stories section */}
          <div className="w-full lg:w-3/4">
            <div className="rounded-xl bg-white shadow-sm">
              <StoriesCard />
            </div>
          </div>

          {/* Right section - hidden on mobile */}
          <div className="lg:hidden">
            <div className="mt-4">{rightSidebarContent}</div>
          </div>
          <div className="hidden lg:block lg:w-1/4">
            <div className="">{rightSidebarContent}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
