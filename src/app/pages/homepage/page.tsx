<<<<<<< Updated upstream
import React from "react";
=======
"use client";
import React, { useEffect, useState } from "react";
>>>>>>> Stashed changes
import StoriesCard from "./_components/StoriesCard";
import RightSidebar from "~/app/_components/RightSidebar";
import PreLoginSide from "~/app/_components/PreLoginSide";
import HasnotInvestedSide from "~/app/_components/HasnotInvestedSide";
import HasInvestedSide from "~/app/_components/HasInvestedSide";
import { useWallet } from "@jup-ag/wallet-adapter";
import { useStoriesStore } from "~/store/useStoriesStore";

const HomePage = () => {
  const wallet = useWallet();
  const walletAddress = wallet.publicKey?.toString();
  const { getStories, stories, isLoading, error } = useStoriesStore();

  useEffect(() => {
    if (wallet.connected && walletAddress) {
      getStories(walletAddress);
    }
  }, [wallet.connected, walletAddress, getStories]);

  let rightSidebarContent;
  if (isLoading) {
    rightSidebarContent = <p className="text-gray-500">Loading...</p>;
  } else if (!wallet.connected) {
    rightSidebarContent = <PreLoginSide />;
  } else {
    rightSidebarContent = <HasnotInvestedSide />;
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
          <div className="hidden lg:block lg:w-1/4">
            <div className="">
              {/* <PreLoginSide /> */}
              {/* <HasnotInvestedSide /> */}
              {/* <HasInvestedSide /> */}
              {rightSidebarContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
