// server/api/routers/story.ts
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { StoryStorage } from "../r2/story";
import { StorySchema } from "@/server/schemas/story";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const storyStorage = new StoryStorage();

export const storyRouter = createTRPCRouter({
  submit: publicProcedure
    .input(
      z.object({
        walletAddress: StorySchema.shape.walletAddress,
        content: StorySchema.shape.content,
        title: StorySchema.shape.title.optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const key = `${Date.now()}_${input.walletAddress.slice(2, 8)}`;
      const storyData = {
        ...input,
        createdAt: new Date(),
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
        const { objects, nextToken } = await storyStorage.listObjects(
          "stories/",
          input.cursor,
        );

        const validStories = (
          await Promise.all(
            objects.map(async (obj: any) => {
              try {
                if (!obj.Key) return null;
                const response = await storyStorage.getStory(obj.Key);
                return StorySchema.parse(response);
              } catch {
                return null;
              }
            }),
          )
        ).filter(Boolean);

        const filteredStories = validStories
          .filter((s: any) =>
            input.walletAddress
              ? s.walletAddress.toLowerCase() ===
                input.walletAddress.toLowerCase()
              : true,
          )
          .slice(0, input.limit);

        return {
          stories: filteredStories,
          nextCursor: nextToken,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch stories",
        });
      }
    }),
});
