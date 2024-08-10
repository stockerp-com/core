import { adminServerSchema } from '@retailify/validation/env/admin-server.schema';
import logger from '@retailify/logger';
import { config } from 'dotenv';

const { NODE_ENV } = process.env;

config({
  path:
    NODE_ENV === 'test'
      ? '.env.test'
      : NODE_ENV === 'development'
        ? '.env.development'
        : '.env',
});

const { data: env, success, error } = adminServerSchema.safeParse(process.env);

if (success) {
  logger.info(
    '[ apps:admin-server ] Successfully validated environment variables',
  );
}

if (error) {
  logger.fatal(
    '[ apps:admin-server ] Failed to validate environment variables',
    error.errors,
  );
  throw new Error(error.message);
}

export default env;
