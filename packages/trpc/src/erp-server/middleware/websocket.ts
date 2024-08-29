import { type WebSocketServer } from 'ws';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { appRouter } from '../routers/app.router.js';
import { createContextInner } from '../context.js';
import { type TFunction } from 'i18next';
import { type PrismaManager } from '@retailify/db';
import { type Redis } from '@retailify/redis';
import { verifyAT } from '../utils/jwt.js';
import logger from '@retailify/logger';

export const createWSSHandler = ({
  wss,
  t,
  prismaManager,
  redis,
}: {
  wss: WebSocketServer;
  t: TFunction<'translation', undefined>;
  prismaManager: PrismaManager;
  redis: Redis;
}) =>
  applyWSSHandler({
    wss,
    router: appRouter,
    onError: (error) => {
      logger.error(error);
    },
    createContext: (opts) => {
      return createContextInner({
        prismaManager,
        redis,
        t,
        session: null,
        getAT: () => opts.info.connectionParams?.token ?? null,
      });
    },
    keepAlive: {
      enabled: true,
      pingMs: 30000,
      pongWaitMs: 5000,
    },
  });
