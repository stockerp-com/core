import { router } from '../../trpc.js';
import { addHandler } from './handlers/add.handler.js';
import { editHandler } from './handlers/edit.handler.js';
import {
  findManyHandler,
  findManyInfiniteHandler,
} from './handlers/find-all.handler.js';
import { findOneHandler } from './handlers/find-one.handler.js';

export const organizationRouter = router({
  add: addHandler,
  edit: editHandler,
  findManyInfinite: findManyInfiniteHandler,
  findMany: findManyHandler,
  findOne: findOneHandler,
});
