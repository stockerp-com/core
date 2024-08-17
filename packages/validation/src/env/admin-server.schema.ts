import { z } from 'zod';

export const adminServerSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  ADMIN_SERVER_PORT: z.coerce.number().default(3000),
  ADMIN_SERVER_JWT_AT_SECRET: z.string(),
  ADMIN_SERVER_JWT_RT_SECRET: z.string(),
});

export type AdminServerEnv = z.infer<typeof adminServerSchema>;
