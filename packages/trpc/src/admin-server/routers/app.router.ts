import { publicProcedure } from '../procedures/public.js';
import { router } from '../trpc.js';
import { authRouter } from './auth/auth.router.js';

export const appRouter = router({
  auth: authRouter,
  greeting: publicProcedure.query(({ ctx }) => {
    const message = ctx.t?.('common:greeting');

    return { message, adsf: 'adsf' };
  }),
});

export type AppRouter = typeof appRouter;
