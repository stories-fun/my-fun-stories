import React, { useState } from "react";
import { useWallet } from "@jup-ag/wallet-adapter";
import { api } from "~/trpc/react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { WalletChildrenProvider } from "./wallet";
import Image from "next/image";
import ShareModal from "./CommentsShareModal";
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
        const [isCollapsed, setIsCollapsed] = useState(true);
        const [showReplyInput, setShowReplyInput] = useState(false);
        const [replyContent, setReplyContent] = useState("");
        const [showShareModal, setShowShareModal] = useState(false);
        const { publicKey } = useWallet();
        const walletAddress = publicKey?.toBase58();
        const utils = api.useUtils();

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

        // Format the comment content to preserve line breaks
        const formattedContent = comment.content.split("\n").map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < comment.content.split("\n").length - 1 && <br />}
          </React.Fragment>
        ));

        return (
          <div className="group relative">
            <div className="flex">
              {/* Thread line container - hidden on mobile */}
              <div className="relative mr-2 hidden w-[24px] flex-shrink-0 sm:mr-4 sm:block">
                {level > 0 && (
                  <>
                    <div className="absolute -top-3 bottom-0 left-0 w-[2px] bg-gray-200" />
                    <div className="absolute left-0 top-[16px] h-[2px] w-6 bg-gray-200" />
                  </>
                )}
              </div>

              {/* Comment content */}
              <div className="flex-1">
                <div className="flex items-start">
                  <div
                    className={`mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8 ${getAvatarColor(
                      comment.walletAddress,
                    )} text-xs font-medium text-white sm:text-sm`}
                  >
                    {getAvatarText(comment.walletAddress, comment.username)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="break-all text-xs font-medium text-gray-900 sm:text-sm">
                        {comment.username ??
                          `${comment.walletAddress.slice(0, 8)}...`}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formattedDate}
                      </span>
                    </div>

                    <div className="mt-1">
                      <div className="whitespace-pre-line break-words text-xs text-gray-900 sm:text-sm">
                        {formattedContent}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleVote("upvote")}
                            className={`flex items-center gap-1 text-xs sm:text-sm ${
                              comment.upvotes.includes(walletAddress ?? "")
                                ? "text-blue-500"
                                : "text-gray-400 hover:text-blue-500"
                            }`}
                          >
                            <Image
                              src="/images/Flower.png"
                              width={14}
                              height={14}
                              alt="upvote"
                              className="sm:h-4 sm:w-4"
                            />
                            <span>{comment.upvotes.length}</span>
                          </button>

                          <button
                            onClick={() => handleVote("downvote")}
                            className={`flex items-center gap-1 pl-2 text-xs sm:pl-4 sm:text-sm ${
                              comment.downvotes.includes(walletAddress ?? "")
                                ? "text-red-500"
                                : "text-gray-400 hover:text-red-500"
                            }`}
                          >
                            <Image
                              src="/images/dislike.png"
                              width={14}
                              height={14}
                              alt="downvote"
                              className="sm:h-4 sm:w-4"
                            />
                            <span>{comment.downvotes.length}</span>
                          </button>
                        </div>

                        <button
                          onClick={() => setShowReplyInput(!showReplyInput)}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 sm:text-sm"
                        >
                          <Image
                            src="/images/comment.png"
                            width={14}
                            height={14}
                            alt="reply"
                            className="sm:h-4 sm:w-4"
                          />
                          <span>Reply</span>
                        </button>

                        <button
                          onClick={() => setShowShareModal(true)}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 sm:text-sm"
                        >
                          <Image
                            src="/images/Share.png"
                            width={14}
                            height={14}
                            alt="share"
                            className="sm:h-4 sm:w-4"
                          />
                          <span>Share</span>
                        </button>

                        {comment.replies && comment.replies.length > 0 && (
                          <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="text-xs text-gray-500 hover:text-gray-700 sm:text-sm"
                          >
                            {isCollapsed
                              ? `[+] ${comment.replies.length} ${
                                  comment.replies.length === 1
                                    ? "reply"
                                    : "replies"
                                }`
                              : "[-] Hide"}
                          </button>
                        )}
                      </div>

                      {showReplyInput && (
                        <div className="mt-3 sm:mt-4">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="min-h-[80px] w-full rounded border border-gray-200 p-2 text-xs focus:border-gray-300 focus:outline-none sm:min-h-[100px] sm:p-3 sm:text-sm"
                            placeholder="Write a reply..."
                          />
                          <div className="mt-2 flex justify-end gap-2">
                            <button
                              onClick={() => setShowReplyInput(false)}
                              className="rounded px-3 py-1 text-xs text-gray-500 hover:bg-gray-100 sm:px-4 sm:text-sm"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleReply}
                              className="rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600 disabled:opacity-50 sm:px-4 sm:text-sm"
                              disabled={
                                !replyContent.trim() ||
                                addCommentMutation.isPending
                              }
                            >
                              {addCommentMutation.isPending
                                ? "Sending..."
                                : "Reply"}
                            </button>
                          </div>
                        </div>
                      )}

                      <ShareModal
                        isOpen={showShareModal}
                        onClose={() => setShowShareModal(false)}
                        postId={postId}
                        commentId={comment.id}
                        content={comment.content}
                      />
                    </div>

                    {comment.replies &&
                      comment.replies.length > 0 &&
                      !isCollapsed && (
                        <div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
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
                </div>
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
      <div className="border-b p-3 sm:p-4">
        {!walletAddress ? (
          <div className="rounded bg-gray-50 p-3 text-center text-xs text-gray-500 sm:p-4 sm:text-sm">
            Connect wallet to join the discussion
          </div>
        ) : (
          <div className="space-y-2">
            <textarea
              className="min-h-[80px] w-full rounded border p-2 text-xs focus:border-blue-300 focus:outline-none sm:min-h-[100px] sm:p-3 sm:text-sm"
              placeholder="What are your thoughts?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="rounded bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600 disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
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
            <div key={comment.id} className="p-3 sm:p-4">
              <CommentComponentWithNoSSR comment={comment} postId={postId} />
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-xs text-gray-500 sm:p-8 sm:text-sm">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </div>

      {comments.length > visibleComments && (
        <div className="p-3 sm:p-4">
          <button
            onClick={() =>
              setVisibleComments((prev) => prev + COMMENTS_PER_PAGE)
            }
            className="w-full rounded-full border border-gray-200 py-1.5 text-xs text-blue-500 hover:border-gray-300 hover:text-blue-600 sm:py-2 sm:text-sm"
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
