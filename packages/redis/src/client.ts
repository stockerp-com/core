import { createClient } from 'redis';
import env from './env.js';

export type Redis = ReturnType<typeof createClient>;

export const redis: Redis = createClient({
  url: `redis://:${env?.REDIS_PASSWORD}@${env?.REDIS_HOST}:${env?.REDIS_PORT}/0`,
});
