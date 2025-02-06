// server/api/routers/user.ts
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { UserStorage } from "../r2/user";
import { UserSchema } from "@/server/schemas/user";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const userStorage = new UserStorage();

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        walletAddress: UserSchema.shape.walletAddress,
        username: UserSchema.shape.username,
      }),
    )
    .mutation(async ({ input }) => {
      const existingUser = await userStorage.getUser(input.walletAddress);
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }

      const newUser = {
        ...input,
        createdAt: new Date(),
      };

      await userStorage.saveUser(input.walletAddress, newUser);
      return { success: true, user: newUser };
    }),
});
