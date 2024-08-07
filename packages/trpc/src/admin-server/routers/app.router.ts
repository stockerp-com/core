import { procedure, router } from '../trpc.js';

export const appRouter = router({
  foo: procedure.query(() => ({ message: 'bar' })),
});

export type AppRouter = typeof appRouter;
