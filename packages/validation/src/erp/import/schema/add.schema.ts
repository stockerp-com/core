import { z } from 'zod';
import { stringField } from '../../../utils/common.js';
import { importSchemaSchema } from './schema.schema.js';

export const addImportSchemaSchema = z.object({
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

export type AddImportSchemaSchemaInput = z.infer<typeof addImportSchemaSchema>;
