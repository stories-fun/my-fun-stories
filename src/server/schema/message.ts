import { z } from "zod";

export const messageSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  content: z.string(),
  createdAt: z.date(),
  read: z.boolean().default(false),
});

export type Message = z.infer<typeof messageSchema>;

export const createMessageSchema = messageSchema.omit({
  id: true,
  createdAt: true,
  read: true,
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
