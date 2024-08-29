import { router } from '../../trpc.js';
import { addHandler, onAddHandler } from './handlers/add.handler.js';
import { deleteHandler } from './handlers/delete.handler.js';
import { editHandler } from './handlers/edit.handler.js';
import {
  findManyHandler,
  findManyInfiniteHandler,
} from './handlers/find-all.handler.js';
import { findOneHandler } from './handlers/find-one.handler.js';

export const organizationRouter = router({
  add: addHandler,
  onAdd: onAddHandler,
  findManyInfinite: findManyInfiniteHandler,
  findMany: findManyHandler,
  findOne: findOneHandler,
  edit: editHandler,
  delete: deleteHandler,
});
