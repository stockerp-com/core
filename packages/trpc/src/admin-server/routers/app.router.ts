import { router } from '../trpc.js';
import { accountRouter } from './account/account.router.js';
import { authRouter } from './auth/auth.router.js';
import { employeeRouter } from './employee/employee.router.js';
import { s3Router } from './s3/s3.router.js';

export const appRouter = router({
  auth: authRouter,
  employee: employeeRouter,
  account: accountRouter,
  s3: s3Router,
});

export type AppRouter = typeof appRouter;
