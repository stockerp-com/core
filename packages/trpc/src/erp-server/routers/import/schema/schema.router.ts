import { router } from '../../../trpc.js';
import { addHandler } from './handlers/add.js';
import { deleteHandler } from './handlers/delete.js';
import { editHandler } from './handlers/edit.js';
import {
  findManyHandler,
  findManyInfiniteHandler,
} from './handlers/find-many.js';
import { findOneHandler } from './handlers/find-one.js';

export const schemaRouter = router({
  // Handlers:
  add: addHandler,
  findOne: findOneHandler,
  edit: editHandler,
  delete: deleteHandler,
  findMany: findManyHandler,
  findManyInfinite: findManyInfiniteHandler,
});
