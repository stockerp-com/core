import { z } from 'zod';

export const s3Schema = z.object({
  AWS_S3_ACCESS_KEY_ID: z.string(),
  AWS_S3_SECRET_ACCESS_KEY: z.string(),
  AWS_S3_REGION: z.string(),
  AWS_S3_BUCKET: z.string(),
});

export type S3Env = z.infer<typeof s3Schema>;
