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
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center space-x-2">
      <div className="h-8 w-8 overflow-hidden rounded-full">
        <Image
          src="/images/profile.png"
          width={32}
          height={32}
          alt={`${name}'s profile`}
          className="h-full w-full object-cover"
        />
      </div>
      <span className="text-sm font-medium">{name}</span>
      {hasVerification && (
        <Image
          src="/images/verification.png"
          width={16}
          height={16}
          alt="verified"
          className="h-4 w-4"
        />
      )}
    </div>
    <button className="rounded-full bg-[#0079D3] px-6 py-1.5 text-sm font-medium text-white transition hover:bg-[#0069BD]">
      Follow
    </button>
  </div>
);

const RightSection = () => {
  return (
    <div className="h-full w-full bg-[#F6F7F8]">
      {/* Banner Image */}
      <div className="relative h-32 w-full overflow-hidden">
        <Image
          src="/images/Image.png"
          alt="Cover image"
          layout="fill"
          objectFit="cover"
          className="h-full w-full"
        />
      </div>

      {/* Investor Profile Section */}
      <div className="border-b border-gray-200">
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src="/images/profile.png"
                  width={40}
                  height={40}
                  alt="Investor profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-lg font-medium">Investor Name</span>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Your personal frontpage, a short description to understand you.
          </p>

          <button className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-700">
            Show more
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 p-4">
        <button className="w-full rounded-full bg-[#0079D3] py-3 text-center font-semibold text-white transition hover:bg-[#0069BD]">
          Invest Now
        </button>
        <button className="w-full rounded-full border border-[#0079D3] bg-white py-3 text-center font-semibold text-[#0079D3] transition hover:bg-gray-50">
          Chat
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4 border-b border-t border-gray-200 px-6 py-4">
        <div className="text-center">
          <div className="text-sm font-semibold">MarketCap</div>
          <div className="text-xs text-gray-500">$1.2M</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold">Holder</div>
          <div className="text-xs text-gray-500">2.5K</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold">Volume</div>
          <div className="text-xs text-gray-500">$50K</div>
        </div>
      </div>

      {/* Suggested Creators */}
      <div className="p-4">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">
          STORIES YOU MIGHT WANT TO FOLLOW
        </h3>
        <div className="space-y-2">
          <CreatorCard name="Name" />
          <CreatorCard name="Name" />
          <CreatorCard name="Name" />
          <CreatorCard name="Name" />
          <CreatorCard name="Name" />
        </div>
      </div>
    </div>
  );
};

export default RightSection;
