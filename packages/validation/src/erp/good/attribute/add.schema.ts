import { z } from 'zod';
import { stringField } from '../../../utils/common.js';

export const addAttributeSchema = z.object({
  localizations: z.array(
    z.object({
      name: stringField,
      locale: stringField,
    }),
  ),
});

export type AddAttributeInput = z.input<typeof addAttributeSchema>;
