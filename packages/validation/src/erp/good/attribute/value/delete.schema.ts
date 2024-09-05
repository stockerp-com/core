import { z } from 'zod';
import { numberField } from '../../../../utils/common.js';

export const deleteAttributeValueSchema = z.object({
  id: numberField,
});

export type DeleteAttributeValueInput = z.infer<
  typeof deleteAttributeValueSchema
>;
