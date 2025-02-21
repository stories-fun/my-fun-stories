"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import PostActions from "~/app/_components/PostActions";
import ProgressBar from "~/app/_components/ProgressBar";
import { useStoriesStore } from "~/store/useStoriesStore";
import { useRouter } from "next/navigation";
import Loading from "./Loading";

const LiveIndicator = () => (
  <div className="flex items-center space-x-1">
    <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
    <span className="text-xs">Live Now</span>
  </div>
);

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

const PaginationDots = ({
  total,
  current,
}: {
  total: number;
  current: number;
}) => (
  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-1.5">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`h-1.5 w-1.5 rounded-full ${
          i === current ? "bg-blue-500" : "bg-gray-300"
        }`}
      />
    ))}
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    <div className="mx-auto w-full max-w-4xl">
      {stories.map((story) => (
        <article
          key={story.id}
          className="overflow-hidden rounded-lg bg-white p-3"
        >
          <StoryHeader username={story.username} />

          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="w-full lg:w-3/5">
              {/* Image Section */}
              <div
                className="relative mb-3 aspect-video h-[55%] w-[80%] cursor-pointer rounded-2xl bg-gray-100"
                onClick={() => handleCardClick(story.id)}
              >
                <button className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <PaginationDots total={3} current={currentImageIndex} />
              </div>

              <PostActions storyKey={story.id} />

              <div>
                <ProgressBar />
              </div>
            </div>

            <div
              className="w-full cursor-pointer lg:w-2/5"
              onClick={() => handleCardClick(story.id)}
            >
              <div className="space-y-2">
                <h2 className="font-lg text-lg font-[IBM_Plex_Sans] leading-tight">
                  {story.title}
                </h2>
                <p className="text-sm text-gray-600">{story.content}</p>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default StoriesCard;
