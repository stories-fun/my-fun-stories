import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavBar from "~/app/_components/NavBar";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      {/* Hero Image Section */}
      <div className="relative h-[200px] w-full sm:h-[250px] md:h-[300px] lg:h-[300px]">
        <div className="bg-[#007AFF] flex h-[70%] w-full items-center justify-center font-bold text-white sm:text-3xl md:text-5xl lg:text-7xl">
          <p>Believe In Stories</p>
          <p className="text-black">.</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-prose">
          <div className="space-y-4 text-base leading-relaxed text-gray-700 sm:text-lg">
            <p className="text-lg font-medium sm:text-xl">
              Traditional social media is broken. It&apos;s all about followers,
              fake personas, and superficial connections.
            </p>

            <p className="text-lg font-medium sm:text-xl">
              At <strong className="text-gray-900">stories.fun</strong>,
              we&apos;re flipping the script.
            </p>

            <p>
              Here, genuine connections are built on{" "}
              <strong className="text-gray-900">true, authentic</strong>{" "}
              stories. No filters, no facades—just real people sharing real
              journeys.
            </p>

            <p>
              <strong className="text-gray-900">stories.fun</strong> is where
              authentic stories are tokenized, empowering creators to monetize
              their journeys and communities to invest in meaningful
              connections.
            </p>

            <p>
              Whether you&apos;re dating, networking, or just sharing your life,
              your <strong className="text-gray-900">stories.fun</strong> link
              becomes the ultimate way to introduce yourself. It&apos;s like a
              digital handshake, but way more personal.
            </p>

            <p>We&apos;re bringing the world&apos;s stories on-chain.</p>

            <p>
              Hold tokens of your favorite stories for future airdrops,
              exclusive perks, and premium features (coming soon).{" "}
              <strong className="text-gray-900">You&apos;re EARLY</strong>.
            </p>

            <p>
              Remember: Keep your story{" "}
              <strong className="text-gray-900">genuine and honest</strong>.
              This is the place to show a side of yourself you can&apos;t share
              anywhere else.
            </p>

            <p>More announcements coming soon.</p>

            <p>
              Follow us for updates. Let&apos;s make storytelling fun again.
            </p>
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
