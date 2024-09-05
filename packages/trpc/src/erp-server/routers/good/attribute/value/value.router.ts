import { router } from '../../../../trpc.js';
import { addHandler } from './handlers/add.js';
import { deleteHandler } from './handlers/delete.js';
import { editHandler } from './handlers/edit.js';
import { findManyInfiniteHandler } from './handlers/find-many.js';
import { findOneHandler } from './handlers/find-one.js';

export const valueRouter = router({
  // Handlers:
  add: addHandler,
  edit: editHandler,
  delete: deleteHandler,
  findOne: findOneHandler,
  findManyInfinite: findManyInfiniteHandler,
});
