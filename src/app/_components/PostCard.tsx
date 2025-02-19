"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import PostActions from "./PostActions";
import { FaRegComment } from "react-icons/fa";
import { ImageSlider } from "../pages/homepage/_components/ImageSlider";
import { ImageSliderForStories } from "./ImageSliderForStories";
import { EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import dynamic from "next/dynamic";
import NestedComment from "../comment/_component/nestedComment";
import { useStoriesStore } from "~/store/useStoriesStore";
import Comments from "../_components/Comments";

const commentsData = [
  {
    id: 1,
    user: "Reader1",
    text: "Great story!",
    likes: 5,
    replies: [
      {
        id: 2,
        user: "Author",
        text: "Thank you!",
        likes: 2,
        replies: [
          {
            id: 3,
            user: "Reader1",
            text: "When's the next chapter?",
            likes: 1,
            replies: [],
          },
        ],
      },
    ],
  },
];

// const Editor = dynamic(() => import("draft-js").then((mod) => mod.Editor), {
//   ssr: false,
// });

const PostCard = ({ storyId }: { storyId: string }) => {
  const { getById, stories, isLoading, error } = useStoriesStore();

  useEffect(() => {
    if (storyId) {
      getById(storyId);
    }
  }, [storyId, getById]);

  const story = stories[0];
  console.log("Story in PostCard:", story);

  // const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // const onEditorStateChange = (state: any) => {
  //   setEditorState(state);
  // };
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!story) return <p>No story Found</p>;

  return (
    <div className="container mx-auto w-full rounded-lg">
      <h2 className="font-bold">{story.title}</h2>
      <div className="bg-[#F6F7F8]">
        {/* <ImageSlider /> */}
        <ImageSliderForStories />
      </div>
      <div className="mt-4">
        <PostActions storyKey={""} walletAddress="" />
        {/* <PostActions postId={story.id || storyId} /> */}
      </div>

      <div className="mt-4">
        {/* <textarea
          placeholder="write your story..."
          className="h-auto w-full resize-none rounded-lg bg-transparent p-3 text-lg outline-none focus:ring-2 focus:ring-blue-500"
        /> */}
        {/* <Editor
          editorState={editorState}
          onChange={onEditorStateChange}
          placeholder="Write your story..."
          key="post-editor"
        /> */}
        <div>{story.content}</div>
      </div>

      {/* Comments Section */}
      <div className="mt-4">
        <Comments postId={story.id || storyId} />
      </div>
    </div>
  );
};

export default PostCard;
