import { z } from 'zod';
import {
  enumField,
  findManyInfiniteSchema,
  findManySchema,
  orderByField,
} from '../../../utils/common.js';
import { SUPPORTED_LOCALIZATIONS } from '@core/utils/localizations';

const orderBy = z.object({
  createdAt: orderByField,
  updatedAt: orderByField,
  id: orderByField,
});

export const findManyInfiniteAttributeSchema = findManyInfiniteSchema.extend({
  orderBy,
  languageName: enumField<typeof SUPPORTED_LOCALIZATIONS>(
    SUPPORTED_LOCALIZATIONS,
  ),
});

export const findManyAttributeSchema = findManySchema.extend({
  orderBy,
  languageName: enumField<typeof SUPPORTED_LOCALIZATIONS>(
    SUPPORTED_LOCALIZATIONS,
  ),
});

export type FindManyInfiniteAttributeInput = z.infer<
  typeof findManyInfiniteAttributeSchema
>;

export type FindManyAttributeInput = z.infer<typeof findManyAttributeSchema>;
