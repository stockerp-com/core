import { EmployeeRoles } from '@core/utils/employee';
import { ensureSession, ensureTenant } from '../middleware/session.js';
import { procedure } from '../trpc.js';

export const tenantProcedure = (allowedRoles: EmployeeRoles) =>
  procedure.use(ensureSession).use(ensureTenant(allowedRoles));
