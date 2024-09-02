import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from '../routers/app.router.js';
import { createContext } from '../context.js';
import { PrismaManager } from '@core/db';
import { Redis } from '@core/redis';
import { TFunction } from 'i18next';
import { AWS } from '@core/aws';

export const createExpressTrpcMiddleware = ({
  redis,
  prismaManager,
  aws,
}: {
  redis: Redis;
  prismaManager: PrismaManager;
  aws: AWS;
}) =>
  createExpressMiddleware({
    router: appRouter,
    createContext: (opts) =>
      createContext({
        expressContextOpts: opts as unknown as typeof opts & {
          req: { t: TFunction<'translation', undefined> };
        },
        redis,
        prismaManager,
        aws,
      }),
  });
