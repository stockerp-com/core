import { router } from '../trpc.js';
import { accountRouter } from './account/account.router.js';
import { authRouter } from './auth/auth.router.js';
import { awsRouter } from './aws/aws.router.js';
import { employeeRouter } from './employee/employee.router.js';
import { goodRouter } from './good/good.router.js';
import { importRouter } from './import/import.router.js';
import { organizationRouter } from './organization/organization.router.js';
import { stockpointRouter } from './stockpoint/stockpoint.router.js';

export const appRouter = router({
  // Routers:
  auth: authRouter,
  employee: employeeRouter,
  account: accountRouter,
  organization: organizationRouter,
  aws: awsRouter,
  stockpoint: stockpointRouter,
  import: importRouter,
  good: goodRouter,
});

export type AppRouter = typeof appRouter;
