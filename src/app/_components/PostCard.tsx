"use client";
import React, { useEffect } from "react";
import PostActions from "./PostActions";

import { ImageSliderForStories } from "./ImageSliderForStories";
import "draft-js/dist/Draft.css";
import { useStoriesStore } from "~/store/useStoriesStore";

const PostCard = ({ storyId }: { storyId: string }) => {
  const { getById, stories, isLoading, error } = useStoriesStore();

  useEffect(() => {
    if (storyId) {
      getById(storyId);
    }
  }, [storyId, getById]);

  const story = stories.find((s) => s.id === storyId);
  console.log("Story in PostCard:", story);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!story) return <p>No story Found</p>;

  return (
    <div className="container mx-auto w-full rounded-lg">
      <h2 className="font-bold">{story.title}</h2>
      <div className="bg-[#F6F7F8]">
        <ImageSliderForStories />
      </div>
      <div className="mt-4">
        <PostActions postId={story.id || storyId} />
      </div>

      <div className="mt-4">
        <div>{story.content}</div>
      </div>
    </div>
  );
};

export default PostCard;
