import Image from "next/image";
import React from "react";
import PostActions from "./PostActions";

const PostCard = () => {
  return (
    <div className="container mx-auto rounded-lg bg-[#F6F7F8]">
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
      <div>
        {/* rendering image section */}
        <Image
          src={"/images/profile.png"}
          width={640}
          height={360}
          alt="post"
          className="h-auto w-full rounded-lg object-cover sm:h-[360px] sm:w-[640px]"
        />
      </div>
      <div className="">
        <PostActions />
      </div>
    </div>
  );
};

export default PostCard;
