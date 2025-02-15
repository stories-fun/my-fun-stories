"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import PostActions from "~/app/_components/PostActions";
import ProgressBar from "~/app/_components/ProgressBar";
import { ImageSlider } from "./ImageSlider";
import { EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import dynamic from "next/dynamic";
import axios from "axios";

const Editor = dynamic(() => import("draft-js").then((mod) => mod.Editor), {
  ssr: false,
});

const StoriesCard = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    const stories = async () => {
      try {
        const response = await axios.get("/api/trpc/");
      } catch (error) {}
    };
  }, []);

  const onEditorStateChange = (state: any) => {
    setEditorState(state);
  };

  return (
    <div className="mt-4 flex h-[550px] flex-col gap-4 border-b-2 sm:flex-col md:flex-row">
      <div className="flex-2 w-full md:w-2/3">
        <div className="flex items-center space-x-2">
          <Image
            src={"/images/profile.png"}
            width={30}
            height={30}
            alt="profile"
          />
          <div className="flex flex-col">
            <div className="flex items-center space-x-1">
              <div className="text-bold text-sm">Name</div>
              <Image
                src={"/images/verification.png"}
                width={25}
                height={25}
                alt=""
              />
            </div>

            <div className="mb-2 flex w-16 items-center justify-center rounded-full bg-[#AF52DE] px-4 py-1 text-xs">
              Trending
            </div>
          </div>
        </div>

        <div className="">
          {/* rendering image section */}
          {/* <Image
            src={"/images/profile.png"}
            width={640}
            height={360}
            alt="post"
            className="h-auto w-full rounded-lg object-cover sm:h-[360px] sm:w-[640px]"
          /> */}
          <ImageSlider />
        </div>
        <div className="mt-4">
          <PostActions />
        </div>
        {/* presale progress bar */}
        <div className="my-4">
          <ProgressBar />
        </div>

        {/* <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-100 p-3">
          <FaRegComment className="mb-3 text-gray-500" />

          <textarea
            placeholder="Add a comment..."
            className="h-[38px] w-full resize-none bg-transparent text-base placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div> */}
      </div>

      <div className="flex w-full flex-col justify-start md:w-1/3">
        {/* text area */}
        {/* <textarea
          placeholder="write your story..."
          className="h-auto w-full resize-none rounded-lg bg-transparent p-3 text-lg outline-none focus:ring-2 focus:ring-blue-500"
        /> */}
        <div className="max-h-[400px] overflow-y-auto p-4">
          <Editor
            editorState={editorState}
            onChange={onEditorStateChange}
            placeholder="Write your story..."
            // You can customize other editor properties here
          />
        </div>
      </div>

      {/* comment */}
    </div>
  );
};

export default StoriesCard;
