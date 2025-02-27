import React from "react";
import Image from "next/image";

const PreLoginSide = () => {
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
        <h2 className="text-sm font-bold">Welcome to story.fun</h2>
        <p className="text-xs font-bold">
          Share your real story. Tokenize it. Build a community that invests in
          you. Forget fake personas—here, authentic journeys turn into assets,
          with fans co-owning the ride via presales and DEX trading. <br />
          <br />
          Leave your story on-chain—your legacy, forever etched in time.
        </p>
        <div className="flex items-center justify-center">
          <button className="rounded-full bg-[#0079D3] px-36 py-2">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreLoginSide;
