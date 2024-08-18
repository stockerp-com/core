import { router } from '../trpc.js';
import { accountRouter } from './account/account.router.js';
import { authRouter } from './auth/auth.router.js';
import { employeeRouter } from './employee/employee.router.js';
import { organizationRouter } from './organization/organization.router.js';

export const appRouter = router({
  auth: authRouter,
  employee: employeeRouter,
  account: accountRouter,
  organization: organizationRouter,
});

export type AppRouter = typeof appRouter;
