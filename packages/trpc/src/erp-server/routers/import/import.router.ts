import { router } from '../../trpc.js';
import { schemaRouter } from './schema/schema.router.js';

export const importRouter = router({
  // Handlers:
  // Routers:
  schema: schemaRouter,
});
