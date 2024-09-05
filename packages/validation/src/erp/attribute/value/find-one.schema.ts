import { z } from 'zod';
import { numberField } from '../../../utils/common.js';

export const findOneAttributeValueSchema = z.object({
  id: numberField,
});

export type FindOneAttributeValueInput = z.infer<
  typeof findOneAttributeValueSchema
>;
