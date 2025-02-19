"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import PostActions from "~/app/_components/PostActions";
import ProgressBar from "~/app/_components/ProgressBar";
import { ImageSlider } from "./ImageSlider";
import { EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import dynamic from "next/dynamic";
import axios from "axios";
import { useStoriesStore } from "~/store/useStoriesStore";
import { useRouter } from "next/navigation";
import Comments from "~/app/_components/Comments";
import Loading from "./Loading";

const Editor = dynamic(() => import("draft-js").then((mod) => mod.Editor), {
  ssr: false,
});

const StoriesCard = () => {
  const router = useRouter();
  const { stories, error, isLoading, getStories } = useStoriesStore();

  useEffect(() => {
    void getStories();
  }, [getStories]);

  console.log("Stories in StoriesCard:", stories); // Debug log

  if (isLoading) return <Loading />;
  if (error) return <p>Error Loading Stories{error}</p>;
  if (!stories.length) return <p>No stories found</p>;

  const handleCardClick = (storyId: string) => {
    console.log("Clicking story with ID:", storyId); // Debug log
    router.push(`/stories/${storyId}`);
  };

  return (
    <div className="container mx-auto w-full rounded-lg">
      {stories.map((story) => (
        <div key={story.id} className="mb-8 transition-all hover:bg-gray-50">
          <h2 className="font-bold">{story.title}</h2>
          <div
            className="cursor-pointer bg-[#F6F7F8]"
            onClick={() => handleCardClick(story.id)}
          >
            <ImageSlider />
          </div>
          <div className="mt-4">
            <PostActions postId={story.id} />
          </div>
          <div className="mt-4">
            <div>{story.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoriesCard;
