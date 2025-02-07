import React from "react";
import Image from "next/image";
import PostActions from "~/app/_components/PostActions";
import { FaRegComment } from "react-icons/fa";
import ProgressBar from "~/app/_components/ProgressBar";

const StoriesCard = () => {
  return (
    <div className="flex flex-col gap-4 sm:flex-col md:flex-row">
      <div className="flex-2 w-full md:w-2/3">
        <div className="flex space-x-2">
          <Image
            src={"/images/profile.png"}
            width={25}
            height={25}
            alt="profile"
          />
          <div>Name</div>
        </div>
        <div>Title</div>
        <div className="bg-[#F6F7F8]">
          {/* rendering image section */}
          <Image
            src={"/images/profile.png"}
            width={640}
            height={360}
            alt="post"
            className="h-auto w-full rounded-lg object-cover sm:h-[360px] sm:w-[640px]"
          />
        </div>
        <div className="mt-4">
          <PostActions />
        </div>
        {/* presale progress bar */}
        <div className="my-4">
          <ProgressBar />
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-100 p-3">
          {/* Comment Icon */}
          <FaRegComment className="mb-3 text-gray-500" />

          {/* Comment Input */}
          <textarea
            placeholder="Add a comment..."
            className="h-[38px] w-full resize-none bg-transparent text-base placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      <div className="mt-4 w-full flex-1 md:w-1/3">
        {/* text area */}
        <textarea
          placeholder="write your story..."
          className="h-auto w-full resize-none rounded-lg bg-transparent p-3 text-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* comment */}
    </div>
  );
};

export default StoriesCard;
