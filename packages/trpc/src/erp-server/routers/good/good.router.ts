import { router } from '../../trpc.js';
import { additionalIdentificatorRouter } from './additional-identificator/additional-identificator.router.js';
import { attributeRouter } from './attribute/attribute.router.js';

export const goodRouter = router({
  // Handlers:
  // Routers:
  additionalIdentificator: additionalIdentificatorRouter,
  attribute: attributeRouter,
});
