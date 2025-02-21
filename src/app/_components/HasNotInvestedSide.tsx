import React from "react";
import Image from "next/image";

const HasnotInvestedSide = () => {
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
        <div>
          <h2 className="font-bold">Welcome to story.fun</h2>
          <p>
            Discover authentic stories, form meaningful connections that break
            the mold of traditional social media. Dive into real journeys,
            genuine struggles, and inspiring transformations—each one tokenized
            for community support and exclusive perks.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="font-[IBM Plex Sans] text-xs font-bold text-[#1A1A1B]">
            EXPLORE & INVEST IN FOLLOWING LIVE STORIES
          </h2>
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <Image
                src={"/images/profile.png"}
                width={25}
                height={25}
                alt=""
              />
              <div>Name</div>
              <Image
                src={"/images/verification.png"}
                width={25}
                height={25}
                alt=""
              />
            </div>
            <button className="rounded-full bg-[#0079D3] px-4 py-1 text-sm text-white">
              Explore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HasnotInvestedSide;