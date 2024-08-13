import { adminProcedure } from '../../../procedures/admin.js';

export const verifyHandler = adminProcedure.query(() => ({
  ok: true,
}));
