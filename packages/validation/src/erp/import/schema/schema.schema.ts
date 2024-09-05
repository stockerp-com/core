import { z } from 'zod';
import { enumField, numberField, stringField } from '../../../utils/common.js';
import { editGoodFieldsSchema } from '../../good/edit.schema.js';
import { SUPPORTED_LOCALIZATIONS } from '@core/utils/localizations';
import { SUPPORTED_CURRENCIES } from '@core/utils/financial';

export const importGoodsMapSchema = z.object({
  sku: stringField,
  price: stringField.optional(),
  discount: stringField.optional(),
  fullPrice: stringField,
  name: stringField,
  groupName: stringField,
  media: z
    .object({
      field: stringField,
      type: z.enum(['key', 'url']),
    })
    .optional(),
  attributes: z
    .array(
      z.object({
        id: numberField,
        field: stringField,
      }),
    )
    .optional(),
  additionalIdentificators: z.array(
    z.object({
      name: stringField,
      field: stringField,
    }),
  ),
  quantity: stringField.optional(),
});

export const importSchemaSchema = z.object({
  languageName: enumField<typeof SUPPORTED_LOCALIZATIONS>(
    SUPPORTED_LOCALIZATIONS,
  ),
  currency: enumField<typeof SUPPORTED_CURRENCIES>(SUPPORTED_CURRENCIES),
  goods: z.object({
    stockpointId: numberField,
    sheetName: stringField,
    organizeGoodsGroupsBy: z.array(stringField),
    map: importGoodsMapSchema,
    editFields: editGoodFieldsSchema,
  }),
});
