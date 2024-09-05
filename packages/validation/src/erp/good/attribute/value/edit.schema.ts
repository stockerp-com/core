import { z } from 'zod';
import { numberField } from '../../../../utils/common.js';
import { addAttributeValueSchema } from './add.schema.js';

export const editAttributeValueSchema = addAttributeValueSchema.extend({
  id: numberField,
});

export type EditAttributeValueInput = z.infer<typeof editAttributeValueSchema>;
