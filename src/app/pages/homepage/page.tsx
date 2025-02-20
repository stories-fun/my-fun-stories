import React from "react";
import StoriesLayout from "./_components/StoriesLayout";
import RightSection from "./_components/RightSection";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Main stories section */}
          <div className="w-full lg:w-3/4">
            <div className="rounded-xl bg-white shadow-sm">
              <StoriesLayout />
            </div>
          </div>

          {/* Right section - hidden on mobile */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="sticky top-6">
              <RightSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
