import React from "react";
import PostCard from "./PostCard";
import RightSidebar from "./RightSidebar";

const Layout = () => {
  return (
    <div className="container mx-auto flex gap-6 p-10">
      {/* left sidebar */}
      <div className="hidden w-1/4 rounded-lg bg-gray-100 p-4 lg:block">
        left sidebar
      </div>

      {/* middle stories */}
      <div className="w-full rounded-lg bg-white p-4 lg:w-1/2">
        <PostCard />
      </div>

      {/* right sidebar */}
      <div className="hidden w-1/4 rounded-lg bg-gray-100 lg:block">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Layout;
