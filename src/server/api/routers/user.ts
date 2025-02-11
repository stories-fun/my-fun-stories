import { createTRPCRouter, publicProcedure } from "../trpc";
import { UserStorage } from "../r2/user";
import { UserSchema } from "../../schema/user";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const userStorage = new UserStorage();

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        walletAddress: UserSchema.shape.walletAddress,
        username: UserSchema.shape.username,
        pfp: UserSchema.shape.pfp.optional(),
        description: UserSchema.shape.description.optional(),
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

  get: publicProcedure
    .input(
      z.object({
        walletAddress: UserSchema.shape.walletAddress,
      }),
    )
    .query(async ({ input }) => {
      const user = await userStorage.getUser(input.walletAddress);
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      return user;
    }),

  list: publicProcedure.query(async () => {
    const users = await userStorage.listUsers();
    return users;
  }),
});
