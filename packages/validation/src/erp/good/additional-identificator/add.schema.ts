import { z } from 'zod';
import { stringField } from '../../../utils/common.js';

export const addAdditionalGoodIdentificatorSchema = z.object({
  name: stringField,
});

export type AddAdditionalGoodIdentificatorSchemaInput = z.infer<
  typeof addAdditionalGoodIdentificatorSchema
>;
