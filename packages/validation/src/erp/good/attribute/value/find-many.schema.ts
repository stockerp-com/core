import { z } from 'zod';
import {
  findManyInfiniteSchema,
  findManySchema,
  numberField,
  orderByField,
  stringField,
} from '../../../../utils/common.js';

const orderBy = z.object({
  createdAt: orderByField,
  updatedAt: orderByField,
  id: orderByField,
});

export const findManyInfiniteAttributeValueSchema =
  findManyInfiniteSchema.extend({
    orderBy,
    locale: stringField,
    attributeId: numberField.optional(),
  });

export const findManyAttributeValueSchema = findManySchema.extend({
  orderBy,
  locale: stringField,
});

export type FindManyInfiniteAttributeValueInput = z.infer<
  typeof findManyInfiniteAttributeValueSchema
>;

export type FindManyAttributeValueInput = z.infer<
  typeof findManyAttributeValueSchema
>;
