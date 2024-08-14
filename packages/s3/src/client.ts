import { S3Client } from '@aws-sdk/client-s3';
import env from './env.js';

export const s3 = new S3Client({
  region: env?.AWS_S3_REGION as unknown as string,
  credentials: {
    accessKeyId: env?.AWS_S3_ACCESS_KEY_ID as unknown as string,
    secretAccessKey: env?.AWS_S3_SECRET_ACCESS_KEY as unknown as string,
  },
});

export type S3 = typeof s3;
