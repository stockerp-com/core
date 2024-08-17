import { authenticatedProcedure } from '../../../procedures/authenticated.js';
import { removeCurrentSession } from '../../../utils/session.js';

export const signOutHandler = authenticatedProcedure.mutation(
  async ({ ctx }) => {
    await removeCurrentSession(ctx);

    return {
      message: ctx.t?.('res:auth.sign_out.success'),
    };
  },
);
