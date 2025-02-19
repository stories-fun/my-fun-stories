"use client";
import React from "react";
import PostCard from "~/app/_components/PostCard";
import { useParams } from "next/navigation";
import RightSidebar from "~/app/_components/RightSidebar";
import NavBar from "~/app/_components/NavBar";

const page = () => {
  const { id } = useParams();
  console.log("here is id", id);

  return (
    <>
      <NavBar />
      <div className="container mx-auto flex gap-6 p-10">
        {/* middle stories */}
        <div className="w-full rounded-lg bg-white p-4 md:w-3/4">
          <PostCard storyId={id as string} />
        </div>

        {/* right sidebar */}
        <div className="hidden rounded-lg bg-gray-100 md:block md:w-1/4">
          <RightSidebar />
        </div>
      </div>
    </>
  );
};

export default page;
