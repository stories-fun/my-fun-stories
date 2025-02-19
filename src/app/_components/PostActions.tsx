import React, { useState } from "react";
import { IoFlowerOutline } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa";
import { FaRegShareSquare } from "react-icons/fa";
import { LuWallet } from "react-icons/lu";
import Image from "next/image";
import Comments from "./Comments";

interface PostActionsProps {
  postId: string;
}

const PostActions: React.FC<PostActionsProps> = ({ postId }) => {
  const [showComments, setShowComments] = useState(false);

  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowComments((prev) => !prev);
    console.log("Comment button clicked, showComments:", !showComments);
  };

  return (

    <div className="relative mt-4">
      <div className="flex items-center space-x-6">
        {/* flower button */}
        <div className="flex items-center space-x-2 rounded-full text-sm font-bold">
          <Image src={"/images/Flower.png"} width={25} height={25} alt="" />
          {/* <IoFlowerOutline /> */}
          <span>Likes</span>
        </div>
        <div className="flex items-center space-x-2 rounded-full text-sm font-bold">
          {/* <LuWallet /> */}
          <Image src={"/images/Advertise.png"} width={25} height={25} alt="" />
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
        {/* Share button */}
        <div className="flex items-center space-x-2 rounded-full text-sm font-bold">
          {/* <FaRegShareSquare /> */}
          <Image src={"/images/Share.png"} width={25} height={25} alt="" />
          <span>Share</span>
        </div>
      </div>

      {showComments && (
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
            <Comments postId={postId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostActions;
