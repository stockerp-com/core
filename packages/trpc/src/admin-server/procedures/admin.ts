import { ensureSession } from '../middleware/session.js';
import { procedure } from '../trpc.js';

export const adminProcedure = procedure.use(ensureSession);
