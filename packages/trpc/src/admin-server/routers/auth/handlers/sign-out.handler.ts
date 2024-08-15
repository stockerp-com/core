import { authenticatedProcedure } from '../../../procedures/authenticated.js';
import { clearSession } from '../../../utils/session.js';

export const signOutHandler = authenticatedProcedure.mutation(
  async ({ ctx }) => {
    await clearSession(ctx);

    return {
      message: ctx.t?.('res:auth.sign_out.success'),
    };
  },
);
