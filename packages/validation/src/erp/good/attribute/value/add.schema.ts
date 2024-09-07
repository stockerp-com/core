import { z } from 'zod';
import { numberField, stringField } from '../../../../utils/common.js';

export const addAttributeValueSchema = z.object({
  attributeId: numberField,
  localizations: z.array(
    z.object({
      data: stringField,
      locale: stringField,
    }),
  ),
});

export type AddAttributeValueInput = z.input<typeof addAttributeValueSchema>;
