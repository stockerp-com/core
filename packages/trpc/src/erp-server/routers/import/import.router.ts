import { router } from '../../trpc.js';
import { addHandler } from './handlers/add.js';
import { schemaRouter } from './schema/schema.router.js';

export const importRouter = router({
  // Handlers:
  add: addHandler,
  // Routers:
  schema: schemaRouter,
});
