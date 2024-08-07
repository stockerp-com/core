import { TRPCError } from '@trpc/server';
import { middleware } from '../trpc.js';
import { signJwt, verifyJwt } from '../utils/jwt.js';

export const ensureSession = middleware(async ({ ctx, next }) => {
  const session = ctx.session;
  if (!session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized',
    });
  }

  const existingToken = await ctx.redis?.get(`admin:${session?.id}`);
  if (!existingToken) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized',
    });
  }
  verifyJwt(existingToken);

  const newToken = signJwt(session);
  await ctx.redis?.set(`admin:${session.id}`, newToken);
  ctx.setSessionCookie(newToken);

  return next({
    ctx,
  });
});
