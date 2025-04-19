import { getChain } from "~/server/langchain";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

type ChainResponse = {
  result: string;
};

export const linktreepromptRouter = createTRPCRouter({
  ask: publicProcedure
    .input(z.object({ question: z.string().min(3).max(500) }))
    .mutation(async ({ input }) => {
      try {
        const chain = await getChain();
        console.log("Here is chain ", chain);
        const response = (await chain.invoke({
          query: input.question,
        })) as ChainResponse;
        return {
          success: true,
          answer: response.result,
        };
      } catch (error) {
        console.log("Here is error from storytree langchain", error);
        return {
          success: false,
          answer: "Sorry, I couldn't process your question.",
        };
      }
    }),
});
