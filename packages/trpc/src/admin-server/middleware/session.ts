import { middleware } from '../trpc.js';
import { checkSession, setSession } from '../utils/session.js';

export const ensureSession = middleware(async ({ ctx, next }) => {
  const session = await checkSession(ctx);

  await setSession(ctx, session);

  return next({
    ctx,
  });
});
