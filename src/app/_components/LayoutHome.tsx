import React from "react";
import PostCard from "./PostCard";
import RightSidebar from "./RightSidebar";

const Layout = () => {
  return (
    <div className="container mx-auto flex gap-6 p-10">
      {/* middle stories */}
      <div className="w-full rounded-lg bg-white p-4 md:w-3/4">
        {/* <StoriesCard /> */}
        <PostCard />
      </div>

      {/* right sidebar */}
      <div className="hidden rounded-lg bg-gray-100 md:block md:w-1/4">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Layout;
