import React, { useEffect, useState } from "react";
import Image from "next/image";
import ShareModal from "./ShareModal";
import { useRouter } from "next/navigation";
import { useStoriesStore } from "~/store/useStoriesStore";

interface PostActionsProps {
  storyKey: string;
  walletAddress: string;
}

const PostActions: React.FC<PostActionsProps> = ({
  storyKey,
  walletAddress,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const router = useRouter();

  const { like, isLoading, error, stories, likeCounts } = useStoriesStore();

  const story = stories.find((s) => s.id === storyKey);
  const [count, setCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  // const [isLiked, setIsLiked] = useState(
  //   Array.isArray(story?.likeCount)
  //     ? story.likeCount.includes(walletAddress)
  //     : false,
  // );
  // const [count, setCount] = useState(
  //   likeCounts[storyKey] ?? story?.likeCount ?? 0,
  // );

  useEffect(() => {
    if (story) {
      setIsLiked(
        Array.isArray(story.likeCount)
          ? story.likeCount.includes(walletAddress)
          : false,
      );
      // setCount(likeCounts[storyKey] ?? story.likeCount);
      setCount(
        likeCounts[storyKey] ??
          (Array.isArray(story.likeCount)
            ? story.likeCount.length
            : (story.likeCount ?? 0)),
      );
    }
  }, [storyKey, likeCounts, story, walletAddress]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!walletAddress) {
      alert("Please connect your wallet to like posts");
      return;
    }

    if (isLiked) {
      alert("You cannot unlike this post.");
      return;
    }

    try {
      await like(storyKey, walletAddress);
      setIsLiked(true);
    } catch (error) {
      console.error("Error liking post:", error);
      setIsLiked(false);
    }
  };

  const handleCommentClick = () => {
    router.push(`/stories/${storyKey}#comments`);
  };

  return (
    <div className="relative mt-4 pb-4">
      <div className="flex items-center space-x-6">
        {/* flower button */}
        <button
          className="flex cursor-pointer items-center space-x-2 rounded-full text-sm font-bold"
          onClick={handleLikeClick}
        >
          <Image src={"/images/Flower.png"} width={20} height={20} alt="" />
          {/* <IoFlowerOutline /> */}

          <span>{count} Likes</span>
        </button>
        <div className="flex items-center space-x-2 rounded-full text-sm font-bold">
          {/* <LuWallet /> */}
          <Image src={"/images/Advertise.png"} width={20} height={20} alt="" />
          <span>Invest</span>
        </div>
        {/* Comment button */}
        <button
          type="button"
          className="flex cursor-pointer items-center space-x-2 rounded-full text-sm font-bold hover:opacity-80"
          onClick={handleCommentClick}
        >
          {/* <FaRegComment /> */}
          <Image
            src={"/images/comment.png"}
            width={25}
            height={25}
            alt="comment"
          />
          <span>Comment</span>
        </button>
        <button onClick={() => setShowShareModal(true)}>
          <div className="flex items-center space-x-2 rounded-full text-sm font-bold">
            <Image src={"/images/Share.png"} width={25} height={25} alt="" />
            <span>Share</span>
          </div>
        </button>
      </div>

      {/* {showComments && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={(e) => {
            e.stopPropagation();
            setShowComments(false);
          }}
        >
          <div
            className="mx-4 w-full max-w-2xl rounded-lg bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <Comments postId={storyKey} />
          </div>
        </div>
      )} */}

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        postId={storyKey}
      />
    </div>
  );
};

export default PostActions;
