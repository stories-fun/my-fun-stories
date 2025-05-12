import React from "react";
import Image from "next/image";
import space from "../../../public/images/Space.png";

interface HasnotInvestedSideProps {
  username?: string | null;
}

const HasnotInvestedSide: React.FC<HasnotInvestedSideProps> = ({
}) => {

  return (
    <div className="mt-12 w-full overflow-hidden rounded-lg border bg-[#F6F7F8] shadow-md">
      <div className="bg-navy-900 relative h-20 w-full">
        <Image
          src={space}
          fill={true}
          sizes="(max-width: 768px) 100%, 100%"
          alt="Space theme with planets"
        />
      </div>

      <div className="space-y-6 p-4">
        <div>
          <p className="mt-4 text-xl text-gray-800">
          Perks & token details coming soon. Be the first to know when this story unlocks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HasnotInvestedSide;
