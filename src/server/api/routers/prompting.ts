import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const promptingRouter = createTRPCRouter({
  getResponse: publicProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
              role: "user",
              content:
                input.prompt ??
                "Write a one-sentence bedtime story about a unicorn.",
            },
          ],
        });

        console.log("API response:", response);
        const responseText =
          response.choices[0]?.message?.content ?? "No response";

        return {
          reply: responseText,
        };
      } catch (error) {
        console.error("OpenAI API error:", error);
      }
    }),
});
