import { z } from 'zod';
import { findManyInfiniteSchema, orderByField } from '../../../utils/common.js';

const orderBy = z.object({
  createdAt: orderByField,
  updatedAt: orderByField,
  name: orderByField,
});

export const findManyInfiniteAdditionalGoodIdentificatorsSchema = z.object({
  ...findManyInfiniteSchema.shape,
  cursor: z.string().nullish(),
  orderBy,
});

export type FindManyInfiniteAdditionalGoodIdentificatorsSchemaInput = z.infer<
  typeof findManyInfiniteAdditionalGoodIdentificatorsSchema
>;
