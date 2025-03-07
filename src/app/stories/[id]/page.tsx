"use client";
import React, { useEffect, useState } from "react";
import PostCard from "~/app/_components/PostCard";
import { useParams } from "next/navigation";
import RightSidebar from "~/app/_components/RightSidebar";
import NavBar from "~/app/_components/NavBar";
import Comments from "~/app/_components/Comments";
import { useStoriesStore } from "~/store/useStoriesStore";
import { useWallet } from "@jup-ag/wallet-adapter";
import { api } from "~/trpc/react";

const Page = () => {
  const params = useParams();
  const id = params?.id;
  const { stories, isLoading } = useStoriesStore();
  const [hasScrolled, setHasScrolled] = useState(false);
  const wallet = useWallet();
  const walletAddress = wallet.publicKey?.toString();

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
    // rightSidebarContent = <PreLoginSide />;
    rightSidebarContent = <RightSidebar username={user?.username ?? "User"} />;
  } else {
    rightSidebarContent = (
      <RightSidebar username={user?.username ?? "Unknown User"} />
    );
  }

  useEffect(() => {
    if (
      window.location.hash === "#comments" &&
      !hasScrolled &&
      !isLoading &&
      stories.length > 0
    ) {
      const scrollToComments = () => {
        const commentsSection = document.getElementById("comments");
        if (commentsSection) {
          const headerHeight = 80; // Adjust this value based on your header height
          const elementPosition = commentsSection.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
          setHasScrolled(true);
        }
      };

      // Try scrolling multiple times to ensure it works
      const scrollAttempts = [0, 100, 500, 1000];
      scrollAttempts.forEach((delay) => {
        setTimeout(scrollToComments, delay);
      });
    }
  }, [isLoading, stories, hasScrolled]);

  // Reset hasScrolled when navigating to a new story
  useEffect(() => {
    setHasScrolled(false);
  }, [id]);

  return (
    <>
      <NavBar />
      <div className="bg-white-50 min-h-screen">
        <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-10">
          <div className="flex flex-col gap-14 lg:flex-row">
            {/* Main stories section */}
            <div className="w-full lg:w-3/4">
              <div className="rounded-xl bg-white shadow-sm">
                <PostCard storyId={id as string} />
                <div id="comments" className="scroll-mt-20 scroll-smooth">
                  <Comments postId={id as string} />
                </div>
              </div>
            </div>

            {/* Right section - shows at bottom on mobile */}
            <div className="w-full lg:w-1/4">
              <div className="">{rightSidebarContent}</div>
              {/* <RightSidebar /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
