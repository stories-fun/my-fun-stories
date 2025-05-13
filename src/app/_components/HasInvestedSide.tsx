import React from "react";
import Image from "next/image";
import space from "../../../public/images/Space.png";

const HasInvestedSide = () => {
  return (
    <div className="mt-12 w-full overflow-hidden rounded-lg border bg-[#F6F7F8] shadow-md">
          <div className="bg-navy-900 relative h-20 w-full">
            <Image
              src={space}
              fill={true}
              sizes="(max-width: 768px) 100%, 100%"
              alt="Space theme with planets"
            /><div className="rounded-lg bg-[#F6F7F8] shadow-md">
            <Image
              src={"/images/banner.png"}
              width={350}
              height={128}
              className="rounded-t-lg object-cover"
              alt="banner"
            />
            <div className="space-y-4 p-2">
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Image
                    src={"/images/profile.png"}
                    width={25}
                    height={25}
                    alt="pfp"
                  />
                  <h2 className="font-bold">Welcome back [UserName]</h2>
                </div>
                <div>
                  <p>
                    You&apos;ve entered the world of fascinating stories, and ow
                    it&apos;s time to make your mark. Invest in a story that moves you
                    and unlock exclusive access, perks, and a direct connection with
                    the storyteller. Every investment helps bring these authentic
                    journeys to life.
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
                      alt="pfp"
                    />
                    <div>Name</div>
                    <Image
                      src={"/images/verification.png"}
                      width={25}
                      height={25}
                      alt="verification"
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
                      alt="pfp"
                    />
                    <div>Name</div>
                    <Image
                      src={"/images/verification.png"}
                      width={25}
                      height={25}
                      alt="verification"
                    />
                  </div>
                  <button className="rounded-full bg-[#0079D3] px-4 py-1 text-sm text-white">
                    Explore
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
    
          <div className="space-y-6 p-4">
            <div>
              <p className="mt-4 text-xl text-gray-800">
              Perks & token details coming soon. Be the first to know when this story unlocks.
              </p>
            </div>
          </div>
        </div>
  );
};

export default HasInvestedSide;
