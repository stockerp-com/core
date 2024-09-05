import { z } from 'zod';
import { numberField } from '../../utils/common.js';

export const deleteAttributeSchema = z.object({
  id: numberField,
});

export type DeleteAttributeInput = z.input<typeof deleteAttributeSchema>;
