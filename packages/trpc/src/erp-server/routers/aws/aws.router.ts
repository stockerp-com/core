import { router } from '../../trpc.js';
import { cloudfrontRouter } from './cloudfront/cloudfront.router.js';
import { s3Router } from './s3/s3.router.js';

export const awsRouter = router({
  // Routers:
  s3: s3Router,
  cloudfront: cloudfrontRouter,
});
