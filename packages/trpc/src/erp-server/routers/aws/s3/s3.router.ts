import { router } from '../../../trpc.js';
import { presignPutUrlHandler } from './handlers/presign-put-url.js';

export const s3Router = router({
  // Handlers:
  presignPutUrl: presignPutUrlHandler,
});
