import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import ShareModal from "./ShareModal";
import { useRouter } from "next/navigation";
import { useStoriesStore } from "~/store/useStoriesStore";
import { BuyTokensDialog } from "./BuyToken";
import { useWallet } from "@jup-ag/wallet-adapter";
import { useUIStore } from "~/store/useUIStore";
import { usePostActionsStore } from "~/store/usePostActionsStore";
import flower from "../../../public/images/Flower.png";
import share from "../../../public/images/Share.png";
import comment from "../../../public/images/comment.png";
import investIcon from "../../../public/images/Advertise.png"

interface PostActionsProps {
  storyKey: string;
  walletAddress?: string;
}

const PostActions: React.FC<PostActionsProps> = ({ storyKey }) => {
  const {
    setShowShareModal,
    setShowBuyDialog,
    getShowShareModal,
    getShowBuyDialog,
  } = useUIStore();

  const {
    userWallet,
    setUserWallet,
    setIsLiked,
    setCount,
    getIsLiked,
    getCount,
  } = usePostActionsStore();

  const router = useRouter();

  const { like, stories, likeCounts } = useStoriesStore();
  const wallet = useWallet();

  // Get current UI state for this specific post
  const showShareModal = getShowShareModal(storyKey);
  const showBuyDialog = getShowBuyDialog(storyKey);

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      const address = wallet.publicKey.toString();
      setUserWallet(address);
      console.log("Connected wallet address:", address);
    } else {
      setUserWallet(null);
      console.log("Wallet not connected");
    }
  }, [wallet.connected, wallet.publicKey, setUserWallet]);

  const story = stories.find((s) => s.id === storyKey);

  const likesArray = useMemo(() => story?.likes ?? [], [story?.likes]);

  useEffect(() => {
    if (userWallet) {
      setIsLiked(storyKey, likesArray.includes(userWallet));
    } else {
      setIsLiked(storyKey, false);
    }
    setCount(storyKey, likeCounts[storyKey] ?? story?.likeCount ?? 0);
  }, [
    storyKey,
    likeCounts,
    story,
    userWallet,
    likesArray,
    setIsLiked,
    setCount,
  ]);

  // Get current state for this specific post
  const isLiked = getIsLiked(storyKey);
  const count = getCount(storyKey);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!userWallet) {
      alert("Please connect your wallet to like posts");
      return;
    }

    if (isLiked) {
      alert("You cannot unlike this post.");
      return;
    }

    try {
      setIsLiked(storyKey, true);
      setCount(storyKey, (prev) => prev + 1);
      await like(storyKey, userWallet);
    } catch (error) {
      console.error("Error liking post:", error);
      setIsLiked(storyKey, false);
      setCount(storyKey, (prev) => prev - 1);
    }
  };

  const handleCommentClick = () => {
    router.push(`/stories/${storyKey}#comments`);
  };

  return (
    <div className="relative mt-8 pb-4">
      <div className="flex items-center space-x-3">
        <button
          className="flex cursor-pointer items-center space-x-1 rounded-full text-sm font-bold"
          onClick={handleLikeClick}
        >
          <Image
            src={flower}
            width={20}
            height={20}
            alt=""
            style={{ width: "auto", height: "auto" }}
          />
          <span>{count} Likes</span>
        </button>
        <div
          className="flex cursor-pointer items-center space-x-2 rounded-full text-sm font-bold"
          onClick={() => setShowBuyDialog(storyKey, true)}
        >
          <Image
            src={investIcon}
            width={20}
            height={20}
            alt=""
            style={{ width: "auto", height: "auto" }}
          />
          <span>Invest</span>
        </div>
        {showBuyDialog && (
          <BuyTokensDialog
            open={showBuyDialog}
            onClose={() => setShowBuyDialog(storyKey, false)}
          />
        )}
        <button
          type="button"
          className="flex cursor-pointer items-center space-x-2 rounded-full text-sm font-bold hover:opacity-80"
          onClick={handleCommentClick}
        >
          <Image
            src={comment}
            width={25}
            height={25}
            alt="comment"
            style={{ width: "auto", height: "auto" }}
          />
          <span>Comments</span>
        </button>
        <button onClick={() => setShowShareModal(storyKey, true)}>
          <div className="flex items-center space-x-2 rounded-full text-sm font-bold">
            <Image
              src={share}
              width={25}
              height={25}
              alt=""
              style={{ width: "auto", height: "auto" }}
            />
            <span>Share</span>
          </div>
        </button>
      </div>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(storyKey, false)}
        postId={storyKey}
      />
    </div>
  );
};

export default PostActions;
