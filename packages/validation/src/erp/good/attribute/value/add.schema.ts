import { z } from 'zod';
import { numberField, stringField } from '../../../../utils/common.js';

export const addAttributeValueSchema = z.object({
  locale: stringField,
  data: stringField,
  attributeId: numberField,
});

export type AddAttributeValueInput = z.input<typeof addAttributeValueSchema>;
