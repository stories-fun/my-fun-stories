"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import PostActions from "~/app/_components/PostActions";
import ProgressBar from "~/app/_components/ProgressBar";
import { useStoriesStore } from "~/store/useStoriesStore";
import { useRouter } from "next/navigation";
import Loading from "./Loading";
// import { ImageSlider } from "./ImageSlider";
import { StoryVideo } from "./StoryVideo";

const LiveIndicator = () => (
  <div className="flex items-center space-x-1">
    <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
    <span className="text-xs">Going Live on date</span>
  </div>
);

const truncateContent = (content: string, wordLimit: number) => {
  const words = content.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return content;
};

const ProfileImage = ({ src, alt }: { src: string; alt: string }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
      <Image
        src={src}
        fill
        className={`object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        alt={alt}
        onLoadingComplete={() => setIsLoading(false)}
        priority={true}
      />
    </div>
  );
};

const VerificationBadge = () => (
  <div className="relative h-4 w-4">
    <Image
      src="/images/verification.png"
      fill
      className="object-contain"
      alt="verified"
      priority={true}
    />
  </div>
);

const StoryHeader = ({ username }: { username: string }) => (
  <div className="mb-3 flex items-center space-x-2">
    <ProfileImage src="/images/profile.png" alt={`${username}'s profile`} />
    <div className="flex flex-col">
      <div className="flex items-center space-x-1">
        <span className="text-sm font-medium">{username}</span>
        <VerificationBadge />
      </div>
      <div className="flex items-center space-x-2">
        <span className="rounded-full bg-purple-500 px-2 py-0.5 text-xs text-white">
          Trending
        </span>
        <LiveIndicator />
      </div>
    </div>
  </div>
);

const StoriesCard = () => {
  const router = useRouter();
  const { stories, error, isLoading, getStories } = useStoriesStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    void getStories();
  }, [getStories]);

  const handleCardClick = (id: string) => {
    router.push(`/stories/${id}`);
  };

  if (!mounted) return null;
  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="rounded-lg bg-red-50 p-4 text-center text-red-500">
        Error Loading Stories: {error}
      </div>
    );
  if (!stories?.length)
    return (
      <div className="rounded-lg bg-gray-50 p-4 text-center text-gray-500">
        No stories found
      </div>
    );

  return (
    <div className="mx-auto w-full">
      {stories.map((story, index) => (
        <article
          key={story.id}
          className="relative overflow-hidden rounded-lg bg-white p-3"
        >
          <StoryHeader username={story.username} />

          <div className="flex flex-col space-x-6 lg:flex-row">
            <div className="w-full lg:w-1/3">
              {/* Image Section */}
              <div className="relative aspect-video h-[55%] w-full cursor-pointer rounded-lg bg-gray-100">
                {/* <ImageSlider /> */}
                <StoryVideo src={"/video.mp4"} />
              </div>
              <PostActions storyKey={story.id} />

              <div>
                <ProgressBar />
              </div>
            </div>

            <div
              className="w-full cursor-pointer lg:w-2/3"
              onClick={() => handleCardClick(story.id)}
            >
              <div className="space-y-2">
                <h2 className="font-lg text-lg font-[IBM_Plex_Sans] leading-tight">
                  {story.title}
                </h2>
                <p className="text-sm text-gray-600">
                  {truncateContent(story.content, 80)}
                </p>
              </div>
            </div>
          </div>
          {/* </div> */}
          {index >= 2 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="z-10 text-xl font-semibold text-black">
                Coming Soon
              </span>
            </div>
          )}
        </article>
      ))}
    </div>
  );
};

export default StoriesCard;
