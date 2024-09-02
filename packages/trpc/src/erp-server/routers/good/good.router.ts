import { router } from '../../trpc.js';
import { additionalIdentificatorRouter } from './additional-identificator/additional-identificator.router.js';

export const goodRouter = router({
  // Handlers:
  // Routers:
  additionalIdentificator: additionalIdentificatorRouter,
});
