import { adminProcedure } from '../../../procedures/admin.js';
import { clearSession } from '../../../utils/session.js';

export const logOutHandler = adminProcedure.mutation(async ({ ctx }) => {
  await clearSession(ctx);

  return {
    message: 'Successfully logged out',
  };
});
