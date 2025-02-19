"use client";
import React, { useEffect, useState } from "react";
import PostCard from "~/app/_components/PostCard";
import { useParams, useSearchParams } from "next/navigation";
import RightSidebar from "~/app/_components/RightSidebar";
import NavBar from "~/app/_components/NavBar";
import Comments from "~/app/_components/Comments";
import { useStoriesStore } from "~/store/useStoriesStore";

const Page = () => {
  const { id } = useParams();
  const { stories, isLoading } = useStoriesStore();
  const [hasScrolled, setHasScrolled] = useState(false);

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
      <div className="container mx-auto flex gap-6 p-10">
        {/* middle stories */}
        <div className="w-full rounded-lg bg-white p-4 md:w-3/4">
          <PostCard storyId={id as string} />
<<<<<<< HEAD
=======
          <div id="comments" className="scroll-mt-20 scroll-smooth">
            <Comments postId={id as string} />
          </div>
>>>>>>> main
        </div>

        {/* right sidebar */}
        <div className="hidden rounded-lg bg-gray-100 md:block md:w-1/4">
          <RightSidebar />
        </div>
      </div>
    </>
  );
};

export default Page;
