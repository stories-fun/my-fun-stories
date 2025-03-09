import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavBar from "~/app/_components/NavBar";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      {/* Hero Image Section */}
      {/* to authorise deployment */}
      <div className="relative h-[200px] w-full sm:h-[250px] md:h-[300px] lg:h-[300px]">
        <div className="flex h-[70%] w-full items-center justify-center bg-[#007AFF] font-bold text-white sm:text-3xl md:text-5xl lg:text-7xl">
          <p>Believe In Stories</p>
          <p className="text-black">.</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-prose">
          <div className="space-y-4 text-base leading-relaxed text-gray-700 sm:text-lg">
            <p className="text-lg font-medium sm:text-xl">
              Traditional social media is busted—fake personas, shallow likes,
              and follower counts that mean nothing.
            </p>

            <p className="text-lg font-medium sm:text-xl">
              At <strong className="text-gray-900">stories.fun</strong>,
              we&apos;re rewriting the rules.
            </p>

            <p>
              This is a SocialFi platform where you share your true story,
              tokenize it, and build a community that invests in you—literally.
              No filters, no facades—just real journeys turned into assets via
              presale drops and DEX trading.
            </p>

            <p>
              Your <strong className="text-gray-900">stories.fun</strong> link?
              It&apos;s your new intro for dating, networking, or flexing your
              life—raw, personal, and on-chain forever.
            </p>

            <p>
              We&apos;re bringing the world&apos;s stories to the blockchain.
            </p>

            <p>
              Hold tokens from your favourite creators for airdrops, premium
              access, and exclusive perks (dropping soon). Communities co-own
              the ride—think live streams, books, even OTT hits—coming in hot on
              our roadmap.
            </p>

            <p>
              <strong className="text-gray-900">You&lsquo;re early</strong>.
              Keep it real—this is where your story becomes your legacy.
            </p>

            <p>What&apos;s Your Story?</p>
          </div>
        </div>
      </div>

      {/* Social Links Section */}
      <div className="mx-auto my-12 flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Follow us to stay updated
        </h2>
        <Link
          href="https://x.com/StoriesDotFun"
          className="transform transition-transform hover:scale-110"
        >
          <Image
            src="/images/twitter.png"
            width={50}
            height={50}
            alt="Twitter/X Logo"
            className="h-12 w-12 sm:h-[50px] sm:w-[50px]"
          />
        </Link>
      </div>
    </div>
  );
};

export default AboutUs;
