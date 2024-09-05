import { z } from 'zod';
import { numberField, stringField } from '../../../../utils/common.js';

export const findOneAttributeValueSchema = z.object({
  id: numberField,
  locale: stringField,
});

export type FindOneAttributeValueInput = z.infer<
  typeof findOneAttributeValueSchema
>;
