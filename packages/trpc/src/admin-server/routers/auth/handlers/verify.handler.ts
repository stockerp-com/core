import { authenticatedProcedure } from '../../../procedures/authenticated.js';

export const verifyHandler = authenticatedProcedure.query(() => ({
  ok: true,
}));
