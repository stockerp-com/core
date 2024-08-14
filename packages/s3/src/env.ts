import { config } from 'dotenv';
import { s3Schema } from '@retailify/validation/env/s3.schema';
import logger from '@retailify/logger';

const { NODE_ENV } = process.env;

config({
  path:
    NODE_ENV === 'test'
      ? '.env.test'
      : NODE_ENV === 'development'
        ? '.env.development'
        : '.env',
});

const { data: env, success, error } = s3Schema.safeParse(process.env);

if (success) {
  logger.info('[ packages:s3 ] Successfully validated environment variables');
}

if (error) {
  logger.fatal(
    '[ packages:s3 ] Failed to validate environment variables',
    error.errors,
  );
  throw new Error(error.message);
}

export default env;
