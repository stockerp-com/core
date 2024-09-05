import { z } from 'zod';
import {
  findManyInfiniteSchema,
  findManySchema,
  orderByField,
} from '../../../utils/common.js';

const orderBy = z.object({
  createdAt: orderByField,
  updatedAt: orderByField,
  id: orderByField,
});

export const findManyInfiniteAttributeValueSchema =
  findManyInfiniteSchema.extend({
    orderBy,
  });

export const findManyAttributeValueSchema = findManySchema.extend({
  orderBy,
});

export type FindManyInfiniteAttributeValueInput = z.infer<
  typeof findManyInfiniteAttributeValueSchema
>;

export type FindManyAttributeValueInput = z.infer<
  typeof findManyAttributeValueSchema
>;
