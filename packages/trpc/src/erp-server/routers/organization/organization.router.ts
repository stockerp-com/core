import { router } from '../../trpc.js';
import { addHandler } from './handlers/add.handler.js';
import { findAllInfiniteHandler } from './handlers/find-all.handler.js';
import { findOneHandler } from './handlers/find-one.handler.js';

export const organizationRouter = router({
  findAllInfinite: findAllInfiniteHandler,
  add: addHandler,
  findOne: findOneHandler,
});
