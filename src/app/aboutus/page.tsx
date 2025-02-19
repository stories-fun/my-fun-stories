import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavBar from "~/app/_components/NavBar";

const AboutUs = () => {
  return (
    <div>
      <NavBar />
      <div>
        <img
          src={"/images/aboutus.png"}
          alt="cover image"
          className="h-full w-full"
        />
        {/* <Image src={"/images/aboutus.png"} className="h-full w-full" alt="" /> */}
      </div>
      <div className="container mx-auto my-6 w-full p-4 md:w-[50%]">
        <div className="text-align space-y-2">
          <p>
            Traditional social media is broken. It’s all about followers, fake
            personas, and superficial connections.
          </p>{" "}
          <p>
            At <strong>stories.fun</strong>, we’re flipping the script.
          </p>{" "}
          <p>
            {" "}
            Here, genuine connections are built on{" "}
            <strong>true, authentic</strong> stories. No filters, no
            facades—just real people sharing real journeys.
          </p>
          <p>
            <strong>stories.fun </strong>is where authentic stories are
            tokenized, empowering creators to monetize their journeys and
            communities to invest in meaningful connections.
          </p>
          <p>
            {" "}
            Whether you’re dating, networking, or just sharing your life, your{" "}
            <strong>stories.fun</strong> link becomes the ultimate way to
            introduce yourself. It’s like a digital handshake, but way more
            personal.
          </p>
          <p> We’re bringing the world’s stories on-chain.</p>
          <p>
            {" "}
            Hold tokens of your favorite stories for future airdrops, exclusive
            perks, and premium features (coming soon).
            <strong>You’re EARLY</strong> .
          </p>
          <p>
            {" "}
            Remember: Keep your story <strong>genuine and honest</strong>. This
            is the place to show a side of yourself you can’t share anywhere
            else.
          </p>
          <p> More announcements coming soon.</p>
          <p> Follow us for updates. Let’s make storytelling fun again.</p>
        </div>
      </div>

      <div className="my-8 flex flex-col items-center justify-center">
        <h1 className="font-bold">Follow us to stay updated</h1>
        <Link href="https://x.com/StoriesDotFun">
          <Image src={"/images/twitter.png"} width={50} height={50} alt="" />
        </Link>
      </div>
    </div>
  );
};

export default AboutUs;
