import React, { useEffect } from "react";
import { Copy, Check, Twitter, Facebook, Link } from "lucide-react";
import dynamic from "next/dynamic";
import { useCommentsStore } from "~/store/useCommentsStore";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  commentId: string;
  content: string;
}

const ShareModalContent = ({
  isOpen,
  onClose,
  postId,
  commentId,
  content,
}: ShareModalProps) => {
  const {
    copied,
    setCopied,
    activeTab,
    setActiveTab,
    commentUrl,
    setCommentUrl,
    twitterShareUrl,
    setTwitterShareUrl,
    facebookShareUrl,
    setFacebookShareUrl,
    embedCode,
    setEmbedCode,
  } = useCommentsStore();

  useEffect(() => {
    // Generate URLs only on client side
    const baseUrl = window.location.origin;
    const fullCommentUrl = `${baseUrl}/stories/${postId}/comment/${commentId}`;

    setCommentUrl(fullCommentUrl);
    setTwitterShareUrl(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullCommentUrl)}&text=${encodeURIComponent(content.slice(0, 200))}`,
    );
    setFacebookShareUrl(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullCommentUrl)}`,
    );
    setEmbedCode(`<iframe 
  src="${fullCommentUrl}/embed" 
  width="100%" 
  height="200" 
  frameborder="0" 
  scrolling="no">
</iframe>`);
  }, [
    postId,
    commentId,
    content,
    setCommentUrl,
    setTwitterShareUrl,
    setFacebookShareUrl,
    setEmbedCode,
  ]);

  if (!isOpen) return null;

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSocialShare = (url: string) => {
    window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Share Comment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="mb-4 flex border-b">
          <button
            className={`mr-4 pb-2 ${
              activeTab === "link"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("link")}
          >
            Link
          </button>
          <button
            className={`mr-4 pb-2 ${
              activeTab === "social"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("social")}
          >
            Social
          </button>
          <button
            className={`pb-2 ${
              activeTab === "embed"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("embed")}
          >
            Embed
          </button>
        </div>

        <div className="mt-4">
          {activeTab === "link" && (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={commentUrl}
                className="flex-1 rounded-md border p-2 text-sm"
              />
              <button
                onClick={() => handleCopy(commentUrl)}
                className="flex h-10 w-10 items-center justify-center rounded-md border hover:bg-gray-50"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          )}

          {activeTab === "social" && (
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => handleSocialShare(twitterShareUrl)}
                className="flex items-center space-x-2 rounded-md border p-2 hover:bg-gray-50"
              >
                <Twitter className="h-4 w-4" />
                <span>Share on Twitter</span>
              </button>
              <button
                onClick={() => handleSocialShare(facebookShareUrl)}
                className="flex items-center space-x-2 rounded-md border p-2 hover:bg-gray-50"
              >
                <Facebook className="h-4 w-4" />
                <span>Share on Facebook</span>
              </button>
            </div>
          )}

          {activeTab === "embed" && (
            <div className="space-y-3">
              <pre className="overflow-x-auto rounded-md bg-gray-100 p-3 text-sm">
                <code>{embedCode}</code>
              </pre>
              <button
                onClick={() => handleCopy(embedCode)}
                className="flex w-full items-center justify-center space-x-2 rounded-md border p-2 hover:bg-gray-50"
              >
                <Link className="h-4 w-4" />
                <span>Copy Embed Code</span>
              </button>
            </div>
          )}
        </div>

        {copied && (
          <div className="mt-4 rounded-md bg-green-50 p-2 text-center text-sm text-green-600">
            Copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
};

// Export a client-side only version of the modal
const ShareModal = dynamic(() => Promise.resolve(ShareModalContent), {
  ssr: false,
});

export default ShareModal;
