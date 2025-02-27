import React, { useState } from "react";

export const StoryVideo = ({ src }: { src: string }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        try {
          await videoRef.current.play(); // Await the promise
        } catch (error) {
          console.error("Error playing video:", error);
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div
      className="relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg bg-gray-100"
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  );
};
