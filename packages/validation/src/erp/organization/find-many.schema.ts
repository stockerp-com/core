import { z } from 'zod';
import {
  orderByField,
  presetfindManyInfiniteSchema,
  presetfindManySchema,
} from '../../find-all-preset.schema.js';

export const findManyInfiniteOrganizationsSchema = z.object({
  ...presetfindManyInfiniteSchema.shape,
});
export const findManyOrganizationsSchema = z.object({
  ...presetfindManySchema.shape,
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
