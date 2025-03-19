"use client";

import Image from "next/image";
import React from "react";
import { useRightSidebarStore } from "~/store/useRightSidebarStore";

const RightSidebar = ({ username }: { username: string }) => {
  const tiers = [
    {
      price: 5,
      description:
        "Unlock DM access. Response guaranteed in 5 days else moneyback.",
    },
    {
      price: 10,
      description: "All of above + Access to full story & future updates",
    },
    {
      price: 20,
      description: "All of above + Free Book shipped",
    },
    {
      price: 50,
      description: "All of above + 30 mins Voice call",
    },
    {
      price: 100,
      description: "All of above + Video Call",
    },
  ];

  const { expandedTiers, toggleTier } = useRightSidebarStore();

  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <div className="">
        <Image
          src={"/images/banner.png"}
          alt="cover image"
          className="h-[60px] w-full"
          width={500}
          height={100}
          sizes="(max-width: 768px) 100%, 500px"
        />
      </div>

      <div className="border-b pb-4">
        <div className="relative flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-6 w-6 text-pink-300"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <div className="max-w-[150px] truncate text-lg font-medium">
                  {username}
                </div>
                <div className="ml-2 rounded-full bg-blue-500 p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <button className="mt-2 rounded-full bg-blue-500 px-6 py-2 font-medium text-white">
                Follow
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 pb-2">
          <p className="text-gray-800">
            Your personal frontpage. a short discription to understand you and
            your story.
          </p>
        </div>

        <div className="flex items-center justify-center">
          <button className="p-2 font-medium text-gray-500">Show more</button>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <button className="w-full rounded-full bg-blue-500 py-3 font-medium text-white">
          Invest Now
        </button>
        <button className="w-full rounded-full border-2 border-blue-500 bg-white py-3 font-medium text-blue-500">
          Chat with creator
        </button>
      </div>
      <div className="flex justify-between border-b border-t px-4 py-6">
        <div className="text-center">
          <div className="text-xl font-bold">26k</div>
          <div className="text-gray-500">Market Cap</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold">2k</div>
          <div className="text-gray-500">Holder</div>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center text-xl font-bold">
            20k
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1 h-4 w-4 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-gray-500">Volume</div>
        </div>
      </div>

      <div className="px-4 pb-2 pt-4">
        <div className="mb-2 font-bold text-gray-700">UTILITIES</div>
      </div>

      {tiers.map((tier, index) => (
        <div key={index} className="border-t">
          <div
            className="flex cursor-pointer items-center justify-between px-4 py-4"
            onClick={() => toggleTier(index)}
          >
            <div className="font-medium">${tier.price}</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-gray-400 transition-transform ${expandedTiers[index] ? "rotate-180 transform" : ""}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {expandedTiers[index] && (
            <div className="border-t bg-gray-50 px-4 py-3">
              <p className="text-gray-600">{tier.description}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RightSidebar;
