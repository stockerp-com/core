import { z } from 'zod';
import { numberField, stringField } from '../../../utils/common.js';

export const editAttributeSchema = z.object({
  id: numberField,
  name: stringField,
  locale: stringField,
});

export type EditAttributeInput = z.input<typeof editAttributeSchema>;
