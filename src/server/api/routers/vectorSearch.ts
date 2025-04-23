import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import LangchainVectorService from "../../vector-search/langchain-vector-service";
import { TRPCError } from "@trpc/server";

// Define types for the database response
interface DbPoint {
  id: string;
  metadata?: {
    title?: string;
    content?: string;
    username?: string;
    createdAt?: string | Date;
    extractedMetadata?: Record<string, unknown>;
  };
}

// Mock client function for demo purposes
// In a real app, this would import and use a proper database client
async function getClient() {
  // Return a mock client
  return {
    index: (name: string) => ({
      getPoints: async ({
        ids,
        includeMetadata,
      }: {
        ids: string[];
        includeMetadata: boolean;
      }) => {
        // This is a mock implementation
        return {
          points: [] as DbPoint[], // Return empty array as we don't have a real DB
        };
      },
    }),
  };
}

// Options schema for search
const searchOptionsSchema = z.object({
  limit: z.number().optional(),
  threshold: z.number().optional(),
  intent: z.string().optional(),
  filters: z.record(z.string(), z.array(z.string())).optional(),
  strictMode: z.boolean().optional(),
});

export const vectorSearchRouter = createTRPCRouter({
  searchStories: publicProcedure
    .input(
      z.object({
        query: z.string(),
        options: searchOptionsSchema.optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { query, options = {} } = input;
      const vectorService = LangchainVectorService.getInstance();

      console.log(`Starting search for query: ${query}`);
      console.log(`Current vector count: ${vectorService.getVectorCount()}`);

      // Apply a stricter threshold if not already set
      if (!options.threshold) {
        options.threshold = 0.3; // Higher threshold means more selective results
      }

      const results = await vectorService.search(query, options);

      return {
        results,
        totalVectors: vectorService.getVectorCount(),
        resultsFound: results.length,
        scores: results.map((r) => r.score),
        strictMode: true,
      };
    }),

  // Add getStoryById endpoint
  getStoryById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        // This is a placeholder for database query - replace with your actual DB logic
        // In a real app, you would fetch from your database
        const { id } = input;

        // For demo purposes, we'll fetch from the vector DB
        const client = await getClient();
        const index = client.index("stories");

        try {
          // Try to get the story directly by ID
          const result = await index.getPoints({
            ids: [id],
            includeMetadata: true,
          });

          if (result.points.length > 0) {
            const point = result.points[0];
            if (point?.metadata) {
              return {
                id: point.id,
                title: point.metadata.title ?? "Unknown Title",
                content: point.metadata.content ?? "No content available",
                username: point.metadata.username ?? "anonymous",
                createdAt: point.metadata.createdAt ?? new Date(),
                extractedMetadata: point.metadata.extractedMetadata ?? {},
              };
            }
          }
        } catch (e) {
          console.error("Error fetching story by ID:", e);
        }

        return null;
      } catch (error) {
        console.error("Error in getStoryById:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch story",
        });
      }
    }),
});
