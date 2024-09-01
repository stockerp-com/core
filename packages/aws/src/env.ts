import logger from '@core/logger';
import { awsSchema } from '@core/validation/env/aws.schema';
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

const { data: env, success, error } = awsSchema.safeParse(process.env);

if (success) {
  logger.info(
    '[ packages:redis ] Successfully validated environment variables',
  );
}

if (error) {
  logger.fatal(
    '[ packages:redis ] Failed to validate environment variables',
    error.errors,
  );
  throw new Error(error.message);
}

export default env;
