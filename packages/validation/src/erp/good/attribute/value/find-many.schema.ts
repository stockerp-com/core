import { z } from 'zod';
import {
  enumField,
  findManyInfiniteSchema,
  findManySchema,
  orderByField,
} from '../../../../utils/common.js';
import { SUPPORTED_LOCALIZATIONS } from '@core/utils/localizations';

const orderBy = z.object({
  createdAt: orderByField,
  updatedAt: orderByField,
  id: orderByField,
});

export const findManyInfiniteAttributeValueSchema =
  findManyInfiniteSchema.extend({
    orderBy,
    languageName: enumField<typeof SUPPORTED_LOCALIZATIONS>(
      SUPPORTED_LOCALIZATIONS,
    ),
  });

export const findManyAttributeValueSchema = findManySchema.extend({
  orderBy,
  languageName: enumField<typeof SUPPORTED_LOCALIZATIONS>(
    SUPPORTED_LOCALIZATIONS,
  ),
});

export type FindManyInfiniteAttributeValueInput = z.infer<
  typeof findManyInfiniteAttributeValueSchema
>;

export type FindManyAttributeValueInput = z.infer<
  typeof findManyAttributeValueSchema
>;
