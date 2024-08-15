import { router } from '../../trpc.js';
import { findAllInfiniteHandler } from './handlers/find-all.handler.js';

export const organizationRouter = router({
  findAllInfinite: findAllInfiniteHandler,
});
