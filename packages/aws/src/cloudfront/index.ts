import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import env from '../env.js';
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront';
import { randomUUID } from 'crypto';

// CloudFront client setup
const cloudfrontClient = new CloudFrontClient({
  credentials: {
    accessKeyId: env?.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: env?.AWS_SECRET_ACCESS_KEY as string,
  },
});

// Invalidate CloudFront cache. You can either invalidate a single file or a directory by providing a wildcard (*).
export function invalidateCache({ key }: { key: string }) {
  const command = new CreateInvalidationCommand({
    DistributionId: env?.AWS_CLOUDFRONT_DISTRIBUTION_ID as string,
    InvalidationBatch: {
      CallerReference: randomUUID(),
      Paths: {
        Quantity: 1,
        Items: [`/${key}`],
      },
    },
  });

  return cloudfrontClient.send(command);
}

// Sign a CloudFront URL
export function signGetUrl({ key }: { key: string }) {
  return getSignedUrl({
    url: `${env?.AWS_CLOUDFRONT_DOMAIN_NAME}/${key}`,
    keyPairId: env?.AWS_CLOUDFRONT_KEY_PAIR_ID as string,
    privateKey: env?.AWS_CLOUDFRONT_PRIVATE_KEY as string,
    dateGreaterThan: new Date().toUTCString(), // Right now
    dateLessThan: new Date(Date.now() + 1000 * 60 * 60).toUTCString(), // 1 hour from now
  });
}

// A simple function to get a public URL of a file in CloudFront
export function getPublicUrl({ key }: { key: string }) {
  return `${env?.AWS_CLOUDFRONT_DOMAIN_NAME}/${key}`;
}
