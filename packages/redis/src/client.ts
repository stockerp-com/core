import { createClient } from 'redis';
import logger from '@retailify/logger';
import env from './env.js';

export const redis = createClient({
  url: `redis://:${env?.REDIS_PASSWORD}@${env?.REDIS_HOST}:${env?.REDIS_PORT}/0`,
});

(async () => {
  redis.on('error', (err) => {
    logger.fatal('Redis Client Error', err);
  });
  redis.on('ready', () => logger.info('Redis Client Ready'));

  await redis.connect();

  await redis.ping();
})();
