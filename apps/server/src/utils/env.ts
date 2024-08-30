import logger from '@core/logger';
import { config } from 'dotenv';
import { serverSchema } from '@core/validation/env/server.schema';

const { NODE_ENV } = process.env;

config({
  path:
    NODE_ENV === 'test'
      ? '.env.test'
      : NODE_ENV === 'development'
        ? '.env.development'
        : '.env',
});

const { data: env, success, error } = serverSchema.safeParse(process.env);

if (success) {
  logger.info('[ apps:server ] Successfully validated environment variables');
}

if (error) {
  logger.fatal(
    '[ apps:server ] Failed to validate environment variables',
    error.errors,
  );
  throw new Error(error.message);
}

export default env;
