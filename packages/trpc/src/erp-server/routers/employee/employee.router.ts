import { router } from '../../trpc.js';
import { findOneHandler } from './handlers/find-one.handler.js';

export const employeeRouter = router({
  findOne: findOneHandler,
});
