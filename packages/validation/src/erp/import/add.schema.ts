import { z } from 'zod';
import { numberField, stringField } from '../../utils/common.js';

export const addImportSchema = z.object({
  importFileKey: stringField,
  schemaId: numberField,
});

export type AddImportSchemaInput = z.infer<typeof addImportSchema>;
