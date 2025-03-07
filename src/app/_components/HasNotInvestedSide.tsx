import React from "react";
import Image from "next/image";

interface HasnotInvestedSideProps {
  username?: string | null;
}

const HasnotInvestedSide: React.FC<HasnotInvestedSideProps> = ({
  username,
}) => {
  // Create an array of placeholder items to match the image
  const storyItems = Array(5).fill(null);

  return (
    <div className="mt-12 w-full overflow-hidden rounded-lg border bg-[#F6F7F8] shadow-md">
      {/* Space-themed header image */}
      <div className="bg-navy-900 relative h-20 w-full">
        <Image
          src={"/images/Image.png"}
          layout="fill"
          // objectFit="cover"
          alt="Space theme with planets"
          // width={40}
          // height={40}
        />
      </div>

      <div className="space-y-6 p-4">
        {/* Welcome text section */}
        <div>
          <h2 className="text-xl font-bold">Hello, {username}!</h2>
          <p className="mt-4 text-gray-800">
            You&apos;ve entered the world of fascinating stories, and now
            it&apos;s time to make your mark. Invest in a story that moves you
            and unlock exclusive access, perks, and a direct connection with the
            storyteller. Every investment helps bring these authentic journeys
            to life.
          </p>
        </div>

        {/* Stories section */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wide text-gray-900">
            EXPLORE & INVEST IN THE FOLLOWING LIVE STORIES
          </h2>

          {/* Story items */}
          <div className="space-y-3">
            {storyItems.map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Name</span>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <button className="rounded-full bg-blue-500 px-4 py-1 text-sm font-medium text-white hover:bg-blue-600">
                  Explore
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HasnotInvestedSide;
