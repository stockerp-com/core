import { z } from 'zod';
import { stringField } from '../../../utils/common.js';
import { importSchemaSchema } from './schema.schema.js';

export const addImportSchemaSchema = z.object({
  name: stringField,
  isPublic: z.boolean().default(false),
  schema: importSchemaSchema,
});

export type AddImportSchemaSchemaInput = z.infer<typeof addImportSchemaSchema>;
