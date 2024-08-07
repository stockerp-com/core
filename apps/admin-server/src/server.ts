import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { createExpressTrpcMiddleware } from '@retailify/trpc/src/admin-server/middleware/express.js';
import { db } from '@retailify/db';
import { redis } from '@retailify/redis';
import logger from '@retailify/logger';

export const server = (): Express => {
  const app = express();

  (async () => {
    redis.on('error', (err) => {
      logger.fatal('Redis Client Error', err);
    });
    redis.on('ready', () => logger.info('Redis Client Ready'));

    await redis.connect();

    await redis.ping();
  })();

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
    .use(cookieParser());

  app.get('/', (_req, res) => {
    res.send({ message: 'Hello World' });
  });

  app.use('/trpc', createExpressTrpcMiddleware);

  return app;
};
