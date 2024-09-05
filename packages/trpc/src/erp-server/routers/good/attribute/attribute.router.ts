import { router } from '../../../trpc.js';
import { addHandler } from './handlers/add.js';
import { deleteHandler } from './handlers/delete.js';
import { editHandler } from './handlers/edit.js';
import { findManyInfiniteHandler } from './handlers/find-many.js';
import { findOneHandler } from './handlers/find-one.js';
import { valueRouter } from './value/value.router.js';

export const attributeRouter = router({
  // Handlers:
  add: addHandler,
  edit: editHandler,
  findOne: findOneHandler,
  findManyInfinite: findManyInfiniteHandler,
  delete: deleteHandler,
  // Routers:
  value: valueRouter,
});
