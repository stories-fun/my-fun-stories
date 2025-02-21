"use client";
import { useState } from "react";
import InteractionButtons from "./interactionButton";
import Image from "next/image";

const Comments = ({ comment, depth = 0 }: any) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const hasReplies = comment.replies?.length > 0;

  return (
    <div className={`relative mt-3 ${depth > 0 ? "ml-4" : ""}`}>
      <div className="flex items-start">
        {/* Collapse/Expand Button */}
        {hasReplies && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mr-2 text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? "−" : "+"}
          </button>
        )}

        {/* Comment Content */}
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-sm font-semibold">{comment.user}</span>
          </div>
          <p className="text-sm text-gray-700">{comment.text}</p>

          <div className="mt-2 flex items-center gap-4">
            <InteractionButtons
              likes={comment.likes}
              comments={comment.replies?.length || 0}
              onLike={() => {}}
            />
            <div className="">
              <button
                className="flex space-x-2 text-xs text-gray-500 hover:text-gray-700"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                <Image
                  src={"/images/comment.png"}
                  width={15}
                  height={15}
                  alt=""
                />

                <span className="text-xs text-gray-500">Reply</span>
              </button>
            </div>
            <div>
              <button className="flex space-x-2 text-xs text-gray-500 hover:text-gray-700">
                <Image
                  src={"/images/Share.png"}
                  width={15}
                  height={15}
                  alt=""
                />

                <span className="text-xs text-gray-500">Share</span>
              </button>
            </div>
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-2">
              <textarea
                className="w-full rounded border p-2 text-sm"
                placeholder="Write your reply..."
                // rows="2"
              />
              <div className="mt-1 flex gap-2">
                <button className="rounded bg-gray-100 px-2 py-1 text-xs">
                  Cancel
                </button>
                <button className="rounded bg-blue-500 px-2 py-1 text-xs text-white">
                  Post Reply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {hasReplies && isExpanded && (
        <div className={`ml-${depth * 4} border-l-2 border-gray-100 pl-4`}>
          {comment.replies.map((reply: any) => (
            <NestedComment key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;

// const CommentsSection = ({ comments }) => {
//   return (
//     <div className="mt-8">
//       <h2 className="mb-4 text-2xl font-semibold">
//         Comments ({comments.length})
//       </h2>
//       {comments.map((comment) => (
//         <Comment key={comment.id} comment={comment} />
//       ))}
//     </div>
//   );
// };

// export default CommentsSection;
