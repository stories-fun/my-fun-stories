import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  getR2Instance,
  storeMessage,
  getConversation,
  getUserConversations,
  markMessagesAsRead,
  getUnreadMessageCounts,
} from "~/server/api/r2/message";
import { createMessageSchema } from "~/server/schema/message";
import { observable } from "@trpc/server/observable";

export const messageRouter = createTRPCRouter({
  // Send a message
  sendMessage: publicProcedure
    .input(createMessageSchema)
    .mutation(async ({ input }) => {
      try {
        console.log("Server: Sending message:", input);
        const r2 = getR2Instance();
        const result = await storeMessage(r2, input);
        console.log("Server: Message stored successfully:", result);
        return result;
      } catch (error) {
        console.error("Server: Error storing message:", error);
        throw error;
      }
    }),

  // Get conversation between two users
  getConversation: publicProcedure
    .input(
      z.object({
        userId1: z.string(),
        userId2: z
          .union([z.string(), z.undefined()])
          .transform((val) => val ?? "placeholder"),
        limit: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      try {
        if (!input.userId2 || input.userId2 === "placeholder") {
          console.log("Server: Invalid userId2, returning empty array");
          return [];
        }

        console.log("Server: Fetching conversation:", input);
        const r2 = getR2Instance();
        const result = await getConversation(
          r2,
          input.userId1,
          input.userId2,
          input.limit,
        );
        console.log("Server: Retrieved messages:", result.length);
        return result;
      } catch (error) {
        console.error("Server: Error fetching conversation:", error);
        return [];
      }
    }),

  // Get all conversations for a user
  getUserConversations: publicProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ input }) => {
      try {
        console.log("Server: Fetching conversations for user:", input.userId);
        const r2 = getR2Instance();
        const result = await getUserConversations(r2, input.userId);
        console.log("Server: Retrieved conversations:", result);
        return result;
      } catch (error) {
        console.error("Server: Error fetching user conversations:", error);
        return [];
      }
    }),

  // Mark messages as read
  markMessagesAsRead: publicProcedure
    .input(
      z.object({
        senderId: z.string().min(1),
        receiverId: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        console.log("Server: Marking messages as read:", input);
        const r2 = getR2Instance();
        await markMessagesAsRead(r2, input.senderId, input.receiverId);
        return { success: true };
      } catch (error) {
        console.error("Server: Error marking messages as read:", error);
        return { success: false, error: String(error) };
      }
    }),

  // Get unread message count
  getUnreadMessageCount: publicProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ input }) => {
      try {
        console.log("Server: Getting unread count for user:", input.userId);
        const r2 = getR2Instance();
        const result = await getUnreadMessageCounts(r2, input.userId);
        console.log("Server: Unread count:", result);
        return result;
      } catch (error) {
        console.error("Server: Error getting unread count:", error);
        return 0;
      }
    }),

  // Subscribe to new messages
  subscribeToUnreadCount: publicProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .subscription(({ input }) => {
      console.log("Server: Starting subscription for user:", input.userId);
      return observable<number>((emit) => {
        const interval = setInterval(() => {
          void (async () => {
            try {
              const r2 = getR2Instance();
              const count = await getUnreadMessageCounts(r2, input.userId);
              emit.next(count);
            } catch (error) {
              console.error("Server: Error in subscription:", error);
            }
          })();
        }, 10000); // Check every 10 seconds

        return () => {
          console.log("Server: Ending subscription for user:", input.userId);
          clearInterval(interval);
        };
      });
    }),
});
