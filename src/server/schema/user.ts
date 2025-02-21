import { z } from "zod";

export const UserSchema = z.object({
  walletAddress: z.string(),
  username: z.string().min(3),
  pfp: z.string().optional(),
  description: z.string().optional(),
  createdAt: z.preprocess((val) => {
    if (val instanceof Date) return val;
    return new Date(val as string);
  }, z.date()),
});

export type User = z.infer<typeof UserSchema>;
