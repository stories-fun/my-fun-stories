import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaWhatsapp, FaFacebook, FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, postId }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/story/${postId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <FaWhatsapp size={24} className="text-green-500" />,
      action: () =>
        window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`),
    },
    {
      name: "X",
      icon: <FaXTwitter size={24} className="text-black" />,
      action: () =>
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`,
        ),
    },
    {
      name: "Facebook",
      icon: <FaFacebook size={24} className="text-blue-600" />,
      action: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        ),
    },
    {
      name: "Email",
      icon: <MdEmail size={24} className="text-gray-600" />,
      action: () => window.open(`mailto:?body=${encodeURIComponent(shareUrl)}`),
    },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-lg bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <IoMdClose size={24} />
        </button>

        <h2 className="mb-6 text-xl font-semibold">Share in a post</h2>

        <div className="mb-8 flex flex-wrap justify-center gap-4">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={option.action}
              className="flex flex-col items-center space-y-2 rounded-lg p-3 hover:bg-gray-100"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                {option.icon}
              </div>
              <span className="text-sm">{option.name}</span>
            </button>
          ))}
        </div>

        <div className="relative mt-4 flex items-center rounded-lg border p-3">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 bg-transparent pr-20 text-sm outline-none"
          />
          <button
            onClick={handleCopy}
            className="absolute right-2 rounded-lg bg-blue-500 px-4 py-1 text-sm text-white hover:bg-blue-600"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
