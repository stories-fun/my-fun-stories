import { z } from "zod";
import { commentSchema } from "./comments";

export const StorySchema = z.object({
  id: z.string(),
  manualId: z.string().optional(),
  walletAddress: z.string(),
  username: z.string(),
  content: z.string().min(1),
  title: z.string().optional(),
  createdAt: z.date(),
  likes: z.array(z.string()).default([]),
  comments: z.array(commentSchema).default([]),
});

export type Story = z.infer<typeof StorySchema>;
