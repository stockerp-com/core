import { z } from 'zod';
import {
  presetfindManyInfiniteSchema,
  presetfindManySchema,
  presetOrderBySchema,
} from '../../find-all-preset.schema.js';

const orderBy = presetOrderBySchema([
  'id',
  'name',
  'staff._count',
  'createdAt',
  'updatedAt',
]);

export const findManyInfiniteOrganizationsSchema = z.object({
  ...presetfindManyInfiniteSchema.shape,
});
export const findManyOrganizationsSchema = z.object({
  ...presetfindManySchema.shape,
  orderBy,
});

export type findManyInfiniteOrganizationsInput = z.infer<
  typeof findManyInfiniteOrganizationsSchema
>;
export type findManyOrganizationsInput = z.infer<
  typeof findManyOrganizationsSchema
>;
