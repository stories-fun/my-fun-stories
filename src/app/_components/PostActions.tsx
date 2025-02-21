import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import ShareModal from "./ShareModal";
import { useRouter } from "next/navigation";
import { useStoriesStore } from "~/store/useStoriesStore";
import { BuyTokensDialog } from "./BuyToken";
import { useWallet } from "@jup-ag/wallet-adapter";

interface PostActionsProps {
  storyKey: string;
  walletAddress?: string;
}

const PostActions: React.FC<PostActionsProps> = ({ storyKey }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [userWallet, setUserWallet] = useState<string | null>(null);
  const router = useRouter();

  const { like, stories, likeCounts } = useStoriesStore();
  const wallet = useWallet();

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      const address = wallet.publicKey.toString();
      setUserWallet(address);
      console.log("Connected wallet address:", address);
    } else {
      setUserWallet(null);
      console.log("Wallet not connected");
    }
  }, [wallet.connected, wallet.publicKey]);

  const story = stories.find((s) => s.id === storyKey);

  const likesArray = useMemo(() => story?.likes ?? [], [story?.likes]);

  const [isLiked, setIsLiked] = useState<boolean>(
    userWallet ? likesArray.includes(userWallet) : false,
  );
  const [count, setCount] = useState<number>(
    likeCounts[storyKey] ?? story?.likeCount ?? 0,
  );

  useEffect(() => {
    if (story && userWallet) {
      setIsLiked(likesArray.includes(userWallet));
      setCount(likeCounts[storyKey] ?? story.likeCount ?? 0);
    }
  }, [storyKey, likeCounts, story, userWallet, likesArray]);

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
      setIsLiked(true);
      setCount((prev) => prev + 1);
      await like(storyKey, userWallet);
    } catch (error) {
      console.error("Error liking post:", error);
      setIsLiked(false);
      setCount((prev) => prev - 1);
    }
  };

  const handleCommentClick = () => {
    router.push(`/stories/${storyKey}#comments`);
  };

  return (
    <div className="relative mt-4 pb-4">
      <div className="flex items-center space-x-6">
        <button
          className="flex cursor-pointer items-center space-x-2 rounded-full text-sm font-bold"
          onClick={handleLikeClick}
        >
          <Image src={"/images/Flower.png"} width={20} height={20} alt="" />

          <span>{count} Likes</span>
        </button>
        <div
          className="flex cursor-pointer items-center space-x-2 rounded-full text-sm font-bold"
          onClick={() => setShowBuyDialog(true)}
        >
          <Image src={"/images/Advertise.png"} width={20} height={20} alt="" />
          <span>Invest</span>
        </div>
        {showBuyDialog && (
          <BuyTokensDialog
            open={showBuyDialog}
            onClose={() => setShowBuyDialog(false)}
          />
        )}
        <button
          type="button"
          className="flex cursor-pointer items-center space-x-2 rounded-full text-sm font-bold hover:opacity-80"
          onClick={handleCommentClick}
        >
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

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        postId={storyKey}
      />
    </div>
  );
};

export default PostActions;
