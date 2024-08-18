/* eslint-disable no-unused-vars */
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from '../routers/app.router.js';
import { createContext } from '../context.js';
import { Db } from '@retailify/db';
import { Redis } from '@retailify/redis';
import { TFunction } from 'i18next';

export type CreateExpressTrpcMiddleware = (
  db: Db,
  redis: Redis,
) => ReturnType<typeof createExpressMiddleware>;

export const createExpressTrpcMiddleware: CreateExpressTrpcMiddleware = (
  db: Db,
  redis: Redis,
) =>
  createExpressMiddleware({
    router: appRouter,
    createContext: (opts) =>
      createContext({
        expressContextOpts: opts as unknown as typeof opts & {
          req: { t: TFunction<'translation', undefined> };
        },
        db,
        redis,
      }),
  });
