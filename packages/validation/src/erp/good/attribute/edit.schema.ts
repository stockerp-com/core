import { z } from 'zod';
import { enumField, numberField, stringField } from '../../../utils/common.js';
import { SUPPORTED_LOCALIZATIONS } from '@core/utils/localizations';

export const editAttributeSchema = z.object({
  id: numberField,
  name: stringField,
  languageName: enumField<typeof SUPPORTED_LOCALIZATIONS>(
    SUPPORTED_LOCALIZATIONS,
  ),
});

export type EditAttributeInput = z.input<typeof editAttributeSchema>;
