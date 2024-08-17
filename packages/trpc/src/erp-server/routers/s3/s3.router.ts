import { router } from '../../trpc.js';
import { presignPutUrlHandler } from './handlers/presign-put-url.handler.js';

export const s3Router = router({
  presignPutUrl: presignPutUrlHandler,
});
