import { router } from '../trpc.js';
import { authRouter } from './auth/auth.router.js';
import { employeeRouter } from './employee/employee.router.js';

export const appRouter = router({
  auth: authRouter,
  employee: employeeRouter,
});

export type AppRouter = typeof appRouter;
