/* eslint-disable no-unused-vars */
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from '../routers/app.router.js';
import { createContext } from '../context.js';
import { PrismaManager } from '@retailify/db';
import { Redis } from '@retailify/redis';
import { TFunction } from 'i18next';

export type CreateExpressTrpcMiddleware = (
  redis: Redis,
  prismaManager: PrismaManager,
) => ReturnType<typeof createExpressMiddleware>;

export const createExpressTrpcMiddleware: CreateExpressTrpcMiddleware = (
  redis: Redis,
  prismaManager: PrismaManager,
) =>
  createExpressMiddleware({
    router: appRouter,
    createContext: (opts) =>
      createContext({
        expressContextOpts: opts as unknown as typeof opts & {
          req: { t: TFunction<'translation', undefined> };
        },
        redis,
        prismaManager,
      }),
  });
