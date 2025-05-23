"use client";
import React, { useState } from "react";
import Image from "next/image";
import PostActions from "~/app/_components/PostActions";
import { useRouter } from "next/navigation";
import Loading from "./Loading";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import type { Story } from "~/server/schema/story";

const LiveIndicator = ({ index }: { index: number }) => (
  <div className="flex items-center space-x-1">
    <div
      className={`h-1.5 w-1.5 rounded-full ${index === 1 ? "bg-green-500" : "bg-red-500"}`}
    ></div>
    <span className="text-xs">
      {index === 1 ? "Going Live on 20th March" : "Live Now"}
    </span>
  </div>
);

const videoLinks = {
  shubham: "https://youtu.be/RfDRtTqS2jo",
  paarug: "https://www.youtube.com/watch?v=zIeT-_QvkAs",
  rahim: "https://www.youtube.com/watch?v=UT1G0BAjqo8",
  admin: "https://pub-61076b0159ee4fdab7efe9dadc68458d.r2.dev/assets/adhi_sample_video.MP4",
};

const StoryHeader = ({
  username,
  index,
}: {
  username: string;
  index: number;
}) => (
  <div className="mb-3 flex items-center space-x-2">
    <ProfileImage src={`/images/pfp/${username}_story_pfp.jpg`} alt={`${username}'s profile`} />
    <div className="flex flex-col">
      <div className="flex items-center space-x-1">
        <span className="text-sm font-medium">{username}</span>
        <VerificationBadge />
      </div>
      <div className="flex items-center space-x-2">
        {index !== 1 && (
          <span className="rounded-full bg-purple-500 px-2 py-0.5 text-xs text-white">
            Trending
          </span>
        )}
        <LiveIndicator index={index} />
      </div>
    </div>
  </div>
);

const truncateContent = (content: string, wordLimit: number) => {
  // Strip HTML tags
  const strippedContent = content.replace(/<[^>]+>/g, '');
  const words = strippedContent.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return strippedContent;
};

const ProfileImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
      <Image
        src={src}
        fill
        className="object-cover"
        alt={alt}
        priority={true}
        sizes="40px"
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
      sizes="16px"
    />
  </div>
);

interface StoriesCardProps {
  stories?: Story[];
  isLoading: boolean;
}

const StoriesCard = ({ stories, isLoading }: StoriesCardProps) => {
  const router = useRouter();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Separate handlers for image/video and text sections
  const handleMediaClick = (id: string, username: string) => {
    const videoUrl = getVideoUrl(username);
    if (videoUrl) {
      setActiveVideo(videoUrl);
    } else {
      router.push(`/stories/${id}`);
    }
  };

  const handleTextClick = (id: string) => {
    router.push(`/stories/${id}`);
  };

  if (isLoading) return <Loading />;
  if (!stories?.length) {
    return (
      <div className="rounded-lg bg-gray-50 p-4 text-center text-gray-500">
        No stories found
      </div>
    );
  }

  const getVideoThumbnail = (username: string) => {
    const videoUrl = videoLinks[username.toLowerCase() as keyof typeof videoLinks];
    if (!videoUrl) return null;
    
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const regex = /(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/videos\/))([^"&?\/\s]{11})/;
      const videoId = regex.exec(videoUrl)?.[1];
      if (!videoId) return null;
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    
    return null;
  };

  const getImageUrl = (username: string) => {
    // Special case for admin - use a specific thumbnail or banner
    if (username.toLowerCase() === 'admin') {
      return '/images/banner/admin_story_banner.jpg';  // Make sure this image exists
    }
    
    // Check if there's a video first (since we know if it exists)
    const videoUrl = videoLinks[username.toLowerCase() as keyof typeof videoLinks];
    if (videoUrl) {
      const videoThumbnail = getVideoThumbnail(username);
      if (videoThumbnail) return videoThumbnail;
    }
    
    // If no video or thumbnail failed, use story banner
    return `/images/banner/${username}_story_banner.jpg`;
  };

  const getVideoUrl = (username: string) => {
    return videoLinks[username.toLowerCase() as keyof typeof videoLinks] ?? null;
  };

  const getEmbedUrl = (videoUrl: string) => {
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const regex = /(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/videos\/))([^"&?\/\s]{11})/;
      const videoId = regex.exec(videoUrl)?.[1];
      if (!videoId) return null;
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    }
    return videoUrl; // Return the direct video URL as is
  };
  
  return (
    <div className="mx-auto w-full">
      {stories.map((story, index) => (
        <article
          key={story.id}
          className="relative mb-4 overflow-hidden bg-white p-3"
        >
          <StoryHeader username={story.username} index={index} />

          <div className="flex flex-col space-y-3 lg:flex-row lg:space-x-6 lg:space-y-0">
            <div className="w-full lg:w-1/3">
              <div
                className="relative aspect-video w-full cursor-pointer bg-gray-100"
                onClick={() => handleMediaClick(story.id, story.username)}
              >
                {activeVideo === videoLinks[story.username.toLowerCase() as keyof typeof videoLinks] ? (
                  videoLinks[story.username.toLowerCase() as keyof typeof videoLinks]?.includes('youtube.com') || 
                  videoLinks[story.username.toLowerCase() as keyof typeof videoLinks]?.includes('youtu.be') ? (
                    <iframe
                      src={`${getEmbedUrl(activeVideo)}?autoplay=1&rel=0`}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                      title={`${story.username}'s video`}
                    />
                  ) : (
                    <video
                      src={activeVideo}
                      className="absolute inset-0 h-full w-full"
                      controls
                      autoPlay
                      title={`${story.username}'s video`}
                    />
                  )
                ) : (
                  <Image
                    src={getImageUrl(story.username)}
                    fill
                    className="object-cover"
                    alt="story banner"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={false}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('default-banner.jpg')) {
                        target.src = '/images/default-banner.jpg';
                      }
                    }}
                  />
                )}
                {/* Show play button overlay if video exists */}
                {getVideoUrl(story.username) && !activeVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-black/50 p-4">
                      <svg 
                        className="h-8 w-8 text-white" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              <PostActions storyKey={story.id} />
            </div>

            <div
              className="w-full cursor-pointer pt-2 lg:w-2/3 lg:pt-0"
              onClick={() => handleTextClick(story.id)}
            >
              <div className="space-y-2">
                <h2 className="font-lg text-xl font-[IBM_Plex_Sans] leading-tight sm:text-2xl">
                  {story.title ?? "Untitled Story"}
                </h2>
                <p className="text-base text-gray-600 sm:text-lg">
                  {truncateContent(story.content, 80)}
                </p>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  <span>By {story.username}</span>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(story.createdAt))} ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default StoriesCard;
