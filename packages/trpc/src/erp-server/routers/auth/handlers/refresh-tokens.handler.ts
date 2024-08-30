import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../procedures/public.js';
import { refreshSession } from '../../../utils/session.js';
import logger from '@core/logger';

export const refreshTokensHandler = publicProcedure.query(async ({ ctx }) => {
  const newSession = await refreshSession(ctx);
  if (!newSession) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: ctx.t?.('errors:http.401'),
    });
  }

  logger.info({ employeeId: ctx.session?.id }, 'Refreshed tokens');
  return newSession;
});
