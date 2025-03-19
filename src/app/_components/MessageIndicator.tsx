"use client";

import { useEffect } from "react";
import { useChatStore } from "~/store/useChatStore";
import { api } from "~/trpc/react";

const MessageIndicator = () => {
  const { unreadCount, setUnreadCount, openChat, userId, initializeUserId } =
    useChatStore();

  // Initialize userId on mount
  useEffect(() => {
    initializeUserId();
  }, [initializeUserId]);

  // Fetch unread message count
  const { data: unreadCountData } = api.message.getUnreadMessageCount.useQuery(
    { userId },
    {
      enabled: !!userId,
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  );

  useEffect(() => {
    if (unreadCountData !== undefined) {
      setUnreadCount(unreadCountData);
    }
  }, [unreadCountData, setUnreadCount]);

  const handleClick = () => {
    openChat();
  };

  return (
    <button
      onClick={handleClick}
      className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
        />
      </svg>

      {unreadCount > 0 && (
        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </div>
      )}
    </button>
  );
};

export default MessageIndicator;
