import { z } from 'zod';

export const deleteImportSchemaSchema = z.object({
  id: z.number(),
});

export type DeleteImportSchemaSchemaInput = z.infer<
  typeof deleteImportSchemaSchema
>;
