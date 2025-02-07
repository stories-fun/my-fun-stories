import { z } from "zod";

export const UserSchema = z.object({
  walletAddress: z.string(),
  username: z.string().min(3),
  createdAt: z.date(),
});
