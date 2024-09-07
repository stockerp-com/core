import { z } from 'zod';
import { numberField } from '../../../utils/common.js';
import { addAttributeSchema } from './add.schema.js';

export const editAttributeSchema = addAttributeSchema.extend({
  id: numberField,
});

export type EditAttributeInput = z.input<typeof editAttributeSchema>;
