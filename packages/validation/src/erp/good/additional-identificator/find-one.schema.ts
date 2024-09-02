import { z } from 'zod';
import { stringField } from '../../../utils/common.js';

export const findOneAdditionalGoodIdentificatorSchema = z.object({
  name: stringField,
});

export type FindOneAdditionalGoodIdentificatorSchemaInput = z.infer<
  typeof findOneAdditionalGoodIdentificatorSchema
>;
