import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from '../routers/app.router.js';
import { createContext } from '../context.js';

export const createExpressTrpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext: (opts) => createContext(opts),
});
