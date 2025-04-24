import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  LocalVectorSearchService,
  type SearchOptions,
} from "../../vector-search/local-vector-service";

// Options schema for search - should match SearchOptions in LocalVectorSearchService
const searchOptionsSchema = z.object({
  limit: z.number().optional(),
  threshold: z.number().optional(),
  intent: z.string().optional(),
  filters: z.record(z.string(), z.array(z.string())).optional(),
});

export const patchVectorRouter = createTRPCRouter({
  searchStories: publicProcedure
    .input(
      z.object({
        query: z.string(),
        options: searchOptionsSchema.optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { query, options = {} } = input;
      const vectorService = LocalVectorSearchService.getInstance();

      console.log(`Starting search for query: ${query}`);
      console.log(`Current vector count: ${vectorService.getVectorCount()}`);

      // Transform the options object to ensure type safety
      const searchOptions: SearchOptions = {
        limit: options.limit,
        threshold: options.threshold,
        intent: options.intent,
        filters: options.filters,
      };

      const results = await vectorService.search(query, searchOptions);

      return {
        results,
        totalVectors: vectorService.getVectorCount(),
        resultsFound: results.length,
        scores: results.map((r) => r.score),
      };
    }),
});
