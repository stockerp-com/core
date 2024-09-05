import { z } from 'zod';
import { enumField, numberField, stringField } from '../../../utils/common.js';
import { ATTRIBUTE_VALUE_TYPES } from '@core/utils/goods';

export const addAttributeValueSchema = z.object({
  dataType: enumField<typeof ATTRIBUTE_VALUE_TYPES>(ATTRIBUTE_VALUE_TYPES),
  language: stringField,
  value: z.any(),
  attributeId: numberField,
});

export type AddAttributeValueInput = z.input<typeof addAttributeValueSchema>;
