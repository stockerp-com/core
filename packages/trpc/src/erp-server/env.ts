import { AwsEnv } from '@core/validation/env/aws.schema';
import { ServerEnv } from '@core/validation/env/server.schema';

export const env = process.env as unknown as ServerEnv & AwsEnv;
