import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { storyRouter } from "./routers/story";
import { messageRouter } from "./routers/message";
import { promptingRouter } from "./routers/prompting";
import { linktreepromptRouter } from "./routers/linktreeprompt";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  story: storyRouter,
  message: messageRouter,
  prompting: promptingRouter,
  linktreeprompt: linktreepromptRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
