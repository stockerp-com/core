import { z } from 'zod';
import { fileField, stringField } from '../../../utils/common.js';

export const editImportSchemaSchema = z.object({
  id: z.number(),
  name: stringField,
  file: fileField,
});

export type EditImportSchemaSchemaInput = z.infer<
  typeof editImportSchemaSchema
>;
