import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { createExpressTrpcMiddleware } from '@retailify/trpc/admin-server/middleware/express';
import { redis } from '@retailify/redis';
import logger from '@retailify/logger';
import { db } from '@retailify/db';
import * as i18nextMiddleware from 'i18next-http-middleware';
import { initI18n } from './utils/i18n.js';

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
    .use(helmet())
    .use(cors())
    .use(
      rateLimit({
        windowMs: 1000 * 60 * 15,
        limit: 100,
      }),
    )
    .use(cookieParser())
    .use(i18nextMiddleware.handle(i18n));

  app.get('/', (req, res) => {
    res.send({
      message: req.t('greeting'),
      your_locale: req.language,
    });
  });

  app.use('/trpc', createExpressTrpcMiddleware(db, redis));

  return app;
};
