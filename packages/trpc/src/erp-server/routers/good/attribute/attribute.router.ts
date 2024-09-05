import { router } from '../../../trpc.js';
import { valueRouter } from './value/value.router.js';

export const attributeRouter = router({
  // Handlers:
  // Routers:
  value: valueRouter,
});
