import { z } from 'zod';
import { stringField } from '../../utils/common.js';

export const addAttributeSchema = z.object({
  name: stringField,
  language: stringField,
});

export type AddAttributeInput = z.input<typeof addAttributeSchema>;
