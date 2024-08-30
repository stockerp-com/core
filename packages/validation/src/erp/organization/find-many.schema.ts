import { z } from 'zod';
import {
  findManyInfiniteSchema,
  findManySchema,
  orderByField,
} from '../../utils/common.js';

export const findManyInfiniteOrganizationsSchema = z.object({
  ...findManyInfiniteSchema.shape,
});

export const findManyOrganizationsSchema = z.object({
  ...findManySchema.shape,
  orderBy: z
    .object({
      createdAt: orderByField,
      updatedAt: orderByField,
      id: orderByField,
      name: orderByField,
      staff: z
        .object({
          _count: orderByField,
        })
        .optional(),
    })
    .optional(),
});

export type findManyInfiniteOrganizationsInput = z.infer<
  typeof findManyInfiniteOrganizationsSchema
>;

export type findManyOrganizationsInput = z.infer<
  typeof findManyOrganizationsSchema
>;
