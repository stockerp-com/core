import { z } from 'zod';
import { numberField } from '../../utils/common.js';

export const findOneAttributeSchema = z.object({
  id: numberField,
});
