import Image from "next/image";
import React from "react";
import NavBar from "~/app/_components/NavBar";

const AboutUs = () => {
  return (
    <div>
      <NavBar />
      <div>{/* <Image src={} width={} height={} alt="" /> */}</div>
      <div className="container mx-auto mt-6 w-full p-4 md:w-[50%]">
        <p>
          Traditional social media is broken. It’s all about followers, fake
          personas, and superficial connections. At <strong>stories.fun</strong>
          , we’re flipping the script. Here, genuine connections are built on{" "}
          <strong>true, authentic</strong> stories. No filters, no facades—just
          real people sharing real journeys. <strong>stories.fun </strong>is
          where authentic stories are tokenized, empowering creators to monetize
          their journeys and communities to invest in meaningful connections.
          Whether you’re dating, networking, or just sharing your life, your{" "}
          <strong>stories.fun</strong> link becomes the ultimate way to
          introduce yourself. It’s like a digital handshake, but way more
          personal. We’re bringing the world’s stories on-chain. Hold tokens of
          your favorite stories for future airdrops, exclusive perks, and
          premium features (coming soon).<strong>You’re EARLY</strong> .
          Remember: Keep your story <strong>genuine and honest</strong>. This is
          the place to show a side of yourself you can’t share anywhere else.
          More announcements coming soon. Follow us for updates. Let’s make
          storytelling fun again.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
