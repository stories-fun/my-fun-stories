import { z } from "zod";

export const StorySchema = z.object({
  walletAddress: z.string(),
  content: z.string().min(1),
  title: z.string().optional(),
  createdAt: z.date(),
});
