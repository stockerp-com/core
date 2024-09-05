import { z } from 'zod';
import { enumField, numberField } from '../../../../utils/common.js';
import { SUPPORTED_LOCALIZATIONS } from '@core/utils/localizations';

export const findOneAttributeValueSchema = z.object({
  id: numberField,
  languageName: enumField<typeof SUPPORTED_LOCALIZATIONS>(
    SUPPORTED_LOCALIZATIONS,
  ),
});

export type FindOneAttributeValueInput = z.infer<
  typeof findOneAttributeValueSchema
>;
