"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import PostActions from "~/app/_components/PostActions";
import ProgressBar from "~/app/_components/ProgressBar";
import { ImageSlider } from "./ImageSlider";
import { EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import dynamic from "next/dynamic";
import { useStoriesStore } from "~/store/useStoriesStore";
import { useRouter } from "next/navigation";
import Comments from "~/app/_components/Comments";
import Loading from "./Loading";

// const Editor = dynamic(() => import("draft-js").then((mod) => mod.Editor), {
//   ssr: false,
// });

const StoriesCard = () => {
  const router = useRouter();
  // const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const { stories, error, isLoading, getStories } = useStoriesStore();

  useEffect(() => {
    void getStories();
  }, [getStories]);

  console.log("Stories in StoriesCard:", stories); // Debug log

  if (isLoading) return <Loading />;
  if (error) return <p>Error Loading Stories{error}</p>;
  if (!stories.length) return <p>No stories found</p>;

  const handleCardClick = (id: string) => {
    router.push(`/stories/${id}`);
  };

  return (
    <div className="container mx-auto space-y-6">
      {stories.map((story) => (
        <div key={story.id} className="rounded-lg bg-white p-4 shadow">
          {/* Header with profile and trending tag */}
          <div className="mb-4 flex items-center space-x-3">
            <Image
              src="/images/profile.png"
              width={40}
              height={40}
              alt="profile"
              className="rounded-full"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{story.username}</span>
                <Image
                  src="/images/verification.png"
                  width={20}
                  height={20}
                  alt="verified"
                />
              </div>
              <div className="flex space-x-2">
                <span className="rounded-full bg-purple-500 px-3 py-0.5 text-xs text-white">
                  Trending
                </span>
                <span className="rounded-full bg-red-500 px-3 py-0.5 text-xs text-white">
                  Live Now
                </span>
              </div>
            </div>
          </div>

          {/* Story content */}
          <div
            className="cursor-pointer"
            onClick={() => handleCardClick(story.id)}
          >
            <h2 className="mb-2 text-xl font-bold">{story.title}</h2>
            <p className="mb-4 text-gray-700">{story.content}</p>
          </div>

          {/* Image slider */}
          <div className="mb-4">
            <ImageSlider />
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-2">
              <Image
                src="/images/Flower.png"
                width={24}
                height={24}
                alt="like"
              />
              <span>{story.likeCount} Likes</span>
            </button>
            <button className="flex items-center space-x-2">
              <Image
                src="/images/Advertise.png"
                width={24}
                height={24}
                alt="invest"
              />
              <span>Invest</span>
            </button>
            <button className="flex items-center space-x-2">
              <Image
                src="/images/comment.png"
                width={24}
                height={24}
                alt="comment"
              />
              <span>29 Comments</span>
            </button>
            <button className="flex items-center space-x-2">
              <Image
                src="/images/Share.png"
                width={24}
                height={24}
                alt="share"
              />
              <span>Share</span>
            </button>
          </div>

          {/* Participation message */}
          <div className="mt-4 text-sm text-gray-600">
            Participate in the Presale of this token now.
          </div>
          {/* Progress bar could go here */}
        </div>
      ))}
    </div>
  );
};

export default StoriesCard;
