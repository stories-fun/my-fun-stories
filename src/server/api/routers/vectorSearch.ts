import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import LangchainVectorService from "../../vector-search/langchain-vector-service";

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
});
