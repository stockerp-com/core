import { z } from 'zod';

export const awsSchema = z.object({
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_S3_REGION: z.string(),
  AWS_S3_BUCKET: z.string(),
  AWS_CLOUDFRONT_PRIVATE_KEY: z.string(),
  AWS_CLOUDFRONT_KEY_PAIR_ID: z.string(),
  AWS_CLOUDFRONT_DOMAIN_NAME: z.string(),
  AWS_CLOUDFRONT_DISTRIBUTION_ID: z.string(),
});

export type AwsEnv = z.infer<typeof awsSchema>;
