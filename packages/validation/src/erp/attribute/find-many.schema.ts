import { z } from 'zod';
import {
  findManyInfiniteSchema,
  findManySchema,
  orderByField,
} from '../../utils/common.js';

const orderBy = z.object({
  createdAt: orderByField,
  updatedAt: orderByField,
  id: orderByField,
});

export const findManyInfiniteAttributeSchema = findManyInfiniteSchema.extend({
  orderBy,
});

export const findManyAttributeSchema = findManySchema.extend({
  orderBy,
});

export type FindManyInfiniteAttributeInput = z.infer<
  typeof findManyInfiniteAttributeSchema
>;

export type FindManyAttributeInput = z.infer<typeof findManyAttributeSchema>;
