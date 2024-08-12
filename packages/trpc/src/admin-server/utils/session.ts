import { TRPCError } from '@trpc/server';
import { Context, Session } from '../context.js';
import { signJwt, verifyJwt } from './jwt.js';

export const checkSession = async (ctx: Context) => {
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

  return session;
};

export const processSession = async (ctx: Context, sessionData: Session) => {
  const newToken = signJwt(sessionData);
  await ctx.redis?.set(`admin:${sessionData.id}`, newToken);
  if (ctx.setSessionCookie) {
    ctx.setSessionCookie(newToken);
  }
};

export const clearSession = async (ctx: Context) => {
  const session = ctx.session;
  if (!session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: ctx.t?.('res:auth.sign_out.failed'),
    });
  }

  await ctx.redis?.del(`admin:${session.id}`);
  if (ctx.clearSessionCookie) {
    ctx.clearSessionCookie();
  }
};
