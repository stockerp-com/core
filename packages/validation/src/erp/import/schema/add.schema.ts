import { z } from 'zod';
import { fileField, stringField } from '../../../utils/common.js';

export const addImportSchemaSchema = z.object({
  name: stringField,
  file: fileField,
  isPublic: z.boolean().default(false),
});

export type AddImportSchemaSchemaInput = z.infer<typeof addImportSchemaSchema>;
