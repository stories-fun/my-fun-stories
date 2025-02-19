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
import { useStoriesStore } from "~/store/useStoriesStore";
import { useRouter } from "next/navigation";
import Comments from "~/app/_components/Comments";

const Editor = dynamic(() => import("draft-js").then((mod) => mod.Editor), {
  ssr: false,
});

const StoriesCard = () => {
  const router = useRouter();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const { stories, error, isLoading, getStories } = useStoriesStore();
  

  console.log("Here is stories", stories);

  useEffect(() => {
    const wallet = process.env.NEXT_PUBLIC_WALLET_ADDRESS;
    if (wallet) {
      getStories(wallet);
    }
  }, []);

  // const onEditorStateChange = (state: any) => {
  //   setEditorState(state);
  // };

  if (isLoading)
    return (
      <div className="animate-pulse">
        <div className="mt-4 flex h-[550px] flex-col gap-4 border-b-2 sm:flex-col md:flex-row">
          <div className="flex-2 w-full md:w-2/3">
            {/* Profile section loading */}
            <div className="mb-4 flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="h-4 w-16 rounded bg-gray-200" />
              </div>
            </div>

            {/* Image slider loading */}
            <div className="mb-4 h-[300px] rounded-lg bg-gray-200" />

            {/* Post actions loading */}
            <div className="mb-4 flex space-x-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-gray-200" />
                  <div className="h-4 w-16 rounded bg-gray-200" />
                </div>
              ))}
            </div>

            {/* Progress bar loading */}
            <div className="h-2 rounded bg-gray-200" />
          </div>

          {/* Content section loading */}
          <div className="w-full md:w-1/3">
            <div className="space-y-4 p-4">
              <div className="h-6 w-3/4 rounded bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-5/6 rounded bg-gray-200" />
                <div className="h-4 w-4/6 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  if (error) return <p>Error Loading Stories{error}</p>;
  if (!stories.length) return <p>No stories found</p>;

  const handleCardClick = (id: string) => {
    router.push(`/stories/${id}`);
  };

  return (
<<<<<<< HEAD
    <div>
      {stories.length > 0 &&
        stories.map((story) => (
          <div
            className="mt-4 flex h-[550px] cursor-pointer flex-col gap-4 border-b-2 sm:flex-col md:flex-row"
            key={story.id}
          >
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
                    <div className="text-bold text-sm">{story.username}</div>
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
                <PostActions
                  storyKey={story.id}
                  walletAddress={story.walletAddres}
                />
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

            <div
              className="flex w-full flex-col justify-start md:w-1/3"
              onClick={() => handleCardClick(story.id)}
            >
              {/* text area */}
              {/* <textarea
          placeholder="write your story..."
          className="h-auto w-full resize-none rounded-lg bg-transparent p-3 text-lg outline-none focus:ring-2 focus:ring-blue-500"
        /> */}
              <div className="max-h-[400px] overflow-y-auto p-4">
                {/* <Editor
            editorState={editorState}
            onChange={onEditorStateChange}
            placeholder="Write your story..."
          /> */}
                <h2 className="font-bold">{story.title}</h2>
                <div>{story.content}</div>
              </div>
            </div>
=======
    <div className="container mx-auto w-full rounded-lg">
      {stories.map((story) => (
        <div key={story.id} className="mb-8">
          <h2 className="font-bold">{story.title}</h2>
          <div className="bg-[#F6F7F8]">
            <ImageSlider />
>>>>>>> 9ea024e96f5b1fe0561c82e49cfd92da1b15960c
          </div>
          <div className="mt-4">
            <PostActions postId={story.id} />
          </div>
          <div className="mt-4">
            <div>{story.content}</div>
          </div>
          <div className="mt-4">
            <Comments postId={story.id} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoriesCard;
