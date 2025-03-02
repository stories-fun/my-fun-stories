import React from "react";
import Image from "next/image";
import { useWallet } from "@jup-ag/wallet-adapter";

const PreLoginSide = () => {
  const wallet = useWallet();

  // const handleLogin = () => {
  //   // Connect to the first available wallet
  //   if (wallet.wallets.length > 0) {
  //     await wallet.connect();
  //   }
  // };

  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <div className="">
        <Image
          src={"/images/Image.png"}
          alt="cover image"
          className="h-[60px] w-full"
          width={500}
          height={100}
        />
      </div>
      <div className="space-y-4 border-b p-4 pb-6">
        <h2 className="text-lg font-medium">Welcome to stories.fun</h2>
        <p className="text-sm text-gray-800">
          Share your real story. Tokenize it. Build a community that invests in
          you. Forget fake personas—here, authentic journeys turn into assets,
          with fans co-owning the ride via presales and DEX trading. <br />
          <br />
          Leave your story on-chain—your legacy, forever etched in time.
        </p>
        <div className="pt-2">
          <button
            // onClick={handleLogin}
            className="w-full rounded-full bg-blue-500 py-3 font-medium text-white transition-colors hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreLoginSide;
