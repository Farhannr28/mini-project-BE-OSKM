import { crudRouter } from "~/server/api/routers/crud";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  crud: crudRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
