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
  name: orderByField,
});

export const findManyInfiniteImportSchemasSchema = z.object({
  ...findManyInfiniteSchema.shape,
  orderBy,
});

export const findManyImportSchemasSchema = z.object({
  ...findManySchema.shape,
  orderBy,
});

export type FindManyImportSchemasSchemaInput = z.infer<
  typeof findManyImportSchemasSchema
>;
export type FindManyInfiniteImportSchemasSchemaInput = z.infer<
  typeof findManyInfiniteImportSchemasSchema
>;
