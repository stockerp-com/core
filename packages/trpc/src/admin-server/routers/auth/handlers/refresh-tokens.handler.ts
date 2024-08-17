import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../procedures/public.js';
import { refreshSession } from '../../../utils/session.js';

export const refreshTokensHandler = publicProcedure.mutation(
  async ({ ctx }) => {
    const newSession = await refreshSession(ctx);
    if (!newSession) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: ctx.t?.('errors:http.401'),
      });
    }

    return newSession;
  },
);
