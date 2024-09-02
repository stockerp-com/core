import { router } from '../../../trpc.js';
import { addHandler } from './handlers/add.js';
import { deleteHandler } from './handlers/delete.js';
import { findManyInfiniteHandler } from './handlers/find-many.js';
import { findOneHandler } from './handlers/find-one.js';

export const additionalIdentificatorRouter = router({
  // Handlers:
  add: addHandler,
  findOne: findOneHandler,
  findManyInfinite: findManyInfiniteHandler,
  delete: deleteHandler,
});
