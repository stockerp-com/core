import { TRPCError } from '@trpc/server';
import { middleware } from '../trpc.js';
import { verifyAT } from '../utils/jwt.js';
import jwt from 'jsonwebtoken';

export const ensureSession = middleware(async ({ ctx, next }) => {
  const at = ctx.getAT?.();
  if (!at) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: ctx.t?.('errors:http.401'),
    });
  }

  try {
    const session = verifyAT(at);

    return next({
      ctx: {
        ...ctx,
        session,
      },
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: ctx.t?.('errors:http.401'),
      });
    } else {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: ctx.t?.('errors:http.other'),
      });
    }
  }
});
