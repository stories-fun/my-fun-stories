"use client";
import React, { useEffect } from "react";
import PostActions from "./PostActions";
import "draft-js/dist/Draft.css";

// import { ImageSliderForStories } from "./ImageSliderForStories";
import "draft-js/dist/Draft.css";
import { useStoriesStore } from "~/store/useStoriesStore";
import { StoryVideo } from "../pages/homepage/_components/StoryVideo";

const PostCard = ({ storyId }: { storyId: string }) => {
  const { getById, stories, isLoading, error } = useStoriesStore();

  useEffect(() => {
    if (storyId) {
      getById(storyId).catch((error) => {
        console.error("Failed to fetch story:", error);
      });
    }
  }, [storyId, getById]);

  const story = stories.find((s) => s.id === storyId);
  console.log("Story in PostCard:", story);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!story) return <p>No story Found</p>;

  return (
    <div className="container mx-auto w-full rounded-lg">
      <h1 className="text-2xl font-[IBM_Plex_Sans] font-bold md:text-3xl lg:text-4xl">
        {story.title}
      </h1>
      <div className="bg-[#F6F7F8]">
        {/* <ImageSliderForStories /> */}
        <StoryVideo src={"/video.mp4"} />
      </div>
      <div className="mt-4">
        <PostActions storyKey={story.id} walletAddress={story.walletAddres} />
      </div>

      <div className="mt-4 font-[IBM_Plex_Sans]">
        <div>{story.content}</div>
      </div>
    </div>
  );
};

export default PostCard;
