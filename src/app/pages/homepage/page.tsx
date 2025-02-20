import React from "react";
import RightSection from "./_components/RightSection";
import StoriesCard from "./_components/StoriesCard";
import RightSidebar from "~/app/_components/RightSidebar";

const HomePage = () => {
  return (
    <div className="bg-white-50 min-h-screen">
      <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Main stories section */}
          <div className="w-full lg:mr-10">
            <div className="rounded-xl bg-white shadow-sm">
              <StoriesCard />
            </div>
          </div>

          {/* Right section - hidden on mobile */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="sticky top-6">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
