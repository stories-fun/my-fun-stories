import React from "react";
import { IoFlowerOutline } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa";
import { FaRegShareSquare } from "react-icons/fa";
import { LuWallet } from "react-icons/lu";

const PostActions = () => {
  return (
    <div className="flex items-center space-x-6 space-y-2">
      {/* flower button */}
      <div className="flex items-center space-x-2 rounded-full text-sm font-bold">
        <IoFlowerOutline />
        <span>Likes</span>
      </div>
      <div className="flex items-center space-x-2 rounded-full text-sm font-bold">
        <LuWallet />
        <span>Invest</span>
      </div>
      {/* Comment button */}
      <div className="flex items-center space-x-2 rounded-full text-sm font-bold">
        <FaRegComment />
        <span>Comment</span>
      </div>
      {/* Share button */}
      <div className="flex items-center space-x-2 rounded-full text-sm font-bold">
        <FaRegShareSquare />
        <span>Share</span>
      </div>
    </div>
  );
};

export default PostActions;
