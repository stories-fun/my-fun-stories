import React, { useState, useEffect } from "react";
import Image from "next/image";
import { api } from "~/trpc/react";
import { useWallet } from "@jup-ag/wallet-adapter";
import { WalletChildrenProvider } from "./wallet";

interface Comment {
  id: string;
  content: string;
  walletAddress: string;
  username: string;
  createdAt: Date;
  replies?: Comment[];
  upvotes: string[];
  downvotes: string[];
}

interface CommentsProps {
  postId: string;
}

const CommentsInner: React.FC<CommentsProps> = ({ postId }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58();

  console.log("PostId in Comments:", postId); // Debug log

  // Get comments only if postId exists
  // const { data: fetchedComments, refetch: refetchComments } =
  //   api.story.getComments.useQuery(
  //     { storyKey: postId },
  //     {
  //       enabled: !!postId,
  //       onSuccess: (data) => {
  //         setComments(data);
  //       },
  //     },
  //   );

  const { data: fetchedComments, refetch: refetchComments } =
    api.story.getComments.useQuery({ storyKey: postId }, { enabled: !!postId });

  useEffect(() => {
    if (fetchedComments) {
      setComments(fetchedComments);
    }
  }, [fetchedComments]);

  // Add comment mutation
  const addCommentMutation = api.story.addComment.useMutation({
    onSuccess: () => {
      refetchComments();
    },
  });

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    if (!walletAddress) {
      alert("Please connect your wallet first");
      return;
    }
    if (!postId) {
      alert("Story ID is missing");
      return;
    }

    try {
      await addCommentMutation.mutateAsync({
        storyKey: postId,
        content: newComment,
        walletAddress: walletAddress,
      });

      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment. Please try again.");
    }
  };

  const handleReplySubmit = async (
    parentCommentId: string,
    replyText: string,
  ) => {
    if (!replyText.trim()) return;
    if (!walletAddress) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      await addCommentMutation.mutateAsync({
        storyKey: postId,
        content: replyText,
        walletAddress: walletAddress,
        parentCommentId,
      });
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert("Failed to submit reply. Please try again.");
    }
  };

  const CommentComponent: React.FC<{
    comment: Comment;
    isWalletConnected: boolean;
  }> = ({ comment, isWalletConnected }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState("");

    const handleReply = async () => {
      if (!replyText.trim()) return;
      if (!isWalletConnected) {
        alert("Please connect your wallet first");
        return;
      }

      await handleReplySubmit(comment.id, replyText);
      setShowReplyInput(false);
      setReplyText("");
    };

    return (
      <div className="ml-4 mt-2">
        <div className="flex items-start space-x-2">
          <div className="h-8 w-8 overflow-hidden rounded-full">
            <Image
              src="/images/default-avatar.png"
              width={32}
              height={32}
              alt={comment.username}
            />
          </div>
          <div className="flex-1">
            <div className="rounded-lg bg-gray-100 p-3">
              <p className="text-sm font-semibold">{comment.username}</p>
              <p className="text-sm">{comment.content}</p>
            </div>
            <div className="mt-1 flex space-x-4 text-xs text-gray-500">
              {isWalletConnected ? (
                <button
                  className="hover:text-gray-700"
                  onClick={() => setShowReplyInput(!showReplyInput)}
                >
                  Reply
                </button>
              ) : null}
              <span>{new Date(comment.createdAt).toLocaleString()}</span>
            </div>

            {showReplyInput && (
              <div className="mt-2">
                <textarea
                  className="w-full rounded-lg border p-2 text-sm"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={2}
                />
                <div className="mt-2 flex justify-end space-x-2">
                  <button
                    className="rounded-lg bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
                    onClick={() => {
                      setShowReplyInput(false);
                      setReplyText("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded-lg bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                    onClick={handleReply}
                  >
                    Reply
                  </button>
                </div>
              </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-4 mt-2">
                {comment.replies.map((reply) => (
                  <CommentComponent
                    key={reply.id}
                    comment={reply}
                    isWalletConnected={isWalletConnected}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-h-[500px] overflow-y-auto rounded-lg bg-white p-4 shadow-lg">
      <div className="mb-4">
        {!walletAddress ? (
          <div className="mb-4 text-center text-gray-500">
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
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-2 flex justify-end">
              <button
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmitComment();
                }}
                // disabled={addCommentMutation.isLoading || !walletAddress}
                disabled={
                  addCommentMutation.status === "pending" || !walletAddress
                }
              >
                {/* {addCommentMutation.isLoading ? "Posting..." : "Comment"} */}
                {addCommentMutation.status === "pending"
                  ? "Posting..."
                  : "Comment"}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentComponent
            key={comment.id}
            comment={comment}
            isWalletConnected={!!walletAddress}
          />
        ))}
      </div>
    </div>
  );
};

const Comments: React.FC<CommentsProps> = (props) => {
  // Add validation for required props
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
