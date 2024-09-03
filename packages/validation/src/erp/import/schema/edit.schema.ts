import { z } from 'zod';
import { stringField } from '../../../utils/common.js';
import { importSchemaSchema } from './schema.schema.js';

export const editImportSchemaSchema = z.object({
  id: z.number(),
  name: stringField,
  schema: importSchemaSchema,
  additionalIdentificators: z
    .array(
      z.object({
        identificatorName: stringField,
      }),
    )
    .optional(),
});

export type EditImportSchemaSchemaInput = z.infer<
  typeof editImportSchemaSchema
>;
