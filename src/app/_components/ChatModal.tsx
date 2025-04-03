"use client";

import { useEffect, useRef, useCallback } from "react";
import { useChatStore } from "~/store/useChatStore";
import { api } from "~/trpc/react";
import type { Message } from "~/server/schema/message";

// Conversation list item
const ConversationItem = ({
  userId,
  isActive,
  onClick,
}: {
  userId: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <div
    className={`flex cursor-pointer items-center gap-3 rounded-md p-3 transition hover:bg-gray-100 ${
      isActive ? "bg-gray-100" : ""
    }`}
    onClick={onClick}
  >
    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-pink-200 to-purple-200 sm:h-9 sm:w-9">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-4 w-4 text-pink-500 sm:h-5 sm:w-5"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    </div>
    <div className="truncate text-sm font-medium sm:text-base">{userId}</div>
  </div>
);

// Message bubble
const MessageBubble = ({
  message,
  isCurrentUser,
}: {
  message: Message;
  isCurrentUser: boolean;
}) => (
  <div
    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-3`}
  >
    <div
      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm sm:max-w-[80%] sm:px-4 sm:py-2 sm:text-base ${
        isCurrentUser
          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      <p className="break-words">{message.content}</p>
      <p className="mt-1 text-xs opacity-70">
        {new Date(message.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  </div>
);

const ChatModal = () => {
  const {
    isChatOpen,
    closeChat,
    activeConversationUserId,
    setActiveConversation,
    conversations,
    setConversations,
    messages,
    setMessages,
    addMessage,
    userId,
    initializeUserId,
    messageInput,
    setMessageInput,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize userId on mount
  useEffect(() => {
    initializeUserId();
  }, [initializeUserId]);

  // Debug log for open state
  useEffect(() => {
    console.log("Chat open state:", isChatOpen);
    console.log("Active conversation:", activeConversationUserId);
    console.log("Current userId:", userId);
  }, [isChatOpen, activeConversationUserId, userId]);

  // Fetch user conversations
  const conversationsQuery = api.message.getUserConversations.useQuery(
    { userId },
    {
      enabled: isChatOpen && !!userId,
      refetchInterval: isChatOpen ? 3000 : false,
    },
  );

  // Update conversations in store when data is fetched
  useEffect(() => {
    if (conversationsQuery.data) {
      console.log("Fetched conversations:", conversationsQuery.data);
      setConversations(conversationsQuery.data);

      // Only set active conversation if none is selected and we have conversations
      if (
        conversationsQuery.data.length > 0 &&
        !activeConversationUserId &&
        !hasInitializedRef.current
      ) {
        setActiveConversation(conversationsQuery.data[0] ?? "");
        hasInitializedRef.current = true;
      }
    }
  }, [
    conversationsQuery.data,
    setConversations,
    activeConversationUserId,
    setActiveConversation,
  ]);

  // Get active conversation messages
  const messagesQuery = api.message.getConversation.useQuery(
    {
      userId1: userId,
      userId2: activeConversationUserId ?? "",
    },
    {
      enabled: !!userId && !!activeConversationUserId && isChatOpen,
      refetchInterval: isChatOpen ? 3000 : false,
    },
  );

  // Update messages when conversation data changes
  useEffect(() => {
    if (messagesQuery.data && activeConversationUserId) {
      console.log(
        "Fetched messages for conversation:",
        activeConversationUserId,
        messagesQuery.data,
      );
      setMessages(activeConversationUserId, messagesQuery.data);
    }
  }, [messagesQuery.data, activeConversationUserId, setMessages]);

  // Mark messages as read
  const markAsReadMutation = api.message.markMessagesAsRead.useMutation();

  useEffect(() => {
    if (
      isChatOpen &&
      activeConversationUserId &&
      userId &&
      activeConversationUserId !== userId
    ) {
      markAsReadMutation.mutate({
        senderId: activeConversationUserId,
        receiverId: userId,
      });
    }
  }, [isChatOpen, activeConversationUserId, userId, markAsReadMutation]);

  // Send message mutation
  const sendMessageMutation = api.message.sendMessage.useMutation({
    onSuccess: (data) => {
      console.log("Message sent successfully:", data);
      addMessage(data);
      setMessageInput("");

      // Focus the input after sending
      inputRef.current?.focus();

      // Refresh messages
      messagesQuery.refetch().catch(console.error);
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    },
  });

  // Message sending state
  const isSending = sendMessageMutation.status === "pending";

  // Handle send message
  const handleSendMessage = useCallback(() => {
    if (!messageInput.trim() || !activeConversationUserId || !userId) {
      console.log("Cannot send message, missing data:", {
        messageInput: messageInput.trim() ? "OK" : "Empty",
        activeConversationUserId: activeConversationUserId ?? "None",
        userId: userId ?? "None",
      });
      return;
    }

    // TypeScript non-null assertion since we checked these values above
    const receiverId = activeConversationUserId;
    const senderUserId = userId;

    console.log("Sending message:", {
      senderId: senderUserId,
      receiverId,
      content: messageInput,
    });

    sendMessageMutation.mutate({
      senderId: senderUserId,
      receiverId,
      content: messageInput,
    });
  }, [messageInput, activeConversationUserId, userId, sendMessageMutation]);

  // Scroll to bottom when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeConversationUserId]);

  // Focus input when conversation changes
  useEffect(() => {
    if (activeConversationUserId && isChatOpen) {
      inputRef.current?.focus();
    }
  }, [activeConversationUserId, isChatOpen]);

  if (!isChatOpen) return null;

  const activeMessages = activeConversationUserId
    ? (messages[activeConversationUserId] ?? [])
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-4">
      {/* Backdrop for mobile - full screen overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={closeChat}
      />

      {/* Chat modal container */}
      <div
        className="relative flex h-[80vh] w-full flex-col overflow-hidden rounded-t-lg bg-white shadow-lg md:h-[600px] md:w-[600px] md:max-w-full md:rounded-lg md:border lg:w-[800px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-gray-50 to-white p-3 shadow-sm sm:p-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <button
            onClick={closeChat}
            className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex h-full overflow-hidden">
          {/* Conversation list - hidden on small screens if conversation is active */}
          <div
            className={`h-full border-r bg-gray-50 ${
              activeConversationUserId
                ? "hidden w-0 sm:block sm:w-1/3 md:w-1/4"
                : "w-full sm:w-1/3 md:w-1/4"
            }`}
          >
            <div className="h-full overflow-y-auto p-1 sm:p-2">
              {conversations.map((convUserId) => (
                <ConversationItem
                  key={convUserId}
                  userId={convUserId}
                  isActive={convUserId === activeConversationUserId}
                  onClick={() => setActiveConversation(convUserId)}
                />
              ))}
              {conversations.length === 0 && (
                <div className="flex h-full items-center justify-center p-4 text-center text-sm text-gray-500 sm:text-base">
                  No conversations yet
                </div>
              )}
            </div>
          </div>

          {/* Chat area */}
          <div
            className={`flex h-full ${
              activeConversationUserId && "w-full sm:w-2/3 md:w-3/4"
            } flex-col`}
          >
            {activeConversationUserId ? (
              <>
                {/* Conversation header with back button on mobile */}
                <div className="flex items-center border-b bg-white p-3">
                  <button
                    className="mr-2 sm:hidden"
                    onClick={() => setActiveConversation("")}
                    aria-label="Back to conversations"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <div className="font-medium">{activeConversationUserId}</div>
                  {isSending && (
                    <div className="ml-2 text-xs text-gray-500">Sending...</div>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto bg-white p-3 sm:p-4">
                  {activeMessages.length > 0 ? (
                    activeMessages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isCurrentUser={message.senderId === userId}
                      />
                    ))
                  ) : (
                    <div className="flex h-full items-center justify-center text-center text-sm text-gray-500 sm:text-base">
                      No messages yet. Start the conversation!
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t bg-white p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type a message..."
                      className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:bg-white sm:text-base"
                      disabled={isSending}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || isSending}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-2 text-white shadow-sm transition hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
                      aria-label="Send message"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-5 w-5"
                      >
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center bg-white p-4 text-center text-sm text-gray-500 sm:hidden">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
