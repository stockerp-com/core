import { middleware } from '../trpc.js';
import { checkSession, processSession } from '../utils/session.js';

export const ensureSession = middleware(async ({ ctx, next }) => {
  const session = await checkSession(ctx);

  await processSession(ctx, session);

  return next({
    ctx,
  });
});
