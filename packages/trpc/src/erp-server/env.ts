import { AdminServerEnv } from '@retailify/validation/env/server.schema';
import { S3Env } from '@retailify/validation/env/s3.schema';

export const env = process.env as unknown as AdminServerEnv & S3Env;
