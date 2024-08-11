import { publicProcedure } from '../procedures/public.js';
import { router } from '../trpc.js';
import { authRouter } from './auth/auth.router.js';
import { z } from 'zod';

export const appRouter = router({
  auth: authRouter,
  testQuery: publicProcedure
    .input(
      z.object({
        someField: z.string().min(5),
      }),
    )
    .query(({ input }) => {
      return input;
    }),
});

export type AppRouter = typeof appRouter;
