import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { createExpressTrpcMiddleware } from '@core/trpc/erp-server/middleware/express';
import { redis } from '@core/redis';
import logger from '@core/logger';
import { prismaManager } from '@core/db';
import * as i18nextMiddleware from 'i18next-http-middleware';
import { initI18n } from './utils/i18n.js';
import http from 'http';
import { WebSocketServer } from 'ws';
import { createWSSHandler } from '@core/trpc/erp-server/middleware/websocket';
import env from './utils/env.js';
import { AWS } from '@core/aws';

export const serverFactory = async () => {
  await (async () => {
    redis.on('error', (err) => {
      logger.fatal('Redis Client Error', err);
    });
    redis.on('ready', () => logger.info('Redis Client Ready'));

    await redis.connect();

    await redis.ping();
  })();
  const i18n = await initI18n();
  const aws = new AWS();

  const app = express();
  const server = http.createServer(app);

  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser())
    .use(helmet())
    .use(
      cors({
        origin: [
          env?.ERP_CLIENT_URL ?? '',
          env?.POS_CLIENT_URL ?? '',
          env?.STOREFRONT_CLIENT_URL ?? '',
        ],
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

  app.use(
    '/erp/trpc',
    createExpressTrpcMiddleware({
      redis,
      prismaManager,
      aws,
    }),
  );

  const wss = new WebSocketServer({ server });
  const wssHandlerErp = createWSSHandler({
    wss,
    t: i18n.t,
    prismaManager,
    redis,
  });

  wss.on('connection', (ws) => {
    logger.info(
      { connections: wss.clients.size },
      'New Connection to WebSocket',
    );
    ws.once('close', () => {
      logger.info(
        { connections: wss.clients.size },
        'Disconnected from WebSocket',
      );
    });
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM');
    wssHandlerErp.broadcastReconnectNotification();
    wss.close();
    process.exit(0);
  });

  return server;
};
