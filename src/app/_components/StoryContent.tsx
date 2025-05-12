"use client";
import React from "react";
import Image from "next/image";
import PostActions from "./PostActions";
import { api } from "~/trpc/react";
import Loading from "./Loading";
import { StoryVideo } from "./StoryVideo";
import AdhiStory from "../stories/AdhiStory";
import DOMPurify from 'isomorphic-dompurify';

const StoryContent = ({ storyId }: { storyId: string }) => {
  const { data: storyData, isLoading } = api.story.getById.useQuery({
    storyKey: storyId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto w-full rounded-lg">
        <div className="mb-4 h-12 animate-pulse rounded bg-gray-100" />
        <div className="h-96 animate-pulse rounded bg-gray-100" />
      </div>
    );
  }

  if (!storyData?.story) return <p className="p-4 text-gray-500">Story not found</p>;

  const story = storyData.story;

  return (
    <div className="container mx-auto w-full rounded-lg">
      <h1 className="pb-4 text-xl font-[IBM_Plex_Sans] font-bold md:text-3xl lg:text-4xl">
        {story.title}
      </h1>

      <div className="bg-[#F6F7F8]">
        <StoryVideo src="https://pub-61076b0159ee4fdab7efe9dadc68458d.r2.dev/assets/adhi_sample_video.MP4" />
      </div>

      <div className="mt-4">
        <PostActions storyKey={story.id} walletAddress={story.walletAddress} />
      </div>

      <div className="mt-4 font-[IBM_Plex_Sans]" data-tts-content="true">
        {storyId === "1740725593742_pDHykt" ? (
          <AdhiStory />
        ) : (
          <div className="prose max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(story.content) }}
              className="
                [&>h1]:text-lg [&>h1]:font-[IBM_Plex_Sans] [&>h1]:font-bold [&>h1]:md:text-2xl [&>h1]:lg:text-3xl [&>h1]:mt-8 [&>h1]:mb-4
                [&>h2]:text-base [&>h2]:font-[IBM_Plex_Sans] [&>h2]:font-bold [&>h2]:md:text-xl [&>h2]:lg:text-2xl [&>h2]:mt-6 [&>h2]:mb-3
              "
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryContent; 