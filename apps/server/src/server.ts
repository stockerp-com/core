import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { createExpressTrpcMiddleware } from '@retailify/trpc/erp-server/middleware/express';
import { redis } from '@retailify/redis';
import logger from '@retailify/logger';
import { prismaManager } from '@retailify/db';
import * as i18nextMiddleware from 'i18next-http-middleware';
import { initI18n } from './utils/i18n.js';
import { cwd } from 'process';

export const server = async (): Promise<Express> => {
  const app = express();

  await (async () => {
    redis.on('error', (err) => {
      logger.fatal('Redis Client Error', err);
    });
    redis.on('ready', () => logger.info('Redis Client Ready'));

    await redis.connect();

    await redis.ping();
  })();

  const i18n = await initI18n();

  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser())
    .use(helmet())
    .use(
      cors({
        origin: 'http://localhost:5173',
        credentials: true,
      }),
    )
    .use(
      rateLimit({
        windowMs: 1000 * 60,
        limit: 100,
      }),
    )
    .use(i18nextMiddleware.handle(i18n));

  app.get('/', (req, res) => {
    res.send({
      message: req.t('greeting'),
      your_locale: req.language,
    });
  });

  app.use('/erp/trpc', createExpressTrpcMiddleware(redis, prismaManager));

  return app;
};
