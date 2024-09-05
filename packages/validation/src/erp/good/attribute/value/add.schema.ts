import { z } from 'zod';
import {
  enumField,
  numberField,
  stringField,
} from '../../../../utils/common.js';
import { SUPPORTED_LOCALIZATIONS } from '@core/utils/localizations';

export const addAttributeValueSchema = z.object({
  languageName: enumField<typeof SUPPORTED_LOCALIZATIONS>(
    SUPPORTED_LOCALIZATIONS,
  ),
  data: stringField,
  attributeId: numberField,
});

export type AddAttributeValueInput = z.input<typeof addAttributeValueSchema>;
