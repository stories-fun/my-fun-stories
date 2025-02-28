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
    if (storyId && storyId !== "1740050375765_ffqB3s") {
      getById(storyId).catch((error) => {
        console.error("Failed to fetch story:", error);
      });
    }
  }, [storyId, getById]);

  const story =
    storyId === "1740050375765_ffqB3s"
      ? {
          id: "1740725593742_pDHykt",
          walletAddres: "6zpDHykt19QBN3VKpZpV9jEAMtYJKwkkYMgiEix8sVky",
          title: " How I Met God and Got Into Crypto",
          content:
            "I started writing this book while I was in India and a large part of it was conceptualized and written in India. Parts of the book have been conceived and/or written through my stay in Paris, Amsterdam, Luxembourg, Qatar, UAE, Singapore, Brussels and Berlin. However, the words you are reading right now(and certain other sections of the book) are being written (almost totally by chance!)in a rather interesting place - a Cafe named after a man who married his own cousin, never saw his first daughter, if he ever went to an Indian school, 5th grade bullies would call him “Maggi noodles'' over his now iconic hairdo, he refused the Presidency of Israel, was spied on by the FBI for decades and on the side, also made some scientific discoveries - I’m of course talking about Albert Einstein. The cafe is called - (take a wild guess) - Cafe Einstein! I mean, I would have hoped they were more imaginative than that? For egs, I would perhaps have called it Cafe Spooky Einstein or Cafe Einstainglement(Sounds so German no?) in reference to his dismissive remark on the remarkable concept of “Quantum Entanglement” in Quantum Physics. I feel one subject that comes closest to life is Quantum Physics. If you truly want to “understand” life, you must “understand” Quantum Physics but there is a problem -  you cannot. Quantum Physics cannot be understood - you must keep trying until some day, you just get it. In Quantum Physics, there is a beautiful concept called Quantum Entanglement which basically suggests that the state of one particle has a direct impact on the state of a totally different particle. Confused? Let me explain using a Bollywood movie",
          writerName: "Admin",
        }
      : stories.find((s) => s.id === storyId);
  console.log("Story in PostCard:", story);

  if (isLoading && storyId !== "1740725593742_pDHykt") return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!story) return <p>No story Found</p>;

  return (
    <div className="container mx-auto w-full rounded-lg">
      <h1 className="text-2xl font-[IBM_Plex_Sans] font-bold md:text-3xl lg:text-4xl">
        {story.title}
      </h1>
      <div className="bg-[#F6F7F8]">
        {/* <ImageSliderForStories /> */}
        {/* <StoryVideo src={"/video.mp4"} /> */}
        <StoryVideo src="https://pub-61076b0159ee4fdab7efe9dadc68458d.r2.dev/adhi_sample_video.mp4" />
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
