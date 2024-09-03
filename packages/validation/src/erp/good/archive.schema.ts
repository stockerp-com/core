import { z } from 'zod';
import { numberField } from '../../utils/common.js';
import { stringField } from '../../utils/common.js';

export const archiveGoodSchema = z.object({
  id: numberField.optional(),
  additionalIdentificators: z
    .array(
      z.object({
        name: stringField,
        value: stringField,
      }),
    )
    .optional(),
});

export type ArchiveGoodSchemaInput = z.infer<typeof archiveGoodSchema>;
