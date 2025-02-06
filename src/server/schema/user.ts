import { z } from "zod";

export const UserSchema = z.object({
  walletAddress: z.string(),
  username: z.string().min(3),
  createdAt: z.date(),
});

// server/schemas/story.ts
import { z } from "zod";

export const StorySchema = z.object({
  walletAddress: z.string(),
  content: z.string().min(1),
  title: z.string().optional(),
  createdAt: z.date(),
});
