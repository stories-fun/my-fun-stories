import React, { useState, useEffect } from "react";
import { useWallet } from "@jup-ag/wallet-adapter";
import { api } from "~/trpc/react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { WalletChildrenProvider } from "./wallet";
import dynamic from "next/dynamic";

interface Comment {
  id: string;
  content: string;
  walletAddress: string;
  username?: string;
  createdAt: Date | string;
  upvotes: string[];
  downvotes: string[];
  replies: Comment[];
}

const COMMENTS_PER_PAGE = 5;
const INITIAL_VISIBLE_REPLIES = 2;

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
        const [isCollapsed, setIsCollapsed] = useState(level > 0);
        const [showReplyInput, setShowReplyInput] = useState(false);
        const [replyContent, setReplyContent] = useState("");
        const [showShareModal, setShowShareModal] = useState(false);
        const [visibleReplies, setVisibleReplies] = useState(
          INITIAL_VISIBLE_REPLIES,
        );
        const { publicKey } = useWallet();
        const walletAddress = publicKey?.toBase58();
        const utils = api.useUtils();

        const remainingReplies = comment.replies.length - visibleReplies;

        // Generate consistent avatar background color based on wallet address
        const getAvatarColor = (address: string) => {
          const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-yellow-500",
            "bg-red-500",
            "bg-purple-500",
          ];
          const index = Array.from(address).reduce(
            (acc, char) => acc + char.charCodeAt(0),
            0,
          );
          return colors[index % colors.length];
        };

        // Get user initials or first characters from wallet address
        const getAvatarText = (address: string, username?: string) => {
          if (username) {
            return username.slice(0, 2).toUpperCase();
          }
          return address.slice(0, 2).toUpperCase();
        };

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

        const getVoteCount = () => {
          return comment.upvotes.length - comment.downvotes.length;
        };

        const handleVote = async (voteType: "upvote" | "downvote") => {
          if (!walletAddress) return;
          await voteMutation.mutateAsync({
            storyKey: postId,
            commentId: comment.id,
            walletAddress,
            voteType,
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
          <div className="group relative">
            <div className={`pl-8 ${isCollapsed ? "" : "mb-2"}`}>
              <div className="flex items-center space-x-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${getAvatarColor(comment.walletAddress)} text-sm font-medium text-white`}
                >
                  {getAvatarText(comment.walletAddress, comment.username)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {comment.username ??
                      `${comment.walletAddress.slice(0, 8)}...`}
                  </span>
                  <span className="text-xs text-gray-500">{formattedDate}</span>
                </div>
              </div>

              <div className="ml-10">
                <div className="my-2 text-sm text-gray-900">
                  {comment.content}
                </div>

                <div className="mb-2 flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleVote("upvote")}
                      className={`rounded hover:bg-gray-100 ${
                        comment.upvotes.includes(walletAddress ?? "")
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                    >
                      ↑ {comment.upvotes.length}
                    </button>
                    <button
                      onClick={() => handleVote("downvote")}
                      className={`rounded hover:bg-gray-100 ${
                        comment.downvotes.includes(walletAddress ?? "")
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      ↓ {comment.downvotes.length}
                    </button>
                  </div>

                  <button
                    onClick={() => setShowReplyInput(!showReplyInput)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Reply
                  </button>

                  {comment.replies.length > 0 && (
                    <button
                      onClick={() => setIsCollapsed(!isCollapsed)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {isCollapsed
                        ? `Show ${comment.replies.length} replies`
                        : "Hide replies"}
                    </button>
                  )}
                </div>

                {showReplyInput && (
                  <div className="mb-4">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="min-h-[100px] w-full rounded border border-gray-200 p-2 text-sm focus:border-gray-300 focus:outline-none"
                      placeholder="Write a reply..."
                    />
                    <div className="mt-2 flex justify-end space-x-2">
                      <button
                        onClick={() => setShowReplyInput(false)}
                        className="rounded px-4 py-1 text-sm text-gray-500 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleReply}
                        className="rounded bg-blue-500 px-4 py-1 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
                        disabled={
                          !replyContent.trim() || addCommentMutation.isPending
                        }
                      >
                        {addCommentMutation.isPending ? "Sending..." : "Reply"}
                      </button>
                    </div>
                  </div>
                )}

                {!isCollapsed &&
                  comment.replies &&
                  comment.replies.length > 0 && (
                    <div className="mt-2 space-y-4">
                      {comment.replies.slice(0, visibleReplies).map((reply) => (
                        <CommentComponentWithNoSSR
                          key={reply.id}
                          comment={reply}
                          postId={postId}
                          level={level + 1}
                        />
                      ))}

                      {remainingReplies > 0 && (
                        <button
                          onClick={() =>
                            setVisibleReplies(comment.replies.length)
                          }
                          className="text-sm text-blue-500 hover:text-blue-600"
                        >
                          Show {remainingReplies} more{" "}
                          {remainingReplies === 1 ? "reply" : "replies"}
                        </button>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>
        );
      },
    ),
  { ssr: false },
);

const CommentsInner = ({ postId }: { postId: string }) => {
  const [newComment, setNewComment] = useState("");
  const [visibleComments, setVisibleComments] = useState(COMMENTS_PER_PAGE);
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
    if (!newComment.trim() || !walletAddress) return;
    await addCommentMutation.mutateAsync({
      storyKey: postId,
      content: newComment,
      walletAddress,
    });
  };

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="border-b p-4">
        {!walletAddress ? (
          <div className="rounded bg-gray-50 p-4 text-center text-sm text-gray-500">
            Connect wallet to join the discussion
          </div>
        ) : (
          <div className="space-y-2">
            <textarea
              className="min-h-[100px] w-full rounded border p-3 text-sm focus:border-blue-300 focus:outline-none"
              placeholder="What are your thoughts?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || addCommentMutation.isPending}
              >
                {addCommentMutation.isPending ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="divide-y divide-gray-100">
        {comments.length > 0 ? (
          comments.slice(0, visibleComments).map((comment) => (
            <div key={comment.id} className="p-4">
              <CommentComponentWithNoSSR comment={comment} postId={postId} />
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </div>

      {comments.length > visibleComments && (
        <div className="p-4">
          <button
            onClick={() =>
              setVisibleComments((prev) => prev + COMMENTS_PER_PAGE)
            }
            className="w-full rounded-full border border-gray-200 py-2 text-sm text-blue-500 hover:border-gray-300 hover:text-blue-600"
          >
            Load More Comments
          </button>
        </div>
      )}
    </div>
  );
};

const Comments = ({ postId }: { postId: string }) => {
  if (!postId) return null;

  return (
    <WalletChildrenProvider>
      <CommentsInner postId={postId} />
    </WalletChildrenProvider>
  );
};

export default Comments;
