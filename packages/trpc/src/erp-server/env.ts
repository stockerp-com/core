import { ServerEnv } from '@retailify/validation/env/server.schema';

export const env = process.env as unknown as ServerEnv;
