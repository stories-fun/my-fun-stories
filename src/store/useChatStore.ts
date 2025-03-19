import { create } from "zustand";
import type { Message } from "~/server/schema/message";

interface ChatState {
  isChatOpen: boolean;
  activeConversationUserId: string | null;
  conversations: string[];
  messages: Record<string, Message[]>;
  unreadCount: number;
  userId: string;
  messageInput: string;

  // Actions
  openChat: (userId?: string) => void;
  closeChat: () => void;
  setActiveConversation: (userId: string) => void;
  setConversations: (conversations: string[]) => void;
  setMessages: (userId: string, messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setUnreadCount: (count: number) => void;
  setUserId: (id: string) => void;
  initializeUserId: () => void;
  setMessageInput: (text: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  isChatOpen: false,
  activeConversationUserId: null,
  conversations: [],
  messages: {},
  unreadCount: 0,
  userId: "",
  messageInput: "",

  openChat: (userId) =>
    set({
      isChatOpen: true,
      ...(userId ? { activeConversationUserId: userId } : {}),
    }),

  closeChat: () => set({ isChatOpen: false }),

  setActiveConversation: (userId) => set({ activeConversationUserId: userId }),

  setConversations: (conversations) => set({ conversations }),

  setMessages: (userId, messages) =>
    set({
      messages: {
        ...get().messages,
        [userId]: messages,
      },
    }),

  addMessage: (message) => {
    const { messages } = get();
    const partnerId =
      message.senderId === message.receiverId
        ? message.receiverId
        : message.senderId === localStorage.getItem("userId")
          ? message.receiverId
          : message.senderId;

    const existingMessages = messages[partnerId] ?? [];

    set({
      messages: {
        ...messages,
        [partnerId]: [...existingMessages, message],
      },
    });
  },

  setUnreadCount: (count) => set({ unreadCount: count }),

  setUserId: (id) => set({ userId: id }),

  initializeUserId: () => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");

      if (storedUserId) {
        console.log("Using stored userId:", storedUserId);
        set({ userId: storedUserId });
      } else {
        // For demonstration, generate temporary ID
        const tempId = `user_${Date.now()}`;
        console.log("Creating temporary userId:", tempId);
        localStorage.setItem("userId", tempId);
        set({ userId: tempId });
      }
    }
  },

  setMessageInput: (text) => set({ messageInput: text }),
}));
