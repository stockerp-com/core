import { router } from '../../../trpc.js';
import { getPrivateUrlHandler } from './handlers/get-private-url.js';

export const cloudfrontRouter = router({
  // Handlers:
  getPrivateUrl: getPrivateUrlHandler,
});
