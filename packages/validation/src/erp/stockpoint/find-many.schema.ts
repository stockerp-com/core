import { z } from 'zod';
import { findManyInfiniteSchema, findManySchema } from '../../utils/common.js';

export const findManyInfiniteStockpointsSchema = findManyInfiniteSchema.extend(
  {},
);

export const findManyStockpointsSchema = findManySchema.extend({
  orderBy: z
    .object({
      createdAt: z.enum(['asc', 'desc']).optional(),
      updatedAt: z.enum(['asc', 'desc']).optional(),
      id: z.enum(['asc', 'desc']).optional(),
      name: z.enum(['asc', 'desc']).optional(),
      description: z.enum(['asc', 'desc']).optional(),
      address: z.enum(['asc', 'desc']).optional(),
      phone: z.enum(['asc', 'desc']).optional(),
      email: z.enum(['asc', 'desc']).optional(),
      website: z.enum(['asc', 'desc']).optional(),
      coordinates: z.enum(['asc', 'desc']).optional(),
    })
    .optional(),
});

export type findManyInfiniteStockpointsInput = z.infer<
  typeof findManyInfiniteStockpointsSchema
>;

export type findManyStockpointsInput = z.infer<
  typeof findManyStockpointsSchema
>;
