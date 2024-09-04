import { router } from '../../trpc.js';
import { addHandler } from './handlers/add.js';
import { archiveHandler } from './handlers/archive.js';
import { editHandler } from './handlers/edit.js';
import { findManyInfiniteHandler } from './handlers/find-many.js';
import { findOneHandler } from './handlers/find-one.js';

export const stockpointRouter = router({
  // Handlers:
  add: addHandler,
  archive: archiveHandler,
  edit: editHandler,
  findManyInfinite: findManyInfiniteHandler,
  findOne: findOneHandler,
});
