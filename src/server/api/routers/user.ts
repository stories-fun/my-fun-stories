import { createTRPCRouter, publicProcedure } from "../trpc";
import { UserStorage } from "../r2/user";
import { UserSchema, type User } from "../../schema/user";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

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
    .mutation(async ({ input }): Promise<{ success: boolean; user: User }> => {
      const existingUser = await userStorage.getUser(input.walletAddress);
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }

      const newUser: User = {
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
    .query(async ({ input }): Promise<User> => {
      const user = await userStorage.getUser(input.walletAddress);
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      return user;
    }),

  getUploadUrl: publicProcedure
    .input(
      z.object({
        walletAddress: UserSchema.shape.walletAddress,
        fileType: z.string().regex(/^image\/(jpeg|png|gif|webp)$/),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const fileExtension = input.fileType.split("/")[1];
        const key = `users/${input.walletAddress}/pfp/${nanoid()}.${fileExtension}`;

        const command = new PutObjectCommand({
          Bucket: userStorage.getBucketName(),
          Key: key,
          ContentType: input.fileType,
          ACL: "public-read",
        });

        const url = await getSignedUrl(userStorage.getClient(), command, {
          expiresIn: 3600,
        });

        // Get the public URL for the uploaded file
        const publicUrl = `https://${userStorage.getBucketName()}.r2.cloudflarestorage.com/${key}`;

        console.log("Generated presigned URL:", {
          bucket: userStorage.getBucketName(),
          key,
          url,
          publicUrl,
          contentType: input.fileType,
        });

        return {
          uploadUrl: url,
          key: publicUrl, // Return the public URL as the key
        };
      } catch (error) {
        console.error("Error generating upload URL:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate upload URL. Please try again.",
          cause: error,
        });
      }
    }),

  list: publicProcedure.query(async (): Promise<User[]> => {
    const users = await userStorage.listUsers();
    return users;
  }),
});
