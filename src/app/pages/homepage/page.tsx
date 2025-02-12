import React from "react";
import StoriesLayout from "./_components/StoriesLayout";
import RightSection from "./_components/RightSection";

const HomePage = () => {
  return (
    <div className="container mx-auto flex gap-6 p-10">
      {/* main stories  */}
      <div className="w-full rounded-lg md:w-3/4">
        <StoriesLayout />
      </div>
      {/* rightside section */}
      <div className="hidden rounded-lg md:block md:w-1/4">
        <RightSection />
      </div>
    </div>
  );
};

export default HomePage;
