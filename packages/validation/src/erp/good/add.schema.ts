import { z } from 'zod';
import {
  booleanField,
  decimalField,
  enumField,
  fileField,
  numberField,
  stringField,
} from '../../utils/common.js';
import { SUPPORTED_CURRENCIES } from '@core/utils/financial';
import { DISTRIBUTION_CHANNELS } from '@core/utils/goods';
import { SUPPORTED_LOCALIZATIONS } from '@core/utils/localizations';

export const addGoodSchema = z.object({
  retailGroupId: numberField.optional(),
  distributionChannel: enumField<typeof DISTRIBUTION_CHANNELS>(
    DISTRIBUTION_CHANNELS,
  ),
  sku: stringField,
  isArchived: booleanField.optional().default(false),
  additionalIdentificators: z
    .array(
      z.object({
        name: stringField,
        value: stringField,
      }),
    )
    .optional(),
  retailPrices: z
    .array(
      z.object({
        currencyId:
          enumField<typeof SUPPORTED_CURRENCIES>(SUPPORTED_CURRENCIES),
        price: decimalField,
        discount: decimalField.optional(),
        fullPrice: decimalField.optional(),
      }),
    )
    .optional(),
  bulkPrices: z
    .array(
      z.object({
        currencyId:
          enumField<typeof SUPPORTED_CURRENCIES>(SUPPORTED_CURRENCIES),
        price: decimalField,
        discount: decimalField.optional(),
        fullPrice: decimalField.optional(),
      }),
    )
    .optional(),
  media: z.array(fileField).optional(),
  attributes: z
    .array(
      z.object({
        id: numberField,
        valueIds: z.array(numberField),
      }),
    )
    .optional(),
  stock: z
    .array(
      z.object({
        stockpointId: numberField,
        quantity: decimalField,
      }),
    )
    .optional(),
  localizations: z
    .array(
      z.object({
        language: enumField<typeof SUPPORTED_LOCALIZATIONS>(
          SUPPORTED_LOCALIZATIONS,
        ),
        name: stringField,
      }),
    )
    .optional(),
});

export type AddGoodSchemaInput = z.infer<typeof addGoodSchema>;
