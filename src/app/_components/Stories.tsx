"use client";
import React from "react";
import StoriesCard from "./StoriesCard";
import PreLoginSide from "~/app/_components/PreLoginSide";
import { useWallet } from "@jup-ag/wallet-adapter";
import HasnotInvestedSide from "~/app/_components/HasNotInvestedSide";
import { api } from "~/trpc/react";

const Stories = () => {
  const wallet = useWallet();
  const walletAddress = wallet.publicKey?.toString();

  // Replace useStoriesStore with TRPC query
  const { data: storiesData, isLoading } = api.story.list.useQuery({
    limit: 10
  });

  const { data: user } = api.user.get.useQuery(
    {
      walletAddress: walletAddress!,
    },
    {
      enabled: !!wallet.connected && !!walletAddress,
    },
  );

  let rightSidebarContent;
  if (isLoading) {
    rightSidebarContent = <p className="text-gray-500">Loading...</p>;
  } else if (!wallet.connected) {
    rightSidebarContent = <PreLoginSide />;
  } else {
    rightSidebarContent = (
      <HasnotInvestedSide/>
    );
  }

  return (
    <div className="bg-white-50 min-h-screen">
      <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full lg:w-3/4">
            <div className="rounded-xl bg-white shadow-sm">
              <StoriesCard 
                stories={storiesData?.stories?.filter((story): story is NonNullable<typeof story> => story !== null)} 
                isLoading={isLoading} 
              />
            </div>
          </div>
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

export default Stories;
