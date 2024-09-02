import { z } from 'zod';
import { stringField } from '../../../utils/common.js';

export const deleteAdditionalGoodIdentificatorSchema = z.object({
  name: stringField,
});

export type DeleteAdditionalGoodIdentificatorSchemaInput = z.infer<
  typeof deleteAdditionalGoodIdentificatorSchema
>;
