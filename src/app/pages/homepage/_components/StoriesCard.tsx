"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import PostActions from "~/app/_components/PostActions";
import ProgressBar from "~/app/_components/ProgressBar";
import { ImageSlider } from "./ImageSlider";
import { useStoriesStore } from "~/store/useStoriesStore";
import { useRouter } from "next/navigation";
import Loading from "./Loading";

const ProfileImage = ({ src, alt }: { src: string; alt: string }) => {
  // Using useState to handle image loading state
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
  <div className="relative h-5 w-5">
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
  <div className="border-b p-4">
    <div className="flex items-center space-x-3">
      <ProfileImage src="/images/profile.png" alt={`${username}'s profile`} />
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold">{username}</span>
          <VerificationBadge />
        </div>
        <div className="inline-block">
          <span className="rounded-full bg-purple-500 px-3 py-1 text-xs text-white">
            Trending
          </span>
        </div>
      </div>
    </div>
  </div>
);

const StoryContent = ({
  title,
  content,
  onClick,
}: {
  title: string;
  content: string;
  onClick: () => void;
}) => (
  <div
    className="cursor-pointer border-t p-4 lg:w-1/3 lg:border-l lg:border-t-0"
    onClick={onClick}
  >
    <div className="h-full max-h-[500px] overflow-y-auto">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <div className="prose prose-sm max-w-none">{content}</div>
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

  // Don't render anything until client-side hydration is complete
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

  const handleCardClick = (id: string) => {
    router.push(`/stories/${id}`);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4">
      {stories.map((story) => (
        <article
          key={story.id}
          className="overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <StoryHeader username={story.username} />

          <div className="flex flex-col lg:flex-row">
            <div className="p-4 lg:w-2/3">
              <div
                className="cursor-pointer overflow-hidden rounded-lg"
                onClick={() => handleCardClick(story.id)}
              >
                <ImageSlider />
              </div>

              <div className="mt-6">
                <PostActions
                  storyKey={story.id}
                  walletAddress={story.walletAddres}
                />
              </div>

              <div className="my-6">
                <ProgressBar />
              </div>
            </div>

            <StoryContent
              title={story.title}
              content={story.content}
              onClick={() => handleCardClick(story.id)}
            />
          </div>
        </article>
      ))}
    </div>
  );
};

export default StoriesCard;
