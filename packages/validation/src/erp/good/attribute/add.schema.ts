import { z } from 'zod';
import { enumField, stringField } from '../../../utils/common.js';
import { SUPPORTED_LOCALIZATIONS } from '@core/utils/localizations';

export const addAttributeSchema = z.object({
  name: stringField,
  languageName: enumField<typeof SUPPORTED_LOCALIZATIONS>(
    SUPPORTED_LOCALIZATIONS,
  ),
});

export type AddAttributeInput = z.input<typeof addAttributeSchema>;
