import { z } from 'zod';

export const serverSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  JWT_AT_SECRET: z.string(),
  JWT_RT_SECRET: z.string(),
});

export type ServerEnv = z.infer<typeof serverSchema>;
