import Image from "next/image";
import React from "react";

const RightSidebar = () => {
  return (
    <div className="bg-[#F6F7F8]">
      {/* banner */}
      <div className="">
        <Image
          src={"/images/Image.png"}
          alt="cover image"
          className="w-full"
          width={100}
          height={50}
        />
      </div>
      {/* profile */}
      <div className="border-b-2">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center space-x-2">
            <div>
              <Image
                src={"/images/profile.png"}
                width={25}
                height={25}
                alt="profile"
              />
            </div>
            <div>Name</div>
            <div>
              <Image
                src={"/images/verification.png"}
                width={25}
                height={25}
                alt="verified badge"
              />
            </div>
          </div>
          <div className="cursor-pointer rounded-full bg-[#0079D3] px-4 py-1">
            <h2 className="text-white">Follow</h2>
          </div>
        </div>

        <div className="p-4">
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid
            itaque quod eum ad recusandae earum mollitia qui fugit accusamus.
            Fugiat rerum quam minima, est rem maxime quaerat totam
            necessitatibus asperiores!
          </p>
        </div>
        <div className="flex items-center justify-center">
          <button className="p-4 text-[#878A8C]">Show more</button>
        </div>
      </div>

      {/* Invest Now */}
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-center rounded-full bg-[#0079D3] p-4 font-bold text-white">
          <button>Invest Now</button>
        </div>
        {/* Chat with Creator */}
        <div className="flex items-center justify-center rounded-full bg-white p-4 text-[#0079D3]">
          <button>Chat with Creator</button>
        </div>
      </div>

      {/* data market cap ,volumn and holders */}
      <div className="flex justify-between p-8">
        <div>MarketCap</div>
        <div>Holder</div>

        <div>Volumn</div>
      </div>
    </div>
  );
};

export default RightSidebar;
