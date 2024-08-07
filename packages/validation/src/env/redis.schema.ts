import { z } from 'zod';

export const redisSchema = z.object({
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PASSWORD: z.string().default(''),
  REDIS_PORT: z.coerce.number().default(6379),
});
