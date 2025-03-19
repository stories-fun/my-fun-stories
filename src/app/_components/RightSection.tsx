import Image from "next/image";
import React from "react";

interface CreatorProps {
  name: string;
  hasVerification?: boolean;
}

const CreatorCard: React.FC<CreatorProps> = ({
  name,
  hasVerification = true,
}) => (
  <div className="group flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-100">
    <div className="flex items-center space-x-3">
      <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-gray-100">
        <Image
          src="/images/profile.png"
          width={40}
          height={40}
          alt={`${name}'s profile`}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
        />
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-semibold text-gray-800">{name}</span>
        {hasVerification && (
          <div className="relative h-4 w-4">
            <Image
              src="/images/verification.png"
              width={16}
              height={16}
              alt="verified"
              className="absolute transition-transform duration-200 group-hover:scale-110"
            />
          </div>
        )}
      </div>
    </div>
    <button className="rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
      Follow
    </button>
  </div>
);

// RightSection.tsx
const RightSection = () => {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      {/* Banner Image with gradient overlay */}
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

      {/* Investor Profile Section */}
      <div className="border-b border-gray-100">
        <div className="p-6">
          <div className="mb-4 flex items-center space-x-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full ring-4 ring-white">
              <Image
                src="/images/profile.png"
                width={48}
                height={48}
                alt="Investor profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">
                Investor Name
              </span>
              <span className="text-sm text-gray-500">@investorhandle</span>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-gray-600">
            Your personal frontpage, a short description to understand you and
            your investment strategy.
          </p>

          <button className="mt-4 flex w-full items-center justify-center space-x-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700">
            <span>Show more</span>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 p-6">
        <button className="w-full rounded-full bg-blue-600 py-3 text-center font-semibold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Invest Now
        </button>
        <button className="w-full rounded-full border-2 border-blue-600 bg-white py-3 text-center font-semibold text-blue-600 transition-all duration-200 hover:bg-blue-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Chat
        </button>
      </div>

      {/* Stats Section */}
      <div className="border-y border-gray-100 bg-gray-50 px-6 py-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm font-bold text-gray-900">MarketCap</div>
            <div className="mt-1 text-sm font-medium text-blue-600">$1.2M</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-gray-900">Holder</div>
            <div className="mt-1 text-sm font-medium text-blue-600">2.5K</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-gray-900">Volume</div>
            <div className="mt-1 text-sm font-medium text-blue-600">$50K</div>
          </div>
        </div>
      </div>

      {/* Suggested Creators */}
      <div className="p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-900">
          Stories You Might Like
        </h3>
        <div className="space-y-2">
          <CreatorCard name="Sarah Johnson" />
          <CreatorCard name="Michael Chen" />
          <CreatorCard name="Emma Davis" />
          <CreatorCard name="Alex Turner" />
          <CreatorCard name="Maria Garcia" />
        </div>
      </div>
    </div>
  );
};

export default RightSection;
