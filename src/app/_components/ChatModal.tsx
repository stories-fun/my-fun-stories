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
    className={`flex cursor-pointer items-center gap-3 rounded-md p-3 hover:bg-gray-100 ${
      isActive ? "bg-gray-100" : ""
    }`}
    onClick={onClick}
  >
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-5 w-5 text-pink-300"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    </div>
    <div className="truncate font-medium">{userId}</div>
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
      className={`max-w-[80%] rounded-lg px-4 py-2 ${
        isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
      }`}
    >
      <p>{message.content}</p>
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

  if (!isChatOpen) return null;

  const activeMessages = activeConversationUserId
    ? (messages[activeConversationUserId] ?? [])
    : [];

  return (
    <div className="fixed bottom-0 right-5 z-50 flex h-[600px] w-[420px] flex-col overflow-hidden rounded-t-lg border border-b-0 bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-gray-50 p-4">
        <h2 className="font-semibold">Messages</h2>
        <button
          onClick={closeChat}
          className="text-gray-500 hover:text-gray-700"
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

      <div className="flex h-full">
        {/* Conversation list */}
        <div className="h-full w-1/3 overflow-y-auto border-r">
          {conversations.map((convUserId) => (
            <ConversationItem
              key={convUserId}
              userId={convUserId}
              isActive={convUserId === activeConversationUserId}
              onClick={() => setActiveConversation(convUserId)}
            />
          ))}
          {conversations.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No conversations yet
            </div>
          )}
        </div>

        {/* Chat area */}
        <div className="flex h-full w-2/3 flex-col">
          {activeConversationUserId ? (
            <>
              {/* Conversation header */}
              <div className="border-b p-3">
                <div className="font-medium">{activeConversationUserId}</div>
                {isSending && (
                  <div className="text-xs text-gray-500">
                    Sending message...
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {activeMessages.length > 0 ? (
                  activeMessages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isCurrentUser={message.senderId === userId}
                    />
                  ))
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    No messages yet. Start the conversation!
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex border-t p-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                    disabled={isSending}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || isSending}
                    className="rounded-full bg-blue-500 p-2 text-white disabled:opacity-50"
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
            <div className="flex h-full items-center justify-center text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
