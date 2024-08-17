import { ensureSession } from '../middleware/session.js';
import { procedure } from '../trpc.js';

export const authenticatedProcedure = procedure.use(ensureSession);
