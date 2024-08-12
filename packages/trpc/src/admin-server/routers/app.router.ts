import { router } from '../trpc.js';
import { authRouter } from './auth/auth.router.js';

export const appRouter = router({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
