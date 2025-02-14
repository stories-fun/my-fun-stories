import Image from "next/image";
import React from "react";
import PostActions from "./PostActions";
import { FaRegComment } from "react-icons/fa";
import { ImageSlider } from "../pages/homepage/_components/ImageSlider";
import { ImageSliderForStories } from "./ImageSliderForStories";

const PostCard = () => {
  return (
    <div className="container mx-auto rounded-lg">
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
        {/* <Image
          src={"/images/profile.png"}
          width={969}
          height={559}
          alt="post"
          className="h-auto w-full rounded-lg object-cover sm:h-[360px] sm:w-[640px]"
        /> */}
        {/* <ImageSlider /> */}
        <ImageSliderForStories />
      </div>

      <div className="mt-4">
        {/* text area */}
        <textarea
          placeholder="write your story..."
          className="h-auto w-full resize-none rounded-lg bg-transparent p-3 text-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mt-4">
        <PostActions />
      </div>
      {/* comment */}
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-100 p-3">
        {/* Comment Icon */}
        <FaRegComment className="mb-3 text-gray-500" />

        {/* Comment Input */}
        <textarea
          placeholder="Add a comment..."
          className="h-[38px] w-full resize-none bg-transparent text-base placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
      {/* comment thread */}
      <div className="mt-4 space-y-4">
        {/* Reply 1 */}
        <div>
          <div className="flex space-x-2">
            <Image src={"/images/profile.png"} alt="" width={25} height={25} />
            <div>Name</div>
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-gray-200 p-3">
            <FaRegComment className="text-lg text-gray-500" />
            <p className="text-base">
              This is a reply to the original comment!
            </p>
          </div>
        </div>

        {/* Reply 2 */}
        <div>
          <div className="flex space-x-2">
            <Image src={"/images/profile.png"} alt="" width={25} height={25} />
            <div>Name</div>
          </div>
          <div className="mt-2 flex items-start gap-2 rounded-lg bg-gray-200 p-3">
            <FaRegComment className="text-lg text-gray-500" />
            <p className="text-base">Another response to the main comment.</p>
          </div>
        </div>

        {/* Nested Replies (reply to a reply) */}
        <div className="mt-2 pl-8">
          <div>
            <div className="flex space-x-2">
              <Image
                src={"/images/profile.png"}
                alt=""
                width={25}
                height={25}
              />
              <div>Name</div>
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-gray-300 p-3">
              <FaRegComment className="text-lg text-gray-500" />
              <p className="text-base">
                This is a nested reply to the first reply.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
