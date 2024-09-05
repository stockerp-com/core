import { z } from 'zod';
import { numberField, stringField } from '../../../utils/common.js';

export const findOneAttributeSchema = z.object({
  id: numberField,
  locale: stringField,
});
