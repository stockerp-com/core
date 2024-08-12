import { adminProcedure } from '../../../procedures/admin.js';
import { clearSession } from '../../../utils/session.js';

export const signOutHandler = adminProcedure.mutation(async ({ ctx }) => {
  await clearSession(ctx);

  return {
    message: ctx.t?.('res:auth.sign_out.success'),
  };
});
