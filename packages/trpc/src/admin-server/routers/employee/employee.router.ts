import { router } from '../../trpc.js';
import { findMeHandler } from './handlers/find-me.handler.js';
import { findOneHandler } from './handlers/find-one.handler.js';

export const employeeRouter = router({
  findOne: findOneHandler,
  findMe: findMeHandler,
});
