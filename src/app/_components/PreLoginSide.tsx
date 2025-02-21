import React from "react";
import Image from "next/image";

const PreLoginSide = () => {
  return (
    <div className="rounded-lg bg-[#F6F7F8] shadow-md">
      <Image
        src={"/images/Image.png"}
        width={350}
        height={128}
        className="rounded-t-lg object-cover"
        alt=""
      />
      <div className="space-y-4 p-2">
        <h2 className="font-bold">Welcome to story.fun</h2>
        <p>
          Discover authentic stories, form meaningful connections that break the
          mold of traditional social media. Dive into real journeys, genuine
          struggles, and inspiring transformations—each one tokenized for
          community support and exclusive perks.
        </p>
        <div className="flex items-center justify-center">
          <button className="rounded-full bg-[#0079D3] px-36 py-2">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreLoginSide;