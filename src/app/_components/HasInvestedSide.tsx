import React from "react";
import Image from "next/image";

const HasInvestedSide = () => {
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
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Image src={"/images/profile.png"} width={25} height={25} alt="" />
            <h2 className="font-bold">Welcome back [UserName]</h2>
          </div>
          <div>
            <p>
              Discover authentic stories, form meaningful connections that break
              the mold of traditional social media. Dive into real journeys,
              genuine struggles, and inspiring transformations—each one
              tokenized for community support and exclusive perks.
            </p>
          </div>
        </div>
        <div>
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
            <button className="rounded-full border border-[#0079D3] bg-[#F6F7F8] px-4 py-1 text-sm font-bold text-[#0079D3]">
              Chat
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="font-[IBM Plex Sans] text-xs font-bold text-[#1A1A1B]">
            EXPLORE NEW STORIES
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

export default HasInvestedSide;
