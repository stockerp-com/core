import { z } from 'zod';

export const findOneImportSchemaSchema = z.object({
  id: z.number(),
});
