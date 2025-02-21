import React, { useEffect, useState } from "react";
import { useWallet } from "@jup-ag/wallet-adapter";
import { api } from "~/trpc/react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { WalletChildrenProvider } from "./wallet";
import Image from "next/image";
import ShareModal from "./ShareModal";

import dynamic from "next/dynamic";


interface Comment {
  id: string;
  content: string;
  walletAddress: string;
  username?: string;
  createdAt: Date;
  replies: Comment[];
  parentCommentId?: string;
  upvotes: string[];
  downvotes: string[];
}

interface CommentsProps {
  postId: string;
}

// Dynamically import the component with no SSR
const CommentComponentWithNoSSR = dynamic(
  () =>
    Promise.resolve(
      ({
        comment,
        postId,
        level = 0,
      }: {
        comment: Comment;
        postId: string;
        level?: number;
      }) => {
        const [showReplyInput, setShowReplyInput] = useState(false);
        const [replyContent, setReplyContent] = useState("");
        const [showShareModal, setShowShareModal] = useState(false);
        const { publicKey } = useWallet();
        const walletAddress = publicKey?.toBase58();
        const utils = api.useUtils();

        const addCommentMutation = api.story.addComment.useMutation({
          onSuccess: async () => {
            await utils.story.getComments.invalidate({ storyKey: postId });
            setReplyContent("");
            setShowReplyInput(false);
          },
        });

        const voteMutation = api.story.voteComment.useMutation({
          onSuccess: async () => {
            await utils.story.getComments.invalidate({ storyKey: postId });
          },
        });
        const handleVote = async (voteType: "upvote" | "downvote") => {
          if (!walletAddress) return;


          const isUpvoted = comment.upvotes.includes(walletAddress);
          const isDownvoted = comment.downvotes.includes(walletAddress);

          let action: "upvote" | "downvote" | "remove" = voteType;

          if (voteType === "upvote" && isUpvoted) {
            action = "remove";
          } else if (voteType === "downvote" && isDownvoted) {
            action = "remove";
          }

          await voteMutation.mutateAsync({
            storyKey: postId,
            commentId: comment.id,
            walletAddress,
            voteType: action,
          });
        };

        const handleReply = async () => {
          if (!replyContent.trim() || !walletAddress) return;
          await addCommentMutation.mutateAsync({
            storyKey: postId,
            content: replyContent,
            walletAddress,
            parentCommentId: comment.id,
          });
        };

        const formattedDate = formatDistanceToNow(new Date(comment.createdAt), {
          addSuffix: true,
        });

        return (
          <div className={`mt-4 ${level > 0 ? "ml-8" : ""}`}>
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex justify-between">
                <span className="font-semibold">
                  {comment.username ??
                    `${comment.walletAddress.slice(0, 8)}...`}
                </span>
                <span className="text-sm text-gray-500">{formattedDate}</span>
              </div>
              <p className="mt-2 text-gray-700">{comment.content}</p>

              <div className="mt-3 flex items-center gap-4">
                <button
                  onClick={() => handleVote("upvote")}
                  className={`flex items-center gap-1 text-sm ${
                    comment.upvotes.includes(walletAddress ?? "")
                      ? "text-blue-500"
                      : "text-gray-600 hover:text-blue-500"
                  }`}
                  disabled={voteMutation.isPending}
                >
                  <Image
                    src="/images/Flower.png"
                    width={20}
                    height={20}
                    alt="upvote"
                  />
                  <span>{comment.upvotes.length}</span>
                </button>

                <button
                  onClick={() => handleVote("downvote")}
                  className={`flex items-center gap-1 text-sm ${
                    comment.downvotes.includes(walletAddress ?? "")
                      ? "text-red-500"
                      : "text-gray-600 hover:text-red-500"
                  }`}
                  disabled={voteMutation.isPending}
                >
                  <Image
                    src="/images/dislike.png"
                    width={20}
                    height={20}
                    alt="downvote"
                  />
                  <span>{comment.downvotes.length}</span>
                </button>

                <button
                  onClick={() => setShowReplyInput(!showReplyInput)}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-500"
                >
                  <Image
                    src="/images/comment.png"
                    width={20}
                    height={20}
                    alt="reply"
                  />
                  <span>Reply</span>
                </button>

                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-500"
                >
                  <Image
                    src="/images/Share.png"
                    width={20}
                    height={20}
                    alt="share"
                  />
                  <span>Share</span>
                </button>
              </div>

              {showReplyInput && (
                <div className="mt-2">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full rounded border p-2 text-sm"
                    placeholder="Write a reply..."
                  />
                  <div className="mt-2 flex justify-end space-x-2">
                    <button
                      onClick={() => setShowReplyInput(false)}
                      className="rounded px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReply}
                      className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                      disabled={addCommentMutation.isPending}
                    >
                      {addCommentMutation.isPending ? "Replying..." : "Reply"}
                    </button>
                  </div>
                </div>
              )}

              <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                postId={comment.id}
              />
            </div>

            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-8">
                {comment.replies.map((reply) => (
                  <CommentComponentWithNoSSR
                    key={reply.id}
                    comment={reply}
                    postId={postId}
                    level={level + 1}
                  />
                ))}
              </div>
            )}
          </div>
        );
      },
    ),
  { ssr: false },
);

const CommentsInner: React.FC<CommentsProps> = ({ postId }) => {
  const [newComment, setNewComment] = useState("");
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58();

  const { data: comments = [], refetch: refetchComments } =
    api.story.getComments.useQuery(
      { storyKey: postId },
      {
        enabled: !!postId,
        refetchInterval: 3000,
      },
    );

  const addCommentMutation = api.story.addComment.useMutation({
    onSuccess: async () => {
      await refetchComments();
      setNewComment("");
    },
  });

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !walletAddress || !postId) return;

    await addCommentMutation.mutateAsync({
      storyKey: postId,
      content: newComment,
      walletAddress,
    });
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-4">
        {!walletAddress ? (
          <div className="text-center text-gray-500">
            Please connect your wallet to comment
          </div>
        ) : (
          <>
            <textarea
              className="w-full rounded-lg border p-3 text-sm"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <div className="mt-2 flex justify-end">
              <button
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                onClick={handleSubmitComment}
                disabled={addCommentMutation.isPending}
              >
                {addCommentMutation.isPending ? "Posting..." : "Comment"}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="space-y-4">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <CommentComponentWithNoSSR
              key={comment.id}
              comment={comment}
              postId={postId}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No comments yet</p>
        )}
      </div>
    </div>
  );
};

const Comments = (props: CommentsProps) => {
  if (!props.postId) {
    console.error("Comments component requires a postId prop");
    return null;
  }
  return (
    <WalletChildrenProvider>
      <CommentsInner {...props} />
    </WalletChildrenProvider>
  );
};

export default Comments;
