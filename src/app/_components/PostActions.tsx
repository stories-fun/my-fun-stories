import React from "react";
import { IoFlowerOutline } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa";
import { FaRegShareSquare } from "react-icons/fa";
import { LuWallet } from "react-icons/lu";
import Image from "next/image";

const PostActions = () => {
  return (
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
      <div className="flex items-center space-x-2 rounded-full text-sm font-bold">
        {/* <FaRegComment /> */}
        <Image src={"/images/comment.png"} width={25} height={25} alt="" />
        <span>Comment</span>
      </div>
      {/* Share button */}
      <div className="flex items-center space-x-2 rounded-full text-sm font-bold">
        {/* <FaRegShareSquare /> */}
        <Image src={"/images/Share.png"} width={25} height={25} alt="" />

        <span>Share</span>
      </div>
    </div>
  );
};

export default PostActions;
