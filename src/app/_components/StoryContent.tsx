"use client";
import React, { useState } from "react";
import PostActions from "./PostActions";
import { api } from "~/trpc/react";
import Image from "next/image";
import DOMPurify from 'isomorphic-dompurify';
import AdhiStory from "../stories/AdhiStory";

const videoLinks = {
  shubham: "https://youtu.be/RfDRtTqS2jo",
  paarug: "https://www.youtube.com/watch?v=zIeT-_QvkAs",
  rahim: "https://www.youtube.com/watch?v=UT1G0BAjqo8",
  admin: "https://pub-61076b0159ee4fdab7efe9dadc68458d.r2.dev/assets/adhi_sample_video.MP4",
};

const StoryContent = ({ storyId }: { storyId: string }) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const { data: storyData, isLoading } = api.story.getById.useQuery({
    storyKey: storyId,
  });

  React.useEffect(() => {
    if (storyData?.story) {
      const videoUrl = getVideoUrl(storyData.story.username);
      setActiveVideo(videoUrl);
    }
  }, [storyData]);

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
    const videoUrl = videoLinks[username.toLowerCase() as keyof typeof videoLinks];
    if (videoUrl) {
      const videoThumbnail = getVideoThumbnail(username);
      if (videoThumbnail) return videoThumbnail;
    }
    
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
  const videoUrl = getVideoUrl(story.username);

  return (
    <div className="container mx-auto w-full rounded-lg">
      <h1 className="pb-4 text-xl font-[IBM_Plex_Sans] font-bold md:text-3xl lg:text-4xl">
        {story.title}
      </h1>

      <div className="relative aspect-video w-full bg-[#F6F7F8]">
        {activeVideo && (
          videoUrl?.includes('youtube.com') || videoUrl?.includes('youtu.be') ? (
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
        )}
      </div>

      <div className="mt-4">
        <PostActions storyKey={story.id} walletAddress={story.walletAddress} />
      </div>

      <div className="mt-4 font-[IBM_Plex_Sans]" data-tts-content="true">
        <div className="prose max-w-none">
          {storyId === "1740725593742_pDHykt" ? (
            <AdhiStory />
          ) : (
            <div 
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(story.content) }}
              className="
                [&>h1]:text-lg [&>h1]:font-[IBM_Plex_Sans] [&>h1]:font-bold [&>h1]:md:text-2xl [&>h1]:lg:text-3xl [&>h1]:mt-8 [&>h1]:mb-4
                [&>h2]:text-base [&>h2]:font-[IBM_Plex_Sans] [&>h2]:font-bold [&>h2]:md:text-xl [&>h2]:lg:text-2xl [&>h2]:mt-6 [&>h2]:mb-3
              "
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryContent; 