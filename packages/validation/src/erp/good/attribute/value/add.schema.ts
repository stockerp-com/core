import { z } from 'zod';
import { enumField, numberField } from '../../../../utils/common.js';
import { ATTRIBUTE_VALUE_TYPES } from '@core/utils/goods';
import { SUPPORTED_LOCALIZATIONS } from '@core/utils/localizations';

export const addAttributeValueSchema = z.object({
  dataType: enumField<typeof ATTRIBUTE_VALUE_TYPES>(ATTRIBUTE_VALUE_TYPES),
  languageName: enumField<typeof SUPPORTED_LOCALIZATIONS>(
    SUPPORTED_LOCALIZATIONS,
  ),
  value: z.any(),
  attributeId: numberField,
});

export type AddAttributeValueInput = z.input<typeof addAttributeValueSchema>;
