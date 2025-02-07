import React from "react";
import { IoFlowerOutline } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa";
import { FaRegShareSquare } from "react-icons/fa";
import { LuWallet } from "react-icons/lu";

const PostActions = () => {
  return (
    <div className="flex items-center space-x-2 space-y-2">
      {/* flower button */}
      <div className="flex items-center space-x-2 rounded-full bg-[#F5F5F5] px-4 py-2 text-xs">
        <IoFlowerOutline />
        <span>Likes</span>
      </div>
      <div className="flex items-center space-x-2 rounded-full bg-[#F5F5F5] px-4 py-2 text-xs">
        <LuWallet />
        <span>Invest</span>
      </div>
      {/* Comment button */}
      <div className="flex items-center space-x-2 rounded-full bg-[#F5F5F5] px-4 py-2 text-xs">
        <FaRegComment />
        <span>Comment</span>
      </div>
      {/* Share button */}
      <div className="flex items-center space-x-2 rounded-full bg-[#F5F5F5] px-4 py-2 text-xs">
        <FaRegShareSquare />
        <span>Share</span>
      </div>
    </div>
  );
};

export default PostActions;
