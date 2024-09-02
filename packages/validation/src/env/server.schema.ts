import { z } from 'zod';

export const serverSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  ERP_CLIENT_URL: z.string().default('http://localhost:4242'),
  POS_CLIENT_URL: z.string().default('http://localhost:4243'),
  STOREFRONT_CLIENT_URL: z.string().default('http://localhost:4244'),
  JWT_AT_SECRET: z.string(),
  JWT_RT_SECRET: z.string(),
});

export type ServerEnv = z.infer<typeof serverSchema>;
