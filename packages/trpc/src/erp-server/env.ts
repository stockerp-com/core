import { ServerEnv } from '@retailify/validation/env/server.schema';
import { S3Env } from '@retailify/validation/env/s3.schema';

export const env = process.env as unknown as ServerEnv & S3Env;
