import { z } from 'zod';
import { enumField, numberField, stringField } from '../../../utils/common.js';
import { SUPPORTED_CURRENCIES } from '@core/utils/financial';
import { SUPPORTED_LOCALIZATIONS } from '@core/utils/localizations';

export const goodsImportFieldMapSchema = z.object({
  retailGroupIdField: stringField,
  distributionChannelField: stringField.optional(),
  skuField: stringField,
  isArchivedField: stringField.optional(),
  additionalIdentificatorFields: z.array(
    z.object({
      identificatorName: stringField,
      valueField: stringField,
    }),
    {
      required_error: 'errors:validation.required',
    },
  ),
  retailPriceFields: z
    .array(
      z.object({
        priceField: stringField,
        discountField: stringField,
        fullPriceField: stringField,
        currencyId:
          enumField<typeof SUPPORTED_CURRENCIES>(SUPPORTED_CURRENCIES),
      }),
    )
    .optional(),
  bulkPriceFields: z
    .array(
      z.object({
        priceField: stringField,
        discountField: stringField,
        fullPriceField: stringField,
        currencyId:
          enumField<typeof SUPPORTED_CURRENCIES>(SUPPORTED_CURRENCIES),
      }),
    )
    .optional(),
  mediaFields: z
    .array(
      z.object({
        dataType: z.enum(['string', 'array']),
        field: stringField,
      }),
    )
    .optional(),
  attributeFields: z
    .array(
      z.object({
        attributeId: numberField,
        index: numberField,
        valueField: stringField,
      }),
    )
    .optional(),
  stock: z.object({
    quantityField: stringField,
  }),
  localizations: z
    .array(
      z.object({
        language: enumField<typeof SUPPORTED_LOCALIZATIONS>(
          SUPPORTED_LOCALIZATIONS,
        ),
        nameField: stringField,
      }),
    )
    .optional(),
});

export const importSchemaSchema = z.object({
  goods: z.object({
    name: stringField,
    organizeGoodsGroupsBy: z.array(stringField),
    fieldMap: goodsImportFieldMapSchema,
  }),
});
