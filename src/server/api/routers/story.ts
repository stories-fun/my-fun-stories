import { createTRPCRouter, publicProcedure } from "../trpc";
import { StoryStorage } from "../r2/story";
import { StorySchema } from "../../schema/story";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { UserStorage } from "../r2/user";
import { Comment } from "~/server/schema/comments";

const storyStorage = new StoryStorage();
const userStorage = new UserStorage();

export const storyRouter = createTRPCRouter({
  submit: publicProcedure
    .input(
      z.object({
        walletAddress: StorySchema.shape.walletAddress,
        writerName: z.string(),
        content: StorySchema.shape.content,
        title: StorySchema.shape.title.optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const username = input.writerName;

      const key = `${Date.now()}_${input.walletAddress.slice(2, 8)}`;
      const storyData = {
        id: key,
        walletAddress: input.walletAddress,
        writerName: input.writerName,
        username: input.writerName,
        content: input.content,
        title: input.title,
        createdAt: new Date(),
        likes: [],
        comments: [],
      };

      await storyStorage.saveStory(key, storyData);
      return { success: true, key };
    }),

  list: publicProcedure
    .input(
      z.object({
        walletAddress: z.string().optional(),
        limit: z.number().min(1).max(200).default(100),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      try {
        console.log("List stories input:", input);
        const { objects, nextToken } = await storyStorage.listObjects(
          "stories/",
          input.cursor,
        );

        console.log("Found objects:", objects.length);

        const validStories = (
          await Promise.all(
            objects.map(async (obj: any) => {
              try {
                if (!obj.Key) {
                  console.log("Object has no Key:", obj);
                  return null;
                }
                // Remove both the prefix and the .json extension
                const key = obj.Key.replace(/^stories\//, "").replace(
                  /\.json$/,
                  "",
                );
                console.log("Processing story with key:", key);

                const story = await storyStorage.getStory(key);
                if (!story) {
                  console.log("No story found for key:", key);
                  return null;
                }

                return {
                  key,
                  ...story,
                };
              } catch (error) {
                console.error("Error processing story:", error);
                return null;
              }
            }),
          )
        ).filter(Boolean);

        console.log("Valid stories found:", validStories.length);

        const filteredStories = validStories
          .filter((s: any) =>
            input.walletAddress
              ? s.walletAddress.toLowerCase() ===
                input.walletAddress.toLowerCase()
              : true,
          )
          .slice(0, input.limit);

        console.log("Filtered stories:", filteredStories.length);

        const uniqueWallets = Array.from(
          new Set(filteredStories.map((s: any) => s.walletAddress)),
        );
        const users: { [wallet: string]: any } = {};
        await Promise.all(
          uniqueWallets.map(async (wallet) => {
            const user = await userStorage.getUser(wallet);
            users[wallet] = user; // may be null if user doesn't exist
          }),
        );

        return {
          stories: filteredStories,
          users,
          nextCursor: nextToken,
        };
      } catch (error) {
        console.error("Failed to fetch stories:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch stories",
        });
      }
    }),

  addComment: publicProcedure
    .input(
      z.object({
        storyKey: z.string(),
        content: z.string().min(1),
        walletAddress: z.string(),
        parentCommentId: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await userStorage.getUser(input.walletAddress);
      if (!user)
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      const commentId = `${Date.now()}_${input.walletAddress.slice(2, 8)}`;
      const newComment = {
        id: commentId,
        content: input.content,
        walletAddress: input.walletAddress,
        username: user.username,
        createdAt: new Date(),
        upvotes: [],
        downvotes: [],
        replies: [],
      };

      const updateFn = (comments: Comment[]) => {
        if (!input.parentCommentId) return [...comments, newComment];

        const parent = storyStorage.findCommentById(
          comments,
          input.parentCommentId,
        );
        if (!parent)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Parent comment not found",
          });

        parent.replies.push(newComment);
        return comments;
      };

      await storyStorage.updateStoryComments(input.storyKey, updateFn);
      return { success: true, commentId };
    }),

  voteComment: publicProcedure
    .input(
      z.object({
        storyKey: z.string(),
        commentId: z.string(),
        walletAddress: z.string(),
        voteType: z.enum(["upvote", "downvote", "remove"]),
      }),
    )
    .mutation(async ({ input }) => {
      const updateFn = (comments: Comment[]) => {
        const comment = storyStorage.findCommentById(comments, input.commentId);
        if (!comment)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Comment not found",
          });

        comment.upvotes = comment.upvotes.filter(
          (a: string) => a !== input.walletAddress,
        );
        comment.downvotes = comment.downvotes.filter(
          (a: string) => a !== input.walletAddress,
        );

        if (input.voteType === "upvote") {
          comment.upvotes.push(input.walletAddress);
        } else if (input.voteType === "downvote") {
          comment.downvotes.push(input.walletAddress);
        }

        return comments;
      };

      await storyStorage.updateStoryComments(input.storyKey, updateFn);
      return { success: true };
    }),

  like: publicProcedure
    .input(
      z.object({
        storyKey: z.string(),
        walletAddress: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { storyKey, walletAddress } = input;

      const story = await storyStorage.getStory(storyKey);
      if (!story) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Story not found",
        });
      }

      if (story.likes.includes(walletAddress)) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already liked this story",
        });
      }

      story.likes.push(walletAddress);
      await storyStorage.saveStory(storyKey, story);

      return { success: true, likes: story.likes.length };
    }),

  getById: publicProcedure
    .input(
      z.object({
        storyKey: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const story = await storyStorage.getStory(input.storyKey);
        if (!story) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Story not found",
          });
        }
        return { success: true, story };
      } catch (error) {
        console.error("Failed to fetch story by ID:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch story",
        });
      }
    }),
});
